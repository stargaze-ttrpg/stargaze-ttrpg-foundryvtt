const { StringField, HTMLField } = foundry.data.fields;

export class WeaponData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new HTMLField({ required: false, blank: true }),
      damage: new StringField({ required: true, initial: "1d6" })
    };
  }
}
