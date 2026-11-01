const ActorSheetBase = foundry.appv1?.sheets?.ActorSheet ?? ActorSheet;
const ContextMenuClass = foundry.applications.ux.ContextMenu.implementation;

export class CharacterSheet extends ActorSheetBase {

  /* Initialization */

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["stargaze", "sheet", "character"],
      template: "systems/stargaze/templates/character-sheet.hbs",
      width: 900,
      height: 700,
      tabs: [
        {
          navSelector: ".sheet-tabs[data-group='primary']",
          contentSelector: ".sheet-body",
          initial: "main"
        },
        {
          navSelector: ".sheet-tabs[data-group='abilities']",
          contentSelector: ".abilities-body",
          initial: "scripts"
        }
      ]
    });
  }


  async getData(options) {
    const context = await super.getData(options);
    context.system = this.actor.system;
    context.actions = this.actor.items.filter(i => i.type === "action").sort((a, b) => a.sort - b.sort);
    context.properties = this.actor.items.filter(i => i.type === "property").sort((a, b) => a.sort - b.sort);
    context.chemicals = this.actor.items.filter(i => i.type === "chemicals").sort((a, b) => a.sort - b.sort);
    context.scripts = this.actor.items.filter(i => i.type === "script").sort((a, b) => a.sort - b.sort);
    context.psionics = this.actor.items.filter(i => i.type === "psionics").sort((a, b) => a.sort - b.sort);

    context.scriptsByLevel = {
      level1: context.scripts.filter(i => (i.system.level || 1) === 1).sort((a, b) => a.sort - b.sort),
      level2: context.scripts.filter(i => (i.system.level || 1) === 2).sort((a, b) => a.sort - b.sort),
      level3: context.scripts.filter(i => (i.system.level || 1) === 3).sort((a, b) => a.sort - b.sort),
      level4: context.scripts.filter(i => (i.system.level || 1) === 4).sort((a, b) => a.sort - b.sort),
    };
    context.chemicalsByLevel = {
      level1: context.chemicals.filter(i => (i.system.level || 1) === 1).sort((a, b) => a.sort - b.sort),
      level2: context.chemicals.filter(i => (i.system.level || 1) === 2).sort((a, b) => a.sort - b.sort),
      level3: context.chemicals.filter(i => (i.system.level || 1) === 3).sort((a, b) => a.sort - b.sort),
      level4: context.chemicals.filter(i => (i.system.level || 1) === 4).sort((a, b) => a.sort - b.sort),
    };
    context.psionicsByLevel = {
      level1: context.psionics.filter(i => (i.system.level || 1) === 1).sort((a, b) => a.sort - b.sort),
      level2: context.psionics.filter(i => (i.system.level || 1) === 2).sort((a, b) => a.sort - b.sort),
      level3: context.psionics.filter(i => (i.system.level || 1) === 3).sort((a, b) => a.sort - b.sort),
      level4: context.psionics.filter(i => (i.system.level || 1) === 4).sort((a, b) => a.sort - b.sort),
    };
    context.implants = {
      body: this.actor.items.filter(i => i.type === "implant" && i.system.slot === "body").sort((a, b) => a.sort - b.sort),
      nerv: this.actor.items.filter(i => i.type === "implant" && i.system.slot === "nerv").sort((a, b) => a.sort - b.sort),
      mind: this.actor.items.filter(i => i.type === "implant" && i.system.slot === "mind").sort((a, b) => a.sort - b.sort),
      psyc: this.actor.items.filter(i => i.type === "implant" && i.system.slot === "psyc").sort((a, b) => a.sort - b.sort)
    };
    context.inventory = {
      ship: this.actor.items.filter(i => i.type === "gear" && i.system.location === "ship").sort((a, b) => a.sort - b.sort),
      stock: this.actor.items.filter(i => i.type === "gear" && i.system.location === "stock").sort((a, b) => a.sort - b.sort),
      self: this.actor.items.filter(i => i.type === "gear" && (i.system.location === "self" || !i.system.location )).sort((a, b) => a.sort - b.sort),
      weapons: this.actor.items.filter(i => i.type === "weapon").sort((a, b) => a.sort - b.sort)
    };
    return context;
  }

  /* Function */
  
  rollStat(target){
    const dataset = target.currentTarget.closest(".stat")?.dataset;
    const stat = dataset.stat;

    this.actor.rollStat(stat);
  }

  rollSkill(target){
    const dataset = target.currentTarget.closest(".skill")?.dataset;
    const skill = dataset.skill;

    this.actor.rollSkill(skill);
  }

  itemEdit(item){
    item.showItemSheet();
  }

  itemDelete(item){
    item.deleteItem(this.actor);
  }

  itemShare(item){
    item.sendItemToChat(this.actor);
  }

  collapseItem(item){
    item.collapseItem();
  }

  weaponAttack(item){
    item.rollAttack(this.actor, undefined);
  }

  /* Registeration */

  characterItemClick(targetItemType, delegate){
    return (target) =>{
      const id = target.currentTarget.closest("[data-item-id]")?.dataset.itemId;
      if (!id) return;
      
      const item = this.actor.items.get(id);
      if (!item) return;

      if(targetItemType != null && targetItemType != item.type){
        throw new Error(`itemType(${item.type}) must be equal to targetItemType(${targetItemType})`);
      }

      delegate(this.actor, item);
    }
  }

  characterItemCallback(name, targetItemType, delegate) {
    return {
      name: name,
      icon: undefined,
      condition: (target) =>{
        if(!targetItemType)
          return true;

        const itemType = target[0].dataset.itemType;
        return targetItemType == itemType;
      },
      callback: (target) =>{
        const itemId = target[0].dataset.itemId;
        const itemType = target[0].dataset.itemType;

        if(targetItemType != null && targetItemType != itemType){
          throw new Error(`itemType(${itemType}) must be equal to targetItemType(${targetItemType})`);
        }

        const item = this.actor.items.get(itemId);

        delegate(this.actor, item);
      }
    }
  }

  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;

    html.find(".header-stats .right-stats .stat label").on("click", (target) => this.rollStat(target));
    html.find(".skill-name").on("click", (target) => this.rollSkill(target));

    html.find(".character-item").on("dblclick", this.characterItemClick(null, (actor, item) => this.collapseItem(item)));
    html.find("[data-action='item-edit']").on("click", this.characterItemClick(null, (actor, item) => this.itemEdit(item)));
    html.find("[data-action='item-delete']").on("click", this.characterItemClick(null, (actor, item) => this.itemDelete(item)));
    html.find("[data-action='item-share']").on("click", this.characterItemClick(null, (actor, item) => this.itemShare(item)));
    html.find("[data-action='item-collapse']").on("click", this.characterItemClick(null, (actor, item) => this.collapseItem(item)));
    html.find("[data-action='weapon-attack']").on("click", this.characterItemClick('weapon', (actor, item) => this.weaponAttack(item)));

    html.find("[data-action='edit-image']").on("click", () => {
      const fp = new FilePicker({
        type: "image",
        current: this.actor.img,
        callback: (path) => this.actor.update({ img: path })
      });
      fp.browse();
    });

    const potential = this.actor.system.psionicPotential || 0;
    html.find(".psy-icon").each((i, el) => {
      const level = parseInt(el.dataset.level);
      if (level <= potential) el.classList.add("psy-active");
    });
    html.find(".psy-icon").on("click", (ev) => {
      const level = parseInt(ev.currentTarget.dataset.level);
      this.actor.update({ "system.psionicPotential": level });
    });

    new ContextMenuClass(html, ".character-item", [
      this.characterItemCallback('Бросить атаку в чат', 'weapon', (actor, item) => this.weaponAttack(item)),
      this.characterItemCallback('Показать карточку в чате', null, (actor, item) => this.itemShare(item)),
      this.characterItemCallback('Скрыть', null, (actor, item) => this.collapseItem(item)),
      this.characterItemCallback('Редактировать', null, (actor, item) => this.itemEdit(item)),
      this.characterItemCallback('Удалить', null, (actor, item) => this.itemDelete(item)),
    ]);

    new ContextMenuClass(html, ".panel > h3", [
      {
        name: game.i18n.localize("STARGAZE.List.CollapseAll"),
        icon: '<i class="fas fa-compress"></i>',
        callback: (target) => {
          const panel = target.closest(".panel");
          panel.querySelectorAll(".character-item").forEach(el => {
            const id = el.dataset.itemId;
            const item = this.actor.items.get(id);
            if (item) item.update({ "flags.stargaze.collapsed": true });
          });
        }
      },
      {
        name: game.i18n.localize("STARGAZE.List.ExpandAll"),
        icon: '<i class="fas fa-expand"></i>',
        callback: (target) => {
          const panel = target.closest(".panel");
          panel.querySelectorAll(".character-item").forEach(el => {
            const id = el.dataset.itemId;
            const item = this.actor.items.get(id);
            if (item) item.update({ "flags.stargaze.collapsed": false });
          });
        }
      }
    ]);

    // Drag and drop
    html.find(".character-item").on("dragstart", (ev) => {
      const itemId = ev.currentTarget.dataset.itemId;
      ev.originalEvent.dataTransfer.setData("text/plain", itemId);
      ev.originalEvent.dataTransfer.setData("application/x-stargaze-item", itemId);
      ev.originalEvent.dataTransfer.setData("application/x-stargaze-actor", this.actor.id);
      ev.originalEvent.dataTransfer.effectAllowed = "move";
    });

    html.find(".items").on("dragover", (ev) => {
      ev.preventDefault();
      ev.originalEvent.dataTransfer.dropEffect = "move";
    });

    html.find(".items").on("drop", (ev) => {
      ev.preventDefault();
      const itemId = ev.originalEvent.dataTransfer.getData("application/x-stargaze-item");
      if (!itemId) return;

      const dragged = this.actor.items.get(itemId);
      if (!dragged) return;

      const targetEl = ev.target.closest(".character-item");
      if (!targetEl || targetEl.dataset.itemId === itemId) return;

      const target = this.actor.items.get(targetEl.dataset.itemId);
      if (!target) return;

      // Only reorder within the same list (same parent .items)
      const draggedParent = ev.currentTarget;
      const targetParent = targetEl.closest(".items");
      if (draggedParent !== targetParent) return;

      const siblings = Array.from(draggedParent.querySelectorAll(".character-item"))
        .map(el => this.actor.items.get(el.dataset.itemId))
        .filter(Boolean);

      const fromIndex = siblings.findIndex(i => i.id === dragged.id);
      const toIndex = siblings.findIndex(i => i.id === target.id);
      if (fromIndex === -1 || toIndex === -1) return;

      siblings.splice(fromIndex, 1);
      siblings.splice(toIndex, 0, dragged);

      const updates = siblings.map((item, idx) => ({
        _id: item.id,
        sort: idx * 1000
      }));

      this.actor.updateEmbeddedDocuments("Item", updates);
    });
  }
}