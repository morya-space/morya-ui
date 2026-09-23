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
    'chevrons-up',
    'chevrons-down',
    'chevrons-left',
    'chevrons-right',
    'selector',
    'triangle-up',
    'triangle-down',
    'arrow-up',
    'arrow-down',
    'arrow-left',
    'arrow-right',
    'arrow-narrow-up',
    'arrow-narrow-down',
    'arrow-up-right',
    'arrow-back-up',
    'arrow-forward-up',
    'corner-up-left',
    'corner-up-right',
    'undo',
    'redo',
    'external-link',
    'logout',
    'login',
    'send',
    'share',
    'refresh',
    'rotate-clockwise',
    'rotate-2',
    'switch-horizontal',
    'sort',
    'sort-ascending',
    'sort-descending',
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
    'circle-dashed',
    'loader',
    'star',
    'heart',
    'sparkles',
    'rocket',
    'flag',
    'bookmark',
    'thumb-up',
    'thumb-down',
    'mood-smile',
    'bulb',
    'trophy',
    'flame',
    'crown',
  ],
  actions: [
    'plus',
    'minus',
    'circle-plus',
    'search',
    'edit',
    'pencil',
    'trash',
    'copy',
    'download',
    'upload',
    'filter',
    'filter-off',
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
    'clipboard-check',
    'clipboard-list',
    'paperclip',
    'history',
    'archive',
    'pin',
    'drag-drop',
    'wand',
    'bolt',
    'eraser',
    'tag',
    'tags',
    'list-check',
    'crop',
    'scan',
    'repeat',
    'power',
    'bold',
    'italic',
    'underline',
    'align-left',
    'align-center',
    'align-right',
  ],
  navigation: [
    'home',
    'layout-dashboard',
    'layout-grid',
    'layout-list',
    'layout-cards',
    'layout-columns',
    'layout-kanban',
    'layout-sidebar-left-collapse',
    'layout-sidebar-right-collapse',
    'grid',
    'list',
    'list-details',
    'table',
    'layers',
    'stack',
    'sitemap',
    'settings',
    'sliders',
    'adjustments-horizontal',
    'components',
    'puzzle',
    'apps',
    'palette',
  ],
  people: [
    'user',
    'users',
    'user-plus',
    'user-circle',
    'user-check',
    'user-x',
    'user-minus',
    'user-search',
    'user-cog',
    'users-group',
    'id',
  ],
  files: [
    'folder',
    'folder-open',
    'folder-plus',
    'folder-check',
    'folder-search',
    'folders',
    'file',
    'file-text',
    'file-plus',
    'file-check',
    'file-search',
    'file-download',
    'file-upload',
    'file-export',
    'file-import',
    'file-analytics',
    'file-invoice',
    'file-code',
    'file-zip',
    'file-type-pdf',
    'file-type-xls',
    'file-type-csv',
    'files',
    'book',
    'notebook',
    'report-search',
    'database',
    'box',
    'package',
  ],
  media: [
    'photo',
    'image',
    'photo-plus',
    'photo-search',
    'camera',
    'video',
    'video-off',
    'microphone',
    'microphone-off',
    'music',
    'volume',
    'volume-off',
    'eye',
    'eye-off',
  ],
  devices: [
    'device-desktop',
    'device-laptop',
    'device-tablet',
    'device-mobile',
    'keyboard',
    'mouse',
    'cpu',
    'battery-charging',
    'phone',
    'wifi',
    'wifi-off',
    'bluetooth',
    'server',
    'cloud',
    'terminal',
    'code',
  ],
  commerce: [
    'shopping-cart',
    'shopping-cart-plus',
    'shopping-bag',
    'credit-card',
    'wallet',
    'currency-dollar',
    'currency-yuan',
    'receipt',
    'calculator',
    'briefcase',
    'building',
    'building-bank',
    'building-store',
    'truck-delivery',
    'packages',
    'map-pin',
    'world',
  ],
  charts: [
    'chart-bar',
    'chart-line',
    'chart-pie',
    'chart-area',
    'chart-donut',
    'chart-histogram',
    'chart-candle',
    'activity',
    'trending-up',
    'trending-down',
  ],
  communication: [
    'mail',
    'mail-open',
    'inbox',
    'message',
    'message-2',
    'message-circle',
    'messages',
    'bell',
    'bell-off',
    'bell-ringing',
    'phone-call',
  ],
  security: [
    'lock',
    'unlock',
    'lock-off',
    'link',
    'shield',
    'shield-check',
    'shield-x',
    'shield-lock',
    'key',
    'fingerprint',
    'certificate',
  ],
  weather: [
    'sun',
    'moon',
    'moon-stars',
    'cloud-upload',
    'cloud-download',
    'calendar',
    'calendar-plus',
    'calendar-check',
    'calendar-time',
    'clock',
    'alarm',
    'hourglass',
  ],
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
