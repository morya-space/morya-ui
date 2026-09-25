export type PageSnippetPageType = 'list' | 'form' | 'dashboard' | 'detail' | 'common'

export interface PageSnippet {
  id: string
  title: string
  titleEn: string
  description: string
  descriptionEn: string
  pageTypes: PageSnippetPageType[]
  keywords: string[]
  imports: string[]
  scriptSetup?: string
  template: string
  rules: string[]
  rulesEn: string[]
  avoid: string[]
  avoidEn: string[]
}

export const pageSnippets: PageSnippet[] = [
  {
    id: 'list-filters',
    title: '列表页基础筛选栏',
    titleEn: 'Basic list filter bar',
    description:
      '关键词 + 1–2 个枚举 + 查询/重置。条件少、无需已选摘要时用本片段；有次要条件用 list-filters-collapsible；默认列表推荐 list-filters-stack。',
    descriptionEn:
      'Keyword + 1–2 enums + query/reset. Use for few filters without chips; secondary fields → list-filters-collapsible; default list → list-filters-stack.',
    pageTypes: ['list'],
    keywords: ['筛选', '搜索', '查询', 'filters', 'filter', 'search', 'keyword', 'reset', '基础筛选'],
    imports: ['MPageFilters', 'MSpace', 'MInput', 'MSelect', 'MButton'],
    scriptSetup: `const keyword = ref('')
const status = ref<string | undefined>()
const statusOptions = [
  { label: '全部', value: '' },
  { label: '启用', value: 'active' },
  { label: '停用', value: 'inactive' },
]

function resetFilters() {
  keyword.value = ''
  status.value = undefined
}`,
    template: `<MPageFilters aria-label="筛选" variant="filled">
  <MSpace wrap>
    <MInput v-model="keyword" placeholder="搜索名称" clearable style="width: 14rem" />
    <MSelect
      v-model="status"
      :options="statusOptions"
      placeholder="状态"
      clearable
      style="width: 10rem"
    />
  </MSpace>
  <template #actions>
    <MButton severity="secondary">查询</MButton>
    <MButton severity="secondary" text @click="resetFilters">重置</MButton>
  </template>
</MPageFilters>`,
    rules: [
      '放在 MPageHeader 之后、表格（或 FilterChips）之前',
      '查询/重置放 #actions（尾部簇）；viewport 内 primary 通常在 Header',
      'variant 默认 filled；dense craft 可用 plain + size="small"',
      '不要外包 MCard',
    ],
    rulesEn: [
      'Place after MPageHeader and before the table (or FilterChips)',
      'Query/reset in #actions (trailing cluster); viewport primary usually in Header',
      'Default variant filled; dense craft may use plain + size="small"',
      'Do not wrap with MCard',
    ],
    avoid: [
      '不要手写 .page-filters 类',
      '不要用 MCard 包筛选区',
      '条件 ≥3 且含次要字段时不要硬用本片段 → list-filters-collapsible / list-filters-stack',
    ],
    avoidEn: [
      'Do not hand-write .page-filters classes',
      'Do not wrap filters in MCard',
      'When ≥3 filters with secondary fields → list-filters-collapsible / list-filters-stack',
    ],
  },
  {
    id: 'list-filters-collapsible',
    title: '列表页折叠高级筛选',
    titleEn: 'Collapsible advanced list filters',
    description:
      '常用条件在 default，次要条件在 #advanced；对齐 list-page 黄金结构。通常再接 list-filter-chips，或直接用 list-filters-stack。',
    descriptionEn:
      'Primary filters in default, secondary in #advanced (list-page structure). Usually pair with list-filter-chips, or use list-filters-stack.',
    pageTypes: ['list'],
    keywords: ['折叠', '高级筛选', 'collapse', 'advanced', 'expand', 'filter', '次要条件'],
    imports: ['MPageFilters', 'MSpace', 'MInput', 'MSelect', 'MButton'],
    scriptSetup: `const filtersExpanded = ref(false)
const keyword = ref('')
const status = ref<string | undefined>()
const department = ref<string | null>(null)
const statusOptions = [
  { label: '全部', value: '' },
  { label: '启用', value: 'active' },
  { label: '停用', value: 'inactive' },
]
const departmentOptions = [
  { label: '研发', value: '研发' },
  { label: '运营', value: '运营' },
  { label: '市场', value: '市场' },
]

function resetFilters() {
  keyword.value = ''
  status.value = undefined
  department.value = null
}`,
    template: `<MPageFilters
  v-model:expanded="filtersExpanded"
  aria-label="筛选"
  variant="filled"
  collapsible
>
  <MSpace wrap>
    <MInput v-model="keyword" placeholder="搜索名称" clearable style="width: 14rem" />
    <MSelect
      v-model="status"
      :options="statusOptions"
      placeholder="状态"
      clearable
      style="width: 10rem"
    />
  </MSpace>
  <template #actions>
    <MButton severity="secondary">查询</MButton>
    <MButton severity="secondary" text @click="resetFilters">重置</MButton>
  </template>
  <template #advanced>
    <MSpace wrap>
      <MSelect
        v-model="department"
        :options="departmentOptions"
        placeholder="部门"
        clearable
        style="width: 10rem"
      />
    </MSpace>
  </template>
</MPageFilters>`,
    rules: [
      '常用条件放 default，次要条件放 #advanced',
      '查询/重置放 #actions；toggle 自带「高级筛选/收起」+ chevron',
      '必须 collapsible + v-model:expanded + #advanced',
      '重置应清掉 advanced 字段',
    ],
    rulesEn: [
      'Primary filters in default; secondary in #advanced',
      'Query/reset in #actions; toggle ships Advanced/Collapse + chevron',
      'Require collapsible + v-model:expanded + #advanced',
      'Reset clears advanced fields too',
    ],
    avoid: [
      '不要用 MCard 包整个筛选区',
      '不要只有 #advanced 却不设 collapsible',
      '不要把查询按钮放进 #advanced',
    ],
    avoidEn: [
      'Do not wrap the whole filter bar in MCard',
      'Do not provide #advanced without collapsible',
      'Do not put Query inside #advanced',
    ],
  },
  {
    id: 'list-filter-chips',
    title: '列表页已选筛选 Chips',
    titleEn: 'Active filter chips',
    description:
      'MPageFilterChips + closable MTag；放在 MPageFilters 与表格之间。需配合筛选 ref + activeFilters computed；完整栈见 list-filters-stack。',
    descriptionEn:
      'MPageFilterChips + closable MTag between filters and table. Needs filter refs + activeFilters computed; full stack → list-filters-stack.',
    pageTypes: ['list'],
    keywords: ['已选', 'chip', 'tag', 'active', 'clear', '筛选', 'FilterChips', '已选筛选'],
    imports: ['MPageFilterChips', 'MTag'],
    scriptSetup: `const keyword = ref('')
const status = ref<string | undefined>()
const department = ref<string | null>(null)
const statusOptions = [
  { label: '全部', value: '' },
  { label: '启用', value: 'active' },
  { label: '停用', value: 'inactive' },
]

const activeFilters = computed(() => {
  const items: Array<{ key: string; label: string }> = []
  if (keyword.value.trim()) {
    items.push({ key: 'keyword', label: \`关键词：\${keyword.value.trim()}\` })
  }
  if (status.value) {
    const label = statusOptions.find((o) => o.value === status.value)?.label ?? status.value
    items.push({ key: 'status', label: \`状态：\${label}\` })
  }
  if (department.value) {
    items.push({ key: 'department', label: \`部门：\${department.value}\` })
  }
  return items
})

function clearFilter(key: string) {
  if (key === 'keyword') keyword.value = ''
  if (key === 'status') status.value = undefined
  if (key === 'department') department.value = null
}`,
    template: `<MPageFilterChips v-if="activeFilters.length" label="已选" aria-label="已选筛选">
  <MTag
    v-for="item in activeFilters"
    :key="item.key"
    :value="item.label"
    size="small"
    bordered
    closable
    @close="clearFilter(item.key)"
  />
</MPageFilterChips>`,
    rules: [
      '放在 MPageFilters 之后、表格之前',
      '用 computed 从筛选状态生成 activeFilters；关闭 Tag 时写回对应 ref',
      '无已选条件时用 v-if 隐藏整块',
    ],
    rulesEn: [
      'Place after MPageFilters and before the table',
      'Derive activeFilters from filter state; closing a Tag writes back the ref',
      'Hide the whole block with v-if when empty',
    ],
    avoid: [
      '不要手写 pill 样式或 dashed 壳',
      '不要用 MTag 代替筛选控件本身',
      '不要把 Chips 塞进 MPageFilters 默认槽（可用 #active，但更常见是下方独立 Chips）',
    ],
    avoidEn: [
      'Do not hand-write pill or dashed shells',
      'Do not replace filter controls with MTag',
      'Do not put chips in the PageFilters default slot (optional #active; prefer sibling Chips)',
    ],
  },
  {
    id: 'list-filters-stack',
    title: '列表筛选完整栈（折叠 + 已选）',
    titleEn: 'Full list filter stack (collapsible + chips)',
    description:
      '默认推荐的列表筛选组合：MPageFilters collapsible + #advanced + MPageFilterChips。对齐 list-page / list-page-rail 黄金结构；dense 无高级条件时可改用 list-filters（plain/small）。',
    descriptionEn:
      'Default recommended list filter composition: collapsible MPageFilters + #advanced + MPageFilterChips. Mirrors list-page / list-page-rail; dense with few fields may use list-filters (plain/small).',
    pageTypes: ['list'],
    keywords: [
      '筛选组合',
      '筛选栈',
      '高级筛选',
      '已选筛选',
      'filter stack',
      'filters stack',
      'collapsible',
      'chips',
      'list-page',
      '完整筛选',
    ],
    imports: [
      'MPageFilters',
      'MPageFilterChips',
      'MSpace',
      'MInput',
      'MSelect',
      'MButton',
      'MTag',
    ],
    scriptSetup: `const filtersExpanded = ref(false)
const keyword = ref('')
const status = ref<string | undefined>()
const department = ref<string | null>(null)

const statusOptions = [
  { label: '全部', value: '' },
  { label: '启用', value: 'active' },
  { label: '停用', value: 'inactive' },
]
const departmentOptions = [
  { label: '研发', value: '研发' },
  { label: '运营', value: '运营' },
  { label: '市场', value: '市场' },
]

const activeFilters = computed(() => {
  const items: Array<{ key: string; label: string }> = []
  if (keyword.value.trim()) {
    items.push({ key: 'keyword', label: \`关键词：\${keyword.value.trim()}\` })
  }
  if (status.value) {
    const label = statusOptions.find((o) => o.value === status.value)?.label ?? status.value
    items.push({ key: 'status', label: \`状态：\${label}\` })
  }
  if (department.value) {
    items.push({ key: 'department', label: \`部门：\${department.value}\` })
  }
  return items
})

function clearFilter(key: string) {
  if (key === 'keyword') keyword.value = ''
  if (key === 'status') status.value = undefined
  if (key === 'department') department.value = null
}

function resetFilters() {
  keyword.value = ''
  status.value = undefined
  department.value = null
}`,
    template: `<MPageFilters
  v-model:expanded="filtersExpanded"
  aria-label="筛选"
  variant="filled"
  collapsible
>
  <MSpace wrap>
    <MInput v-model="keyword" placeholder="搜索名称" clearable style="width: 14rem" />
    <MSelect
      v-model="status"
      :options="statusOptions"
      placeholder="状态"
      clearable
      style="width: 10rem"
    />
  </MSpace>
  <template #actions>
    <MButton severity="secondary">查询</MButton>
    <MButton severity="secondary" text @click="resetFilters">重置</MButton>
  </template>
  <template #advanced>
    <MSpace wrap>
      <MSelect
        v-model="department"
        :options="departmentOptions"
        placeholder="部门"
        clearable
        style="width: 10rem"
      />
    </MSpace>
  </template>
</MPageFilters>

<MPageFilterChips v-if="activeFilters.length" label="已选" aria-label="已选筛选">
  <MTag
    v-for="item in activeFilters"
    :key="item.key"
    :value="item.label"
    size="small"
    bordered
    closable
    @close="clearFilter(item.key)"
  />
</MPageFilterChips>`,
    rules: [
      '顺序：Header → Filters → FilterChips →（可选 Toolbar）→ Table',
      '查询/重置放 #actions；toggle 为「高级筛选/收起」+ chevron',
      '重置与 Chip @close 必须写回同一套筛选 ref',
      'dense/compact 且无高级条件：可降级为 list-filters-dense',
    ],
    rulesEn: [
      'Order: Header → Filters → FilterChips → (optional Toolbar) → Table',
      'Query/reset in #actions; toggle is Advanced/Collapse + chevron',
      'Reset and Chip @close must write the same filter refs',
      'Dense/compact without advanced fields: fall back to list-filters-dense',
    ],
    avoid: [
      '不要拆成互不共享状态的 Filters 与 Chips',
      '不要用 MCard 包筛选栈',
      '不要用手写 div 模拟已选条',
    ],
    avoidEn: [
      'Do not split Filters and Chips with disconnected state',
      'Do not wrap the filter stack in MCard',
      'Do not hand-roll an active-filter bar',
    ],
  },
  {
    id: 'list-filters-dense',
    title: '列表页紧凑筛选栏',
    titleEn: 'Dense list filter bar',
    description:
      'list-page-dense craft：variant="plain" + size="small"，字段少、无折叠/Chips。监控/告警等高密度列表用。',
    descriptionEn:
      'list-page-dense craft: variant="plain" + size="small", few fields, no collapse/chips. For dense monitoring/alert lists.',
    pageTypes: ['list'],
    keywords: ['dense', 'compact', '紧凑', 'plain', '监控', '告警', '小尺寸筛选'],
    imports: ['MPageFilters', 'MSpace', 'MInput', 'MSelect', 'MButton'],
    scriptSetup: `const keyword = ref('')
const status = ref<string | undefined>()
const statusOptions = [
  { label: '全部', value: '' },
  { label: '启用', value: 'active' },
  { label: '停用', value: 'inactive' },
]

function resetFilters() {
  keyword.value = ''
  status.value = undefined
}`,
    template: `<MPageFilters aria-label="筛选" variant="plain">
  <MSpace wrap>
    <MInput
      v-model="keyword"
      placeholder="搜索"
      clearable
      size="small"
      style="width: 11rem"
    />
    <MSelect
      v-model="status"
      :options="statusOptions"
      placeholder="状态"
      clearable
      size="small"
      style="width: 8rem"
    />
  </MSpace>
  <template #actions>
    <MButton severity="secondary" size="small">查询</MButton>
    <MButton severity="secondary" size="small" text @click="resetFilters">重置</MButton>
  </template>
</MPageFilters>`,
    rules: [
      '仅在 dense/compact craft 使用；默认列表用 list-filters-stack',
      '控件统一 size="small"；Filters 用 variant="plain"',
      '查询/重置放 #actions，仍为 secondary',
    ],
    rulesEn: [
      'Only for dense/compact craft; default lists use list-filters-stack',
      'Controls size="small"; Filters variant="plain"',
      'Query/reset in #actions; stay secondary',
    ],
    avoid: [
      '不要在普通 soft 列表默认套 dense 筛选',
      '不要在 dense 栏再叠一排大号 filled Filters',
    ],
    avoidEn: [
      'Do not default soft lists to dense filters',
      'Do not stack a large filled Filters bar on dense craft',
    ],
  },
  {
    id: 'list-toolbar',
    title: '列表页页头',
    titleEn: 'List page header',
    description: '页面身份 + 唯一 primary（新建），放在 MPageContent 顶部。',
    descriptionEn: 'Page identity and the single primary action at the top of MPageContent.',
    pageTypes: ['list'],
    keywords: ['页头', '标题', '新建', 'header', 'title', 'create', 'actions'],
    imports: ['MPageHeader', 'MButton'],
    template: `<MPageHeader title="用户管理" description="维护账号、角色与权限。">
  <template #actions>
    <MButton severity="primary">新建用户</MButton>
  </template>
</MPageHeader>`,
    rules: ['页级标题用 MPageHeader，不要用 MPageToolbar 当第二页头', '主操作放 #actions'],
    rulesEn: ['Use MPageHeader for page identity; do not use MPageToolbar as a second page title', 'Put primary actions in #actions'],
    avoid: ['不要在 Toolbar 上写页面 H1 标题'],
    avoidEn: ['Do not put the page H1 on MPageToolbar'],
  },
  {
    id: 'list-batch-toolbar',
    title: '列表页批量操作条',
    titleEn: 'List batch action row',
    description: '表格多选时的批量操作，放在筛选区（及 FilterChips）之后（可选）。',
    descriptionEn: 'Optional batch actions after filters (and FilterChips) when rows are selectable.',
    pageTypes: ['list'],
    keywords: ['批量', '已选', 'toolbar', 'batch', 'export', 'delete'],
    imports: ['MPageToolbar', 'MButton'],
    template: `<MPageToolbar>
  <span style="color:var(--m-color-text-muted);font-size:var(--m-font-size-sm)">已选 0 项</span>
  <template #actions>
    <MButton severity="secondary" text>导出</MButton>
    <MButton severity="danger" text>删除</MButton>
  </template>
</MPageToolbar>`,
    rules: ['左侧用 default 插槽展示已选数量', '批量操作用 text/outlined，danger 仅 destructive', '放在 FilterChips 之后、表格之前'],
    rulesEn: ['Use the default slot for selection count', 'Batch actions use text/outlined; danger only for destructive ops', 'Place after FilterChips and before the table'],
    avoid: ['不要用 Toolbar title 充当页面标题'],
    avoidEn: ['Do not use Toolbar title as the page heading'],
  },
  {
    id: 'list-table',
    title: '列表页表格',
    titleEn: 'List page table',
    description:
      '标准 MTable，直接放在 MPageContent 内。全视口主列表可再加 fill（表体滚、分页贴底）；嵌入/短页不要 fill。',
    descriptionEn:
      'Standard MTable in MPageContent. Add fill only for full-viewport main lists; skip fill for embedded/short pages.',
    pageTypes: ['list'],
    keywords: [
      '表格',
      'table',
      'pagination',
      'paginator',
      'empty',
      'columns',
      'rows',
      'fill',
      '撑满',
      '分页',
    ],
    imports: ['MTable', 'MEmpty', 'MButton'],
    scriptSetup: `const columns = [
  { key: 'name', label: '名称' },
  { key: 'status', label: '状态' },
  { key: 'updatedAt', label: '更新时间' },
  { key: 'actions', label: '操作', width: 128 },
]
const rows = ref<Record<string, unknown>[]>([])
const loading = ref(false)`,
    template: `<!-- 全视口主列表再加 fill；嵌入/短页去掉 fill -->
<MTable
  :columns="columns"
  :rows="rows"
  :loading="loading"
  fill
  paginator
  :rows-per-page="10"
  striped
  bordered
  row-key="id"
  aria-label="数据列表"
>
  <template #empty>
    <MEmpty
      title="还没有数据"
      description="创建第一条记录后，这里会列出结果。"
      icon="inbox"
    >
      <template #extra>
        <MButton severity="primary">新建</MButton>
      </template>
    </MEmpty>
  </template>
</MTable>`,
    rules: [
      '先判断是否适合 fill：全视口后台主列表 + 表格是主任务 → MPageContent fill + MTable fill',
      '嵌入表、短页、整页文档滚动 → 不要 fill，内容高度即可',
      '表格直接放在 MPageContent 内；空态用 MEmpty',
    ],
    rulesEn: [
      'Decide fill first: full-viewport admin main list → MPageContent fill + MTable fill',
      'Embedded / short / document-scroll pages → skip fill',
      'Place the table directly in MPageContent; use MEmpty for zero-data states',
    ],
    avoid: [
      '不要用 MCard 包裹 bordered MTable',
      '不要对嵌入/短页硬套 fill',
      '适合 fill 时不要手写 min-height / calc',
    ],
    avoidEn: [
      'Do not wrap a bordered MTable with MCard',
      'Do not force fill on embedded or short pages',
      'Do not hand-write min-height / calc when fill is appropriate',
    ],
  },
  {
    id: 'list-row-actions',
    title: '表格行操作列',
    titleEn: 'Table row actions cell',
    description: '在 #cell-actions 插槽中放置编辑/删除等按钮组。',
    descriptionEn: 'Edit/delete buttons inside the #cell-actions slot.',
    pageTypes: ['list'],
    keywords: ['行操作', '编辑', '删除', 'actions', 'row', 'cell'],
    imports: ['MSpace', 'MButton'],
    template: `<template #cell-actions>
  <MSpace>
    <MButton severity="secondary" size="small" text>编辑</MButton>
    <MButton severity="danger" size="small" text>删除</MButton>
  </MSpace>
</template>`,
    rules: ['行内操作用 size="small" + text/outlined，避免一排实心按钮', '危险操作使用 severity="danger" 并配合确认弹窗'],
    rulesEn: ['Use size="small" with text/outlined row actions', 'Use severity="danger" with confirmation for destructive actions'],
    avoid: ['不要用 Dropdown 代替明确的行内按钮组，除非操作很多'],
    avoidEn: ['Do not replace explicit row buttons with Dropdown unless there are many actions'],
  },
  {
    id: 'list-status-tag',
    title: '表格分类标签列 Tag',
    titleEn: 'Table category tag cell',
    description: '仅用于分类 / 可关闭标签。业务状态（启用/停用/在线）请用 list-status-dot / MStatus。',
    descriptionEn: 'Category or closable chips only. Prefer list-status-dot / MStatus for business status.',
    pageTypes: ['list'],
    keywords: ['分类', '标签', '可关闭', 'chip', 'category', 'tag-only'],
    imports: ['MTag'],
    template: `<template #cell-category="{ value }">
  <MTag
    :value="String(value ?? '')"
    severity="info"
  />
</template>`,
    rules: ['分类/强调态用 MTag；行内业务状态用 MStatus（list-status-dot）', '不要用 Button 颜色表达状态'],
    rulesEn: ['Use MTag for categories; use MStatus for business status (list-status-dot)', 'Do not use Button colors for status'],
    avoid: ['不要在 #cell-status 里默认用 MTag 表示启用/停用'],
    avoidEn: ['Do not default #cell-status to MTag for active/inactive'],
  },
  {
    id: 'list-status-dot',
    title: '表格状态列 Status',
    titleEn: 'Table status dot cell',
    description: '在 #cell-status 中用 MStatus 展示轻量业务状态（默认首选）。',
    descriptionEn: 'Render lightweight business status with MStatus in #cell-status (default preference).',
    pageTypes: ['list'],
    keywords: ['状态', 'status', 'dot', 'cell-status', '在线', '启用', '停用', '业务状态'],
    imports: ['MStatus'],
    template: `<template #cell-status="{ value }">
  <MStatus
    :label="value === 'active' || value === 'online' ? '启用' : '停用'"
    :severity="value === 'active' || value === 'online' ? 'success' : 'secondary'"
  />
</template>`,
    rules: ['行内轻量业务状态优先 MStatus', '不要用 Button 颜色表达状态'],
    rulesEn: ['Prefer MStatus for lightweight inline business status', 'Do not use Button colors for status'],
    avoid: ['不要用裸文本颜色区分状态', '不要默认改用 MTag 表达启用/停用'],
    avoidEn: ['Do not rely on raw text color for status', 'Do not default to MTag for active/inactive'],
  },
  {
    id: 'empty-block',
    title: '空状态 MEmpty',
    titleEn: 'Empty state with MEmpty',
    description: '列表或内容区无数据时使用 MEmpty，操作放在 #extra。',
    descriptionEn: 'Use MEmpty for no-data regions; put actions in #extra.',
    pageTypes: ['list', 'common'],
    keywords: ['空状态', '无数据', 'empty', 'zero state', 'no data'],
    imports: ['MEmpty', 'MButton'],
    template: `<MEmpty
  title="还没有数据"
  description="创建第一条记录后即可在此查看。"
  icon="database"
>
  <template #extra>
    <MButton label="新建" />
    <MButton label="导入" severity="secondary" text />
  </template>
</MEmpty>`,
    rules: ['正常无数据用 MEmpty，不要用错误色', '主 CTA 用 primary，次动作用 text/secondary'],
    rulesEn: ['Use MEmpty for normal emptiness, not error colors', 'Primary CTA + secondary/text for lesser actions'],
    avoid: ['不要用手写 div 拼空态', '不要用 MResult 表达无数据'],
    avoidEn: ['Do not hand-roll empty markup', 'Do not use MResult for no-data'],
  },
  {
    id: 'result-block',
    title: '结果页 MResult',
    titleEn: 'Result page with MResult',
    description: '提交成功、失败或 403/404/500 使用 MResult。',
    descriptionEn: 'Use MResult for submit outcomes and 403/404/500 pages.',
    pageTypes: ['common'],
    keywords: ['结果', '成功', '失败', '404', '403', 'result', 'success', 'error'],
    imports: ['MResult', 'MButton'],
    template: `<MResult status="success" description="订单已创建，可在列表中查看详情。">
  <template #extra>
    <MButton label="查看订单" />
    <MButton label="返回列表" severity="secondary" text />
  </template>
</MResult>`,
    rules: ['流程终点用 MResult', '提供明确下一步操作'],
    rulesEn: ['Use MResult for terminal outcomes', 'Provide clear next-step actions'],
    avoid: ['不要用 MEmpty 表达 403/404/失败', '不要只靠颜色表达结果'],
    avoidEn: ['Do not use MEmpty for 403/404/failure', 'Do not rely on color alone'],
  },
  {
    id: 'form-header',
    title: '表单页标题区',
    titleEn: 'Form page header',
    description: '表单页顶部标题与说明，放在 MPageContent width="narrow" 内。',
    descriptionEn: 'Form page title and description inside narrow MPageContent.',
    pageTypes: ['form'],
    keywords: ['标题', '说明', 'intro', 'header', 'description'],
    imports: ['MPageHeader'],
    template: `<MPageHeader title="新建用户" description="填写基本信息并分配角色。" />`,
    rules: ['放在 MPageSection 之前', '说明文案用 description prop'],
    rulesEn: ['Place before MPageSection', 'Use the description prop for helper copy'],
    avoid: ['不要裸 h1 + p 手写 margin'],
    avoidEn: ['Do not hand-write h1 + p margins'],
  },
  {
    id: 'form-body',
    title: '表单主体',
    titleEn: 'Form body surface',
    description: 'MPageSection variant="form" 包裹 MForm 字段。',
    descriptionEn: 'Wrap MForm fields with MPageSection variant="form".',
    pageTypes: ['form'],
    keywords: ['表单', 'form', 'fields', 'formitem'],
    imports: ['MPageSection', 'MForm', 'MFormItem', 'MInput'],
    scriptSetup: `const model = reactive({ name: '' })
const submitting = ref(false)`,
    template: `<MPageSection variant="form">
  <MForm @submit.prevent="onSubmit">
    <MFormItem label="姓名" name="name" required>
      <MInput v-model="model.name" placeholder="请输入姓名" fluid />
    </MFormItem>
    <!-- 更多字段 -->
  </MForm>
</MPageSection>`,
    rules: ['字段用 MFormItem + fluid 控件', '表单表面由 MPageSection 提供，不要重复 MCard'],
    rulesEn: ['Use MFormItem with fluid controls', 'Let MPageSection provide the surface; do not duplicate MCard'],
    avoid: ['不要绕过 MForm 手写校验状态'],
    avoidEn: ['Do not bypass MForm for validation state'],
  },
  {
    id: 'form-actions',
    title: '表单底栏操作',
    titleEn: 'Form footer actions',
    description: '保存/取消按钮区，放在 MForm 内底部。',
    descriptionEn: 'Save/cancel actions at the bottom of MForm.',
    pageTypes: ['form'],
    keywords: ['保存', '取消', 'submit', 'actions', 'footer'],
    imports: ['MPageSection', 'MSpace', 'MButton'],
    template: `<MPageSection variant="actions">
  <MSpace>
    <MButton native-type="submit" severity="primary" :loading="submitting">保存</MButton>
    <MButton severity="secondary">取消</MButton>
  </MSpace>
</MPageSection>`,
    rules: ['提交按钮在前，取消 secondary', '保存中传 loading 防重复提交'],
    rulesEn: ['Submit first, cancel secondary', 'Pass loading while saving to prevent duplicate submits'],
    avoid: ['不要手写 border-top + margin-top'],
    avoidEn: ['Do not hand-write border-top and margin-top'],
  },
  {
    id: 'dashboard-kpi-grid',
    title: '仪表盘 KPI 栅格',
    titleEn: 'Dashboard KPI grid',
    description: 'MGrid + MPageStat 展示关键指标。',
    descriptionEn: 'Key metrics with MGrid and MPageStat.',
    pageTypes: ['dashboard'],
    keywords: ['kpi', '指标', 'stat', 'grid', 'metrics'],
    imports: ['MGrid', 'MGridItem', 'MPageStat'],
    scriptSetup: `const metrics = ref([
  { label: '总用户', value: '12,480', trend: '+8.2%', trendDirection: 'up' as const, trendLabel: '较上月', icon: 'users' },
  { label: '今日活跃', value: '1,926', trend: '+3.1%', trendDirection: 'up' as const, trendLabel: '较昨日', icon: 'activity' },
])`,
    template: `<MGrid :cols="4" :x-gap="16" :y-gap="16" responsive="screen">
  <MGridItem v-for="metric in metrics" :key="metric.label" :span="1">
    <MPageStat
      :label="metric.label"
      :value="metric.value"
      :trend="metric.trend"
      :trend-direction="metric.trendDirection"
      :trend-label="metric.trendLabel"
      :icon="metric.icon"
    />
  </MGridItem>
</MGrid>`,
    rules: ['KPI 用 MPageStat，不要每页自定义 stat CSS', 'responsive="screen" 便于窄屏降列'],
    rulesEn: ['Use MPageStat for KPIs', 'Use responsive="screen" for narrow layouts'],
    avoid: ['不要每个指标手写 font-size/颜色'],
    avoidEn: ['Do not hand-write font sizes/colors per metric'],
  },
  {
    id: 'dashboard-chart-card',
    title: '仪表盘图表卡片',
    titleEn: 'Dashboard chart card',
    description: 'MCard shadow="always" + MEmpty 作为图表占位。',
    descriptionEn: 'MCard with shadow="always" and MEmpty for chart pending state.',
    pageTypes: ['dashboard'],
    keywords: ['chart', '图表', 'placeholder', 'card', 'trend'],
    imports: ['MCard', 'MEmpty', 'MSkeleton'],
    template: `<MCard title="趋势概览" shadow="always">
  <MSkeleton v-if="loading" height="8rem" />
  <MEmpty
    v-else
    aria-label="图表占位"
    title="暂无图表数据"
    description="图表区域（接入 ECharts / 业务组件）"
  />
</MCard>`,
    rules: ['图表区适合 MCard，因为需要 card 标题', '加载中用 MSkeleton'],
    rulesEn: ['Charts belong in MCard when a card title is needed', 'Use MSkeleton while loading'],
    avoid: ['不要用 MPageFilters 风格包裹图表'],
    avoidEn: ['Do not wrap charts with MPageFilters styling'],
  },
  {
    id: 'dashboard-recent-table',
    title: '仪表盘最近列表',
    titleEn: 'Dashboard recent list card',
    description: 'MCard 内嵌小尺寸 MTable 展示最近记录。',
    descriptionEn: 'Recent records in a small MTable inside MCard.',
    pageTypes: ['dashboard'],
    keywords: ['recent', '最近', 'table', 'card', 'list'],
    imports: ['MCard', 'MTable', 'MStatus'],
    scriptSetup: `const recentColumns = [
  { key: 'id', label: '工单号', width: 96 },
  { key: 'title', label: '标题' },
  { key: 'status', label: '状态', width: 110 },
]
const recentRows = ref<Record<string, unknown>[]>([])`,
    template: `<MCard title="最近工单">
  <MTable :columns="recentColumns" :rows="recentRows" size="small" :paginator="false" bordered row-key="id">
    <template #cell-status="{ value }">
      <MStatus :label="String(value ?? '')" severity="secondary" />
    </template>
  </MTable>
</MCard>`,
    rules: ['明细列表放 MCard 内合理', 'size="small" 适合卡片内表格', '行内业务状态用 MStatus'],
    rulesEn: ['Detail lists inside MCard are appropriate', 'Use size="small" for in-card tables', 'Use MStatus for row business status'],
    avoid: ['卡片内表格不要再外包一层 MPageContent'],
    avoidEn: ['Do not wrap in-card tables with another MPageContent'],
  },
  {
    id: 'page-content-list',
    title: '列表页内容容器',
    titleEn: 'List page content stack',
    description: 'MLayoutContent 内的标准垂直堆叠容器。',
    descriptionEn: 'Standard vertical stack container inside MLayoutContent.',
    pageTypes: ['list', 'common'],
    keywords: ['page content', 'stack', 'layout content', '容器'],
    imports: ['MPageContent'],
    template: `<MLayoutContent>
  <MPageContent>
    <!-- MPageFilters → MPageToolbar → MTable -->
  </MPageContent>
</MLayoutContent>`,
    rules: ['所有列表区块放在 MPageContent 内', '区块顺序：筛选 → 工具栏 → 表格'],
    rulesEn: ['Keep all list sections inside MPageContent', 'Order: filters → toolbar → table'],
    avoid: ['不要在 MLayoutContent 上手写 padding/gap'],
    avoidEn: ['Do not hand-write padding/gap on MLayoutContent'],
  },
  {
    id: 'page-content-form',
    title: '表单页内容容器',
    titleEn: 'Form page content stack',
    description: '窄宽表单页容器。',
    descriptionEn: 'Narrow form page container.',
    pageTypes: ['form', 'common'],
    keywords: ['narrow', 'form content', 'max-width'],
    imports: ['MPageContent'],
    template: `<MLayoutContent>
  <MPageContent width="narrow">
    <!-- MPageHeader → MPageSection form → actions -->
  </MPageContent>
</MLayoutContent>`,
    rules: ['表单页使用 width="narrow"', '不要手写 max-width CSS'],
    rulesEn: ['Use width="narrow" on form pages', 'Do not hand-write max-width CSS'],
    avoid: ['不要让表单字段铺满超宽视口'],
    avoidEn: ['Do not let form fields stretch across an ultra-wide viewport'],
  },
  {
    id: 'detail-toolbar',
    title: '详情页顶栏',
    titleEn: 'Detail page header actions',
    description: '详情页标题、状态与编辑操作。',
    descriptionEn: 'Detail page title, status, and edit actions.',
    pageTypes: ['detail'],
    keywords: ['detail', '详情', 'edit', 'header'],
    imports: ['MPageHeader', 'MButton', 'MStatus', 'MSpace'],
    template: `<MPageHeader title="示例资源" description="查看摘要与属性。">
  <template #actions>
    <MSpace>
      <MStatus label="正常" severity="success" />
      <MButton severity="primary">编辑</MButton>
      <MButton severity="danger" text>删除</MButton>
    </MSpace>
  </template>
</MPageHeader>`,
    rules: ['状态用 MStatus 放在 actions 区', '编辑为 primary，删除用 danger text'],
    rulesEn: ['Use MStatus in the actions area', 'Edit is primary; delete uses danger text'],
    avoid: ['不要把操作散落到多个无关区域'],
    avoidEn: ['Do not scatter actions across unrelated areas'],
  },
  {
    id: 'page-header-actions',
    title: '页头单主操作',
    titleEn: 'Page header with one primary action',
    description: 'MPageHeader + #actions：视口内仅一个 filled primary，次要用 secondary/text。',
    descriptionEn: 'MPageHeader + #actions: one filled primary in the viewport; secondary/text for lesser actions.',
    pageTypes: ['list', 'form', 'dashboard', 'detail', 'common'],
    keywords: ['页头', '主按钮', '新建', 'header', 'primary', 'actions', 'page-header'],
    imports: ['MPageHeader', 'MButton', 'MSpace'],
    template: `<MPageHeader title="用户管理" description="管理成员与角色。">
  <template #actions>
    <MSpace>
      <MButton severity="secondary" text>导入</MButton>
      <MButton severity="primary">新建用户</MButton>
    </MSpace>
  </template>
</MPageHeader>`,
    rules: ['视口内仅一个 filled primary', '次要动作用 secondary 或 text', '批量操作用 MPageToolbar，不要塞进页头'],
    rulesEn: ['Only one filled primary in the viewport', 'Lesser actions: secondary or text', 'Batch actions belong in MPageToolbar, not the header'],
    avoid: ['不要在页头和筛选区各放一个实心 primary', '不要把危险删除做成页头唯一实心按钮'],
    avoidEn: ['Do not place a solid primary in both header and filters', 'Do not make destructive delete the only solid header button'],
  },
  {
    id: 'form-in-dialog',
    title: '列表内弹窗短表单',
    titleEn: 'Short form in dialog from a list',
    description: '同页 MDialog + MForm + #footer；短 CRUD 默认路径（约 ≤8 字段）。',
    descriptionEn: 'Same-page MDialog + MForm + #footer; default short CRUD path (~≤8 fields).',
    pageTypes: ['list', 'common'],
    keywords: [
      '弹窗表单',
      '新建弹窗',
      '编辑弹窗',
      'dialog form',
      'form-in-dialog',
      'modal form',
      'inline create',
    ],
    imports: ['MDialog', 'MForm', 'MFormItem', 'MInput', 'MSelect', 'MButton', 'MSpace', 'message'],
    scriptSetup: `const dialogOpen = ref(false)
const submitting = ref(false)
const model = reactive({
  name: '',
  email: '',
  role: undefined as string | undefined,
})
const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '成员', value: 'member' },
]

function resetModel() {
  model.name = ''
  model.email = ''
  model.role = undefined
}

async function onSave() {
  submitting.value = true
  try {
    // await api.save(model)
    message.success('已保存')
    dialogOpen.value = false
    resetModel()
  } finally {
    submitting.value = false
  }
}`,
    template: `<MDialog
  v-model="dialogOpen"
  header="新建用户"
  width="32rem"
  @close="resetModel"
>
  <MForm @submit.prevent="onSave">
    <MFormItem label="姓名" name="name" required>
      <MInput v-model="model.name" placeholder="请输入姓名" fluid />
    </MFormItem>
    <MFormItem label="邮箱" name="email" required>
      <MInput v-model="model.email" type="email" placeholder="name@example.com" fluid />
    </MFormItem>
    <MFormItem label="角色" name="role" required>
      <MSelect v-model="model.role" :options="roleOptions" placeholder="请选择角色" fluid />
    </MFormItem>
  </MForm>
  <template #footer>
    <MSpace style="justify-content: flex-end; width: 100%">
      <MButton severity="secondary" text :disabled="submitting" @click="dialogOpen = false">
        取消
      </MButton>
      <MButton severity="primary" :loading="submitting" @click="onSave">
        保存
      </MButton>
    </MSpace>
  </template>
</MDialog>`,
    rules: [
      '留在列表页，不另开路由',
      '宽度约 28–36rem；字段用 fluid',
      '取消/保存放 #footer；成功用 message.success',
    ],
    rulesEn: [
      'Stay on the list page; do not open a new route',
      'Width ~28–36rem; fields use fluid',
      'Cancel/save in #footer; success via message.success',
    ],
    avoid: [
      '不要用 visible 代替 v-model',
      '不要把长多分组表单塞进 Dialog → form-page / form-in-drawer',
      '不要用 toast 代替单行 message',
    ],
    avoidEn: [
      'Do not use visible instead of v-model',
      'Do not stuff long multi-section forms into Dialog → form-page / form-in-drawer',
      'Do not use toast for a one-line message',
    ],
  },
  {
    id: 'form-in-drawer',
    title: '列表内侧滑表单',
    titleEn: 'Form in drawer from a list',
    description: '同页 MDrawer + MForm + #footer；比 Dialog 更长但仍需对照列表。',
    descriptionEn: 'Same-page MDrawer + MForm + #footer; longer than a dialog but list context still matters.',
    pageTypes: ['list', 'detail', 'common'],
    keywords: ['抽屉表单', '侧滑编辑', 'drawer form', 'form-in-drawer', 'side panel edit'],
    imports: ['MDrawer', 'MForm', 'MFormItem', 'MInput', 'MButton', 'MSpace', 'message'],
    scriptSetup: `const drawerOpen = ref(false)
const submitting = ref(false)
const model = reactive({ name: '', note: '' })

async function onSave() {
  submitting.value = true
  try {
    message.success('已保存')
    drawerOpen.value = false
  } finally {
    submitting.value = false
  }
}`,
    template: `<MDrawer
  v-model="drawerOpen"
  header="编辑详情"
  position="right"
  size="28rem"
  @close="/* reset draft */"
>
  <MForm @submit.prevent="onSave">
    <MFormItem label="名称" name="name" required>
      <MInput v-model="model.name" fluid />
    </MFormItem>
    <MFormItem label="备注" name="note">
      <MInput v-model="model.note" fluid />
    </MFormItem>
  </MForm>
  <template #footer>
    <MSpace style="justify-content: flex-end; width: 100%">
      <MButton severity="secondary" text :disabled="submitting" @click="drawerOpen = false">
        取消
      </MButton>
      <MButton severity="primary" :loading="submitting" @click="onSave">
        保存
      </MButton>
    </MSpace>
  </template>
</MDrawer>`,
    rules: ['position 常用 right；较长表单可加大 size', '字段 fluid；底栏放 #footer', '成功用 message.success'],
    rulesEn: ['position usually right; raise size for longer forms', 'Fields fluid; actions in #footer', 'Success via message.success'],
    avoid: ['极短 2–3 字段也用 Drawer → form-in-dialog', '危险删除只用 Drawer 无确认 → confirm-delete'],
    avoidEn: ['Tiny 2–3 field forms → form-in-dialog', 'Destructive delete without confirm → confirm-delete'],
  },
  {
    id: 'confirm-delete',
    title: '危险删除确认',
    titleEn: 'Destructive delete confirm',
    description: 'MConfirmDialog + message.success；列表行删除默认路径。',
    descriptionEn: 'MConfirmDialog + message.success; default for list-row delete.',
    pageTypes: ['list', 'detail', 'common'],
    keywords: ['删除', '确认', '二次确认', 'confirm', 'delete', 'ConfirmDialog', '危险'],
    imports: ['MConfirmDialog', 'message'],
    scriptSetup: `const confirmOpen = ref(false)
const pendingId = ref<string | null>(null)

function askDelete(id: string) {
  pendingId.value = id
  confirmOpen.value = true
}

function onAcceptDelete() {
  // await api.remove(pendingId.value)
  message.success('已删除')
  pendingId.value = null
  confirmOpen.value = false
}`,
    template: `<MConfirmDialog
  v-model="confirmOpen"
  header="确认删除"
  message="删除后不可恢复，确定继续？"
  accept-label="删除"
  reject-label="取消"
  accept-severity="danger"
  @accept="onAcceptDelete"
/>`,
    rules: ['用 MConfirmDialog，不要手写 Dialog 确定/取消', 'acceptSeverity="danger"', '成功用 message.success，不要 toast'],
    rulesEn: ['Use MConfirmDialog; do not hand-roll Dialog Yes/No', 'acceptSeverity="danger"', 'Success via message.success, not toast'],
    avoid: ['普通 Dialog 冒充删除确认', '编辑表单误用 ConfirmDialog'],
    avoidEn: ['Faking delete confirm with Dialog', 'Using ConfirmDialog for edit forms'],
  },
  {
    id: 'row-actions-menu',
    title: '表格行更多操作菜单',
    titleEn: 'Table row overflow actions menu',
    description: '操作较多时用 MDropdown 收纳行内动作；少量明确操作仍用 list-row-actions。',
    descriptionEn: 'Use MDropdown when there are many row actions; prefer list-row-actions for a few explicit buttons.',
    pageTypes: ['list', 'common'],
    keywords: ['更多', '行菜单', 'dropdown', 'row menu', 'overflow', 'actions menu'],
    imports: ['MDropdown', 'MButton'],
    scriptSetup: `const rowMenu = [
  { label: '编辑', command: () => {/* open edit */} },
  { label: '复制', command: () => {/* duplicate */} },
  { label: '删除', severity: 'danger', command: () => {/* askDelete */} },
]`,
    template: `<template #cell-actions>
  <MDropdown :model="rowMenu">
    <MButton severity="secondary" size="small" text icon="more-horizontal" aria-label="更多操作" />
  </MDropdown>
</template>`,
    rules: ['操作很多时再用 Dropdown；2–3 个明确操作用 text 按钮', '危险项走 confirm-delete', '图标按钮必须 aria-label'],
    rulesEn: ['Use Dropdown when many actions; 2–3 explicit actions stay as text buttons', 'Danger → confirm-delete', 'Icon-only buttons need aria-label'],
    avoid: ['表单枚举用 Dropdown → Select', '只有编辑/删除也强行收进菜单'],
    avoidEn: ['Form enums via Dropdown → Select', 'Forcing edit/delete into a menu when two text buttons suffice'],
  },
  {
    id: 'wizard-steps',
    title: '分步向导 Stepper + Form',
    titleEn: 'Wizard stepper with per-step form',
    description: 'MStepper :steps + 每步一个 MForm；完成可用 result-block。',
    descriptionEn: 'MStepper :steps + one MForm per step; finish with result-block when useful.',
    pageTypes: ['form', 'common'],
    keywords: ['向导', '分步', '步骤', 'wizard', 'stepper', 'multi-step'],
    imports: ['MStepper', 'MForm', 'MFormItem', 'MInput', 'MButton', 'MSpace', 'MPageSection', 'message'],
    scriptSetup: `const activeStep = ref(0)
const submitting = ref(false)
const steps = [
  { label: '基本信息', description: '名称与说明' },
  { label: '确认', description: '核对后创建' },
]
const model = reactive({ name: '' })

function back() {
  if (activeStep.value > 0) activeStep.value -= 1
}
function next() {
  if (activeStep.value < steps.length - 1) activeStep.value += 1
}
async function finish() {
  submitting.value = true
  try {
    message.success('已创建')
  } finally {
    submitting.value = false
  }
}`,
    template: `<MStepper v-model="activeStep" :steps="steps" linear />
<MPageSection variant="form">
  <MForm v-if="activeStep === 0" @submit.prevent="next">
    <MFormItem label="名称" name="name" required>
      <MInput v-model="model.name" fluid />
    </MFormItem>
  </MForm>
  <div v-else>
    <p>确认创建「{{ model.name }}」？</p>
  </div>
</MPageSection>
<MPageSection variant="actions">
  <MSpace>
    <MButton severity="secondary" text :disabled="activeStep === 0" @click="back">上一步</MButton>
    <MButton v-if="activeStep < steps.length - 1" severity="primary" @click="next">下一步</MButton>
    <MButton v-else severity="primary" :loading="submitting" @click="finish">创建</MButton>
  </MSpace>
</MPageSection>`,
    rules: ['用 :steps（不是 :items）', '每步一个主任务；进入下一步前校验当前步', '完成文案与「下一步」区分'],
    rulesEn: ['Use :steps (not :items)', 'One job per step; validate before advancing', 'Finish label differs from Next'],
    avoid: ['所有字段藏在单页超长表单', '允许跳过有前置依赖的步骤'],
    avoidEn: ['Hiding all fields on one long page', 'Skipping steps with prerequisites'],
  },
  {
    id: 'auth-split-shell',
    title: '登录左右分栏壳',
    titleEn: 'Auth split brand + form shell',
    description: '左品牌 / 右表单；控件 M*；失败用 role="alert" 或 errorMessage，不用 Toast。',
    descriptionEn: 'Brand left / form right; M* controls; failures via role="alert" or errorMessage, not Toast.',
    pageTypes: ['common'],
    keywords: ['登录', '认证', '分栏', 'login', 'auth', 'split', 'brand'],
    imports: ['MForm', 'MFormItem', 'MInput', 'MInputPassword', 'MButton', 'MSpace', 'MConfigProvider', 'zhCN'],
    scriptSetup: `const submitting = ref(false)
const formError = ref('')
const model = reactive({ email: '', password: '' })

async function onSubmit() {
  formError.value = ''
  submitting.value = true
  try {
    if (!model.email || !model.password) {
      formError.value = '请输入邮箱和密码后再试。'
    }
  } finally {
    submitting.value = false
  }
}`,
    template: `<MConfigProvider :locale="zhCN">
  <div class="login-shell">
    <aside class="login-brand" aria-label="品牌">
      <p class="login-brand__mark">产品名</p>
      <h1 class="login-brand__title">一句品牌主张</h1>
      <p class="login-brand__lead">一句支持说明。</p>
    </aside>
    <main class="login-main">
      <div class="login-panel">
        <header class="login-panel__header">
          <h2>登录</h2>
          <p>使用工作邮箱进入。</p>
        </header>
        <p v-if="formError" class="login-alert" role="alert">{{ formError }}</p>
        <MForm @submit="onSubmit">
          <MFormItem label="邮箱" name="email" required>
            <MInput v-model="model.email" type="email" autocomplete="username" fluid />
          </MFormItem>
          <MFormItem label="密码" name="password" required>
            <MInputPassword v-model="model.password" autocomplete="current-password" fluid />
          </MFormItem>
          <MSpace style="margin-top: var(--m-space-2)" alignment="center">
            <MButton type="submit" label="登录" severity="primary" :loading="submitting" />
            <MButton type="button" label="忘记密码" severity="secondary" text />
          </MSpace>
        </MForm>
      </div>
    </main>
  </div>
</MConfigProvider>`,
    rules: [
      '品牌区用 --m-* / color-mix，默认扁平勿叠 aurora',
      '失败留在表单区（role="alert" 或 errorMessage），不要 Toast',
      '窄屏改为单栏：表单在上或品牌收短',
    ],
    rulesEn: [
      'Brand panel: --m-* / color-mix; flat by default — no stacked aurora',
      'Keep failures in the form (role="alert" or errorMessage), not Toast',
      'Narrow screens: single column',
    ],
    avoid: [
      '不要把 MMessage 当内嵌 Alert',
      '不要引入第二套 UI 库做登录壳',
      '不要未询问就加玻璃/霓虹/全页渐变',
    ],
    avoidEn: [
      'Do not use MMessage as an inline Alert',
      'Do not bring a second UI kit for the auth shell',
      'Do not add glass/neon/full-page gradients unless asked',
    ],
  },
  {
    id: 'layout-app-shell',
    title: '后台应用骨架',
    titleEn: 'Admin app shell',
    description: 'MLayout fillViewport + Header + Content 的最小骨架。',
    descriptionEn: 'Minimal MLayout fillViewport shell with header and content.',
    pageTypes: ['common'],
    keywords: ['layout', 'shell', 'breadcrumb', 'sider', 'app'],
    imports: [
      'MLayout',
      'MLayoutHeader',
      'MLayoutContent',
      'MLayoutSider',
      'MMenu',
      'MBreadcrumb',
      'MPageContent',
      'MConfigProvider',
      'zhCN',
    ],
    template: `<MConfigProvider :locale="zhCN">
  <MLayout fill-viewport has-sider>
    <MLayoutSider v-model:collapsed="siderCollapsed" bordered :collapsed-width="72">
      <MMenu
        :model="[
          { key: 'users', label: '用户管理', icon: 'user', to: '/users' },
          { key: 'roles', label: '角色管理', icon: 'shield', to: '/roles' },
        ]"
        :collapsed="siderCollapsed"
        :collapsed-width="72"
      />
    </MLayoutSider>
    <MLayout>
      <MLayoutHeader :padding="'var(--m-space-4) var(--m-space-6)'">
        <MBreadcrumb :model="[{ label: '首页', to: '/' }, { label: '当前页' }]" />
      </MLayoutHeader>
      <MLayoutContent>
        <MPageContent>
          <!-- page sections -->
        </MPageContent>
      </MLayoutContent>
    </MLayout>
  </MLayout>
</MConfigProvider>`,
    rules: [
      '根布局用 fillViewport',
      '面包屑放 MLayoutHeader',
    ],
    rulesEn: [
      'Use fillViewport on the root layout',
      'Place breadcrumb in MLayoutHeader',
    ],
    avoid: ['不要在 MLayoutContent 上写 padding'],
    avoidEn: ['Do not put padding on MLayoutContent'],
  },
  {
    id: 'scrollable-panel',
    title: '局部可滚动面板',
    titleEn: 'Scrollable local panel',
    description:
      '业务自行限高滚动时的可选写法：显式使用 MScrollbar。组件内置滚动区无需再包。',
    descriptionEn:
      'Optional pattern when the app wants a themed capped scroll region. Do not wrap component-owned scroll chrome again.',
    pageTypes: ['list', 'form', 'dashboard', 'detail', 'common'],
    keywords: [
      'scroll',
      'scrollbar',
      '滚动',
      '滚动条',
      'overflow',
      'max-height',
      'panel',
      'card body',
      'sidebar',
      'log',
    ],
    imports: ['MScrollbar', 'MCard'],
    template: `<MCard title="活动日志">
  <MScrollbar max-height="16rem">
    <ul style="margin:0;padding:0;list-style:none">
      <li v-for="item in logLines" :key="item.id" style="padding:var(--m-space-2) 0;border-bottom:1px solid var(--m-color-border)">
        {{ item.text }}
      </li>
    </ul>
  </MScrollbar>
</MCard>`,
    scriptSetup: `const logLines = [
  { id: '1', text: '用户 admin 登录成功' },
  { id: '2', text: '导出任务已完成' },
  { id: '3', text: '配置已保存' },
]`,
    rules: [
      '整页主滚动推荐 MLayout fillViewport',
      '固定高度用 height；仅超出时才滚动用 max-height',
      'MTable / Layout / 菜单下拉等通常已内置滚动，一般无需再包一层',
      'Dialog / Drawer 内容滚动由业务自行决定，需要主题滚动时再包 MScrollbar',
    ],
    rulesEn: [
      'Main page scroll: prefer MLayout fillViewport',
      'Use height for fixed viewports; use max-height when scroll should appear only on overflow',
      'MTable / Layout / menu popups usually scroll internally; an extra wrapper is often unnecessary',
      'Dialog / Drawer content scrolling is app-owned; wrap MScrollbar only when themed scroll is desired',
    ],
    avoid: ['整页壳写 overflow:auto', '重复包裹已内置滚动的组件'],
    avoidEn: ['overflow:auto on the page shell', 'Double-wrapping components that already scroll'],
  },
]

