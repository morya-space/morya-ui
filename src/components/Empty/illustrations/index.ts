import type { EmptyIllustration } from "./catalog";
import {
  EMPTY_ILLUSTRATION_KEYS,
  isEmptyIllustration,
} from "./catalog";
import { loadEmptyIllustration } from "./loaders";

export {
  EMPTY_ILLUSTRATION_KEYS,
  isEmptyIllustration,
  type EmptyIllustration,
};
export { loadEmptyIllustration } from "./loaders";
export { DEFAULT_EMPTY_ICON_SVG } from "./defaultEmptyIcon";

/** Common no-data / filtered empty presets. */
export const EMPTY_PRESET_KEYS = [
  "no-content",
  "no-result",
  "no-message",
  "no-schedule",
  "no-issue",
] as const satisfies readonly EmptyIllustration[];

export type EmptyPreset = (typeof EMPTY_PRESET_KEYS)[number];

/** Fault / outcome scenes that may appear in empty-adjacent UIs. */
export const EMPTY_OUTCOME_KEYS = [
  "network-error",
  "server-error",
  "building",
] as const satisfies readonly EmptyIllustration[];

export type EmptyOutcomeIllustration = (typeof EMPTY_OUTCOME_KEYS)[number];

const PLACEHOLDER_RE = /__MID_(\d+)__/g;

/** Remap placeholder gradient/filter ids so multiple instances can coexist. */
export function remappedIllustrationMarkup(
  markup: string,
  idPrefix: string,
): string {
  return markup.replace(PLACEHOLDER_RE, (_match, index: string) => {
    return `${idPrefix}-${index}`;
  });
}

/** Load and remap one built-in illustration for injection. */
export async function resolveIllustrationMarkup(
  name: EmptyIllustration,
  idPrefix: string,
): Promise<string> {
  const markup = await loadEmptyIllustration(name);
  return remappedIllustrationMarkup(markup, idPrefix);
}
