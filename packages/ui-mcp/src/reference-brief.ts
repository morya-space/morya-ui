/**
 * Structured reference brief → snippet / shell / token mapping for page fidelity.
 * Agents describe what the reference shows; this module returns how to rebuild it with M*.
 */

export type BriefSurface =
  | 'ops-list'
  | 'ops-form'
  | 'ops-dashboard'
  | 'ops-detail'
  | 'ops-settings'
  | 'account'
  | 'flow-empty'
  | 'flow-result'
  | 'flow-wizard'
  | 'express'
  | 'overlay-dialog'
  | 'overlay-drawer'

export type BriefDensity = 'default' | 'compact' | 'spacious'

export interface ReferenceBriefInput {
  /** Free-text description of the reference (screenshot / mock / “like X”). */
  description?: string
  /** Product / page intent. */
  intent?: string
  surface?: BriefSurface | string
  density?: BriefDensity | string
  /** Named blocks visible in the reference (filters, table, kpi, brand-panel, …). */
  requiredBlocks?: string[]
  /** Component ids or export names that must appear (Table, MStatus, …). */
  requiredComponents?: string[]
  /** One primary CTA label if visible in the reference. */
  primaryAction?: string
  /** Optional free-text style direction (same as recommend_page.style). */
  style?: string
}

export interface BriefMappingItem {
  block: string
  snippetId: string
  notesZh: string
  notesEn: string
}

export interface ReferenceBriefResult {
  surface: BriefSurface
  density: BriefDensity
  styleSummary: string | null
  suggestedSnippets: string[]
  suggestedShellId: string | null
  mapping: BriefMappingItem[]
  tokenRoles: Array<{ role: string; token: string; notesZh: string; notesEn: string }>
  craftCuesZh: string[]
  craftCuesEn: string[]
  validationHints: {
    requiredBlocks: string[]
    requiredComponents: string[]
  }
}

const SURFACE_ALIASES: Record<string, BriefSurface> = {
  list: 'ops-list',
  'admin-list': 'ops-list',
  table: 'ops-list',
  form: 'ops-form',
  'form-page': 'ops-form',
  dashboard: 'ops-dashboard',
  detail: 'ops-detail',
  settings: 'ops-settings',
  login: 'account',
  auth: 'account',
  account: 'account',
  empty: 'flow-empty',
  'empty-state': 'flow-empty',
  result: 'flow-result',
  wizard: 'flow-wizard',
  landing: 'express',
  marketing: 'express',
  express: 'express',
  dialog: 'overlay-dialog',
  'form-in-dialog': 'overlay-dialog',
  drawer: 'overlay-drawer',
  'form-in-drawer': 'overlay-drawer',
}

