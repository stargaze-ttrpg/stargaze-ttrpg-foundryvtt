const ItemSheetBase = foundry.appv1?.sheets?.ItemSheet ?? ItemSheet;

export class PsionicsSheet extends ItemSheetBase {

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["stargaze", "sheet", "psionics"],
      template: "systems/stargaze/templates/psionics-sheet.hbs",
      width: 400,
      height: 200
    });
  }

  async getData(options) {
    const context = await super.getData(options);
    context.system = this.item.system;
    return context;
  }

}
