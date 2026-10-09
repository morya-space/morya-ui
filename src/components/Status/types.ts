import type { MSizeInput, MTagType } from "../../shared/types";
import type { IconName } from "../Icon/types";

export type StatusType = MTagType;
export type StatusSize = MSizeInput;
/** Visual presentation: colored dot (default), soft pill tag, or text only. */
export type StatusVariant = "dot" | "tag" | "text";

export interface StatusProps {
  /** Status text. Ignored when default slot has content. */
  label?: string;
  /**
   * Semantic color. Defaults to `secondary` (neutral).
   */
  type?: StatusType;
  /** Pulse animation on the status indicator (dot). */
  processing?: boolean;
  /** Size. Also accepts legacy `sm` / `lg`. */
  size?: StatusSize;
  /** Custom color. Overrides `type` when set. */
  color?: string;
  /**
   * Presentation style.
   * - `dot`: colored indicator + label (default)
   * - `tag`: soft pill background
   * - `text`: label only (no indicator)
   */
  variant?: StatusVariant;
  /** Leading icon from MIcon. When set (or `#icon` is used), hides the status dot. */
  icon?: IconName;
  /** Dimmed / inactive appearance. */
  disabled?: boolean;
}
