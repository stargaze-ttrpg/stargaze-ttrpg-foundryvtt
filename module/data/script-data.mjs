const { NumberField, StringField, HTMLField } = foundry.data.fields;

export class ScriptData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      subtype: new StringField({ required: false, blank: true }),
      description: new HTMLField({ required: false, blank: true }),
      level: new NumberField({ required: true, integer: true, min: 1, max: 4, initial: 1 }),
    };
  }
}