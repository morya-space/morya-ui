import type { WdAppendTo } from '../../shared/overlay'

export interface DropdownItem {
  /** 菜单项的稳定标识，同时用于 v-for 的 key。 */
  value: string
  /** 菜单项展示文本。需要自定义内容时可使用 item slot。 */
  label: string
  /** 禁用后不可聚焦、不可选择。 */
  disabled?: boolean
}

export interface DropdownProps {
  /** 控制菜单是否打开。 */
  modelValue?: boolean
  /** 菜单项列表。 */
  items: DropdownItem[]
  /** Teleport 到 body 时的水平对齐方式。 */
  placement?: 'bottom-start' | 'bottom-end'
  /** 选择菜单项后是否自动关闭菜单。 */
  closeOnSelect?: boolean
  /**
   * 是否将菜单 Teleport 出去。默认 `true`。
   * 设为 `false` 时等价于 `appendTo: 'self'`。
   */
  teleport?: boolean
  /** 挂载目标，默认 `'body'`；`'self'` / `false` 表示就地渲染。 */
  appendTo?: WdAppendTo
}

export interface DropdownEmits {
  (event: 'update:modelValue', value: boolean): void
  (event: 'select', item: DropdownItem): void
}
