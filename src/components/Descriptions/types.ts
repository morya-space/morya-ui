import type { InjectionKey, Ref } from 'vue'
import type { RootPassThrough } from '../../shared/passThrough'
import type { MSizeInput } from '../../shared/types'

export type DescriptionsLayout = 'horizontal' | 'vertical'
export type DescriptionsSize = MSizeInput

export interface DescriptionsProps {
  pt?: RootPassThrough
  /** Header title. Prefer `#title` for custom markup. */
  title?: string
  /** Draw borders around cells. Default `false`. */
  bordered?: boolean
  /** Items per row. Default `3`. */
  column?: number
  /** Label/content arrangement. Default `horizontal`. */
  layout?: DescriptionsLayout
  size?: DescriptionsSize
  /** Append colon after labels. Default `true`. */
  colon?: boolean
}

export interface DescriptionsItemProps {
  /** Label text. Prefer `#label` for custom markup. */
  label?: string
  /** Column span. Default `1`. */
  span?: number
}

export interface DescriptionsContext {
  bordered: Ref<boolean>
  layout: Ref<DescriptionsLayout>
  sizeClass: Ref<'small' | 'normal' | 'large'>
  colon: Ref<boolean>
  column: Ref<number>
}

export const DESCRIPTIONS_KEY: InjectionKey<DescriptionsContext> = Symbol('mDescriptions')
