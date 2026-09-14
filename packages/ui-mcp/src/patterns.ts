export interface PatternComponent {
  component: string
  role: string
  reason?: string
  required?: boolean
}

export interface PagePattern {
  id: string
  title: string
  titleEn: string
  description: string
  descriptionEn: string
  keywords: string[]
  goldenPage?: string
  components: PatternComponent[]
  structure: string[]
  layout: Record<string, string>
  styleRules: string[]
  interactionRules: string[]
  avoid: string[]
}

export const pagePatterns: PagePattern[] = [
  {
    id: 'admin-list',
    title: '管理后台列表页',
    titleEn: 'Admin list page',
    description: '用于资源管理、设备管理、用户管理等带筛选和行操作的数据列表。',
    descriptionEn: 'A resource-management list with filters, actions, row operations, and pagination.',
    goldenPage: 'docs/golden-pages/list-page.vue',
    keywords: [
      '列表',
      '表格',
      '数据表',
      '数据列表',
      '管理',
      '后台',
      '筛选',
      '搜索',
      '分页',
      '新增',
      '编辑',
      '删除',
      'list',
      'table',
      'filter',
      'pagination',
      'crud',
    ],
    components: [
      { component: 'ConfigProvider', role: '应用根包裹', reason: '统一 locale、主题、密度与浮层挂载' },
      { component: 'Layout', role: '后台应用骨架', reason: 'has-sider 侧栏 + 主内容区' },
      { component: 'LayoutSider', role: '侧栏导航', required: false },
      { component: 'LayoutHeader', role: '顶栏面包屑' },
      { component: 'LayoutContent', role: '页面主体内容区' },
      { component: 'Breadcrumb', role: '页面层级导航' },
      { component: 'PageContent', role: '内容区垂直堆叠与间距', reason: '替代手写 gap/padding CSS' },
      { component: 'PageFilters', role: '筛选区表面与边框' },
      { component: 'PageToolbar', role: '标题与主操作两端对齐' },
      { component: 'Space', role: '筛选控件与行操作间距' },
      { component: 'Input', role: '关键词筛选' },
      { component: 'Select', role: '枚举或状态筛选' },
      { component: 'Button', role: '查询、新增和行操作' },
      { component: 'Table', role: '数据展示', reason: 'paginator 启用内置分页' },
      { component: 'Tag', role: '业务状态展示' },
      { component: 'Dialog', role: '编辑或删除确认', required: false },
    ],
    structure: [
      'MConfigProvider',
      '└── MLayout (has-sider)',
      '    ├── MLayoutSider → MMenu (optional)',
      '    └── MLayout',
      '        ├── MLayoutHeader → MBreadcrumb',
      '        └── MLayoutContent',
      '            └── MPageContent',
      '                ├── MPageFilters (MSpace + MInput + MSelect + MButton)',
      '                ├── MPageToolbar (title + primary action)',
      '                └── MTable (paginator, #cell-* slots, #empty)',
    ],
    layout: {
      page: 'MLayout fillViewport + has-sider；MLayoutContent 内用 MPageContent 堆叠区块',
      header: 'MLayoutHeader 放面包屑；标题与主操作用 MPageToolbar',
      filters: 'MPageFilters 包裹筛选控件；内部 MSpace wrap 或 MFlex',
      data: 'MTable 直接放在 MPageContent 内，不要额外 MCard；paginator + #empty',
    },
    styleRules: [
      '新增、保存等主操作使用 primary MButton',
      '查询等次要操作使用 secondary 或 outlined MButton',
      '删除使用 danger MButton，并配合 MDialog 或 MConfirmDialog',
      '业务状态使用 MTag，不使用 Button severity 表达状态',
      '间距、颜色、圆角优先使用 --m-* 设计令牌，不直接硬编码色板',
    ],
    interactionRules: [
      '筛选提交后重置分页到第一页',
      '加载中禁用重复提交并显示 loading 状态',
      '空数据使用 MTable #empty 插槽或 DataView 空态，不渲染空白表格',
      '行级危险操作必须有确认反馈',
      'CRUD 成功/删除等单行回执使用 message API，不要默认 Toast',
    ],
    avoid: [
      '不要用 MDialog 承载完整列表页',
      '不要用 MButton 代替业务状态标签',
      '不要为每个筛选字段手写一套不一致的 label 和间距',
      '不要用 toast.add({ summary }) 代替 message.success 表达单行操作结果',
    ],
  },
  {
    id: 'form-page',
    title: '新增 / 编辑表单页',
    titleEn: 'Create or edit form page',
    description: '用于创建或编辑业务对象，包含分组字段、校验和提交状态。',
    descriptionEn: 'A create or edit page with grouped fields, validation, and submit states.',
    goldenPage: 'docs/golden-pages/form-page.vue',
    keywords: ['表单', '新增', '编辑', '创建', '配置', '设置', 'form', 'create', 'edit', 'settings'],
    components: [
      { component: 'ConfigProvider', role: '应用根包裹' },
      { component: 'Layout', role: '页面骨架' },
      { component: 'LayoutHeader', role: '顶栏面包屑' },
      { component: 'LayoutContent', role: '页面主体滚动区' },
      { component: 'PageContent', role: '表单页窄宽与垂直间距', reason: 'width="narrow"' },
      { component: 'PageHeader', role: '页面标题与说明' },
      { component: 'PageSection', role: '表单表面与底栏', reason: 'variant form / actions' },
      { component: 'Breadcrumb', role: '页面层级导航' },
      { component: 'Form', role: '声明式校验和布局' },
      { component: 'FormItem', role: '字段标签、帮助文本和校验状态', required: false, reason: '由 MForm 同目录导出，作为表单子结构使用' },
      { component: 'Input', role: '文本字段' },
      { component: 'Select', role: '枚举字段' },
      { component: 'Textarea', role: '长文本字段', required: false },
      { component: 'Button', role: '提交和取消' },
    ],
    structure: [
      'MConfigProvider',
      '└── MLayout',
      '    ├── MLayoutHeader → MBreadcrumb',
      '    └── MLayoutContent',
      '        └── MPageContent (width="narrow")',
      '            ├── MPageHeader',
      '            └── MPageSection (variant="form")',
      '                └── MForm + MPageSection (variant="actions")',
    ],
    layout: {
      shell: 'MLayout fillViewport + MLayoutHeader + MLayoutContent',
      page: 'MPageContent width="narrow" 限制表单宽度',
      form: 'MPageSection variant="form" 包裹 MForm；label-position=top',
      actions: 'MPageSection variant="actions" 放提交/取消；不要手写 border-top CSS',
      responsive: '多列字段在窄屏降为单列',
    },
    styleRules: [
      '统一使用 MForm + MFormItem 管理校验，不在页面中散落错误文案',
      '字段控件通常使用 fluid，宽度由表单布局控制',
      '提交使用 primary MButton，保存中传入 loading',
      '取消使用 secondary text MButton，避免与提交按钮争夺视觉层级',
      '使用 MConfigProvider 或 --m-* Token 保持尺寸和间距一致',
    ],
    interactionRules: [
      '提交前调用 FormInstance.validate()',
      '校验失败时保留用户输入并聚焦第一个错误字段',
      '异步保存期间防止重复提交',
      '离开有未保存修改的页面时给出确认提示',
    ],
    avoid: [
      '不要绕过 MForm 直接手写不一致的字段校验状态',
      '不要把完整编辑流程塞进过窄的 Dialog，除非字段很少',
      '不要使用 placeholder 代替 label',
    ],
  },
  {
    id: 'dashboard',
    title: '仪表盘 / 监控工作台',
    titleEn: 'Dashboard / monitoring workspace',
    description: '用于展示关键指标、趋势、告警和需要优先处理的业务信息。',
    descriptionEn: 'A workspace for KPIs, trends, alerts, and prioritized operational information.',
    keywords: ['仪表盘', '工作台', '监控', '指标', '趋势', '告警', 'dashboard', 'monitoring', 'kpi', 'analytics'],
    components: [
      { component: 'ConfigProvider', role: '应用根包裹' },
      { component: 'Layout', role: '页面骨架' },
      { component: 'LayoutHeader', role: '顶栏与面包屑' },
      { component: 'LayoutContent', role: '仪表盘内容' },
      { component: 'Breadcrumb', role: '页面层级导航' },
      { component: 'PageContent', role: '仪表盘垂直间距', reason: 'density="spacious"' },
      { component: 'PageHeader', role: '页面标题' },
      { component: 'PageStat', role: 'KPI 指标卡' },
      { component: 'PagePlaceholder', role: '图表占位' },
      { component: 'Grid', role: 'KPI 与内容区栅格' },
      { component: 'GridItem', role: '栅格子项' },
      { component: 'Card', role: '图表与列表明细分区' },
      { component: 'Icon', role: 'KPI 图标', required: false },
      { component: 'Tag', role: '状态和告警级别' },
      { component: 'Table', role: '明细数据', required: false },
      { component: 'Button', role: '刷新、查看详情和快捷操作', required: false },
      { component: 'Skeleton', role: '初始加载占位', required: false },
    ],
    goldenPage: 'docs/golden-pages/dashboard-page.vue',
    structure: [
      'ConfigProvider',
      '└── Layout',
      '    ├── LayoutHeader + Breadcrumb',
      '    └── LayoutContent',
      '        ├── Page title',
      '        ├── KPI Grid (Card + Icon)',
      '        ├── Trend / chart Card (placeholder or external chart)',
      '        └── Recent activity Table (optional)',
    ],
    layout: {
      shell: '使用 MLayout + MLayoutHeader + MLayoutContent',
      page: '以 MGrid 组织指标卡和内容卡，避免用绝对定位拼大屏',
      kpi: '指标卡保持等宽，主指标、变化量和时间范围层级清晰',
      content: '图表和明细按业务优先级排列，重要告警靠前',
      responsive: '多列网格在窄屏降为单列或两列',
    },
    styleRules: ['指标使用 text hierarchy，不用大面积高饱和背景', '状态和告警使用 MTag 等语义组件', '图表容器使用 Card 和 --m-* Token 保持表面一致', '实时刷新操作使用 secondary 或 text MButton'],
    interactionRules: ['首次加载使用 Skeleton', '无数据和接口错误必须有明确状态', '刷新中禁用重复请求并保留上次数据', '告警需要可追踪到详情或处理入口'],
    avoid: ['不要把所有信息都做成 KPI 卡片', '不要使用颜色作为唯一告警表达', '不要用固定像素绝对定位实现响应式布局'],
  },
  {
    id: 'settings-page',
    title: '设置 / 配置页',
    titleEn: 'Settings / configuration page',
    description: '用于偏好设置、系统配置、权限配置和分组表单。',
    descriptionEn: 'A grouped configuration page for preferences, system settings, and permissions.',
    keywords: ['设置', '配置', '偏好', '权限', '系统设置', 'settings', 'configuration', 'preferences', 'permissions'],
    components: [
      { component: 'Tabs', role: '多个设置域之间切换' },
      { component: 'Card', role: '设置分组表面' },
      { component: 'Form', role: '配置表单' },
      { component: 'FormItem', role: '字段标签和校验' },
      { component: 'Input', role: '文本配置' },
      { component: 'Select', role: '枚举配置' },
      { component: 'Switch', role: '启用 / 禁用配置', required: false },
      { component: 'Button', role: '保存和恢复默认值' },
    ],
    structure: ['Page', '├── PageHeader', '├── Tabs (optional)', '│   └── Settings section', '│       └── Card + Form', '└── Save actions'],
    layout: { page: '设置内容使用稳定的 max-width，避免控件铺满视口', navigation: '设置域较多时使用 Tabs 或 Sidebar，较少时使用连续分组', form: 'label-position=top，相关字段使用 Card 或 Fieldset 分组', actions: '保存操作固定在表单末尾或明确的 sticky action bar' },
    styleRules: ['开关用于二元启用状态，不用 Select 模拟开关', '保存使用 primary，恢复默认值使用 secondary 或 text', '危险配置需要明确说明影响范围并使用 danger 语义', '使用 MConfigProvider 统一 size、density 和 locale'],
    interactionRules: ['显示未保存修改状态', '保存成功使用 message.success 单行反馈；仅有 summary+detail 时用 toast', '保存失败保留输入并显示字段或页面级错误', '切换 Tab 不应意外丢失未保存输入'],
    avoid: ['不要把所有设置塞进一个超长表单', '不要用 placeholder 代替配置项 label', '不要隐藏影响范围较大的配置说明'],
  },
  {
    id: 'empty-state',
    title: '空状态 / 无结果页',
    titleEn: 'Empty state / no results page',
    description: '用于首次使用、搜索无结果、资源已清空或暂时没有内容的场景。',
    descriptionEn: 'For first use, no search results, empty resources, or temporarily unavailable content.',
    keywords: ['空状态', '无数据', '无结果', '首次使用', 'empty', 'no results', 'no data', 'zero state'],
    components: [
      { component: 'DataView', role: '列表或网格空态承载' },
      { component: 'Button', role: '创建、重置筛选或返回', required: false },
      { component: 'Card', role: '在列表或详情容器中承载空态', required: false },
    ],
    structure: ['Container or Card', '└── DataView / Table #empty', '    ├── Explanation', '    └── Primary recovery action (optional)'],
    layout: { page: '空态在当前内容区域内居中，不一定占满整个视口', content: '说明原因、下一步动作和可选的辅助信息', responsive: '保持按钮可触达，窄屏垂直排列' },
    styleRules: ['空态文案使用中性、可行动的语气', '主恢复动作使用 primary MButton，次动作使用 text', '不要用错误色表达正常的无数据状态'],
    interactionRules: ['搜索无结果提供清除筛选或修改条件入口', '首次使用提供创建或导入入口', '保留页面标题和上下文导航'],
    avoid: ['不要只显示“暂无数据”而没有下一步', '不要把无数据和接口错误混为一谈'],
  },
  {
    id: 'auth-page',
    title: '登录 / 认证页',
    titleEn: 'Login / authentication page',
    description: '用于登录、注册、找回密码和二次认证流程。',
    descriptionEn: 'For login, registration, password recovery, and second-factor authentication flows.',
    keywords: ['登录', '注册', '认证', '密码', '验证码', 'login', 'register', 'authentication', 'password', 'otp'],
    components: [
      { component: 'Card', role: '认证表面' },
      { component: 'Form', role: '认证字段校验' },
      { component: 'FormItem', role: '字段标签和错误信息', required: false, reason: '由 MForm 同目录导出，作为表单子结构使用' },
      { component: 'Input', role: '账号或密码字段' },
      { component: 'InputOtp', role: '验证码字段', required: false },
      { component: 'Button', role: '提交认证' },
      { component: 'Message', role: '页面级反馈', required: false },
    ],
    structure: ['AuthLayout', '└── Card', '    └── Form', '        ├── Identity fields', '        ├── Recovery / alternative links', '        └── Submit action'],
    layout: { page: '认证表单使用窄 max-width 并保持视觉聚焦', form: '字段垂直排列，提交按钮 fluid', 'feedback': '错误信息靠近字段，认证失败提供页面级总结' },
    styleRules: ['密码字段使用 InputPassword 或 documented password API', '提交按钮使用 primary + fluid', '不要用高对比装饰削弱错误信息和焦点状态', '品牌视觉可定制，但控件状态仍使用 --m-* Token'],
    interactionRules: ['提交中显示 loading 并防止重复提交', '错误不清空用户已填写的非敏感字段', '密码输入和验证码输入提供可访问名称', '支持键盘提交和清晰焦点顺序'],
    avoid: ['不要用 placeholder 代替字段 label', '不要把所有认证错误只放在 Toast 中', '不要在错误时回显密码'],
  },
  {
    id: 'wizard-form',
    title: '分步表单 / 向导',
    titleEn: 'Multi-step form / wizard',
    description: '用于字段较多、需要按顺序完成或有阶段性校验的流程。',
    descriptionEn: 'For long workflows that need ordered steps and staged validation.',
    keywords: ['分步', '向导', '步骤', '流程', 'wizard', 'stepper', 'multi-step', 'workflow'],
    components: [
      { component: 'Stepper', role: '步骤导航' },
      { component: 'Form', role: '当前步骤字段校验' },
      { component: 'FormItem', role: '字段标签和校验' },
      { component: 'Input', role: '文本字段', required: false },
      { component: 'Select', role: '选择字段', required: false },
      { component: 'Button', role: '上一步、下一步和完成' },
      { component: 'Dialog', role: '离开或取消确认', required: false },
    ],
    structure: ['Page', '├── Stepper', '├── Current step Card', '│   └── Form', '└── Navigation actions'],
    layout: { page: '步骤导航和表单主体保持同一内容边界', stepper: '步骤少时横向展示，步骤多或窄屏时允许纵向或滚动', actions: '上一步为 secondary，下一步和完成为 primary' },
    styleRules: ['每一步只承载一个清晰目标', '步骤状态使用 Stepper，不用 Button 颜色模拟', '长流程使用 Card 分组但避免多层嵌套', '危险退出使用 ConfirmDialog 或 Dialog'],
    interactionRules: ['进入下一步前只校验当前步骤', '返回上一步保留输入', '完成前展示摘要或确认', '刷新和离开时处理未完成状态'],
    avoid: ['不要把所有字段一次性隐藏在一个超长页面', '不要允许跳过有前置依赖的步骤', '不要让完成按钮在每一步都使用相同文案'],
  },
  {
    id: 'detail-page',
    title: '详情页',
    titleEn: 'Detail page',
    description: '用于查看一个资源的摘要、属性、状态和相关操作。',
    descriptionEn: 'A resource detail view with summary, properties, status, and contextual actions.',
    keywords: ['详情', '明细', '查看', '概览', '属性', '详情页', 'detail', 'overview', 'profile'],
    components: [
      { component: 'Breadcrumb', role: '页面层级导航' },
      { component: 'Card', role: '内容分组表面' },
      { component: 'Tag', role: '状态展示' },
      { component: 'Divider', role: '内容分组分隔', required: false },
      { component: 'Button', role: '编辑、返回和危险操作' },
      { component: 'Dialog', role: '危险操作确认', required: false },
    ],
    structure: [
      'Page',
      '├── Breadcrumb',
      '├── PageHeader',
      '│   ├── Title + Status Tag',
      '│   └── Actions',
      '├── Summary Card',
      '├── Properties Card',
      '└── Related content',
    ],
    layout: {
      page: '使用清晰的标题区和多个语义分组，避免一张超长 Card',
      header: '资源名称、状态和上下文操作集中在顶部',
      content: '属性区可用 CSS grid，多列信息在窄屏降为单列',
      actions: '编辑为主操作，返回为次操作，删除放在低强调区域',
    },
    styleRules: [
      '状态使用 MTag 的语义色',
      '内容分组使用 MCard，必要时用 MDivider 分隔',
      '编辑使用 primary 或 outlined MButton，删除使用 danger',
      '不使用大面积自定义背景色覆盖组件库 surface Token',
    ],
    interactionRules: [
      '详情加载中使用 Skeleton 或 ProgressSpinner',
      '资源不存在时提供明确的 Table #empty 或 DataView 空态和返回入口',
      '危险操作必须确认并在成功后刷新或离开当前详情页',
    ],
    avoid: [
      '不要把所有属性拼成一段无层次文本',
      '不要使用颜色作为唯一的状态表达方式',
      '不要让详情页的操作按钮分散在多个无关区域',
    ],
  },
]

