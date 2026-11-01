const { NumberField, SchemaField, StringField } = foundry.data.fields;

function attrField() {
  return new NumberField({ required: true, integer: true, min: -4, max: 4, initial: 0 });
}

function skillField() {
  return new NumberField({ required: true, integer: true, min: -4, max: 4, initial: 0 });
}

export class CharacterData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      level: new NumberField({ required: true, integer: true, min: 1, initial: 1 }),
      class1: new StringField({ required: false, blank: true, initial: "" }),
      class2: new StringField({ required: false, blank: true, initial: "" }),

      health: new SchemaField({
        value: new NumberField({ required: true, integer: true, min: 0, initial: 10 }),
        max: new NumberField({ required: true, integer: true, min: 0, initial: 10 })
      }),
      stamina: new SchemaField({
        value: new NumberField({ required: true, integer: true, min: 0, initial: 10 }),
        max: new NumberField({ required: true, integer: true, min: 0, initial: 10 })
      }),

      armor: attrField(),
      initiative: attrField(),
      movementSpeed: attrField(),
      rapidFire: attrField(),
      accurateFire: attrField(),
      melee: attrField(),
      hacking: attrField(),

      attributes: new SchemaField({
        body: attrField(),
        nerv: attrField(),
        mind: attrField(),
        psyc: attrField()
      }),

      skills: new SchemaField({
        bodySave: skillField(), endurance: skillField(), athletics: skillField(),
        movement: skillField(), acrobatics: skillField(), detox: skillField(),
        nervSave: skillField(), reaction: skillField(), accuracy: skillField(),
        precision: skillField(), alertness: skillField(), stealth: skillField(),
        mindSave: skillField(), informatics: skillField(), technical: skillField(),
        humanitarian: skillField(), biological: skillField(), psychological: skillField(),
        psycSave: skillField(), empathy: skillField(), coolness: skillField(),
        persuasion: skillField(), tactics: skillField(), eccentricity: skillField()
      })
    };
  }

  prepareDerivedData() {
    super.prepareDerivedData();
    if (this.health.value > this.health.max) this.health.value = this.health.max;
    if (this.stamina.value > this.stamina.max) this.stamina.value = this.stamina.max;

    const a = this.attributes;
    const s = this.skills;

    this.armorTotal = this.armor;
    this.initiativeTotal = this.initiative + a.nerv;
    this.movementSpeedTotal = this.movementSpeed + a.body;
    this.rapidFireTotal = this.rapidFire + a.nerv;
    this.accurateFireTotal = this.accurateFire + a.nerv;
    this.meleeTotal = this.melee + a.body;
    this.hackingTotal = this.hacking + a.mind;

    s.bodySaveTotal = s.bodySave + a.body;
    s.enduranceTotal = s.endurance + a.body;
    s.athleticsTotal = s.athletics + a.body;
    s.movementTotal = s.movement + a.body;
    s.acrobaticsTotal = s.acrobatics + a.body;
    s.detoxTotal = s.detox + a.body;
    s.nervSaveTotal = s.nervSave + a.nerv;
    s.reactionTotal = s.reaction + a.nerv;
    s.accuracyTotal = s.accuracy + a.nerv;
    s.precisionTotal = s.precision + a.nerv;
    s.alertnessTotal = s.alertness + a.nerv;
    s.stealthTotal = s.stealth + a.nerv;
    s.mindSaveTotal = s.mindSave + a.mind;
    s.informaticsTotal = s.informatics + a.mind;
    s.technicalTotal = s.technical + a.mind;
    s.humanitarianTotal = s.humanitarian + a.mind;
    s.biologicalTotal = s.biological + a.mind;
    s.psychologicalTotal = s.psychological + a.mind;
    s.psycSaveTotal = s.psycSave + a.psyc;
    s.empathyTotal = s.empathy + a.psyc;
    s.coolnessTotal = s.coolness + a.psyc;
    s.persuasionTotal = s.persuasion + a.psyc;
    s.tacticsTotal = s.tactics + a.psyc;
    s.eccentricityTotal = s.eccentricity + a.psyc;
  }
}
