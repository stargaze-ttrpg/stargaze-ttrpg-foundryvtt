export class ActorModel extends Actor {
  getRollData() {
    return { ...super.getRollData() };
  }

  /* Roll-ы */

  async rollOne(title, hint, bonus){
    const actor = this;
    
    const roll1 = await new Roll(`1d20 + ${bonus}`).evaluate();
    const roll2 = await new Roll(`1d20 + ${bonus}`).evaluate();

    const rollHtml = await foundry.applications.handlebars.renderTemplate(
      "systems/stargaze/templates/character-skill-roll.hbs",
      {
        roll1: roll1,
        roll2: roll2,
      }
    );

    const messageHtml = await foundry.applications.handlebars.renderTemplate(
      "systems/stargaze/templates/message-roll.hbs",
      {
        title: title,
        hint: hint,
        content: rollHtml,
      }
    );
    
    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor }),
      content: messageHtml,
      rolls: [roll1, roll2]
    });
  }

  async rollStat(stat) {
    const total = this.system?.[stat];
    const title = `STARGAZE.Stats.${stat}.name`;
    const hint = `STARGAZE.Stats.${stat}.hint`;
    
    await this.rollOne(title, hint, total);
  }

  async rollSkill(skill) {
    const total = this.system.skills?.[`${skill}Total`];
    const title = `STARGAZE.Skills.${skill}.name`;
    const hint = `STARGAZE.Skills.${skill}.hint`;

    await this.rollOne(title, hint, total);
  }

  /* Перетаскивание */

  async dragToActor(dragData) {
    
    if (dragData.type == "ChatMessage"){
      const message = game.messages.get(dragData.id);
      console.log(message);
      if (!message) return false;

      const messageType = message.getFlag("stargaze", "messageType");

      switch (messageType) {
        case "message-item": return this.applyMessageItemToActor(message);
        case "weapon-roll": return this.applyWeaponAttackToActor(message);
      }
    }
  }

  async applyMessageItemToActor(message) {
    console.log('applyMessageItemToActor');
    const uuid = message.getFlag("stargaze", "messageItemUuid");
    console.log(uuid);
    if (!uuid) return;

    const item = await fromUuid(uuid);
    console.log(item);
    if (!item) throw new Error('Невозможно добавить предмет в персонажа. Скорее всего оригинал был удален.');

    return this.createEmbeddedDocuments("Item", [item.toObject()]);
  }

  async applyWeaponAttackToActor(message) {
    const actor = this;
    const flags = message.flags?.stargaze;
    if (!flags) return;

    const armor = actor.system.armorTotal ?? actor.system.armor ?? 0;
    // const isMechanism = actor.getFlag("stargaze", "isMechanism") ?? false;
    // const isOrganic = !isMechanism;
    const isMechanism = false;
    const isOrganic = true;

    console.log(flags.weaponDamage1);
    console.log(flags.weaponDamageType1);
    console.log(flags.weaponDamage2);
    console.log(flags.weaponDamageType2);

    const calc = (raw, type) => {
      if (!raw) return {};
      switch (type) {
        case "default":   return { hp: raw - (armor) };
        case "piercing":  return { hp: raw - (armor / 2) };
        case "expansive": return { hp: raw - (armor * 2) };
        case "electric":  return { hp: isMechanism ? raw * 2 : raw };
        case "psychic":   return { hp: isOrganic ? raw : 0 };
        case "true":      return { hp: raw }
        case "stamina":   return { st: raw }
        default:          return { hp: raw - (armor) };
      }
    };

    const dmg1 = calc(flags.weaponDamage1, flags.weaponDamageType1);
    const dmg2 = calc(flags.weaponDamage2, flags.weaponDamageType2);

    console.log(dmg1);
    console.log(dmg2);

    const hpDamage = Math.max(0, dmg1?.hp ?? 0) + Math.max(0, dmg2?.hp ?? 0);
    const stDamage = Math.max(0, dmg1?.st ?? 0) + Math.max(0, dmg2?.st ?? 0);

    console.log(hpDamage);
    console.log(stDamage);

    const updates = {};

    if (hpDamage > 0) {
      const hpCurrent = actor.system.health?.value ?? 0;
      updates["system.health.value"] = hpCurrent - hpDamage;
    }

    if (stDamage > 0) {
      const stCurrent = actor.system.stamina?.value ?? 0;
      updates["system.stamina.value"] = stCurrent - stDamage;
    }

    if (Object.keys(updates).length) {
      return actor.update(updates);
    }
  }
}
