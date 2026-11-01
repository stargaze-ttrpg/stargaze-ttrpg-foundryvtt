const { NumberField, HTMLField } = foundry.data.fields;

export class ScriptData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new HTMLField({ required: false, blank: true }),
      cost: new NumberField({ required: true, integer: true, min: 0, initial: 1 })
    };
  }
}
