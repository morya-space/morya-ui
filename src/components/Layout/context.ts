import type { InjectionKey } from 'vue'
import type { LayoutSiderPlacement } from './types'

export interface RdLayoutContext {
  hasSider: boolean
  siderPlacement: LayoutSiderPlacement
}

export const RD_LAYOUT_KEY: InjectionKey<RdLayoutContext> = Symbol('rdLayout')
