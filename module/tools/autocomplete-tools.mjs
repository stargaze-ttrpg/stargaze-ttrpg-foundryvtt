import { KEYWORDS } from "../configs/keywords.mjs";

class Autocomplete {
  constructor() {
    // Один-единственный элемент меню на всё приложение
    this._menu = null;
    this._items = [];
    this._entries = [];
    this._selectedIndex = -1;

    // Текущий input, для которого открыто меню
    this._activeInput = null;

    document.addEventListener("keydown", (e) => this._onKeyDown(e));
    document.addEventListener("mousedown", (e) => {
      if (this._activeInput && !e.target.closest?.(".sa-autocomplete")) {
        this._dismiss();
      }
    });
    window.addEventListener("resize", () => this._reposition());
  }

  tryAutocomplete(event) {
    const input = event.target;
    if (!input.dataset?.autocompleteGroup) return;

    const group = input.dataset.autocompleteGroup;
    const query = input.value.trim().toLowerCase();
    const keywordSet = KEYWORDS[group];

    if (!keywordSet || !query) {
      this._dismiss();
      return;
    }

    const entries = keywordSet.entries
      .map(entry => ({
        id: entry.id,
        label: game.i18n.localize(entry.label)
      }))
      .filter(entry => entry.label.toLowerCase().includes(query));

    if (entries.length === 0) {
      this._dismiss();
      return;
    }

    this._render(input, entries);
  }

  // --- Внутренняя реализация ---

  _ensureMenu() {
    if (this._menu && document.body.contains(this._menu)) return this._menu;

    const menu = document.createElement("ul");
    menu.className = "sa-autocomplete";
    document.body.appendChild(menu);

    menu.addEventListener("mousedown", (e) => {
      const li = e.target.closest("li[data-index]");
      if (!li) return;
      e.preventDefault();
      const idx = Number(li.dataset.index);
      if (this._entries[idx]) this._select(this._entries[idx]);
    });

    this._menu = menu;
    return menu;
  }

  _render(input, entries) {
    const menu = this._ensureMenu();
    this._activeInput = input;
    this._entries = entries;
    this._selectedIndex = -1;

    menu.innerHTML = "";
    this._items = [];

    entries.forEach((entry, idx) => {
      const li = document.createElement("li");
      li.className = "sa-autocomplete__item";
      li.dataset.index = idx;
      li.textContent = entry.label;
      li.addEventListener("mouseenter", () => this._highlight(idx));
      menu.appendChild(li);
      this._items.push(li);
    });

    this._position();
    menu.classList.add("sa-autocomplete--open");
  }

  _position() {
    if (!this._menu || !this._activeInput) return;
    const rect = this._activeInput.getBoundingClientRect();
    this._menu.style.setProperty("--sa-left", `${rect.left}px`);
    this._menu.style.setProperty("--sa-top", `${rect.bottom + 2}px`);
    this._menu.style.setProperty("--sa-width", `${rect.width}px`);
  }

  _highlight(idx) {
    this._items.forEach((li, i) => {
      li.classList.toggle("sa-autocomplete__item--active", i === idx);
    });
    this._selectedIndex = idx;
  }

  _select(entry) {
    if (!this._activeInput) return;
    this._activeInput.value = entry.label;
    this._activeInput.dispatchEvent(new Event("change", { bubbles: true }));
    this._dismiss();
  }

  _dismiss() {
    if (this._menu) {
      this._menu.classList.remove("sa-autocomplete--open");
      this._menu.innerHTML = "";
    }
    this._items = [];
    this._entries = [];
    this._selectedIndex = -1;
    this._activeInput = null;
  }

  _reposition() {
    if (!this._menu?.classList.contains("sa-autocomplete--open")) return;
    this._position();
  }

  _onKeyDown(event) {
    const input = this._activeInput;
    if (!input || event.target !== input) return;
    if (!this._menu?.classList.contains("sa-autocomplete--open")) return;

    const count = this._entries.length;
    if (count === 0) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        this._highlight((this._selectedIndex + 1) % count);
        break;
      case "ArrowUp":
        event.preventDefault();
        this._highlight((this._selectedIndex - 1 + count) % count);
        break;
      case "Enter":
        if (this._selectedIndex >= 0) {
          event.preventDefault();
          this._select(this._entries[this._selectedIndex]);
        }
        break;
      case "Escape":
        event.preventDefault();
        this._dismiss();
        break;
      case "Tab":
        this._dismiss();
        break;
    }
  }
}

export const autocomplete = new Autocomplete();