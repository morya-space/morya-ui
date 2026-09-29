import type { RootPassThrough } from '../../shared/passThrough'

export type QRCodeErrorLevel = 'L' | 'M' | 'Q' | 'H'
export type QRCodeStatus = 'active' | 'expired' | 'loading' | 'scanned'

export interface QRCodeIcon {
  src: string
  size?: number
}

export interface QRCodeProps {
  pt?: RootPassThrough
  value: string
  size?: number
  /** Foreground modules color. Defaults to `--m-color-text`. */
  color?: string
  /** Background color. Defaults to `--m-color-surface`. */
  bgColor?: string
  bordered?: boolean
  errorLevel?: QRCodeErrorLevel
  status?: QRCodeStatus
  icon?: string | QRCodeIcon
}

export interface QRCodeEmits {
  refresh: []
}
