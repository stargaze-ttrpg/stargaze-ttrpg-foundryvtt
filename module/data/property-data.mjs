const { NumberField, StringField, HTMLField } = foundry.data.fields;

export class PropertyData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      subtype: new StringField({ required: false, blank: true }),
      description: new HTMLField({ required: false, blank: true }),
    };
  }
}