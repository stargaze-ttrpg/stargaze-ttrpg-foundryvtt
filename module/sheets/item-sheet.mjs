const ItemSheetBase = foundry.appv1?.sheets?.ItemSheet ?? ItemSheet;

export class ItemSheet extends ItemSheetBase {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["mysystem", "sheet", "item"],
      template: "systems/stargaze/templates/item.hbs",
      width: 420,
      height: 360
    });
  }

  async getData(options) {
    const context = await super.getData(options);
    context.system = this.item.system;
    return context;
  }
}