const BLOCK_TO_SNIPPET: Record<string, { snippetId: string; notesZh: string; notesEn: string }> = {
  filters: {
    snippetId: 'list-filters-stack',
    notesZh: '筛选区用 MPageFilters；搜索约 14rem，枚举约 10–12rem',
    notesEn: 'Filters via MPageFilters; search ~14rem, selects ~10–12rem',
  },
  'filters-dense': {
    snippetId: 'list-filters-dense',
    notesZh: '高密列表用 list-filters-dense（plain + small）',
    notesEn: 'Dense lists use list-filters-dense (plain + small)',
  },
  chips: {
    snippetId: 'list-filter-chips',
    notesZh: '已选条件用 MPageFilterChips + closable MTag',
    notesEn: 'Active filters via MPageFilterChips + closable MTag',
  },
  header: {
    snippetId: 'page-header-actions',
    notesZh: '页头身份 + 视口内唯一 filled primary',
    notesEn: 'Page identity + one filled primary in the viewport',
  },
  toolbar: {
    snippetId: 'list-batch-toolbar',
    notesZh: '批量操作放 MPageToolbar，不要塞进页头',
    notesEn: 'Batch actions in MPageToolbar, not the page header',
  },
  table: {
    snippetId: 'list-table',
    notesZh: 'MTable + rows；状态列 MStatus；数字列 align end；空态 MEmpty',
    notesEn: 'MTable + rows; status → MStatus; numbers align end; empty → MEmpty',
  },
  'row-actions': {
    snippetId: 'list-row-actions',
    notesZh: '行操作用 small + text',
    notesEn: 'Row actions: size="small" + text',
  },
  status: {
    snippetId: 'list-status-dot',
    notesZh: '业务状态用 MStatus，不要默认 MTag',
    notesEn: 'Business status uses MStatus, not default MTag',
  },
  empty: {
    snippetId: 'empty-block',
    notesZh: '空态带下一步 CTA；主区域优先 illustration',
    notesEn: 'Empty state with next-step CTA; prefer illustration on main regions',
  },
  'form-header': {
    snippetId: 'form-header',
    notesZh: '窄宽表单页标题',
    notesEn: 'Narrow form page header',
  },
  'form-body': {
    snippetId: 'form-body',
    notesZh: 'MPageSection form + MForm；左标签时设 label-width',
    notesEn: 'MPageSection form + MForm; set label-width for left labels',
  },
  'form-actions': {
    snippetId: 'form-actions',
    notesZh: '保存 primary + loading；取消 secondary',
    notesEn: 'Save primary + loading; cancel secondary',
  },
  kpi: {
    snippetId: 'dashboard-kpi-grid',
    notesZh: 'MPageStat 带 trend / trendDirection / trendSeverity',
    notesEn: 'MPageStat with trend / trendDirection / trendSeverity',
  },
  chart: {
    snippetId: 'dashboard-chart-card',
    notesZh: '图表区 MCard + MSkeleton / 带 illustration 的 MEmpty',
    notesEn: 'Chart area: MCard + MSkeleton / illustrated MEmpty',
  },
  recent: {
    snippetId: 'dashboard-recent-table',
    notesZh: '卡片内小表 size="small"',
    notesEn: 'In-card table with size="small"',
  },
  detail: {
    snippetId: 'detail-toolbar',
    notesZh: '详情顶栏：状态 + 唯一编辑 primary',
    notesEn: 'Detail toolbar: status + one edit primary',
  },
  descriptions: {
    snippetId: 'detail-descriptions',
    notesZh: '属性网格用 MDescriptions，不要手写 dl',
    notesEn: 'Attribute grids use MDescriptions, not hand-rolled dl',
  },
  result: {
    snippetId: 'result-block',
    notesZh: '流程终点用 MResult',
    notesEn: 'Terminal outcomes use MResult',
  },
  wizard: {
    snippetId: 'wizard-steps',
    notesZh: '分步用 MStepper + steps',
    notesEn: 'Wizard uses MStepper + steps',
  },
  auth: {
    snippetId: 'auth-split-shell',
    notesZh: '登录分栏壳；filled + 可选 themeConfig；品牌面只用 --m-*',
    notesEn: 'Auth split shell; filled + optional themeConfig; brand panel uses --m-* only',
  },
  shell: {
    snippetId: 'layout-app-shell',
    notesZh: '后台骨架 MLayout + 菜单 icon',
    notesEn: 'Admin shell: MLayout + menu icons',
  },
  dialog: {
    snippetId: 'form-in-dialog',
    notesZh: '短 CRUD 弹窗表单',
    notesEn: 'Short CRUD dialog form',
  },
  drawer: {
    snippetId: 'form-in-drawer',
    notesZh: '侧栏编辑用 Drawer',
    notesEn: 'Side editing uses Drawer',
  },
  confirm: {
    snippetId: 'confirm-delete',
    notesZh: '删除确认',
    notesEn: 'Delete confirmation',
  },
}

