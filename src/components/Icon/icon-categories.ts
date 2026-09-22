import type { IconName } from './icons'
import { iconNames } from './icons'

/** Built-in icon taxonomy for docs and pickers. */
export type IconCategoryId =
  | 'arrows'
  | 'status'
  | 'actions'
  | 'navigation'
  | 'people'
  | 'files'
  | 'media'
  | 'devices'
  | 'commerce'
  | 'charts'
  | 'communication'
  | 'security'
  | 'weather'
  | 'other'

export interface IconCategoryMeta {
  id: IconCategoryId
  /** Chinese label for the docs site. */
  labelZh: string
  /** English label for the docs site. */
  labelEn: string
}

export const iconCategoryMeta: readonly IconCategoryMeta[] = [
  { id: 'arrows', labelZh: '箭头 / 方向', labelEn: 'Arrows' },
  { id: 'status', labelZh: '状态 / 反馈', labelEn: 'Status' },
  { id: 'actions', labelZh: '操作', labelEn: 'Actions' },
  { id: 'navigation', labelZh: '导航 / 布局', labelEn: 'Navigation' },
  { id: 'people', labelZh: '用户', labelEn: 'People' },
  { id: 'files', labelZh: '文件 / 数据', labelEn: 'Files' },
  { id: 'media', labelZh: '媒体', labelEn: 'Media' },
  { id: 'devices', labelZh: '设备 / 系统', labelEn: 'Devices' },
  { id: 'commerce', labelZh: '商业', labelEn: 'Commerce' },
  { id: 'charts', labelZh: '图表', labelEn: 'Charts' },
  { id: 'communication', labelZh: '通讯', labelEn: 'Communication' },
  { id: 'security', labelZh: '安全', labelEn: 'Security' },
  { id: 'weather', labelZh: '天气 / 主题', labelEn: 'Weather' },
  { id: 'other', labelZh: '其他', labelEn: 'Other' },
] as const

const categorizedIcons: Record<Exclude<IconCategoryId, 'other'>, readonly IconName[]> = {
  arrows: [
    'chevron-up',
    'chevron-down',
    'chevron-left',
    'chevron-right',
    'triangle-up',
    'triangle-down',
    'arrow-up',
    'arrow-down',
    'arrow-left',
    'arrow-right',
    'arrow-back-up',
    'arrow-forward-up',
    'undo',
    'redo',
    'external-link',
    'logout',
    'login',
    'send',
    'share',
    'refresh',
    'sort',
  ],
  status: [
    'check',
    'check-circle',
    'close',
    'x-circle',
    'info',
    'info-circle',
    'warning',
    'alert-circle',
    'help-circle',
    'ban',
    'loader',
    'star',
    'heart',
    'sparkles',
    'rocket',
  ],
  actions: [
    'plus',
    'minus',
    'search',
    'edit',
    'trash',
    'copy',
    'download',
    'upload',
    'filter',
    'more',
    'more-vertical',
    'menu',
    'grip',
    'maximize',
    'restore',
    'zoom-in',
    'zoom-out',
    'save',
    'device-floppy',
    'cut',
    'scissors',
    'printer',
    'play',
    'pause',
    'player-play',
    'player-pause',
    'clipboard',
    'paperclip',
    'history',
    'archive',
  ],
  navigation: [
    'home',
    'layout-dashboard',
    'layout-grid',
    'grid',
    'list',
    'table',
    'layers',
    'stack',
    'settings',
    'sliders',
    'adjustments-horizontal',
    'components',
    'palette',
  ],
  people: ['user', 'users', 'user-plus'],
  files: [
    'folder',
    'folder-open',
    'file',
    'file-text',
    'book',
    'database',
    'box',
    'package',
  ],
  media: ['photo', 'image', 'video', 'microphone', 'eye', 'eye-off'],
  devices: [
    'device-desktop',
    'device-mobile',
    'phone',
    'wifi',
    'server',
    'cloud',
    'terminal',
    'code',
  ],
  commerce: [
    'shopping-cart',
    'credit-card',
    'briefcase',
    'building',
    'map-pin',
    'world',
  ],
  charts: ['chart-bar', 'chart-line', 'chart-pie', 'activity'],
  communication: ['mail', 'message', 'bell'],
  security: ['lock', 'unlock', 'link', 'shield', 'key'],
  weather: ['sun', 'moon', 'calendar', 'clock'],
}

const categoryByName = new Map<string, IconCategoryId>()
for (const [category, names] of Object.entries(categorizedIcons) as [
  Exclude<IconCategoryId, 'other'>,
  readonly IconName[],
][]) {
  for (const name of names) {
    categoryByName.set(name, category)
  }
}

export function getIconCategory(name: string): IconCategoryId {
  return categoryByName.get(name) ?? 'other'
}

export interface IconCategoryGroup {
  id: IconCategoryId
  labelZh: string
  labelEn: string
  icons: IconName[]
}

/** Group registry icons by category (stable category order). */
export function getIconCategoryGroups(
  names: readonly string[] = iconNames,
): IconCategoryGroup[] {
  const buckets = new Map<IconCategoryId, IconName[]>()
  for (const meta of iconCategoryMeta) {
    buckets.set(meta.id, [])
  }
  for (const name of names) {
    const id = getIconCategory(name)
    buckets.get(id)!.push(name as IconName)
  }
  return iconCategoryMeta
    .map((meta) => ({
      ...meta,
      icons: buckets.get(meta.id) ?? [],
    }))
    .filter((group) => group.icons.length > 0)
}
