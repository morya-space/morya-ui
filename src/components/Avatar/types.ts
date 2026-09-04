import type { IconName } from '../Icon/types'

export type AvatarShape = 'circle' | 'square'

export type AvatarSize = 'small' | 'medium' | 'large' | 'xlarge'

export interface AvatarProps {
  /** Initials or fallback text when image/icon are absent. */
  label?: string
  /** Image URL. Takes priority over icon and label. */
  image?: string
  /** Icon name from WdIcon. Used when image is absent. */
  icon?: IconName
  /** Shape of the avatar. */
  shape?: AvatarShape
  /** Size. Also accepts legacy `normal` / `sm` / `md` / `lg`. */
  size?: AvatarSize | 'normal' | 'sm' | 'md' | 'lg'
}

export interface AvatarEmits {
  (event: 'error', value: Event): void
}

export interface AvatarGroupProps {
  /** Max avatars to show. Extra count is summarized as `+N`. */
  max?: number
  /** Size applied to overflow rest marker. */
  size?: AvatarSize | 'normal' | 'sm' | 'md' | 'lg'
}
