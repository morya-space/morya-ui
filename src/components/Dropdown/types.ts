import type { MenuNodeBase } from '../../shared/menu'
import type { MAppendTo } from '../../shared/overlay'
import type { RootPassThrough } from '../../shared/passThrough'
import type { MotionPresetId } from '../../theme/motionPresets'

export type DropdownItemType = 'item' | 'group' | 'divider'
export type DropdownTrigger = 'click' | 'hover'

export interface DropdownItem extends MenuNodeBase {
  type?: DropdownItemType
  items?: DropdownItem[]
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
  trigger?: DropdownTrigger
  showDelay?: number
  hideDelay?: number
  /**
   * 是否将菜单 Teleport 出去。默认 `true`。
   * 设为 `false` 时等价于 `appendTo: 'self'`。
   */
  teleport?: boolean
  /** 挂载目标，默认 `'body'`；`'self'` / `false` 表示就地渲染。 */
  appendTo?: MAppendTo
  /** Pass-through attrs/classes/styles for the root element. */
  pt?: RootPassThrough
  /** Named motion preset, or `false` to disable enter/exit transition. */
  transition?: MotionPresetId | false
}

export interface DropdownEmits {
  (event: 'update:modelValue', value: boolean): void
  (event: 'select', item: DropdownItem): void
}