const SURFACE_DEFAULT_BLOCKS: Record<BriefSurface, string[]> = {
  'ops-list': ['shell', 'header', 'filters', 'table', 'status', 'row-actions'],
  'ops-form': ['form-header', 'form-body', 'form-actions'],
  'ops-dashboard': ['header', 'kpi', 'chart', 'recent'],
  'ops-detail': ['detail', 'dialog'],
  'ops-settings': ['form-header', 'form-body', 'form-actions'],
  account: ['auth'],
  'flow-empty': ['empty'],
  'flow-result': ['result'],
  'flow-wizard': ['wizard', 'form-body', 'form-actions'],
  express: ['header'],
  'overlay-dialog': ['dialog'],
  'overlay-drawer': ['drawer'],
}

const SURFACE_SHELL: Record<BriefSurface, string | null> = {
  'ops-list': 'ops-quiet',
  'ops-form': 'ops-quiet',
  'ops-dashboard': 'ops-quiet',
  'ops-detail': 'ops-quiet',
  'ops-settings': 'ops-quiet',
  account: 'account-split',
  'flow-empty': 'flow-empty-frame',
  'flow-result': 'flow-result-hero',
  'flow-wizard': 'ops-quiet',
  express: 'express-hero',
  'overlay-dialog': null,
  'overlay-drawer': null,
}

const TOKEN_ROLES = [
  {
    role: 'page-bg',
    token: '--m-color-surface',
    notesZh: '页面底',
    notesEn: 'Page background',
  },
  {
    role: 'text',
    token: '--m-color-text',
    notesZh: '正文',
    notesEn: 'Body text',
  },
  {
    role: 'muted',
    token: '--m-color-text-muted',
    notesZh: '次要说明',
    notesEn: 'Secondary copy',
  },
  {
    role: 'border',
    token: '--m-color-border',
    notesZh: '分隔 / 边框',
    notesEn: 'Dividers / borders',
  },
  {
    role: 'brand',
    token: '--m-color-primary',
    notesZh: '主操作与品牌强调；品牌差异优先改主题，不在页面写死色',
    notesEn: 'Primary actions and brand accent; prefer theme overrides over page hex',
  },
  {
    role: 'danger',
    token: '--m-color-danger',
    notesZh: '破坏性操作',
    notesEn: 'Destructive actions',
  },
  {
    role: 'space',
    token: '--m-space-4 / --m-space-6',
    notesZh: '区块间距',
    notesEn: 'Section spacing',
  },
  {
    role: 'radius',
    token: '--m-radius-md',
    notesZh: '签名面圆角',
    notesEn: 'Signature surface radius',
  },
]

function normalizeSurface(raw: string | undefined, description: string, intent: string): BriefSurface {
  const key = (raw || '').trim().toLowerCase()
  if (key && SURFACE_ALIASES[key]) return SURFACE_ALIASES[key]
  if (key && (Object.keys(SURFACE_DEFAULT_BLOCKS) as BriefSurface[]).includes(key as BriefSurface)) {
    return key as BriefSurface
  }
  const blob = `${description} ${intent}`.toLowerCase()
  if (/登录|注册|auth|login|sign\s*in/.test(blob)) return 'account'
  if (/落地|营销|landing|pricing|官网|hero/.test(blob)) return 'express'
  if (/仪表盘|dashboard|kpi|监控|工作台/.test(blob)) return 'ops-dashboard'
  if (/向导|分步|wizard|stepper/.test(blob)) return 'flow-wizard'
  if (/空状态|无数据|empty/.test(blob)) return 'flow-empty'
  if (/结果|403|404|500|result/.test(blob)) return 'flow-result'
  if (/抽屉|drawer/.test(blob)) return 'overlay-drawer'
  if (/弹窗|dialog|modal/.test(blob)) return 'overlay-dialog'
  if (/详情|detail|概览/.test(blob)) return 'ops-detail'
  if (/设置|settings|偏好/.test(blob)) return 'ops-settings'
  if (/表单|新建|编辑|form|create|edit/.test(blob) && !/列表|list|table/.test(blob)) return 'ops-form'
  return 'ops-list'
}

