import type { RootPassThrough } from "../../shared/passThrough";
import type { IconName } from "../Icon/types";

/** Result page / outcome status. */
export type ResultStatus =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "403"
  | "404"
  | "500"
  | "418";

export type ResultSize = "small" | "medium" | "large" | "huge" | "sm" | "md" | "lg";

export interface ResultProps {
  pt?: RootPassThrough;
  /** Outcome status. Drives default icon / HTTP illustration, tone, and locale title. */
  status?: ResultStatus;
  /** Title. Defaults to a locale string for the current `status`. */
  title?: string;
  /** Supporting description. */
  description?: string;
  /**
   * Override the status icon (semantic statuses).
   * For HTTP statuses, forces icon mode instead of the built-in illustration.
   */
  icon?: IconName;
  /** Visual density. */
  size?: ResultSize;
}
