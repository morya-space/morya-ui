import type { RootPassThrough } from '../../shared/passThrough'
import type { MotionPresetId } from '../../theme/motionPresets'
export interface BlockUIProps {
  pt?: RootPassThrough
  blocked?: boolean
  /** Named motion preset, or `false` to disable enter/exit transition. */
  transition?: MotionPresetId | false
}
