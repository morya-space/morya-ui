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
      { component: 'Breadcrumb', role: '页面层级导航' },
      { component: 'Card', role: '内容表面', reason: '承载筛选区和数据区' },
      { component: 'Form', role: '筛选表单', reason: '多个查询条件需要统一布局' },
      { component: 'Input', role: '关键词筛选' },
      { component: 'Select', role: '枚举或状态筛选' },
      { component: 'Button', role: '查询、新增和行操作' },
      { component: 'Table', role: '数据展示' },
      { component: 'Pagination', role: '分页' },
      { component: 'Tag', role: '业务状态展示' },
      { component: 'Dialog', role: '编辑或删除确认', required: false },
    ],
    structure: [
      'Page',
      '├── Breadcrumb',
      '├── PageHeader',
      '│   ├── Title',
      '│   └── Actions (primary action)',
      '├── FilterCard',
      '│   └── Form',
      '├── DataCard',
      '│   ├── Toolbar',
      '│   ├── Table',
      '│   └── Pagination',
      '└── Dialog (edit / confirm)',
    ],
    layout: {
      page: '使用垂直分区，页面内容放在有最大宽度的容器内',
      header: '标题和主操作两端对齐，操作按钮靠右',
      filters: '桌面端 inline 或多列布局，窄屏堆叠为单列',
      data: '表格放入 Card，工具栏与分页和表格保持同一内容边界',
    },
    styleRules: [
      '新增、保存等主操作使用 primary WiButton',
      '查询等次要操作使用 secondary 或 outlined WiButton',
      '删除使用 danger WiButton，并配合 WiDialog 或 WiConfirmDialog',
      '业务状态使用 WiTag，不使用 Button severity 表达状态',
      '间距、颜色、圆角优先使用 --wi-* 设计令牌，不直接硬编码色板',
    ],
    interactionRules: [
      '筛选提交后重置分页到第一页',
      '加载中禁用重复提交并显示 loading 状态',
      '空数据使用 Empty 或 DataView 的空态能力，不渲染空白表格',
      '行级危险操作必须有确认反馈',
    ],
    avoid: [
      '不要用 WiDialog 承载完整列表页',
      '不要用 WiButton 代替业务状态标签',
      '不要为每个筛选字段手写一套不一致的 label 和间距',
    ],
  },
  {
    id: 'form-page',
    title: '新增 / 编辑表单页',
    titleEn: 'Create or edit form page',
    description: '用于创建或编辑业务对象，包含分组字段、校验和提交状态。',
    descriptionEn: 'A create or edit page with grouped fields, validation, and submit states.',
    keywords: ['表单', '新增', '编辑', '创建', '配置', '设置', 'form', 'create', 'edit', 'settings'],
    components: [
      { component: 'Breadcrumb', role: '页面层级导航' },
      { component: 'Card', role: '表单内容表面' },
      { component: 'Form', role: '声明式校验和布局' },
      { component: 'FormItem', role: '字段标签、帮助文本和校验状态', required: false, reason: '由 WiForm 同目录导出，作为表单子结构使用' },
      { component: 'Input', role: '文本字段' },
      { component: 'Select', role: '枚举字段' },
      { component: 'Textarea', role: '长文本字段', required: false },
      { component: 'Button', role: '提交和取消' },
    ],
    structure: [
      'Page',
      '├── Breadcrumb',
      '├── PageHeader',
      '└── Card',
      '    └── Form',
      '        ├── FormItem',
      '        ├── FormItem',
      '        └── Actions',
    ],
    layout: {
      page: '表单主体使用 max-width，避免字段横向过宽',
      form: '默认 label-position=top；字段按业务逻辑分组',
      actions: '提交按钮在前，取消使用 text 或 secondary，操作区与表单分隔',
      responsive: '多列字段在窄屏降为单列',
    },
    styleRules: [
      '统一使用 WiForm + WiFormItem 管理校验，不在页面中散落错误文案',
      '字段控件通常使用 fluid，宽度由表单布局控制',
      '提交使用 primary WiButton，保存中传入 loading',
      '取消使用 secondary text WiButton，避免与提交按钮争夺视觉层级',
      '使用 WiConfigProvider 或 --wi-* Token 保持尺寸和间距一致',
    ],
    interactionRules: [
      '提交前调用 FormInstance.validate()',
      '校验失败时保留用户输入并聚焦第一个错误字段',
      '异步保存期间防止重复提交',
      '离开有未保存修改的页面时给出确认提示',
    ],
    avoid: [
      '不要绕过 WiForm 直接手写不一致的字段校验状态',
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
      { component: 'Card', role: '指标和内容分区' },
      { component: 'Tag', role: '状态和告警级别' },
      { component: 'ProgressBar', role: '进度或容量指标', required: false },
      { component: 'DataView', role: '趋势或自定义数据内容承载', required: false },
      { component: 'Table', role: '明细数据', required: false },
      { component: 'Button', role: '刷新、查看详情和快捷操作', required: false },
      { component: 'Skeleton', role: '初始加载占位', required: false },
    ],
    structure: ['Page', '├── PageHeader + refresh action', '├── KPI Cards', '├── Trend / chart cards', '├── Alerts or activity', '└── Detail table (optional)'],
    layout: {
      page: '以 CSS grid 组织指标卡和内容卡，避免用绝对定位拼大屏',
      kpi: '指标卡保持等宽，主指标、变化量和时间范围层级清晰',
      content: '图表和明细按业务优先级排列，重要告警靠前',
      responsive: '多列网格在窄屏降为单列或两列',
    },
    styleRules: ['指标使用 text hierarchy，不用大面积高饱和背景', '状态和告警使用 WiTag 等语义组件', '图表容器使用 Card 和 --wi-* Token 保持表面一致', '实时刷新操作使用 secondary 或 text WiButton'],
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
    styleRules: ['开关用于二元启用状态，不用 Select 模拟开关', '保存使用 primary，恢复默认值使用 secondary 或 text', '危险配置需要明确说明影响范围并使用 danger 语义', '使用 WiConfigProvider 统一 size、density 和 locale'],
    interactionRules: ['显示未保存修改状态', '保存成功提供 Message 或 Toast 反馈', '保存失败保留输入并显示字段或页面级错误', '切换 Tab 不应意外丢失未保存输入'],
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
    structure: ['Container or Card', '└── Empty', '    ├── Explanation', '    └── Primary recovery action (optional)'],
    layout: { page: '空态在当前内容区域内居中，不一定占满整个视口', content: '说明原因、下一步动作和可选的辅助信息', responsive: '保持按钮可触达，窄屏垂直排列' },
    styleRules: ['空态文案使用中性、可行动的语气', '主恢复动作使用 primary WiButton，次动作使用 text', '不要用错误色表达正常的无数据状态'],
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
      { component: 'FormItem', role: '字段标签和错误信息', required: false, reason: '由 WiForm 同目录导出，作为表单子结构使用' },
      { component: 'Input', role: '账号或密码字段' },
      { component: 'InputOtp', role: '验证码字段', required: false },
      { component: 'Button', role: '提交认证' },
      { component: 'Message', role: '页面级反馈', required: false },
    ],
    structure: ['AuthLayout', '└── Card', '    └── Form', '        ├── Identity fields', '        ├── Recovery / alternative links', '        └── Submit action'],
    layout: { page: '认证表单使用窄 max-width 并保持视觉聚焦', form: '字段垂直排列，提交按钮 fluid', 'feedback': '错误信息靠近字段，认证失败提供页面级总结' },
    styleRules: ['密码字段使用 InputPassword 或 documented password API', '提交按钮使用 primary + fluid', '不要用高对比装饰削弱错误信息和焦点状态', '品牌视觉可定制，但控件状态仍使用 --wi-* Token'],
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
      '状态使用 WiTag 的语义色',
      '内容分组使用 WiCard，必要时用 WiDivider 分隔',
      '编辑使用 primary 或 outlined WiButton，删除使用 danger',
      '不使用大面积自定义背景色覆盖组件库 surface Token',
    ],
    interactionRules: [
      '详情加载中使用 Skeleton 或 ProgressSpinner',
      '资源不存在时提供明确的 Empty 或错误状态和返回入口',
      '危险操作必须确认并在成功后刷新或离开当前详情页',
    ],
    avoid: [
      '不要把所有属性拼成一段无层次文本',
      '不要使用颜色作为唯一的状态表达方式',
      '不要让详情页的操作按钮分散在多个无关区域',
    ],
  },
]

