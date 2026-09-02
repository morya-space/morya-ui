import type { IconName } from '../../components/Icon/types'
import { isIconName } from '../../components/Icon/icons'

/** Map common Tabler / Lucide-style names to built-in Wi icons. */
const menuIconAliases: Record<string, IconName> = {
  'layout-dashboard': 'home',
  'users': 'user',
  'user-shield': 'shield',
  'users-group': 'user',
  'user-check': 'user',
  'history': 'clock',
  'school': 'book',
  'building': 'home',
  'forms': 'edit',
  'stack-2': 'grip',
  'git-branch': 'link',
  'adjustments': 'settings',
  'adjustments-horizontal': 'settings',
  'list-details': 'menu',
  'alert-triangle': 'warning',
  'sparkles': 'star',
  'report-analytics': 'chart-bar',
  'report': 'chart-bar',
}

/** Resolve a menu item icon string to a registered IconName, if applicable. */
export function resolveMenuIcon(icon?: string): IconName | undefined {
  if (!icon) return undefined
  if (isIconName(icon)) return icon
  return menuIconAliases[icon]
}