export interface PageStandard {
  id: string
  title: string
  titleEn: string
  recommend: string[]
  recommendEn: string[]
  discouraged?: string[]
  discouragedEn?: string[]
  mcp?: {
    snippet?: string
    decision?: string
  }
}

/** Advisory page-writing standards for MCP and human authors — not enforced blockers. */
export const pageStandards: PageStandard[] = [
  {
    id: 'layout-shell',
    title: '页面骨架',
    titleEn: 'Page shell',
    recommend: [
      '后台页根布局使用 MLayout fillViewport',
      'MLayoutContent 内使用 MPageContent 统一 padding 与区块间距',
      '写整页前先 get_golden_page 复制对应类型结构',
    ],
    recommendEn: [
      'Use MLayout fillViewport as the admin page root',
      'Place MPageContent inside MLayoutContent for consistent padding and section gap',
      'Call get_golden_page before writing a full page and copy the matching structure',
    ],
    discouraged: [
      '手写 min-height:100vh',
      '在 MLayoutContent 上写 padding/gap',
      '嵌套多层 MPageContent',
    ],
    discouragedEn: [
      'Hand-written min-height:100vh',
      'Padding/gap on MLayoutContent instead of MPageContent',
      'Nesting multiple MPageContent shells',
    ],
    mcp: { snippet: 'layout-app-shell' },
  },
  {
    id: 'page-sections',
    title: '页面区块组件',
    titleEn: 'Page section components',
    recommend: [
      '筛选区用 MPageFilters，标题+操作用 MPageToolbar，表单区用 MPageSection',
      '列表页 MTable 直接放在 MPageContent 内',
      '同行控件用 MSpace / MFlex；区块之间依赖 MPageContent 的 gap',
      '局部区块优先 get_page_snippet（filters / toolbar / form-actions 等）',
    ],
    recommendEn: [
      'Use MPageFilters, MPageToolbar, and MPageSection for filters, headers/actions, and forms',
      'Place MTable directly in MPageContent on list pages',
      'Use MSpace / MFlex for same-row controls; let MPageContent gap separate sections',
      'Prefer get_page_snippet for local blocks such as filters, toolbar, or form-actions',
    ],
    discouraged: [
      '手写 .page-filters / .page-toolbar 类',
      '用 MCard 或带 padding 的容器再包 MPageFilters / MPageSection / MPageToolbar',
      '在已有 MPage* 区块之间再写 margin 叠间距',
    ],
    discouragedEn: [
      'Hand-written .page-filters / .page-toolbar classes',
      'Wrapping MPageFilters / MPageSection / MPageToolbar with MCard or extra padded containers',
      'Adding margin between MPage* siblings that PageContent gap already spaces',
    ],
    mcp: { decision: 'surface-nesting-choice' },
  },
  {
    id: 'scroll',
    title: '滚动',
    titleEn: 'Scroll',
    recommend: [
      '组件内置滚动区（Layout 壳、菜单/下拉面板、Table 视口等）使用内置 MScrollbar',
      'Dialog / Drawer / Popover / Splitter 等内容区不强制主题滚动；需要时由业务自行包 MScrollbar',
      '已内置滚动的组件通常无需再外包一层',
    ],
    recommendEn: [
      'Component-owned scroll chrome (Layout shell, menu/select panels, Table viewport) uses built-in MScrollbar',
      'Do not force themed scroll into Dialog / Drawer / Popover / Splitter content; apps can wrap MScrollbar when needed',
      'Components that already scroll internally usually need no extra wrapper',
    ],
    discouraged: [
      '在 Dialog / Drawer / Popover / Splitter / Textarea 等用户内容区强行内置 MScrollbar',
      '业务代码定制 ::-webkit-scrollbar 替代组件内置滚动',
      '重复包裹已内置滚动的组件',
    ],
    discouragedEn: [
      'Forcing MScrollbar into user content areas such as Dialog, Drawer, Popover, Splitter, or Textarea',
      '::-webkit-scrollbar styling instead of component-owned scroll chrome',
      'Extra scroll wrappers around components that already scroll',
    ],
    mcp: { snippet: 'scrollable-panel', decision: 'page-scroll-choice' },
  },
  {
    id: 'tokens',
    title: '设计令牌',
    titleEn: 'Design tokens',
    recommend: ['颜色、间距、圆角、字号优先 --m-* Token', '控件宽度等局部尺寸可用 inline style'],
    recommendEn: [
      'Prefer --m-* tokens for color, spacing, radius, and typography',
      'Inline styles are fine for local control widths',
    ],
    discouraged: ['页面级 hex / 裸 rgb() 色值', '维护第二套色板变量'],
    discouragedEn: ['Page-level hex or raw rgb() colors', 'Maintaining a second color palette'],
  },
  {
    id: 'feedback',
    title: '操作反馈',
    titleEn: 'Action feedback',
    recommend: [
      '单行结果（已保存/已删除）默认 message.success / error',
      '需要标题+补充说明时用 toast',
      '危险操作配合 MConfirmDialog',
    ],
    recommendEn: [
      'Default single-line results to message.success / error',
      'Use toast when a summary plus detail is needed',
      'Pair destructive actions with MConfirmDialog',
    ],
    discouraged: ['只有一行文案却用 toast', '删除等危险操作无确认'],
    discouragedEn: ['Toast for single-line-only feedback', 'Destructive actions without confirmation'],
    mcp: { decision: 'overlay-choice' },
  },
  {
    id: 'accessibility',
    title: '无障碍',
    titleEn: 'Accessibility',
    recommend: [
      '图标按钮提供 aria-label 或 ariaLabel',
      '表单控件有可见 label 或等价可访问名称',
      '筛选区、表格等语义区域可加 aria-label',
    ],
    recommendEn: [
      'Provide aria-label or ariaLabel on icon-only buttons',
      'Give form controls a visible label or equivalent accessible name',
      'Add aria-label to semantic regions such as filter bars or tables when helpful',
    ],
  },
]

