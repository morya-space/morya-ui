import type { RootPassThrough } from "../../shared/passThrough";
import type { IconName } from "../Icon/types";
import type { EmptyIllustration } from "./illustrations";

export type { EmptyIllustration };

export type EmptySize = "small" | "medium" | "large" | "sm" | "md" | "lg";

export interface EmptyProps {
  pt?: RootPassThrough;
  /**
   * Optional title above the description.
   * Pass `""` to hide when using a custom `#title` is not desired.
   */
  title?: string;
  /** Description. Defaults to locale `emptyMessage` when omitted and no default slot. */
  description?: string;
  /** Whether to show the description / default slot text. */
  showDescription?: boolean;
  /** Whether to show the illustration / icon area. */
  showIcon?: boolean;
  /** Size of the empty block. */
  size?: EmptySize;
  /**
   * Optional icon from MIcon.
   * When omitted (and no `image` / `illustration` / `#image` / `#icon`), a lightweight
   * default empty glyph is shown (catalog illustrations stay opt-in).
   * `search` maps to the `no-result` illustration (loaded on demand).
   */
  icon?: IconName;
  /** Named built-in illustration (loaded on demand; not included in the Empty entry by default). */
  illustration?: EmptyIllustration;
  /** Image URL for the visual. Takes precedence over `illustration` / `icon`. */
  image?: string;
  /** Compact horizontal layout with a smaller illustration. */
  simple?: boolean;
}
