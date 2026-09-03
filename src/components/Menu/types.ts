import type { WiAppendTo } from '../../shared/overlay'
import type { WiRouteLocationRaw } from '../../shared/optionalRouter'

export interface MenuItem {
  key?: string
  label?: string
  icon?: string
  /** SPA route target when vue-router is available; falls back to anchor. */
  to?: WiRouteLocationRaw
  command?: () => void
  disabled?: boolean
  separator?: boolean
  items?: MenuItem[]
}

export type MenuMode = 'vertical' | 'horizontal'

export type MenuPopupPlacement =
  | 'bottom-start'
  | 'bottom-end'
  | 'top-start'
  | 'top-end'

export interface MenuProps {
  model: MenuItem[]
  /** Render as popup overlay when true. */
  popup?: boolean
  /** Popup visibility. Use with `v-model`. */
  modelValue?: boolean
  /** Popup placement relative to the default-slot trigger or last pointer. */
  placement?: MenuPopupPlacement
  /** Selected item key (`item.key` or `item.label`). */
  selectedKey?: string | null
  /** Icon-only density; nested groups use flyout popovers. */
  collapsed?: boolean
  /** Sider width when collapsed, used to center icons. Default 80. */
  collapsedWidth?: number
  /** Extra padding-left per nesting level, in px. Default 12. */
  indent?: number
  /** Root item left padding, in px. Default 16. */
  rootIndent?: number
  /** Only one top-level submenu open at a time. */
  accordion?: boolean
  /** Initially expanded submenu keys. */
  defaultExpandedKeys?: string[]
  /** Controlled expanded submenu keys. */
  expandedKeys?: string[]
  /** Expand all nested groups initially. */
  defaultExpandAll?: boolean
  /** Layout direction. */
  mode?: MenuMode
  /** Dark / sider-style colors. */
  inverted?: boolean
  /** Remove chrome for embedding in layout sider. Defaults to `!popup`. */
  embedded?: boolean
  /** Teleport overlay when `popup`. Defaults to `true`. */
  teleport?: boolean
  /** Teleport target. Defaults to `'body'` (or ConfigProvider `appendTo`). */
  appendTo?: WiAppendTo
}

export interface MenuEmits {
  (event: 'update:modelValue', value: boolean): void
  (event: 'update:selectedKey', value: string | null): void
  (event: 'update:expandedKeys', value: string[]): void
  (event: 'select', item: MenuItem): void
}
