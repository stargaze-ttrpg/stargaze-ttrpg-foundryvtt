const { NumberField, StringField, HTMLField } = foundry.data.fields;
// import { dataTools } from "../tools/data-tools.mjs";

export class ActionData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      actionType: new StringField({ required: false, blank: true }),
      description: new HTMLField({ required: false, blank: true }),
    };
  }
}