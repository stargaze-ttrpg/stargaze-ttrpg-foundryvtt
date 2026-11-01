const ItemSheetBase = foundry.appv1?.sheets?.ItemSheet ?? ItemSheet;

export class WeaponSheet extends ItemSheetBase {

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["stargaze", "sheet", "weapon"],
      template: "systems/stargaze/templates/weapon-sheet.hbs",
      width: 420,
      height: 400
    });
  }

  async getData(options) {
    const context = await super.getData(options);
    context.system = this.item.system;
    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find("[data-action='attack']").on("click", () => {
      this.item.rollAttack(this.item.actor);
    });
  }
}
