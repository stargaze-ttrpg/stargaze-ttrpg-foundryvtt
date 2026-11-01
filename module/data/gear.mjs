const { NumberField, StringField, HTMLField } = foundry.data.fields;

export class GearData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new HTMLField({ required: false, blank: true }),
      quantity: new NumberField({ required: true, integer: true, min: 0, initial: 1 }),
      location: new StringField({ required: true, initial: "self", choices: ["self", "ship", "stock"] })
    };
  }
}
