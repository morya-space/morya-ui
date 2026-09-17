import type { MSizeInput, MTagSeverity } from "../../shared/types";
import type { IconName } from "../Icon/types";

export type StatusSeverity = MTagSeverity | "warning";
export type StatusSize = MSizeInput;
/** Visual presentation: colored dot (default), soft pill tag, or text only. */
export type StatusVariant = "dot" | "tag" | "text";

export interface StatusProps {
  /** Status text. Ignored when default slot has content. */
  label?: string;
  /**
   * Semantic color. Defaults to `secondary` (neutral).
   * Legacy `warning` is normalized to `warn`.
   */
  severity?: StatusSeverity;
  /** Pulse animation on the status indicator (dot). */
  processing?: boolean;
  /** Size. Also accepts legacy `sm` / `lg`. */
  size?: StatusSize;
  /** Custom color. Overrides `severity` when set. */
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