export const designRules = {
  tokens: {
    colors: ['--wi-color-primary', '--wi-color-surface', '--wi-color-text', '--wi-color-border'],
    spacing: '--wi-space-*',
    radius: '--wi-radius-sm/md/lg',
    typography: '--wi-font-size-xs/sm/md/lg',
    motion: '--wi-motion-fast/normal',
  },
  actions: {
    primary: { component: 'WiButton', props: ['severity omitted or primary'] },
    secondary: { component: 'WiButton', props: ['severity="secondary"', 'outlined or text'] },
    destructive: { component: 'WiButton', props: ['severity="danger"'], requiresConfirmation: true },
    cancel: { component: 'WiButton', props: ['severity="secondary"', 'text'] },
  },
  status: {
    component: 'WiTag',
    mapping: { active: 'success', pending: 'warn', disabled: 'secondary', error: 'danger' },
  },
  global: [
    '优先使用组件库组件和 --wi-* Token，不重复维护第二套色板',
    '图标按钮必须提供 aria-label 或 ariaLabel',
    '表单字段必须有可见 label 或等价的可访问名称',
    '浮层默认 Teleport 到 body；只有有明确布局约束时才改 appendTo',
    '优先使用组件的 documented variant，不通过深层 CSS 覆盖内部样式',
  ],
} as const

export function findPattern(name: string): PagePattern | undefined {
  const key = name.trim().toLowerCase().replace(/[-_\s]/g, '')
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
