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
    keywords: ['筛选', '搜索', '查询', 'filters', 'filter', 'search', 'keyword', 'reset'],
    imports: ['MPageFilters', 'MSpace', 'MInput', 'MSelect', 'MButton'],
    scriptSetup: `const keyword = ref('')
const status = ref<string | undefined>()
const statusOptions = [
  { label: '全部', value: '' },
  { label: '启用', value: 'active' },
  { label: '停用', value: 'inactive' },
]`,
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
    <MButton severity="secondary">查询</MButton>
    <MButton severity="secondary" text>重置</MButton>
  </MSpace>
</MPageFilters>`,
    rules: ['放在 MPageHeader 之后、表格之前', 'viewport 内仅一个 primary（通常在 Header）', '不要外包 MCard'],
    rulesEn: ['Place after MPageHeader and before the table', 'Keep one primary in the viewport (usually in Header)', 'Do not wrap with MCard'],
    avoid: ['不要手写 .page-filters 类', '不要用 MCard 包筛选区'],
    avoidEn: ['Do not hand-write .page-filters classes', 'Do not wrap filters in MCard'],
  },
  {
    id: 'list-filters-collapsible',
    title: '列表页折叠筛选',
    titleEn: 'Collapsible list filters',
    description: 'MPageFilters collapsible + #advanced 隐藏次要字段。',
    descriptionEn: 'Hide secondary fields with collapsible MPageFilters and an #advanced slot.',
    pageTypes: ['list'],
    keywords: ['折叠', '高级筛选', 'collapse', 'advanced', 'expand', 'filter'],
    imports: ['MPageFilters', 'MSpace', 'MInput', 'MSelect', 'MButton'],
    scriptSetup: `const filtersExpanded = ref(false)
const keyword = ref('')
const department = ref<string | null>(null)`,
    template: `<MPageFilters
  v-model:expanded="filtersExpanded"
  aria-label="筛选"
  variant="filled"
  collapsible
>
  <MSpace wrap>
    <MInput v-model="keyword" placeholder="搜索名称" clearable style="width: 14rem" />
    <MButton severity="secondary">查询</MButton>
    <MButton severity="secondary" text>重置</MButton>
  </MSpace>
  <template #advanced>
    <MSpace wrap>
      <MSelect
        v-model="department"
        :options="[{ label: '研发', value: '研发' }, { label: '运营', value: '运营' }]"
        placeholder="部门"
        clearable
        style="width: 10rem"
      />
    </MSpace>
  </template>
</MPageFilters>`,
    rules: ['常用条件放 default，次要条件放 #advanced', '查询/重置保持 secondary'],
    rulesEn: ['Keep primary filters in default; secondary filters in #advanced', 'Query/reset stay secondary'],
    avoid: ['不要用 MCard 包整个筛选区'],
    avoidEn: ['Do not wrap the whole filter bar in MCard'],
  },
  {
    id: 'list-filter-chips',
    title: '列表页已选筛选',
    titleEn: 'Active filter chips',
    description: 'MPageFilterChips + MTag closable 展示并清除已选条件。',
    descriptionEn: 'Show and clear active filters with MPageFilterChips and closable MTag.',
    pageTypes: ['list'],
    keywords: ['已选', 'chip', 'tag', 'active', 'clear', '筛选'],
    imports: ['MPageFilterChips', 'MTag'],
    template: `<MPageFilterChips label="已选" aria-label="已选筛选">
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
    rules: ['放在 MPageFilters 之后、表格之前', '用业务 computed 生成 activeFilters'],
    rulesEn: ['Place after MPageFilters and before the table', 'Derive activeFilters from filter state'],
    avoid: ['不要手写 pill 样式或 dashed 壳'],
    avoidEn: ['Do not hand-write pill or dashed shells'],
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
    description: '表格多选时的批量操作，放在筛选区之后（可选）。',
    descriptionEn: 'Optional batch actions after filters when rows are selectable.',
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
    rules: ['左侧用 default 插槽展示已选数量', '批量操作用 text/outlined，danger 仅 destructive'],
    rulesEn: ['Use the default slot for selection count', 'Batch actions use text/outlined; danger only for destructive ops'],
    avoid: ['不要用 Toolbar title 充当页面标题'],
    avoidEn: ['Do not use Toolbar title as the page heading'],
  },
  {
    id: 'list-table',
    title: '列表页表格',
    titleEn: 'List page table',
    description: '标准 MTable，直接放在 MPageContent 内，不额外包 Card。',
    descriptionEn: 'Standard MTable placed directly in MPageContent without an extra Card wrapper.',
    pageTypes: ['list'],
    keywords: ['表格', 'table', 'pagination', 'paginator', 'empty', 'columns', 'rows'],
    imports: ['MTable', 'MEmpty', 'MButton'],
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
    rules: ['表格直接放在 MPageContent 内', '空态用 MEmpty，不要留空白或单行灰字'],
    rulesEn: ['Place the table directly in MPageContent', 'Use MEmpty for zero-data states, not a blank or muted sentence'],
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
