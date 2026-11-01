import { CharacterData, ActionData, ChemicalData, GearData, ImplantData, PropertyData, PsionicsData, ScriptData, WeaponData } from "./module/data/_index.mjs";
import { CharacterSheet, ActionSheet, ChemicalSheet, GearSheet, ImplantSheet, PropertySheet, PsionicsSheet, ScriptSheet, WeaponSheet } from "./module/sheets/_index.mjs";
import { ActorModel, ItemModel } from "./module/model/_index.mjs";
import { autocomplete } from "./module/tools/autocomplete-tools.mjs";

Hooks.once("init", () => {
  CONFIG.Actor.documentClass = ActorModel;
  CONFIG.Item.documentClass = ItemModel;

  CONFIG.Actor.dataModels.character = CharacterData;
  CONFIG.Item.dataModels.action = ActionData;
  CONFIG.Item.dataModels.chemical = ChemicalData;
  CONFIG.Item.dataModels.gear = GearData;
  CONFIG.Item.dataModels.implant = ImplantData;
  CONFIG.Item.dataModels.property = PropertyData;
  CONFIG.Item.dataModels.psionics = PsionicsData;
  CONFIG.Item.dataModels.script = ScriptData;
  CONFIG.Item.dataModels.weapon = WeaponData;

  CONFIG.Actor.trackableAttributes = {
    character: { bar: ["health"], value: [] }
  };

  const ActorsCollection = foundry.documents?.collections?.Actors ?? Actors;
  const ItemsCollection = foundry.documents?.collections?.Items ?? Items;
  const CoreActorSheet = foundry.appv1?.sheets?.ActorSheet ?? ActorSheet;
  const CoreItemSheet = foundry.appv1?.sheets?.ItemSheet ?? ItemSheet;

  // Очистка
  ActorsCollection.unregisterSheet("core", CoreActorSheet);
  ItemsCollection.unregisterSheet("core", CoreItemSheet);

  // Регистрация шаблонов
  ActorsCollection.registerSheet("stargaze", CharacterSheet, {
    types: ["character"],
    makeDefault: true
  });

  ItemsCollection.registerSheet("stargaze", ActionSheet, {
    types: ["action"],
    makeDefault: true
  });

  ItemsCollection.registerSheet("stargaze", ChemicalSheet, {
    types: ["chemical"],
    makeDefault: true
  });

  ItemsCollection.registerSheet("stargaze", GearSheet, {
    types: ["gear"],
    makeDefault: true
  });

  ItemsCollection.registerSheet("stargaze", ImplantSheet, {
    types: ["implant"],
    makeDefault: true
  });

  ItemsCollection.registerSheet("stargaze", PropertySheet, {
    types: ["property"],
    makeDefault: true
  });

  ItemsCollection.registerSheet("stargaze", ScriptSheet, {
    types: ["script"],
    makeDefault: true
  });

  ItemsCollection.registerSheet("stargaze", PsionicsSheet, {
    types: ["psionics"],
    makeDefault: true
  });
  
  ItemsCollection.registerSheet("stargaze", WeaponSheet, {
    types: ["weapon"],
    makeDefault: true
  });
  
  Handlebars.registerHelper("critClass", function (roll) {
    if (!roll) return "";
    const d20 = roll.terms?.find?.(t => t.faces === 20);
    const nat = d20?.results?.[0]?.result;
    if (nat === 1)  return "crit1";
    if (nat === 20) return "crit20";
    return "";
  });

  Handlebars.registerHelper("concat", function (...args) {
    return args.slice(0, -1).join("");
  });

  Handlebars.registerHelper('lookupNested', function (data, ...args) {
    const options = args.pop(); // явно вытаскиваем options
    let value = data;
    for (const key of args) {
      if (value == null)
        return undefined;
      value = value[key];
    }
    return value;
});

  [2, 3, 4, 5].forEach(n => {
  Handlebars.registerHelper(`rand${n}`, function () {
      return Math.floor(Math.random() * n) + 1;
    });
  });

  foundry.applications.handlebars.loadTemplates([
    "systems/stargaze/templates/character-item.hbs",
    "systems/stargaze/templates/character-list.hbs",
    "systems/stargaze/templates/character-sheet.hbs",
    "systems/stargaze/templates/character-stat.hbs",
    "systems/stargaze/templates/character-skill.hbs",
    "systems/stargaze/templates/character-skill-roll.hbs",

    "systems/stargaze/templates/message-item.hbs",
    "systems/stargaze/templates/message-roll.hbs",
    

    "systems/stargaze/templates/action-card.hbs",
    "systems/stargaze/templates/action-sheet.hbs",

    "systems/stargaze/templates/chemical-card.hbs",
    "systems/stargaze/templates/chemical-sheet.hbs",

    "systems/stargaze/templates/gear-card.hbs",
    "systems/stargaze/templates/gear-sheet.hbs",

    "systems/stargaze/templates/implant-card.hbs",
    "systems/stargaze/templates/implant-sheet.hbs",

    "systems/stargaze/templates/property-card.hbs",
    "systems/stargaze/templates/property-sheet.hbs",

    "systems/stargaze/templates/psionics-card.hbs",
    "systems/stargaze/templates/psionics-sheet.hbs",

    "systems/stargaze/templates/script-card.hbs",
    "systems/stargaze/templates/script-sheet.hbs",

    "systems/stargaze/templates/weapon-roll.hbs",
    "systems/stargaze/templates/weapon-card.hbs",
    "systems/stargaze/templates/weapon-sheet.hbs",

    "systems/stargaze/templates/roll-box.hbs",
    "systems/stargaze/templates/animations/infinite-code.hbs",
  ]);
});

