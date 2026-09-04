import type { InjectionKey } from 'vue'
import type { LayoutSiderPlacement } from './types'

export interface WdLayoutContext {
  hasSider: boolean
  siderPlacement: LayoutSiderPlacement
}

export const WD_LAYOUT_KEY: InjectionKey<WdLayoutContext> = Symbol('wdLayout')
