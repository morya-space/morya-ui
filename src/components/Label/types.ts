import type { RootPassThrough } from '../../shared/passThrough'

export interface LabelProps {
  /** Prefer over `for` in templates; maps to htmlFor. */
  htmlFor?: string
  /** HTML for attribute alias. */
  for?: string
  /** Pass-through attrs/classes/styles per DOM part. */
  pt?: RootPassThrough
}
