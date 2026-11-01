const { StringField, HTMLField, NumberField, ArrayField } = foundry.data.fields;

const DAMAGE_TYPES = ["default", "piercing", "expansive", "electric", "psychic", "true", "stamina"];
const WEAPON_PROPERTIES = ["точное", "автоматическое", "бесшумное", "тяжелое"];

export class WeaponData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new HTMLField({ required: false, blank: true }),

      damage1: new StringField({ required: true, initial: "1d6" }),
      damage2: new StringField({ required: false, blank: true, initial: "" }),
      damageType1: new StringField({ required: false, blank: true, initial: "", choices: DAMAGE_TYPES }),
      damageType2: new StringField({ required: false, blank: true, initial: "", choices: DAMAGE_TYPES }),

      rangeClose: new NumberField({ required: true, integer: true, min: 0, initial: 10 }),
      rangeMedium: new NumberField({ required: true, integer: true, min: 0, initial: 15 }),
      rangeLong: new NumberField({ required: true, integer: true, min: 0, initial: 20 }),
      rangeExtreme: new NumberField({ required: true, integer: true, min: 0, initial: 25 }),

      attackSkill: new StringField({ required: true, initial: "rapidFire", choices: ["rapidFire", "accurateFire"] }),
      propertiesText: new StringField({ required: false, blank: true, initial: "" }),

      properties: new ArrayField(new StringField({ choices: WEAPON_PROPERTIES }), { initial: [] })
    };
  }

  get rangeTable() {
    const r = this;
    return {
      normal: [r.rangeClose, r.rangeMedium, r.rangeLong, r.rangeExtreme],
      aimed: [r.rangeClose + 5, r.rangeMedium + 5, r.rangeLong + 5, r.rangeExtreme + 5],
      cover: [r.rangeClose + 10, r.rangeMedium + 10, r.rangeLong + 10, r.rangeExtreme + 10]
    };
  }
}