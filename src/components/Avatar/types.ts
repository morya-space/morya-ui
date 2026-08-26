import type { IconName } from '../Icon/types'

export type AvatarShape = 'circle' | 'square'

export type AvatarSize = 'normal' | 'large' | 'xlarge'

export interface AvatarProps {
  /** Initials or fallback text when image/icon are absent. */
  label?: string
  /** Image URL. Takes priority over icon and label. */
  image?: string
  /** Icon name from WiIcon. Used when image is absent. */
  icon?: IconName
  /** Shape of the avatar. */
  shape?: AvatarShape
  /** Size. Also accepts legacy `sm` / `lg`. */
  size?: AvatarSize | 'sm' | 'lg'
}

export interface AvatarEmits {
  (event: 'error', value: Event): void
}

export interface AvatarGroupProps {
  /** Max avatars to show. Extra count is summarized as `+N`. */
  max?: number
  /** Size applied to overflow rest marker. */
  size?: AvatarSize | 'sm' | 'lg'
}
