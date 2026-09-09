import type { InjectionKey } from 'vue'
import type { LayoutSiderPlacement } from './types'

export interface MLayoutContext {
  hasSider: boolean
  siderPlacement: LayoutSiderPlacement
}

export const M_LAYOUT_KEY: InjectionKey<MLayoutContext> = Symbol('muLayout')