Hooks.once("ready", () => {
  console.log("stargaze | ready", game.system.id);

  const chat = document.querySelector("#chat-log");
  if (chat) {
    chat.addEventListener("dragover", (ev) => {
      if (ev.dataTransfer.types.includes("application/x-stargaze-item")) {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "copy";
      }
    });

    chat.addEventListener("drop", async (ev) => {
      const itemId = ev.dataTransfer.getData("application/x-stargaze-item");
      const actorId = ev.dataTransfer.getData("application/x-stargaze-actor");
      if (!itemId || !actorId) return;
      ev.preventDefault();

      const actor = game.actors.get(actorId);
      const item = actor?.items.get(itemId);
      if (item) await item.sendItemToChat(actor);
    });
  }
});

// Автодополнение
document.addEventListener("input", (event) => { autocomplete.tryAutocomplete(event); }, { passive: true });

// Перетаскивание из чата
Hooks.on("renderChatMessageHTML", (message, html, context) => {
    const messageElement = html.querySelector(".message-content")?.closest(".message");
    if (!messageElement) return;

    messageElement.setAttribute("draggable", "true");
    messageElement.addEventListener("dragstart", (event) => {
        const dragData = {
            type: "ChatMessage",
            id: message.id,
            uuid: message.uuid
        };
        event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
    });
});

// Перетаскивание в персонажа
Hooks.on("dropActorSheetData", async (actor, sheet, data) => {
  return actor.dragToActor(data) ?? false;
});

// Перетаскивание в токен
Hooks.on("dropCanvasData", (canvas, data) => {
  const token = canvas.tokens.placeables.find(t => {
    const b = t.bounds;
    return data.x >= b.x && data.x <= b.x + b.width
        && data.y >= b.y && data.y <= b.y + b.height;
  });

  // return true; - продолжить обработку прочих dropCanvasData
  if (!token?.actor) return true;

  token.actor.dragToActor(data);
  return false;
});

// Контекстное меню в списке актеров
Hooks.on("getActorContextOptions", (application, menuItems) => {
  menuItems.push(
    {
      name: "STARGAZE.Context.Edit",
      // icon: '<i class="fas fa-edit"></i>',
      callback: actorCallback((actor) => {

        console.log(actor)
        console.log(foundry.utils.getProperty(actor, "system.armor"))
        console.log(foundry.utils.getProperty(actor, "system.name"))
        console.log(foundry.utils.getProperty(actor, "name"))
        console.log(actor.name)
        console.log(actor.system.armor)

        actor.update({
          "system.armor": foundry.utils.getProperty(actor, "system.armor") + 10
        })
      })
    },
    {
      name: "STARGAZE.Context.Delete",
      // icon: '<i class="fas fa-trash"></i>',
      callback: actorCallback((actor) => {

        console.log(actor);

      })
    }
  );
});

// Контекстное меню в списке айтемов
Hooks.on("getItemContextOptions", (application, menuItems) => {
  menuItems.push(
    {
      name: "STARGAZE.Context.Edit",
      // icon: '<i class="fas fa-edit"></i>',
      callback: itemCallback('123', (item) => {
        console.log(item);
      })
    }
  );
});

/* Регистрация */

function actorCallback(delegate) {
  return (target) =>{

    var actorId =
           target?.dataset?.documentId
        || target?.dataset?.entryId
        || target?.dataset?.id
        || null;

    const actor = game.actors.get(actorId);

    delegate(actor);
  }
}

function itemCallback(targetItemType, delegate) {
  return (target) =>{

    var itemId =
           target?.dataset?.documentId
        || target?.dataset?.entryId
        || target?.dataset?.id
        || null;

    // if(itemType != targetItemType){
    //   throw new Error(`itemType(${itemType}) must be equal to targetItemType(${targetItemType})`);
    // }

    const item = game.items.get(itemId);

    delegate(item);
  }
}