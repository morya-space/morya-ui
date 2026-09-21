export interface ComponentDecisionOption {
  component: string
  when: string[]
  whenEn: string[]
  avoidWhen: string[]
  avoidWhenEn: string[]
}

export interface ComponentDecision {
  id: string
  title: string
  titleEn: string
  question: string
  questionEn: string
  keywords: string[]
  options: ComponentDecisionOption[]
}

export const componentDecisions: ComponentDecision[] = [
  {
    id: 'form-surface-choice',
    title: '新建/编辑用弹窗还是独立表单页',
    titleEn: 'Dialog vs dedicated form page for create/edit',
    question: '表单是从列表触发的短录入，还是多分组/长流程的独立配置？',
    questionEn: 'Is this a short create/edit from a list, or a multi-section dedicated form flow?',
    keywords: ['新建', '编辑', '表单', '弹窗', '路由', 'create', 'edit', 'form', 'dialog', 'page'],
    options: [
      {
        component: 'Dialog',
        when: [
          '从列表/工具栏打开新建或编辑',
          '字段大约 ≤8 个、单段表单',
          '希望保存后仍停留在列表上下文',
        ],
        whenEn: [
          'Create/edit is launched from a list or toolbar',
          'About ≤8 fields in a single section',
          'User should stay in the list context after save',
        ],
        avoidWhen: ['多步骤向导', '多分组长配置页'],
        avoidWhenEn: ['Multi-step wizards', 'Long multi-section configuration pages'],
      },
      {
        component: 'Drawer',
        when: ['表单比 Dialog 更长但仍需对照列表', '详情+编辑侧滑'],
        whenEn: ['Form is longer than a dialog but list context matters', 'Detail plus edit in a side panel'],
        avoidWhen: ['字段极少的确认式录入'],
        avoidWhenEn: ['Tiny confirmation-style forms'],
      },
      {
        component: 'Form',
        when: ['用户明确要求独立表单页', '多分组、长校验、离开需确认的配置流'],
        whenEn: [
          'The user explicitly asked for a dedicated form page',
          'Multi-section, heavy validation, or leave-confirm configuration flows',
        ],
        avoidWhen: ['列表上的常规短 CRUD'],
        avoidWhenEn: ['Routine short CRUD from a list'],
      },
    ],
  },
  {
    id: 'overlay-choice',
    title: '如何选择浮层组件',
    titleEn: 'Choosing an overlay component',
    question: '这是确认、短任务、上下文操作，还是需要保留页面上下文的编辑？',
    questionEn: 'Is this a confirmation, short task, contextual action, or an edit that needs page context?',
    keywords: ['弹窗', '浮层', '模态', '侧栏', '确认', '编辑', 'dialog', 'drawer', 'popover', 'tooltip', 'modal', 'side editing', 'side panel', 'context'],
    options: [
      {
        component: 'Dialog',
        when: [
          '需要用户聚焦完成一项短到中等任务',
          '列表页上的新建/编辑短表单（约 ≤8 个字段）',
          '需要确认危险操作',
          '内容不适合直接放在页面流中',
        ],
        whenEn: [
          'The user should focus on a short or medium-sized task',
          'Create/edit short forms launched from a list (~≤8 fields)',
          'A destructive action needs confirmation',
          'Content should not interrupt the page flow',
        ],
        avoidWhen: ['内容接近完整多分组页面', '用户需要持续查看底层页面上下文且表单很长'],
        avoidWhenEn: [
          'The content is effectively a multi-section full page',
          'The user must continuously reference the underlying page and the form is long',
        ],
      },
      {
        component: 'Drawer',
        when: ['需要侧边编辑或查看详情', '需要保留底层列表或工作区上下文', '内容比普通确认框更长'],
        whenEn: ['Side editing or detail inspection is needed', 'The underlying list or workspace context should remain visible', 'The content is longer than a normal confirmation'],
        avoidWhen: ['只是简单确认', '操作必须阻塞用户直到明确确认'],
        avoidWhenEn: ['It is only a simple confirmation', 'The action must block the user until an explicit decision'],
      },
      {
        component: 'Popover',
        when: ['轻量上下文操作或补充信息', '不需要阻塞页面', '内容与触发元素强相关'],
        whenEn: ['Lightweight contextual actions or supporting information', 'The page should not be blocked', 'The content is tightly related to the trigger'],
        avoidWhen: ['需要复杂表单或危险操作确认'],
        avoidWhenEn: ['A complex form or destructive confirmation is required'],
      },
      {
        component: 'Tooltip',
        when: ['只展示简短说明', '用户悬停或聚焦控件时需要补充提示'],
        whenEn: ['Only a short explanation is needed', 'Extra help is needed on hover or focus'],
        avoidWhen: ['信息是必需内容', '需要放置交互控件'],
        avoidWhenEn: ['The information is essential content', 'Interactive controls need to be placed inside'],
      },
    ],
  },
  {
    id: 'data-display-choice',
    title: '如何选择数据展示组件',
    titleEn: 'Choosing a data display component',
    question: '用户需要比较行列数据、浏览卡片，还是查看树状层级？',
    questionEn: 'Does the user need to compare rows and columns, browse cards, or inspect a hierarchy?',
    keywords: ['表格', '列表', '卡片', '树', '层级', '数据展示', 'table', 'list', 'tree', 'dataview'],
    options: [
      {
        component: 'Table',
        when: ['数据有稳定列结构', '用户需要排序、筛选、批量或行操作', '需要高密度比较多条记录'],
        whenEn: ['Data has a stable column structure', 'Users need sorting, filtering, bulk actions, or row actions', 'Many records must be compared at high density'],
        avoidWhen: ['每条数据结构差异很大', '移动端无法承载横向列结构'],
        avoidWhenEn: ['Each record has a very different structure', 'A horizontal column layout cannot work on mobile'],
      },
      {
        component: 'DataView',
        when: ['数据适合卡片或自定义列表项', '视觉浏览比列对齐更重要', '同一数据需要切换多种展示布局'],
        whenEn: ['Data fits cards or custom list items', 'Visual browsing matters more than column alignment', 'The same data needs multiple presentation layouts'],
        avoidWhen: ['用户必须精确比较字段', '需要复杂列级排序或固定列'],
        avoidWhenEn: ['Users must compare fields precisely', 'Complex column sorting or frozen columns are required'],
      },
      {
        component: 'TreeTable',
        when: ['数据同时具有表格列和父子层级', '用户需要展开、收起层级节点'],
        whenEn: ['Data has both table columns and parent-child hierarchy', 'Users need to expand and collapse hierarchy nodes'],
        avoidWhen: ['数据没有真实层级关系', '普通 Table 已能表达关系'],
        avoidWhenEn: ['There is no real hierarchy', 'A regular Table already expresses the relationship'],
      },
      {
        component: 'Tree',
        when: ['主要任务是浏览或选择层级节点', '节点信息不需要多列比较'],
        whenEn: ['The main task is browsing or selecting hierarchy nodes', 'Nodes do not need multi-column comparison'],
        avoidWhen: ['每行需要展示多个可比较字段'],
        avoidWhenEn: ['Each row needs several comparable fields'],
      },
    ],
  },
  {
    id: 'selection-choice',
    title: '如何选择选择器',
    titleEn: 'Choosing a selection control',
    question: '选项是平面少量、层级结构、多选标签，还是需要输入搜索？',
    questionEn: 'Are options a small flat set, a hierarchy, multi-select tags, or searchable input?',
    keywords: ['选择', '下拉', '多选', '树选择', '搜索选择', '级联', '列表选择', '按钮组', 'select', 'treeselect', 'autocomplete', 'cascadeselect', 'listbox', 'selectbutton', 'radio', 'dropdown'],
    options: [
      {
        component: 'Select',
        when: ['平面选项数量中等', '需要单选或多选', '表单字段需要明确选项集合'],
        whenEn: ['The options are a medium-sized flat set', 'Single or multiple selection is needed', 'The form needs a defined option set'],
        avoidWhen: ['选项有明显层级', '用户需要输入自由文本并搜索建议'],
        avoidWhenEn: ['Options have a meaningful hierarchy', 'Users need free text with suggestions'],
      },
      {
        component: 'TreeSelect',
        when: ['选项有父子层级', '用户需要按组织、分类或资源树选择'],
        whenEn: ['Options have parent-child hierarchy', 'Users select from organizations, categories, or resource trees'],
        avoidWhen: ['选项只是简单平面枚举'],
        avoidWhenEn: ['Options are a simple flat enum'],
      },
      {
        component: 'AutoComplete',
        when: ['用户需要输入关键词搜索建议', '候选项很多或来自远程接口', '输入值本身也有意义'],
        whenEn: ['Users type keywords to search suggestions', 'There are many or remote candidates', 'The entered value is meaningful itself'],
        avoidWhen: ['用户只能从固定枚举中选择', '不应该允许自由输入'],
        avoidWhenEn: ['Users must choose from a fixed enum', 'Free input must not be allowed'],
      },
      {
        component: 'SelectButton',
        when: ['选项很少且需要全部露出', '单选或多选都适合按钮组'],
        whenEn: ['Only a few options, and all of them should stay visible', 'Single or multiple selection works as a button group'],
        avoidWhen: ['选项超过大约 5 个', '选项很长或来自远程搜索'],
        avoidWhenEn: ['More than about five options', 'Labels are long or options come from remote search'],
      },
      {
        component: 'Radio',
        when: ['少量互斥选项需要和表单文案一起阅读', '一次只能选一个'],
        whenEn: ['A few mutually exclusive options should be read with the form copy', 'Only one value can be selected'],
        avoidWhen: ['多选', '选项很多需要收进弹出层'],
        avoidWhenEn: ['Multiple selection', 'Too many options for an always-visible list'],
      },
      {
        component: 'Listbox',
        when: ['选项需要始终以列表展示', '可筛选，但不希望收成下拉框'],
        whenEn: ['Options should stay visible as a list', 'Filtering is useful, but a collapsed dropdown is not'],
        avoidWhen: ['页面空间紧、只需要一个闭合的选择框'],
        avoidWhenEn: ['Space is tight and a closed select is enough'],
      },
      {
        component: 'CascadeSelect',
        when: ['值要按多级分栏逐级点选', '层级是路径而不是可勾选的树'],
        whenEn: ['The value is chosen column by column through levels', 'The hierarchy is a path, not a checkable tree'],
        avoidWhen: ['需要勾选树节点或搜索整棵树'],
        avoidWhenEn: ['Users need to check tree nodes or search the whole tree'],
      },
    ],
  },
  {
    id: 'surface-choice',
    title: '如何选择内容容器',
    titleEn: 'Choosing a content surface',
    question: '内容是否需要独立的视觉表面、标题和边界？',
    questionEn: 'Does the content need an independent visual surface, heading, and boundary?',
    keywords: ['容器', '卡片', '面板', '分组', '表面', 'card', 'panel', 'fieldset', 'surface'],
    options: [
      {
        component: 'Card',
        when: ['内容是页面中的独立业务区块', '需要标题、副标题、页脚或 hover 表面', '需要清晰的边界和内边距'],
        whenEn: ['The content is an independent business section', 'A title, subtitle, footer, or hover surface is useful', 'A clear boundary and padding are needed'],
        avoidWhen: ['页面已有过多嵌套表面', '内容只是简单分组'],
        avoidWhenEn: ['The page already has too many nested surfaces', 'The content is only a simple group'],
      },
      {
        component: 'Panel',
        when: ['需要可折叠或强调一个较长内容区块', '内容具有明确的面板标题'],
        whenEn: ['A collapsible or prominent longer section is needed', 'The content has a clear panel heading'],
        avoidWhen: ['只需要普通内容容器', '标题和边界会增加视觉噪音'],
        avoidWhenEn: ['A regular content container is enough', 'A heading and boundary would add visual noise'],
      },
      {
        component: 'Fieldset',
        when: ['需要语义化分组相关表单字段', '分组标题对理解表单很重要'],
        whenEn: ['Related form fields need semantic grouping', 'A group title is important for understanding the form'],
        avoidWhen: ['内容不是表单字段', '只是为了增加装饰边框'],
        avoidWhenEn: ['The content is not form fields', 'The border would be purely decorative'],
      },
    ],
  },
  {
    id: 'layout-spacing-choice',
    title: '如何选择页面间距组件',
    titleEn: 'Choosing page spacing/layout components',
    question: '控件组、页面区块、栅格之间需要哪种间距与对齐方式？',
    questionEn: 'What kind of spacing and alignment is needed between controls, page sections, or grid areas?',
    keywords: ['间距', '布局', 'gap', 'flex', 'space', 'page', 'toolbar', 'filters', 'spacing', 'layout', 'stack'],
    options: [
      {
        component: 'PageContent',
        when: ['页面主内容区需要统一的 padding 和垂直 gap', '列表/表单/仪表盘区块纵向堆叠'],
        whenEn: ['The main content area needs consistent padding and vertical gap', 'List, form, or dashboard sections stack vertically'],
        avoidWhen: ['只是两个按钮之间的水平间距'],
        avoidWhenEn: ['Only horizontal spacing between two buttons is needed'],
      },
      {
        component: 'Flex',
        when: ['同一行控件需要 gap 和对齐', '工具栏内操作组、筛选控件组'],
        whenEn: ['Controls on one row need gap and alignment', 'Toolbar action groups or filter control rows'],
        avoidWhen: ['整个页面区块的 padding 和垂直 rhythm'],
        avoidWhenEn: ['Padding and vertical rhythm for whole page sections'],
      },
      {
        component: 'Space',
        when: ['简单 wrap 控件组且不需要 justify 语义', '表格行内操作按钮组'],
        whenEn: ['A simple wrapped control group without justify semantics', 'Inline row action button groups'],
        avoidWhen: ['页面级标题与主操作两端对齐'],
        avoidWhenEn: ['Page-level title and primary action need space-between alignment'],
      },
      {
        component: 'Grid',
        when: ['KPI 卡片、仪表盘双栏、响应式列布局'],
        whenEn: ['KPI cards, dashboard two-column layouts, responsive columns'],
        avoidWhen: ['单个筛选行或表单字段列'],
        avoidWhenEn: ['A single filter row or form field column'],
      },
    ],
  },
  {
    id: 'page-section-choice',
    title: '如何选择页面区块组件',
    titleEn: 'Choosing page section components',
    question: '这是筛选区、标题区、表单表面、KPI 还是图表占位？',
    questionEn: 'Is this a filter bar, page header, form surface, KPI metric, or chart placeholder?',
    keywords: ['筛选', '工具栏', '标题', '表单', 'kpi', '占位', 'page filters', 'toolbar', 'header', 'stat', 'placeholder'],
    options: [
      {
        component: 'PageFilters',
        when: ['列表页或搜索页的筛选/查询区域', '需要统一浅色背景与边框'],
        whenEn: ['Filter or search region on list pages', 'A consistent muted background and border is needed'],
        avoidWhen: ['普通表单字段分组', 'KPI 指标展示'],
        avoidWhenEn: ['Regular form field grouping', 'KPI metric display'],
      },
      {
        component: 'PageToolbar',
        when: ['页面标题 + 右侧主操作', '列表页新建按钮区域'],
        whenEn: ['Page title plus primary actions on the right', 'Create button area on list pages'],
        avoidWhen: ['带长描述的表单引导区'],
        avoidWhenEn: ['Form intro areas with long descriptions'],
      },
      {
        component: 'PageHeader',
        when: ['页面标题 + 描述文案', '表单页/详情页引导'],
        whenEn: ['Page title plus descriptive copy', 'Form or detail page intros'],
        avoidWhen: ['只有标题和单个主按钮的列表工具栏'],
        avoidWhenEn: ['List toolbars with only a title and one primary button'],
      },
      {
        component: 'PageSection',
        when: ['表单主体表面 (variant="form")', '底栏操作区 (variant="actions")'],
        whenEn: ['Form body surface (variant="form")', 'Footer actions (variant="actions")'],
        avoidWhen: ['列表页筛选区', 'KPI 卡片'],
        avoidWhenEn: ['List page filter areas', 'KPI cards'],
      },
      {
        component: 'PageStat',
        when: ['仪表盘 KPI 单指标卡', '需要 label/value/trend/icon 结构'],
        whenEn: ['Dashboard KPI cards', 'Needs label/value/trend/icon structure'],
        avoidWhen: ['普通内容分组', '表格或表单'],
        avoidWhenEn: ['Generic content grouping', 'Tables or forms'],
      },
      {
        component: 'PagePlaceholder',
        when: ['图表、地图或媒体区域尚未接入', '需要 dashed 占位表面'],
        whenEn: ['Charts, maps, or media areas are not wired yet', 'A dashed placeholder surface is needed'],
        avoidWhen: ['真实数据表格或表单'],
        avoidWhenEn: ['Real data tables or forms'],
      },
    ],
  },
  {
    id: 'page-scroll-choice',
    title: '页面滚动如何选择',
    titleEn: 'Choosing page scroll strategy',
    question: '这是整页滚动、组件内置滚动，还是业务手写的局部滚动区？',
    questionEn: 'Is this whole-page scroll, built-in component scroll, or a hand-written local scroll region?',
    keywords: [
      'scroll',
      'scrollbar',
      '滚动',
      '滚动条',
      'overflow',
      '页面滚动',
      'layout scroll',
      'panel scroll',
    ],
    options: [
      {
        component: 'MLayout fillViewport',
        when: [
          '整页后台列表/表单/仪表盘',
          '需要 Header + Content + 可选 Sider 的应用骨架',
          '页面主滚动应随 Layout 主题化',
        ],
        whenEn: [
          'Full admin list/form/dashboard pages',
          'App shell with header, content, and optional sider',
          'Main page scroll should follow the layout theme',
        ],
        avoidWhen: ['单个卡片内部的小块内容', '需要业务自行控制滚动的 Dialog/Drawer 内容'],
        avoidWhenEn: ['Small regions inside a single card', 'Dialog/Drawer bodies where apps control scrolling'],
      },
      {
        component: 'MScrollbar',
        when: [
          '业务自行限高的卡片正文、侧栏、日志列表，且希望主题化滚动条',
          'Dialog / Drawer 等内容区需要主题滚动时由业务显式包一层',
          '组件未内置滚动、又需要统一滚动外观时',
        ],
        whenEn: [
          'App-owned capped regions (card bodies, side panels, logs) that want themed scrollbars',
          'Dialog / Drawer content where the app opts into themed scrolling',
          'No built-in component scroll, but a consistent scrollbar look is desired',
        ],
        avoidWhen: [
          'Dialog / Drawer / Popover / Splitter 等用户内容插槽被组件库强行包滚动',
          'Textarea 等原生控件自身的滚动',
          'MTable / MLayoutContent / Select 弹出层等已内置滚动的区域',
        ],
        avoidWhenEn: [
          'Library-forced scroll around user content slots such as Dialog, Drawer, Popover, or Splitter',
          'Native control scrolling such as Textarea',
          'Areas that already scroll internally (MTable, MLayoutContent, Select popups)',
        ],
      },
      {
        component: 'Built-in (no extra wrapper)',
        when: [
          'MLayout、MTable、MVirtualScroller、菜单/下拉面板等已内置 MScrollbar',
          '浮层菜单与子菜单（Dropdown/ContextMenu/TieredMenu/Menu flyout）',
        ],
        whenEn: [
          'MLayout, MTable, MVirtualScroller, and menu/select panels already scroll internally',
          'Overlay menus and nested flyouts (Dropdown/ContextMenu/TieredMenu/Menu flyout)',
        ],
        avoidWhen: ['在已内置滚动的组件外再包一层滚动容器'],
        avoidWhenEn: ['Wrapping another scroll container around built-in scroll chrome'],
      },
    ],
  },
  {
    id: 'surface-nesting-choice',
    title: '如何避免双边框与多余容器',
    titleEn: 'Avoiding double borders and redundant wrappers',
    question: '内容是否已经被 Page 组件或 Table 提供了边界？',
    questionEn: 'Does Page or Table already provide the boundary for this content?',
    keywords: ['边框', '双边框', 'card', 'nested', 'border', 'wrapper', 'table', 'filters'],
    options: [
      {
        component: 'PageContent + MTable',
        when: ['列表页数据表格', 'MPageFilters 已提供筛选区边界'],
        whenEn: ['List page data tables', 'MPageFilters already provides the filter boundary'],
        avoidWhen: ['需要独立卡片标题的内容模块'],
        avoidWhenEn: ['Content modules that need an independent card title'],
      },
      {
        component: 'MCard',
        when: ['仪表盘中的图表区/明细区', '需要 card 标题的内容模块'],
        whenEn: ['Chart or detail areas on dashboards', 'Content modules that need a card title'],
        avoidWhen: ['列表页表格外层', '筛选区外层'],
        avoidWhenEn: ['Wrapping list page tables', 'Wrapping filter regions'],
      },
      {
        component: 'PageSection',
        when: ['表单页主体或 actions 底栏', '需要统一 form surface'],
        whenEn: ['Form page bodies or action footers', 'A unified form surface is needed'],
        avoidWhen: ['再套 MCard variant form 导致双边框'],
        avoidWhenEn: ['Wrapping again with MCard and causing double borders'],
      },
    ],
  },
  {
    id: 'loading-choice',
    title: '如何选择加载反馈',
    titleEn: 'Choosing a loading indicator',
    question: '这是区域或全屏等待、已知布局的占位、可量化进度，还是只需要阻止交互？',
    questionEn: 'Is this a region or fullscreen wait, a placeholder for a known layout, measurable progress, or interaction blocking without a loading message?',
    keywords: [
      '加载',
      '等待',
      '遮罩',
      '骨架',
      '进度',
      'loading',
      'spinner',
      'skeleton',
      'progress',
      'v-loading',
      'mloading',
    ],
    options: [
      {
        component: 'Loading',
        when: [
          '一块区域或整页正在等待，用户暂时不能操作这块内容',
          '需要加载文案、多种动效，或用 v-loading / loading.service 盖住已有节点',
          '全屏提交、保存、跳转前的短暂等待',
        ],
        whenEn: [
          'A region or the whole page is waiting and that content should not be operated',
          'A caption, effect, v-loading, or loading.service mask over an existing node is needed',
          'A short fullscreen wait before submit, save, or navigation',
        ],
        avoidWhen: ['布局已知、希望用占位块避免跳动', '进度可以量化', '只是按钮自己的 loading 状态'],
        avoidWhenEn: [
          'The layout is known and a placeholder should prevent jump',
          'Progress can be measured',
          'Only the button’s own loading state is needed',
        ],
      },
      {
        component: 'Skeleton',
        when: ['内容结构已知，用占位块表示即将出现的卡片、文本或列表', '仪表盘或详情初次进入'],
        whenEn: ['The content structure is known and placeholders stand in for cards, text, or lists', 'First paint of a dashboard or detail view'],
        avoidWhen: ['需要明确的“正在加载”遮罩', '进度可量化'],
        avoidWhenEn: ['An explicit loading mask is required', 'Progress can be measured'],
      },
      {
        component: 'ProgressBar',
        when: ['进度有百分比或可估算完成度', '上传、导入等长任务'],
        whenEn: ['Progress has a percentage or an estimated completion', 'Long tasks such as upload or import'],
        avoidWhen: ['不知道还要等多久', '只是挡住一块区域'],
        avoidWhenEn: ['Duration is unknown', 'The only goal is to cover a region'],
      },
      {
        component: 'ProgressSpinner',
        when: ['行内或控件旁需要一个很小的转圈，不盖住内容'],
        whenEn: ['A small inline spinner beside a control, without covering content'],
        avoidWhen: ['区域遮罩、全屏等待或带文案的加载态'],
        avoidWhenEn: ['A region mask, fullscreen wait, or loading state with a caption'],
      },
      {
        component: 'BlockUI',
        when: ['只需要阻止点击，不需要表达“正在加载”'],
        whenEn: ['Interaction should be blocked without saying that something is loading'],
        avoidWhen: ['用户需要知道正在等待结果'],
        avoidWhenEn: ['The user needs to know a result is still pending'],
      },
    ],
  },
  {
    id: 'status-label-choice',
    title: '如何选择状态与标签',
    titleEn: 'Choosing status, tag, chip, or badge',
    question: '这是行内业务状态、分类标签、可移除实体，还是挂在控件上的数量？',
    questionEn: 'Is this an inline business status, a category label, a removable entity, or a count on another control?',
    keywords: ['行内状态', '状态点', '角标', '徽章', '可关闭标签', '芯片', 'status', 'badge', 'chip', 'tag', 'closable'],
    options: [
      {
        component: 'Status',
        when: ['表格单元格或标题旁的业务状态', '需要圆点或语义图标加短文案'],
        whenEn: ['Business status in a table cell or beside a title', 'A dot or semantic icon plus a short label'],
        avoidWhen: ['可关闭的分类标签', '挂在按钮上的数字'],
        avoidWhenEn: ['A closable category label', 'A count attached to a button'],
      },
      {
        component: 'Tag',
        when: ['分类、筛选结果或可关闭标签', '需要比 Status 更像芯片的表面'],
        whenEn: ['A category, filter result, or closable label', 'A chip-like surface rather than an inline status'],
        avoidWhen: ['只是一行里的轻量状态', '带图片且代表一个可移除实体'],
        avoidWhenEn: ['A lightweight inline status', 'An entity with an image that can be removed'],
      },
      {
        component: 'Chip',
        when: ['短实体信息，可带图标、图片和移除'],
        whenEn: ['A short entity that may include an icon, image, and remove action'],
        avoidWhen: ['纯状态色点', '只是分类色块'],
        avoidWhenEn: ['A status dot only', 'A category color block only'],
      },
      {
        component: 'Badge',
        when: ['角标数量或圆点，附着在按钮、头像等控件上'],
        whenEn: ['A count or dot attached to a button, avatar, or other control'],
        avoidWhen: ['独立成行的状态文案'],
        avoidWhenEn: ['A standalone status sentence'],
      },
    ],
  },
  {
    id: 'empty-result-choice',
    title: '空态还是结果页',
    titleEn: 'Empty state vs result page',
    question: '这是没有数据，还是流程已经结束的成功、失败或 HTTP 状态？',
    questionEn: 'Is there simply no data, or has a flow ended in success, failure, or an HTTP status?',
    keywords: ['空状态', '无数据', '首次使用', '筛选无结果', '结果页', '404', '403', '500', 'empty', 'result'],
    options: [
      {
        component: 'Empty',
        when: ['列表没有行', '筛选没有命中', '首次使用，需要引导创建'],
        whenEn: ['A list has no rows', 'Filters matched nothing', 'First use, and the next step is to create something'],
        avoidWhen: ['接口失败', '无权限', '页面不存在', '提交成功回执'],
        avoidWhenEn: ['The request failed', 'Permission was denied', 'The page does not exist', 'A submit-success receipt'],
      },
      {
        component: 'Result',
        when: ['提交成功或失败的终点页', '403 / 404 / 500 等阻断状态', '需要明确的下一步（返回、重试、回首页）'],
        whenEn: ['A terminal success or failure page', 'A blocking 403 / 404 / 500 state', 'The next step must be explicit (back, retry, home)'],
        avoidWhen: ['正常的无数据', '表格内部的空行'],
        avoidWhenEn: ['A normal empty collection', 'The empty slot inside a table'],
      },
    ],
  },
  {
    id: 'action-menu-choice',
    title: '如何选择菜单',
    titleEn: 'Choosing a menu',
    question: '这是按钮上的操作项、侧栏导航、右键菜单，还是全局命令搜索？',
    questionEn: 'Is this an action menu on a trigger, sider navigation, a context menu, or a global command search?',
    keywords: ['动作菜单', '右键', '右键菜单', '命令面板', '导航菜单', 'context menu', 'command menu', 'menubar', '上下文菜单'],
    options: [
      {
        component: 'Dropdown',
        when: ['从按钮或图标打开一组操作', '编辑、删除、更多'],
        whenEn: ['Actions open from a button or icon', 'Edit, delete, or more'],
        avoidWhen: ['表单里选一个枚举值', '常驻侧栏导航'],
        avoidWhenEn: ['Choosing an enum in a form', 'Persistent sider navigation'],
      },
      {
        component: 'Menu',
        when: ['后台侧栏或页面内的常驻导航', '需要选中项与路由同步'],
        whenEn: ['Persistent navigation in an admin sider or page', 'Selection should stay in sync with the route'],
        avoidWhen: ['一次性操作菜单', '右键弹出'],
        avoidWhenEn: ['A one-shot action menu', 'A right-click popup'],
      },
      {
        component: 'ContextMenu',
        when: ['在指针位置弹出，通常由右键触发'],
        whenEn: ['The menu opens at the pointer, usually from a right-click'],
        avoidWhen: ['可见的导航', '表单选择'],
        avoidWhenEn: ['Visible navigation', 'Form selection'],
      },
      {
        component: 'CommandMenu',
        when: ['全局搜索命令或跳转', '键盘优先，例如 Cmd/Ctrl+K'],
        whenEn: ['Global command search or jump', 'Keyboard-first, such as Cmd/Ctrl+K'],
        avoidWhen: ['少量固定操作放在按钮旁即可'],
        avoidWhenEn: ['A few fixed actions fit next to a button'],
      },
      {
        component: 'Menubar',
        when: ['顶部应用菜单，项很多且分组'],
        whenEn: ['A top application menu with many grouped items'],
        avoidWhen: ['侧栏只有一层链接'],
        avoidWhenEn: ['The sider is a single level of links'],
      },
    ],
  },
]

export function findDecision(name: string): ComponentDecision | undefined {
  const key = name.trim().toLowerCase().replace(/[-_\s]/g, '')
  return componentDecisions.find((decision) => decision.id.replace(/[-_\s]/g, '') === key)
}

export function scoreDecision(decision: ComponentDecision, query: string): number {
  const normalized = query.toLowerCase().trim()
  return decision.keywords.reduce((score, keyword) => {
    const key = keyword.toLowerCase()
    if (normalized === key) return score + 100
    if (normalized.includes(key) || key.includes(normalized)) return score + 20
    return score
  }, 0)
}
