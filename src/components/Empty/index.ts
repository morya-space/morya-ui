import './style'
export type {
  EmptyIllustration,
  EmptyOutcomeIllustration,
  EmptyPreset,
} from "./illustrations";
export {
  EMPTY_ILLUSTRATION_KEYS,
  EMPTY_OUTCOME_KEYS,
  EMPTY_PRESET_KEYS,
  isEmptyIllustration,
  loadEmptyIllustration,
} from "./illustrations";
export { default as MEmpty } from "./Empty.vue";
export type { EmptyProps, EmptySize } from "./types";
