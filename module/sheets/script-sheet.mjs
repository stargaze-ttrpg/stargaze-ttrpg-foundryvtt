const ItemSheetBase = foundry.appv1?.sheets?.ItemSheet ?? ItemSheet;

export class ScriptSheet extends ItemSheetBase {

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["stargaze", "sheet", "script"],
      template: "systems/stargaze/templates/script-sheet.hbs",
      width: 400,
      height: 200
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