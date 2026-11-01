const { NumberField, StringField, HTMLField } = foundry.data.fields;

export class ChemicalData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      subtype: new StringField({ required: false, blank: true }),
      description: new HTMLField({ required: false, blank: true }),
      level: new NumberField({ required: true, integer: true, min: 1, max: 4, initial: 1 }),
      componentB: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      componentN: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      componentM: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      componentP: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
    };
  }
}