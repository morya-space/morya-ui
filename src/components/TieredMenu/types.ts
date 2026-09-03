import type { WiAppendTo } from '../../shared/overlay'
import type { FloatingOverlayPlacement } from '../../shared/overlayPlacement'

export interface TieredMenuItem {
  label?: string
  command?: () => void
  disabled?: boolean
  separator?: boolean
  items?: TieredMenuItem[]
}

export interface TieredMenuProps {
  model: TieredMenuItem[]
  popup?: boolean
  modelValue?: boolean
  /** Popup placement relative to the anchor. Defaults to `'bottom-start'`. */
  placement?: FloatingOverlayPlacement
  /** Teleport overlay when `popup`. Defaults to `true`. */
  teleport?: boolean
  /** Teleport target. Defaults to `'body'` (or ConfigProvider `appendTo`). */
  appendTo?: WiAppendTo
}

export interface TieredMenuEmits {
  (event: 'update:modelValue', value: boolean): void
}
