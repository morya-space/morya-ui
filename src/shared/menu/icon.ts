import type { IconName } from '../../components/Icon/types'
import { isIconName } from '../../components/Icon/icons'

/** Resolve a menu item icon string to a registered IconName, if applicable. */
export function resolveMenuIcon(icon?: string): IconName | undefined {
  return icon && isIconName(icon) ? icon : undefined
}
