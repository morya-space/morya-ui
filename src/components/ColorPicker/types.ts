import type { MAppendTo } from '../../shared/overlay'
import type { FieldPassThrough } from '../../shared/passThrough'
import type { MSizeInput } from '../../shared/types'
import type { MotionPresetId } from '../../theme/motionPresets'

export type ColorPickerFormat = 'hex' | 'rgb' | 'hsb'

export type ColorPickerPlacement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'bottom-start'
  | 'bottom-end'
  | 'right-start'
  | 'left-start'

export interface ColorPickerPreset {
  label?: string
  colors: string[]
  defaultOpen?: boolean
}

export type ColorPickerMode = 'single' | 'gradient'
export type GradientType = 'linear' | 'radial'

export interface GradientStop {
  id: string
  color: string
  position: number
}

export interface GradientValue {
  type: GradientType
  angle: number
  stops: GradientStop[]
}

export interface ColorPickerProps {
  /** Current color value in hex (e.g. '#1677ff') or CSS gradient string. */
  modelValue?: string
  disabled?: boolean
  /** Disable alpha channel. */
  disabledAlpha?: boolean
  /** Show clear button. */
  allowClear?: boolean
  /** Format of the displayed value. */
  format?: ColorPickerFormat
  /** Preset color palettes. */
  presets?: ColorPickerPreset[]
  /** Show text input in trigger. */
  showText?: boolean
  /** Trigger size. */
  size?: MSizeInput
  /** Popup placement. */
  placement?: ColorPickerPlacement
  /** Teleport overlay. Defaults to `true`. */
  teleport?: boolean
  /** Mount target. Defaults to `'body'`. */
  appendTo?: MAppendTo
  /** Named motion preset, or `false` to disable transition. */
  transition?: MotionPresetId | false
  /** Pass-through attrs/classes/styles per DOM part. */
  pt?: FieldPassThrough
  /** Enable gradient mode. */
  gradient?: boolean
}

export interface ColorPickerEmits {
  (event: 'update:modelValue', value: string): void
  (event: 'change', value: string): void
  (event: 'clear'): void
  (event: 'show'): void
  (event: 'hide'): void
}
