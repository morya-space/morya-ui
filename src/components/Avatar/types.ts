import type { IconName } from '../Icon/types'

export type AvatarShape = 'circle' | 'square'

export type AvatarSize = 'normal' | 'large' | 'xlarge'

export interface AvatarProps {
  /** Initials or fallback text when image/icon are absent. */
  label?: string
  /** Image URL. Takes priority over icon and label. */
  image?: string
  /** Icon name from WdIcon. Used when image is absent. */
  icon?: IconName
  /** Shape of the avatar. */
  shape?: AvatarShape
  /** Size. Also accepts legacy `sm` / `lg`. */
  size?: AvatarSize | 'sm' | 'lg'
}
