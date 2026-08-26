import type { InjectionKey } from 'vue'
import type { LayoutSiderPlacement } from './types'

export interface WiLayoutContext {
  hasSider: boolean
  siderPlacement: LayoutSiderPlacement
}

export const WI_LAYOUT_KEY: InjectionKey<WiLayoutContext> = Symbol('wiLayout')
