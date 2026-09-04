import type { WdAppendTo } from '../../shared/overlay'
import type { ButtonSeverity, ButtonSize } from '../Button/types'

export interface SplitButtonItem {
  label: string
  command?: () => void
  disabled?: boolean
}

export interface SplitButtonProps {
  label?: string
  icon?: string
  model?: SplitButtonItem[]
  severity?: ButtonSeverity
  disabled?: boolean
  outlined?: boolean
  size?: ButtonSize | 'sm' | 'md' | 'lg'
  /**
   * 是否将菜单 Teleport 出去。默认 `true`。
   * 设为 `false` 时等价于 `appendTo: 'self'`。
   */
  teleport?: boolean
  /** 挂载目标，默认 `'body'`；`'self'` / `false` 表示就地渲染。 */
  appendTo?: WdAppendTo
}

export interface SplitButtonEmits {
  (event: 'click', value: MouseEvent): void
  (event: 'command', item: SplitButtonItem): void
}
