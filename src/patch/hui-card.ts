import { patch_element, patch_object } from "../helpers/patch_function";

import { apply_card_mod } from "../helpers/apply_card_mod";
import { ModdedElement } from "../helpers/apply_card_mod";

const EXCLUDED_CARDS = [
  "conditional",
  "entity-filter",
];
@patch_element("hui-card")
class HuiCardPatch extends ModdedElement {
  _cardMod = [];
  _element: ModdedElement;
  config;

  async _add_card_mod() {
    if (!this._element) return;
    if (EXCLUDED_CARDS.includes(this.config?.type?.toLowerCase())) return;

    const element = this._element as any;
    const _cfg = element?.config || element?._config || this.config;
    // The inner card's stored config (element._config) can be a copy that
    // lacks card_mod while the hui-card wrapper's own config carries it.
    // Prefer whichever candidate actually has card_mod, keeping the
    // original precedence whenever that pick already has it.
    const config = _cfg?.card_mod
      ? _cfg
      : this.config?.card_mod
        ? this.config
        : element?.config?.card_mod
          ? element.config
          : element?._config?.card_mod
            ? element._config
            : _cfg;
    const cls = `type-${config?.type?.replace?.(":", "-")}`;

    await apply_card_mod(
      this._element,
      "card",
      config?.card_mod,
      { config },
      true,
      cls
    );
  }

  _loadElement(_orig, ...args) {
    _orig?.(...args);
    this._add_card_mod();
  }
}