function normalizeDensity(raw: string | undefined, blob: string): BriefDensity {
  const d = (raw || '').trim().toLowerCase()
  if (d === 'compact' || d === 'dense' || d === '高密' || d === '紧凑') return 'compact'
  if (d === 'spacious' || d === 'loose' || d === '宽松' || d === '留白') return 'spacious'
  if (/dense|compact|高密|紧凑|工具台/.test(blob)) return 'compact'
  if (/spacious|宽松|留白|宽松/.test(blob)) return 'spacious'
  return 'default'
}

function normalizeBlockId(block: string): string {
  const b = block.trim().toLowerCase()
  const aliases: Record<string, string> = {
    filter: 'filters',
    筛选: 'filters',
    高级筛选: 'filters',
    search: 'filters',
    已选: 'chips',
    'filter-chips': 'chips',
    页头: 'header',
    title: 'header',
    批量: 'toolbar',
    表格: 'table',
    列表: 'table',
    状态: 'status',
    行操作: 'row-actions',
    actions: 'row-actions',
    空态: 'empty',
    表单: 'form-body',
    保存: 'form-actions',
    指标: 'kpi',
    stats: 'kpi',
    图表: 'chart',
    最近: 'recent',
    登录: 'auth',
    brand: 'auth',
    品牌: 'auth',
    骨架: 'shell',
    layout: 'shell',
    确认: 'confirm',
    向导: 'wizard',
    结果: 'result',
  }
  return aliases[b] || b
}

function componentHintForBlock(block: string): string[] {
  switch (block) {
    case 'filters':
    case 'filters-dense':
      return ['PageFilters', 'Input', 'Select']
    case 'table':
      return ['Table', 'Empty']
    case 'status':
      return ['Status']
    case 'kpi':
      return ['PageStat', 'Grid']
    case 'chart':
      return ['Card', 'Skeleton', 'Empty']
    case 'auth':
      return ['Form', 'InputPassword', 'Button']
    case 'dialog':
      return ['Dialog', 'Form']
    case 'drawer':
      return ['Drawer', 'Form']
    case 'result':
      return ['Result']
    case 'empty':
      return ['Empty']
    case 'wizard':
      return ['Stepper', 'Form']
    default:
      return []
  }
}

/**
 * Map a reference brief to snippets, shell, and validation hints.
 */
