import { CharacterData, GearData, WeaponData, ScriptData, ImplantData } from "./module/data/_index.mjs";
import { Character } from "./module/model/_index.mjs";
import { CharacterSheet, ItemSheet } from "./module/sheets/_index.mjs";

Hooks.once("init", () => {
  console.log("stargaze | init");

  CONFIG.Actor.documentClass = Character;

  CONFIG.Actor.dataModels.character = CharacterData;
  CONFIG.Item.dataModels.gear = GearData;
  CONFIG.Item.dataModels.weapon = WeaponData;
  CONFIG.Item.dataModels.script = ScriptData;
  CONFIG.Item.dataModels.implant = ImplantData;

  CONFIG.Actor.trackableAttributes = {
    character: { bar: ["health"], value: [] }
  };

  const ActorsCollection = foundry.documents?.collections?.Actors ?? Actors;
  const ItemsCollection = foundry.documents?.collections?.Items ?? Items;
  const CoreActorSheet = foundry.appv1?.sheets?.ActorSheet ?? ActorSheet;
  const CoreItemSheet = foundry.appv1?.sheets?.ItemSheet ?? ItemSheet;

  ActorsCollection.unregisterSheet("core", CoreActorSheet);
  ActorsCollection.registerSheet("stargaze", CharacterSheet, {
    types: ["character"],
    makeDefault: true
  });

  ItemsCollection.unregisterSheet("core", CoreItemSheet);
  ItemsCollection.registerSheet("stargaze", ItemSheet, {
    types: ["gear", "weapon", "script", "implant"],
    makeDefault: true
  });
});

Hooks.once("ready", () => {
  console.log("stargaze | ready", game.system.id);
});
