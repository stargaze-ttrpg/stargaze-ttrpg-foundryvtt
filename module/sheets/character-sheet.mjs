const ActorSheetBase = foundry.appv1?.sheets?.ActorSheet ?? ActorSheet;

export class CharacterSheet extends ActorSheetBase {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["mysystem", "sheet", "character"],
      template: "systems/stargaze/templates/character.hbs",
      width: 900,
      height: 700
    });
  }

  async getData(options) {
    const context = await super.getData(options);
    context.system = this.actor.system;
    context.statuses = this.actor.items.filter(i => i.type === "status");
    context.properties = this.actor.items.filter(i => i.type === "property");
    context.inventory = {
      ship: this.actor.items.filter(i => i.type === "gear" && i.system.location === "ship"),
      stock: this.actor.items.filter(i => i.type === "gear" && i.system.location === "stock"),
      self: this.actor.items.filter(i => i.type === "gear" && i.system.location === "self"),
      weapons: this.actor.items.filter(i => i.type === "weapon")
    };
    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;

    html.find(".interactive_button").on("click", ev => {
      const name = ev.currentTarget.textContent.trim();
      console.log("Clicked:", name);
    });
  }
}
