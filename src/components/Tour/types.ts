import type { RootPassThrough } from '../../shared/passThrough'
import type { FloatingOverlayPlacement } from '../../shared/overlayPlacement'
import type { VNodeChild } from 'vue'

export type TourType = 'default' | 'primary'

export interface TourStepButtonProps {
  children?: VNodeChild | string
  class?: string
  style?: Record<string, string> | string
  onClick?: (event: MouseEvent) => void
}

export interface TourStep {
  title?: VNodeChild | string
  description?: VNodeChild | string
  /** Target element for spotlight + panel placement. */
  target?: () => HTMLElement | null
  cover?: VNodeChild
  placement?: FloatingOverlayPlacement
  nextButtonProps?: TourStepButtonProps
  prevButtonProps?: TourStepButtonProps
  type?: TourType
}

export interface TourProps {
  pt?: RootPassThrough
  steps?: TourStep[]
  /** Controlled open state (`v-model:open`). */
  open?: boolean
  /** Visibility alias for `v-model` (`open`). */
  modelValue?: boolean
  /** Current step index (`v-model:current`). */
  current?: number
  /** Default panel placement when step omits `placement`. */
  placement?: FloatingOverlayPlacement
  /** Dim background outside spotlight. Default `true`. */
  mask?: boolean
  /** Extra padding (px) around the spotlight rect. Default `4`. */
  gap?: number
  type?: TourType
  zIndex?: number
  teleport?: boolean
}

export interface TourEmits {
  'update:open': [open: boolean]
  'update:modelValue': [open: boolean]
  'update:current': [index: number]
  close: []
  finish: []
  change: [current: number]
}
