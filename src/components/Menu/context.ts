import type { InjectionKey, Reactive, Ref } from 'vue'
import type { MenuItem } from './types'

export interface MenuContext {
  collapsed: Ref<boolean>
  selectedKey: Ref<string | null>
  expandedKeys: Ref<string[]>
  accordion: boolean
  indent: number
  rootIndent: number
  mode: 'vertical' | 'horizontal'
  inverted: boolean
  flyoutOpen: Reactive<Record<string, boolean>>
  setFlyoutOpen: (key: string, open: boolean) => void
  toggleExpand: (key: string) => void
  isExpanded: (key: string) => boolean
  activate: (item: MenuItem) => void
  resolveKey: (item: MenuItem, index: number, prefix: string) => string
  isSelected: (item: MenuItem, index: number, prefix: string) => boolean
  isChildActive: (item: MenuItem, index: number, prefix: string) => boolean
  paddingLeft: (depth: number) => number
}

export const WI_MENU_KEY: InjectionKey<MenuContext> = Symbol('wiMenu')
