import type { IconName } from '../../components/Icon/types'
import { isIconName } from '../../components/Icon/icons'

/** Map common Tabler / Lucide-style names to built-in icons. */
const menuIconAliases: Record<string, IconName> = {
  'user-shield': 'shield-check',
  'school': 'book',
  'forms': 'edit',
  'stack-2': 'layers',
  'git-branch': 'link',
  'adjustments': 'settings',
  'alert-triangle': 'warning',
  'report-analytics': 'chart-bar',
  'report': 'chart-bar',
}

/** Resolve a menu item icon string to a registered IconName, if applicable. */
export function resolveMenuIcon(icon?: string): IconName | undefined {
  if (!icon) return undefined
  if (isIconName(icon)) return icon
  return menuIconAliases[icon]
}
