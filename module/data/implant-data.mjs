const { NumberField, StringField, HTMLField } = foundry.data.fields;

export class ImplantData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      subtype: new StringField({ required: false, blank: true }),
      slot: new StringField({ required: true, initial: "body", choices: ["body", "nerv", "mind", "psyc"] }),
      description: new HTMLField({ required: false, blank: true }),
    };
  }
}