export function mapReferenceBrief(input: ReferenceBriefInput): ReferenceBriefResult {
  const description = (input.description || '').trim()
  const intent = (input.intent || '').trim()
  const blob = `${description} ${intent} ${(input.style || '').trim()}`
  const surface = normalizeSurface(input.surface, description, intent)
  const density = normalizeDensity(input.density, blob)

  const requestedBlocks = (input.requiredBlocks || []).map(normalizeBlockId).filter(Boolean)
  let blocks = requestedBlocks.length > 0 ? [...requestedBlocks] : [...SURFACE_DEFAULT_BLOCKS[surface]]

  if (density === 'compact' && blocks.includes('filters')) {
    blocks = blocks.map((b) => (b === 'filters' ? 'filters-dense' : b))
  }

  const mapping: BriefMappingItem[] = []
  const suggestedSnippets: string[] = []
  for (const block of blocks) {
    const entry = BLOCK_TO_SNIPPET[block]
    if (!entry) continue
    mapping.push({
      block,
      snippetId: entry.snippetId,
      notesZh: entry.notesZh,
      notesEn: entry.notesEn,
    })
    if (!suggestedSnippets.includes(entry.snippetId)) {
      suggestedSnippets.push(entry.snippetId)
    }
  }

  const requiredComponents = new Set(
    (input.requiredComponents || []).map((c) => c.replace(/^M/, '')),
  )
  for (const block of blocks) {
    for (const c of componentHintForBlock(block)) requiredComponents.add(c)
  }

  const craftCuesZh = [
    '按 mapping 逐块 get_page_snippet，不要整页克隆黄金样例',
    '品牌色差异优先覆盖主题 --m-color-primary / 字体，页面 CSS 只用 token',
    density === 'compact'
      ? '密度 compact：筛选 plain+small，列表可对照 list-page-dense'
      : density === 'spacious'
        ? '密度 spacious：加大区块间距，避免塞满'
        : '密度 default：对齐 Ops polish（一主按钮、菜单 icon、MStatus）',
  ]
  if (input.primaryAction) {
    craftCuesZh.push(`主操作文案对齐参考：「${input.primaryAction}」`)
  }

  const craftCuesEn = [
    'Fill blocks via get_page_snippet from mapping — do not clone a whole golden page',
    'Brand differences belong in theme tokens (--m-color-primary / fonts), not page hex',
    density === 'compact'
      ? 'Density compact: plain+small filters; optional list-page-dense structure check'
      : density === 'spacious'
        ? 'Density spacious: more section gap; avoid packing'
        : 'Density default: Ops polish (one primary, menu icons, MStatus)',
  ]
  if (input.primaryAction) {
    craftCuesEn.push(`Primary CTA label from reference: “${input.primaryAction}”`)
  }

  return {
    surface,
    density,
    styleSummary: (input.style || description || null) && (input.style || description || '').trim()
      ? (input.style || description).trim()
      : null,
    suggestedSnippets,
    suggestedShellId: SURFACE_SHELL[surface],
    mapping,
    tokenRoles: TOKEN_ROLES,
    craftCuesZh,
    craftCuesEn,
    validationHints: {
      requiredBlocks: blocks,
      requiredComponents: [...requiredComponents],
    },
  }
}

/** Detect whether generated code covers a required block (heuristic). */
export function codeCoversBlock(code: string, block: string): boolean {
  const c = code
  switch (normalizeBlockId(block)) {
    case 'filters':
    case 'filters-dense':
      return /<MPageFilters\b/i.test(c)
    case 'chips':
      return /<MPageFilterChips\b/i.test(c)
    case 'header':
      return /<MPageHeader\b/i.test(c)
    case 'toolbar':
      return /<MPageToolbar\b/i.test(c)
    case 'table':
      return /<MTable\b/i.test(c)
    case 'status':
      return /<MStatus\b/i.test(c)
    case 'row-actions':
      return /#cell-actions|<MDropdown\b/i.test(c)
    case 'empty':
      return /<MEmpty\b/i.test(c)
    case 'form-header':
      return /<MPageHeader\b/i.test(c)
    case 'form-body':
      return /<MForm\b/i.test(c)
    case 'form-actions':
      return /html-type=["']submit["']|native-type=["']submit["']|type=["']submit["']|<MPageSection\b[^>]*variant=["']actions["']/i.test(c)
    case 'kpi':
      return /<MPageStat\b/i.test(c)
    case 'chart':
      return /<MCard\b/i.test(c) && (/<MSkeleton\b|<MEmpty\b/i.test(c) || /chart|图表/i.test(c))
    case 'recent':
      return /<MTable\b/i.test(c)
    case 'detail':
      return /<MPageHeader\b/i.test(c)
    case 'result':
      return /<MResult\b/i.test(c)
    case 'wizard':
      return /<MStepper\b/i.test(c)
    case 'auth':
      return /login-|auth-|<MInputPassword\b/i.test(c)
    case 'shell':
      return /<MLayout\b/i.test(c)
    case 'dialog':
      return /<MDialog\b/i.test(c)
    case 'drawer':
      return /<MDrawer\b/i.test(c)
    case 'confirm':
      return /<MConfirm(?:Dialog|Popup)\b/i.test(c)
    default:
      return true
  }
}

export function codeCoversComponent(code: string, component: string): boolean {
  const name = component.replace(/^M/, '').trim()
  if (!name) return true
  const re = new RegExp(`<M${name}\\b`, 'i')
  return re.test(code)
}
