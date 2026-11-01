const { StringField, HTMLField } = foundry.data.fields;

export class ImplantData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new HTMLField({ required: false, blank: true }),
      slot: new StringField({ required: true, initial: "body", choices: ["body", "nerv", "mind", "psyc"] })
    };
  }
}
