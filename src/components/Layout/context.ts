import type { InjectionKey } from 'vue'
import type { LayoutSiderPlacement } from './types'

export interface WkLayoutContext {
  hasSider: boolean
  siderPlacement: LayoutSiderPlacement
}

export const WK_LAYOUT_KEY: InjectionKey<WkLayoutContext> = Symbol('rdLayout')
