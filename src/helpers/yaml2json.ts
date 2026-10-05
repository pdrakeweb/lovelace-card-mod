import { load } from "js-yaml";
import { CardModStyle } from "./apply_card_mod";

// Parses a theme's `card-mod-<type>-yaml` variable to a style object.
//
// Upstream bootstrapped HA's <ha-yaml-editor> by creating a fake
// <partial-panel-resolver> with a mock hass object. That hack broke on
// HA 2026.9 (_updateRoutes now crashes on the mock, so the yaml editor
// chunk never loads and the bootstrap hangs forever), which hung
// get_theme() and silently killed ALL card-mod styling. Parse the YAML
// directly instead - ha-yaml-editor is js-yaml under the hood anyway.
export const yaml2json = async (yaml: string): Promise<CardModStyle> => {
  try {
    const result = load(yaml);
    if (typeof result === "object" && result !== null)
      return result as CardModStyle;
    console.error("CARD-MOD: Theme yaml did not parse to an object:", yaml);
    return {};
  } catch (err) {
    console.error("CARD-MOD: Error parsing theme yaml:", err);
    return {};
  }
};