export const designRules = {
  meta: {
    nature: 'recommended',
    noteZh: 'standards 为页面书写标准（推荐实践）；特殊场景可偏离。validate_page 仅给出参考建议。',
    noteEn: 'standards are recommended page-writing practices; deviations are fine when justified. validate_page is advisory only.',
  },
  /** Page writing standards — single source for layout, scroll, tokens, feedback, a11y, etc. */
  standards: pageStandards,
  tokens: {
    colors: ['--m-color-primary', '--m-color-surface', '--m-color-text', '--m-color-border'],
    spacing: '--m-space-*',
    radius: '--m-radius-sm/md/lg',
    typography: '--m-font-size-xs/sm/md/lg',
    motion: '--m-motion-fast/normal',
  },
  composition: {
    workflow: [
      'For full pages: recommend_page → get_golden_page → get_design_rules.',
      'For local edits: get_page_snippet(section) for filters/toolbar/form-actions/KPI/scrollable-panel blocks.',
      'Use MLayout fillViewport as the app shell; put MPageContent inside MLayoutContent.',
      'Prefer MPage* components over scoped CSS for filters, toolbars, headers, form surfaces, and KPI cards.',
      'Use MSpace or MFlex for control groups inside MPageFilters; use MPageToolbar for title + primary action.',
    ],
    snippets: [
      'list-filters',
      'list-toolbar',
      'list-table',
      'list-row-actions',
      'form-header',
      'form-body',
      'form-actions',
      'dashboard-kpi-grid',
      'dashboard-chart-card',
      'layout-app-shell',
      'scrollable-panel',
    ],
    pageStack: {
      list: ['MLayout', 'MLayoutHeader', 'MLayoutContent', 'MPageContent', 'MPageFilters', 'MPageToolbar', 'MTable'],
      form: ['MLayout', 'MLayoutHeader', 'MLayoutContent', 'MPageContent', 'MPageHeader', 'MPageSection', 'MForm'],
      dashboard: ['MLayout', 'MLayoutHeader', 'MLayoutContent', 'MPageContent', 'MPageHeader', 'MGrid', 'MPageStat', 'MCard'],
    },
    spacing: {
      pageContent: 'MPageContent handles padding (--m-space-6) and gap (--m-space-4); spacious uses --m-space-6 gap',
      filters: 'MPageFilters handles padded muted surface; do not wrap filters in MCard',
      toolbar: 'MPageToolbar handles title/actions alignment with --m-space-4 gap',
      form: 'MPageSection variant="form" handles form padding/border/shadow',
    },
    borders: {
      do: ['MLayoutHeader bordered (default)', 'MPageFilters for filter regions', 'MPageSection variant="form" for forms', 'MTable bordered when table needs grid lines'],
      avoid: [
        'MCard wrapping MTable that is already bordered',
        'Nested MCard with bordered=true on both levels',
        'Hand-written section borders when MPageFilters or MPageSection applies',
        'Double borders on filter + table wrapper',
      ],
    },
    goldenPages: ['list-page', 'form-page', 'dashboard-page'],
  },
  actions: {
    primary: { component: 'MButton', props: ['severity omitted or primary'] },
    secondary: { component: 'MButton', props: ['severity="secondary"', 'outlined or text'] },
    destructive: { component: 'MButton', props: ['severity="danger"'], requiresConfirmation: true },
    cancel: { component: 'MButton', props: ['severity="secondary"', 'text'] },
  },
  status: {
    component: 'MTag',
    mapping: { active: 'success', pending: 'warn', disabled: 'secondary', error: 'danger' },
  },
  feedback: {
    default: 'message',
    message: {
      api: 'message.success | info | warn | error',
      when: ['单行操作回执（已保存/已删除/已创建）', '轻量警告或错误', '复制成功等一句话反馈'],
      avoid: ['不要写 summary/detail 结构'],
    },
    toast: {
      api: 'toast.success | info | warn | error({ summary, detail? })',
      when: ['同时需要标题与补充说明', '后台任务/批量结果含统计', '异步通知感、角落堆叠'],
      avoid: ['仅有单行文案时不要使用 Toast'],
    },
    inlineMessage: {
      component: 'MMessage',
      when: ['登录/表单区常驻错误', '页面级错误需与表单同区展示'],
    },
    doc: 'docs/feedback-message-vs-toast.md',
  },
  global: [
    '优先使用组件库组件和 --m-* Token',
    '操作反馈默认 message；仅一行文案时优先于 toast',
    '图标按钮建议提供 aria-label；表单字段建议有可见 label',
    '浮层默认 Teleport 到 body；有明确布局约束时再改 appendTo',
    '优先使用组件 documented variant，少写深层 CSS 覆盖',
  ],
} as const

export function findPattern(input: string): PagePattern | undefined {
  const key = input.trim().toLowerCase().replace(/[-_\s]/g, '')
  return pagePatterns.find((pattern) => pattern.id.replace(/[-_\s]/g, '') === key)
}

export function scorePattern(pattern: PagePattern, query: string): number {
  const normalized = query.toLowerCase().trim()
  if (!normalized) return 0
  const parts = normalized.split(/[\s,，、/]+/).filter(Boolean)
  let score = 0
  for (const part of parts) {
    for (const keyword of pattern.keywords) {
      const normalizedKeyword = keyword.toLowerCase()
      if (normalizedKeyword === part) score += 30
      else if (normalizedKeyword.includes(part) || part.includes(normalizedKeyword)) score += 12
    }
  }
  if (pattern.id === normalized.replace(/[-_\s]/g, '')) score += 100
  return score
}
