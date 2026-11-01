const { NumberField, SchemaField, StringField, HTMLField } = foundry.data.fields;

function attrField() {
  return new NumberField({ required: true, integer: true, initial: 0 });
}

function skillField() {
  return new NumberField({ required: true, integer: true, initial: 0 });
}

export class CharacterData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      level: new NumberField({ required: true, integer: true, min: 1, initial: 1 }),
      class1: new StringField({ required: false, blank: true, initial: "" }),
      class2: new StringField({ required: false, blank: true, initial: "" }),

      appearance: new HTMLField({ required: false, blank: true, initial: "" }),
      temper: new HTMLField({ required: false, blank: true, initial: "" }),
      owns: new HTMLField({ required: false, blank: true, initial: "" }),
      notes: new HTMLField({ required: false, blank: true, initial: "" }),
      goals: new HTMLField({ required: false, blank: true, initial: "" }),

      health: new SchemaField({
        value: new NumberField({ required: true, integer: true, min: 0, initial: 10 }),
        max: new NumberField({ required: true, integer: true, min: 0, initial: 10 })
      }),
      stamina: new SchemaField({
        value: new NumberField({ required: true, integer: true, min: 0, initial: 10 }),
        max: new NumberField({ required: true, integer: true, min: 0, initial: 10 })
      }),

      hackingCharges: new SchemaField({
        value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
        max: new NumberField({ required: true, integer: true, min: 0, initial: 0 })
      }),
      overload: new SchemaField({
        value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
        max: new NumberField({ required: true, integer: true, min: 0, initial: 0 })
      }),

      componentB: new SchemaField({
        value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
        max: new NumberField({ required: true, integer: true, min: 0, initial: 0 })
      }),
      componentN: new SchemaField({
        value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
        max: new NumberField({ required: true, integer: true, min: 0, initial: 0 })
      }),
      componentM: new SchemaField({
        value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
        max: new NumberField({ required: true, integer: true, min: 0, initial: 0 })
      }),
      componentP: new SchemaField({
        value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
        max: new NumberField({ required: true, integer: true, min: 0, initial: 0 })
      }),

      psionicPotential: new NumberField({ required: true, integer: true, min: 0, max: 4, initial: 0 }),

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

    s.bodySaveTotal = a.body + s.bodySave;
    s.bodySaveExpression = `${a.body} + ${s.bodySave}`;
    s.enduranceTotal = a.body + s.endurance;
    s.enduranceExpression = `${a.body} + ${s.endurance}`;
    s.athleticsTotal = a.body + s.athletics;
    s.athleticsExpression = `${a.body} + ${s.athletics}`;
    s.movementTotal = a.body + s.movement;
    s.movementExpression = `${a.body} + ${s.movement}`;
    s.acrobaticsTotal = a.body + s.acrobatics;
    s.acrobaticsExpression = `${a.body} + ${s.acrobatics}`;
    s.detoxTotal = a.body + s.detox;
    s.detoxExpression = `${a.body} + ${s.detox}`;

    s.nervSaveTotal = a.nerv + s.nervSave;
    s.nervSaveExpression = `${a.nerv} + ${s.nervSave}`;
    s.reactionTotal = a.nerv + s.reaction;
    s.reactionExpression = `${a.nerv} + ${s.reaction}`;
    s.accuracyTotal = a.nerv + s.accuracy;
    s.accuracyExpression = `${a.nerv} + ${s.accuracy}`;
    s.precisionTotal = a.nerv + s.precision;
    s.precisionExpression = `${a.nerv} + ${s.precision}`;
    s.alertnessTotal = a.nerv + s.alertness;
    s.alertnessExpression = `${a.nerv} + ${s.alertness}`;
    s.stealthTotal = a.nerv + s.stealth;
    s.stealthExpression = `${a.nerv} + ${s.stealth}`;

    s.mindSaveTotal = a.mind + s.mindSave;
    s.mindSaveExpression = `${a.mind} + ${s.mindSave}`;
    s.informaticsTotal = a.mind + s.informatics;
    s.informaticsExpression = `${a.mind} + ${s.informatics}`;
    s.technicalTotal = a.mind + s.technical;
    s.technicalExpression = `${a.mind} + ${s.technical}`;
    s.humanitarianTotal = a.mind + s.humanitarian;
    s.humanitarianExpression = `${a.mind} + ${s.humanitarian}`;
    s.biologicalTotal = a.mind + s.biological;
    s.biologicalExpression = `${a.mind} + ${s.biological}`;
    s.psychologicalTotal = a.mind + s.psychological;
    s.psychologicalExpression = `${a.mind} + ${s.psychological}`;

    s.psycSaveTotal = a.psyc + s.psycSave;
    s.psycSaveExpression = `${a.psyc} + ${s.psycSave}`;
    s.empathyTotal = a.psyc + s.empathy;
    s.empathyExpression = `${a.psyc} + ${s.empathy}`;
    s.coolnessTotal = a.psyc + s.coolness;
    s.coolnessExpression = `${a.psyc} + ${s.coolness}`;
    s.persuasionTotal = a.psyc + s.persuasion;
    s.persuasionExpression = `${a.psyc} + ${s.persuasion}`;
    s.tacticsTotal = a.psyc + s.tactics;
    s.tacticsExpression = `${a.psyc} + ${s.tactics}`;
    s.eccentricityTotal = a.psyc + s.eccentricity;
    s.eccentricityExpression = `${a.psyc} + ${s.eccentricity}`;

    this.armorTotal = this.armor;
    this.armorTotal = `${this.armor}`;
    this.initiativeTotal = Math.max(s.reactionTotal, s.coolnessTotal) + this.initiative;
    this.initiativeExpression = `MAX(${s.reactionTotal}, ${s.coolnessTotal}) + ${this.initiative}`;
    this.movementSpeedTotal = Math.max(s.movementTotal, s.tacticsTotal) + this.movementSpeed;
    this.movementSpeedExpression = `MAX(${s.movementTotal}, ${s.tacticsTotal}) + ${this.movementSpeed}`;
    this.rapidFireTotal = Math.max(s.precisionTotal, s.acrobaticsTotal) + this.rapidFire;
    this.rapidFireExpression = `MAX(${s.precisionTotal}, ${s.acrobaticsTotal}) + ${this.rapidFire}`;
    this.accurateFireTotal = Math.max(s.accuracyTotal, s.coolnessTotal) + this.accurateFire;
    this.accurateFireExpression = `MAX(${s.accuracyTotal}, ${s.coolnessTotal}) + ${this.accurateFire}`;
    this.meleeTotal = Math.max(s.athleticsTotal, s.reactionTotal) + this.melee;
    this.meleeExpression = `MAX(${s.athleticsTotal}, ${s.reactionTotal}) + ${this.melee}`;
    this.hackingTotal = a.mind + Math.max(s.informaticsTotal, s.technicalTotal) + this.hacking;
    this.hackingExpression = `MAX(${s.informaticsTotal}, ${s.technicalTotal}) + ${this.hacking}`;
  }
}
