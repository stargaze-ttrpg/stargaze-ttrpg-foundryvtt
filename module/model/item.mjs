export class ItemModel extends Item {

  async showItemSheet(){
    this.sheet.render(true);
  }

  async deleteItem(actor){
    Item.implementation.deleteDocuments([this.id], {parent: actor});
  }

  async collapseItem(){
    const collapsed = await this.getFlag("stargaze", "collapsed");
    this.setFlag("stargaze", "collapsed", !(collapsed ?? false));
  }

  async sendItemToChat(actor){
    const itemHtml = await foundry.applications.handlebars.renderTemplate(`systems/stargaze/templates/${this.type}-card.hbs`, this);
    const messageHtml = await foundry.applications.handlebars.renderTemplate("systems/stargaze/templates/message-item.hbs",
      {
        name: this.name,
        content: itemHtml
      }
    );

    await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor }),
        content: messageHtml,
        flags: {
            stargaze: {
                messageType: "message-item",
                messageItemUuid: this.uuid   // вместо id — uuid
            }
        }
    });
  }

  async rollAttack(actor, skillOverride) {
    const skill = skillOverride ?? this.system.attackSkill ?? "rapidFire";
    const bonus = actor?.system?.[`${skill}Total`] ?? 0;

    const roll1 = await new Roll(`1d20 + ${bonus}`).evaluate();
    const roll2 = await new Roll(`1d20 + ${bonus}`).evaluate();

    const s = this.system;

    const damage1 = s.damage1 ? (await new Roll(s.damage1).evaluate()) : undefined;
    const damage2 = s.damage2 ? (await new Roll(s.damage2).evaluate()) : undefined;

    const makeRow = (mod) => [
      { dc: s.rangeClose + mod,   hit1: roll1.total >= s.rangeClose + mod,   hit2: roll2.total >= s.rangeClose + mod },
      { dc: s.rangeMedium + mod,  hit1: roll1.total >= s.rangeMedium + mod,  hit2: roll2.total >= s.rangeMedium + mod },
      { dc: s.rangeLong + mod,    hit1: roll1.total >= s.rangeLong + mod,    hit2: roll2.total >= s.rangeLong + mod },
      { dc: s.rangeExtreme + mod, hit1: roll1.total >= s.rangeExtreme + mod, hit2: roll2.total >= s.rangeExtreme + mod }
    ];

    const attackHtml = await foundry.applications.handlebars.renderTemplate(
      "systems/stargaze/templates/weapon-roll.hbs",
      {
        roll1: roll1,
        roll2: roll2,

        damage1: damage1,
        damage2: damage2,
        damageType1: s.damageType1,
        damageType2: s.damageType2,
        
        table: {
          normal: makeRow(0),
          aimed: makeRow(5),
          cover: makeRow(10)
        },
        
        properties: s.propertiesText
      }
    );

    const messageHtml = await foundry.applications.handlebars.renderTemplate(
      "systems/stargaze/templates/message-roll.hbs",
      {
        title: this.name,
        content: attackHtml,
      }
    );

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor }),
      content: messageHtml,
      // rolls: [roll1, roll2, damage1, damage2], // Нельзя чтобы использовать здесь null
      flags: {
        stargaze: {
          messageType: "weapon-roll",
          weaponDamage1: damage1?.total,
          weaponDamage2: damage2?.total,
          weaponDamageType1: s.damageType1,
          weaponDamageType2: s.damageType2
        }
      }
    });
  }
}
