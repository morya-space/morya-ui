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
    title: '列表页筛选区',
    titleEn: 'List page filter bar',
    description: '在 MPageContent 内追加或替换筛选区，使用 MPageFilters + MSpace 包裹控件。',
    descriptionEn: 'Add or replace a filter region inside MPageContent using MPageFilters and MSpace.',
    pageTypes: ['list'],
    keywords: ['筛选', '搜索', '查询', 'filter', 'search', 'keyword', 'reset'],
    imports: ['MPageFilters', 'MSpace', 'MInput', 'MSelect', 'MButton'],
    scriptSetup: `const keyword = ref('')
const status = ref<string | undefined>()
const statusOptions = [
  { label: '全部', value: '' },
  { label: '启用', value: 'active' },
  { label: '停用', value: 'inactive' },
]`,
    template: `<MPageFilters aria-label="筛选">
  <MSpace wrap>
    <MInput v-model="keyword" placeholder="搜索名称" clearable style="width: 14rem" />
    <MSelect
      v-model="status"
      :options="statusOptions"
      placeholder="状态"
      clearable
      style="width: 10rem"
    />
    <MButton severity="primary">查询</MButton>
    <MButton severity="secondary">重置</MButton>
  </MSpace>
</MPageFilters>`,
    rules: ['放在 MPageContent 内、MPageToolbar 之前', '不要外包 MCard', '筛选项宽度用 inline style，区块样式交给 MPageFilters'],
    rulesEn: ['Place inside MPageContent before MPageToolbar', 'Do not wrap with MCard', 'Use inline width on controls; let MPageFilters own the surface'],
    avoid: ['不要手写 .page-filters 类', '不要用 MCard 包筛选区'],
    avoidEn: ['Do not hand-write .page-filters classes', 'Do not wrap filters in MCard'],
  },
  {
    id: 'list-toolbar',
    title: '列表页工具栏',
    titleEn: 'List page toolbar',
    description: '标题 + 主操作按钮，放在筛选区之后、表格之前。',
    descriptionEn: 'Page title and primary action between filters and the table.',
    pageTypes: ['list'],
    keywords: ['工具栏', '标题', '新建', 'toolbar', 'title', 'create', 'actions'],
    imports: ['MPageToolbar', 'MButton'],
    template: `<MPageToolbar title="用户管理">
  <template #actions>
    <MButton severity="primary">新建用户</MButton>
  </template>
</MPageToolbar>`,
    rules: ['主操作放 #actions', '标题优先用 title prop，不用裸 h1 + flex'],
    rulesEn: ['Put primary actions in #actions', 'Prefer the title prop over raw h1 + flex'],
    avoid: ['不要再用自定义 toolbar CSS'],
    avoidEn: ['Do not add custom toolbar CSS'],
  },
  {
    id: 'list-table',
    title: '列表页表格',
    titleEn: 'List page table',
    description: '标准 MTable，直接放在 MPageContent 内，不额外包 Card。',
    descriptionEn: 'Standard MTable placed directly in MPageContent without an extra Card wrapper.',
    pageTypes: ['list'],
    keywords: ['表格', 'table', 'pagination', 'paginator', 'empty', 'columns', 'rows'],
    imports: ['MTable'],
    scriptSetup: `const columns = [
  { key: 'name', label: '名称' },
  { key: 'status', label: '状态' },
  { key: 'updatedAt', label: '更新时间' },
  { key: 'actions', label: '操作', width: 128 },
]
const rows = ref<Record<string, unknown>[]>([])
const loading = ref(false)`,
    template: `<MTable
  :columns="columns"
  :rows="rows"
  :loading="loading"
  paginator
  :rows-per-page="10"
  striped
  bordered
  row-key="id"
  aria-label="数据列表"
>
  <template #empty>
    <p style="margin:0;padding:var(--m-space-8);text-align:center;color:var(--m-color-text-muted)">
      暂无数据
    </p>
  </template>
</MTable>`,
    rules: ['表格直接放在 MPageContent 内', '空态用 #empty，不要留空白区域'],
    rulesEn: ['Place the table directly in MPageContent', 'Use #empty for zero-data states'],
    avoid: ['不要用 MCard 包裹 bordered MTable'],
    avoidEn: ['Do not wrap a bordered MTable with MCard'],
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
    <MButton severity="secondary" size="small">编辑</MButton>
    <MButton severity="danger" size="small">删除</MButton>
  </MSpace>
</template>`,
    rules: ['行内操作用 size="small"', '危险操作使用 severity="danger" 并配合确认弹窗'],
    rulesEn: ['Use size="small" for row actions', 'Use severity="danger" with confirmation for destructive actions'],
    avoid: ['不要用 Dropdown 代替明确的行内按钮组，除非操作很多'],
    avoidEn: ['Do not replace explicit row buttons with Dropdown unless there are many actions'],
  },
  {
    id: 'list-status-tag',
    title: '表格状态列 Tag',
    titleEn: 'Table status tag cell',
    description: '在 #cell-status 中用 MTag 展示业务状态。',
    descriptionEn: 'Render business status with MTag in #cell-status.',
    pageTypes: ['list'],
    keywords: ['状态', 'tag', 'status', 'cell-status'],
    imports: ['MTag'],
    template: `<template #cell-status="{ value }">
  <MTag
    :value="value === 'active' ? '启用' : '停用'"
    :severity="value === 'active' ? 'success' : 'secondary'"
  />
</template>`,
    rules: ['分类/强调态用 MTag；更轻的圆点+文案用 MStatus', '不要用 Button 颜色表达状态'],
    rulesEn: ['Use MTag for chip-like status; use MStatus for lighter dot+label', 'Do not use Button colors for status'],
    avoid: ['不要用裸文本颜色区分状态'],
    avoidEn: ['Do not rely on raw text color for status'],
  },
  {
    id: 'list-status-dot',
    title: '表格状态列 Status',
    titleEn: 'Table status dot cell',
    description: '在 #cell-status 中用 MStatus 展示轻量业务状态。',
    descriptionEn: 'Render lightweight business status with MStatus in #cell-status.',
    pageTypes: ['list'],
    keywords: ['状态', 'status', 'dot', 'cell-status', '在线'],
    imports: ['MStatus'],
    template: `<template #cell-status="{ value }">
  <MStatus
    :label="value === 'online' ? '在线' : '离线'"
    :severity="value === 'online' ? 'success' : 'secondary'"
  />
</template>`,
    rules: ['行内轻量状态优先 MStatus', '不要用 Button 颜色表达状态'],
    rulesEn: ['Prefer MStatus for lightweight inline status', 'Do not use Button colors for status'],
    avoid: ['不要用裸文本颜色区分状态'],
    avoidEn: ['Do not rely on raw text color for status'],
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
  { label: '总用户', value: '12,480', trend: '+8.2%', icon: 'users' },
  { label: '今日活跃', value: '1,926', trend: '+3.1%', icon: 'activity' },
])`,
    template: `<MGrid :cols="4" :x-gap="16" :y-gap="16" responsive="screen">
  <MGridItem v-for="metric in metrics" :key="metric.label" :span="1">
    <MPageStat
      :label="metric.label"
      :value="metric.value"
      :trend="metric.trend"
      icon="activity"
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
    description: 'MCard 标题 + MPagePlaceholder 作为图表占位。',
    descriptionEn: 'MCard title with MPagePlaceholder for chart area.',
    pageTypes: ['dashboard'],
    keywords: ['chart', '图表', 'placeholder', 'card', 'trend'],
    imports: ['MCard', 'MPagePlaceholder', 'MSkeleton'],
    template: `<MCard title="趋势概览">
  <MSkeleton v-if="loading" height="8rem" />
  <MPagePlaceholder
    v-else
    aria-label="图表占位"
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
    imports: ['MCard', 'MTable', 'MTag'],
    scriptSetup: `const recentColumns = [
  { key: 'id', label: '工单号', width: 96 },
  { key: 'title', label: '标题' },
  { key: 'status', label: '状态', width: 96 },
]
const recentRows = ref<Record<string, unknown>[]>([])`,
    template: `<MCard title="最近工单">
  <MTable :columns="recentColumns" :rows="recentRows" size="small" :paginator="false" bordered />
</MCard>`,
    rules: ['明细列表放 MCard 内合理', 'size="small" 适合卡片内表格'],
    rulesEn: ['Detail lists inside MCard are appropriate', 'Use size="small" for in-card tables'],
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
    description: '详情页标题与编辑操作。',
    descriptionEn: 'Detail page title and edit action.',
    pageTypes: ['detail'],
    keywords: ['detail', '详情', 'edit', 'toolbar'],
    imports: ['MPageToolbar', 'MButton', 'MTag'],
    template: `<MPageToolbar title="示例资源">
  <template #actions>
    <MButton severity="primary" outlined>编辑</MButton>
  </template>
</MPageToolbar>
<MTag value="正常" severity="success" />`,
    rules: ['状态 Tag 放在标题区附近', '编辑为主操作，删除放低强调区域'],
    rulesEn: ['Keep status Tag near the header area', 'Edit is primary; delete stays low emphasis'],
    avoid: ['不要把操作散落到多个无关区域'],
    avoidEn: ['Do not scatter actions across unrelated areas'],
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