export function findPageSnippet(id: string): PageSnippet | undefined {
  const key = id.trim().toLowerCase().replace(/[-_\s]/g, '')
  return pageSnippets.find((item) => item.id.replace(/[-_\s]/g, '') === key)
}

export function scorePageSnippet(snippet: PageSnippet, query: string): number {
  const normalized = query.toLowerCase().trim()
  if (!normalized) return 0
  let score = 0
  if (snippet.id.replace(/[-_\s]/g, '') === normalized.replace(/[-_\s]/g, '')) score += 100
  for (const keyword of snippet.keywords) {
    const key = keyword.toLowerCase()
    if (normalized === key) score += 40
    else if (normalized.includes(key) || key.includes(normalized)) score += 15
  }
  for (const type of snippet.pageTypes) {
    if (normalized.includes(type)) score += 10
  }
  if (snippet.title.toLowerCase().includes(normalized) || snippet.titleEn.toLowerCase().includes(normalized)) {
    score += 25
  }
  return score
}

export function filterPageSnippets(args: {
  query?: string
  pageType?: string
  limit?: number
  offset?: number
}) {
  const pageType = args.pageType?.trim().toLowerCase()
  let items = pageSnippets.filter((item) => {
    if (!pageType) return true
    if (item.pageTypes.includes(pageType as PageSnippetPageType)) return true
    return item.pageTypes.length === 1 && item.pageTypes[0] === 'common'
  })
  if (args.query?.trim()) {
    items = items
      .map((item) => ({ item, score: scorePageSnippet(item, args.query!) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.item.id.localeCompare(b.item.id))
      .map((entry) => entry.item)
  }
  const offset = Math.max(args.offset ?? 0, 0)
  const limit = Math.min(Math.max(args.limit ?? 50, 1), 100)
  return {
    total: items.length,
    items: items.slice(offset, offset + limit),
    offset,
    limit,
    hasMore: offset + limit < items.length,
    nextOffset: offset + limit < items.length ? offset + limit : undefined,
  }
}
