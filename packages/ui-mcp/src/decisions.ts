export interface ComponentDecisionRecipe {
  /** 3–8 critical props / usage notes (zh). Not a full API manual. */
  props: string[]
  propsEn: string[]
  slots?: string[]
  slotsEn?: string[]
  events?: string[]
  eventsEn?: string[]
}

export interface ComponentDecisionOption {
  component: string
  when: string[]
  whenEn: string[]
  avoidWhen: string[]
  avoidWhenEn: string[]
  recipe: ComponentDecisionRecipe
  antiPatterns: string[]
  antiPatternsEn: string[]
  /** Page-snippet ids to compose after choosing this option (composition-first). */
  relatedSnippets?: string[]
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

type Pair = [zh: string, en: string]

function recipe(props: Pair[], slots?: Pair[], events?: Pair[]): ComponentDecisionRecipe {
  const out: ComponentDecisionRecipe = {
    props: props.map(([zh]) => zh),
    propsEn: props.map(([, en]) => en),
  }
  if (slots?.length) {
    out.slots = slots.map(([zh]) => zh)
    out.slotsEn = slots.map(([, en]) => en)
  }
  if (events?.length) {
    out.events = events.map(([zh]) => zh)
    out.eventsEn = events.map(([, en]) => en)
  }
  return out
}

function anti(pairs: Pair[]): Pick<ComponentDecisionOption, 'antiPatterns' | 'antiPatternsEn'> {
  return {
    antiPatterns: pairs.map(([zh]) => zh),
    antiPatternsEn: pairs.map(([, en]) => en),
  }
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
        recipe: recipe(
          [
            ['v-model / modelValue 控制开关（不要用 visible）', 'v-model / modelValue for open state (not visible)'],
            ['header 或 title 设弹窗标题', 'header or title for the dialog title'],
            ['width 约 32rem 适配短表单（见 form-in-dialog snippet）', 'width ~32rem for short forms (see form-in-dialog snippet)'],
            ['表单字段用 fluid；主按钮 severity="primary"', 'Form fields use fluid; primary button severity="primary"'],
          ],
          [
            ['#footer 放取消/保存', '#footer for cancel / save'],
            ['默认插槽放 MForm + MFormItem', 'Default slot: MForm + MFormItem'],
          ],
          [
            ['@close 重置表单模型', '@close to reset the form model'],
            ['保存可用按钮 @click，或 MForm @submit + type="submit"', 'Save via button @click, or MForm @submit + type="submit"'],
          ],
        ),
        relatedSnippets: ['form-in-dialog', 'page-header-actions'],
        ...anti([
          ['用普通 Dialog 手写删除确认 → MConfirmDialog', 'Hand-rolled delete confirm in Dialog → MConfirmDialog'],
          ['长多分组配置塞进 Dialog → Form 页或 Drawer', 'Long multi-section config in Dialog → Form page or Drawer'],
        ]),
      },
      {
        component: 'Drawer',
        when: ['表单比 Dialog 更长但仍需对照列表', '详情+编辑侧滑'],
        whenEn: ['Form is longer than a dialog but list context matters', 'Detail plus edit in a side panel'],
        avoidWhen: ['字段极少的确认式录入'],
        avoidWhenEn: ['Tiny confirmation-style forms'],
        recipe: recipe(
          [
            ['v-model / modelValue 控制开关', 'v-model / modelValue for open state'],
            ['position 常用 right；较长表单可加大 size', 'position usually right; raise size for longer forms'],
            ['header 标明新建/编辑对象', 'header names the create/edit subject'],
            ['字段 fluid；底栏操作对齐 #footer', 'Fields fluid; actions in #footer'],
          ],
          [
            ['#footer 取消/保存', '#footer cancel / save'],
            ['默认插槽 MForm', 'Default slot: MForm'],
          ],
          [['@close 清理草稿', '@close to clear draft state']],
        ),
        relatedSnippets: ['form-in-drawer'],
        ...anti([
          ['极短 2–3 字段也用 Drawer → Dialog', 'Tiny 2–3 field form in Drawer → Dialog'],
          ['危险删除只用 Drawer 无确认 → MConfirmDialog', 'Destructive delete in Drawer without confirm → MConfirmDialog'],
        ]),
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
        recipe: recipe(
          [
            ['MPageContent width="narrow"', 'MPageContent width="narrow"'],
            ['MPageSection variant="form" 包表单主体', 'MPageSection variant="form" wraps the form body'],
            ['MPageSection variant="actions" 放底栏按钮', 'MPageSection variant="actions" for footer buttons'],
            ['字段 v-model + fluid；校验用 invalid / errorMessage', 'Fields v-model + fluid; validation via invalid / errorMessage'],
          ],
          [['默认插槽：MFormItem 字段', 'Default: MFormItem fields']],
          [
            ['MForm @submit（或 @submit.prevent）', 'MForm @submit (or @submit.prevent)'],
            ['提交按钮 type="submit" + severity="primary"', 'Submit button type="submit" + severity="primary"'],
          ],
        ),
        relatedSnippets: ['page-content-form', 'form-header', 'form-body', 'form-actions'],
        ...anti([
          ['列表短 CRUD 开独立路由 → form-in-dialog', 'Short list CRUD as a route → form-in-dialog'],
          ['表单外再套装饰性 MCard → 用 PageSection form', 'Extra decorative MCard around form → PageSection form'],
        ]),
      },
    ],
  },
  {
    id: 'overlay-choice',
    title: '如何选择浮层组件',
    titleEn: 'Choosing an overlay component',
    question: '这是确认、短任务、上下文操作，还是需要保留页面上下文的编辑？',
    questionEn: 'Is this a confirmation, short task, contextual action, or an edit that needs page context?',
    keywords: [
      '弹窗',
      '浮层',
      '模态',
      '侧栏',
      '确认',
      '编辑',
      'dialog',
      'drawer',
      'popover',
      'tooltip',
      'modal',
      'side editing',
      'side panel',
      'context',
    ],
    options: [
      {
        component: 'Dialog',
        when: [
          '需要用户聚焦完成一项短到中等任务',
          '列表页上的新建/编辑短表单（约 ≤8 个字段）',
          '内容不适合直接放在页面流中',
        ],
        whenEn: [
          'The user should focus on a short or medium-sized task',
          'Create/edit short forms launched from a list (~≤8 fields)',
          'Content should not interrupt the page flow',
        ],
        avoidWhen: ['内容接近完整多分组页面', '用户需要持续查看底层页面上下文且表单很长', '只是危险操作确认'],
        avoidWhenEn: [
          'The content is effectively a multi-section full page',
          'The user must continuously reference the underlying page and the form is long',
          'Only a destructive confirmation is needed',
        ],
        recipe: recipe(
          [
            ['v-model 控制可见', 'v-model for visibility'],
            ['header / title', 'header / title'],
            ['modal 默认阻塞；任务型内容放默认插槽', 'modal blocks by default; task content in default slot'],
            ['危险确认不要用 Dialog 冒充 → ConfirmDialog', 'Do not fake destructive confirm with Dialog → ConfirmDialog'],
          ],
          [['#footer 主/次操作', '#footer primary / secondary actions']],
          [['@close / @update:modelValue', '@close / @update:modelValue']],
        ),
        relatedSnippets: ['form-in-dialog'],
        ...anti([
          ['Dialog + 手写「确定删除」→ MConfirmDialog', 'Dialog + hand-rolled Delete? → MConfirmDialog'],
          ['v-model:visible → v-model / modelValue', 'v-model:visible → v-model / modelValue'],
        ]),
      },
      {
        component: 'Drawer',
        when: ['需要侧边编辑或查看详情', '需要保留底层列表或工作区上下文', '内容比普通确认框更长'],
        whenEn: [
          'Side editing or detail inspection is needed',
          'The underlying list or workspace context should remain visible',
          'The content is longer than a normal confirmation',
        ],
        avoidWhen: ['只是简单确认', '操作必须阻塞用户直到明确确认'],
        avoidWhenEn: ['It is only a simple confirmation', 'The action must block the user until an explicit decision'],
        recipe: recipe(
          [
            ['v-model', 'v-model'],
            ['position="right"（常用）', 'position="right" (typical)'],
            ['header 说明侧栏任务', 'header describes the side-panel job'],
          ],
          [['#footer 操作区', '#footer actions']],
          [['@close', '@close']],
        ),
        relatedSnippets: ['form-in-drawer'],
        ...anti([['简单 Yes/No 确认用 Drawer → ConfirmDialog / ConfirmPopup', 'Simple Yes/No in Drawer → ConfirmDialog / ConfirmPopup']]),
      },
      {
        component: 'Popover',
        when: ['轻量上下文操作或补充信息', '不需要阻塞页面', '内容与触发元素强相关'],
        whenEn: [
          'Lightweight contextual actions or supporting information',
          'The page should not be blocked',
          'The content is tightly related to the trigger',
        ],
        avoidWhen: ['需要复杂表单或危险操作确认'],
        avoidWhenEn: ['A complex form or destructive confirmation is required'],
        recipe: recipe(
          [
            ['v-model 或触发器控制显示', 'v-model or trigger-controlled visibility'],
            ['placement 相对触发元素', 'placement relative to the trigger'],
            ['内容保持短小', 'Keep content short'],
          ],
          [['默认插槽：轻量内容', 'Default slot: lightweight content']],
        ),
        ...anti([['复杂表单塞进 Popover → Dialog / Drawer', 'Complex form in Popover → Dialog / Drawer']]),
      },
      {
        component: 'Tooltip',
        when: ['只展示简短说明', '用户悬停或聚焦控件时需要补充提示'],
        whenEn: ['Only a short explanation is needed', 'Extra help is needed on hover or focus'],
        avoidWhen: ['信息是必需内容', '需要放置交互控件'],
        avoidWhenEn: ['The information is essential content', 'Interactive controls need to be placed inside'],
        recipe: recipe(
          [
            ['content 或默认插槽短文案', 'content or default slot short copy'],
            ['placement', 'placement'],
            ['包裹触发元素', 'Wrap the trigger element'],
          ],
        ),
        ...anti([['Tooltip 里放按钮/表单 → Popover / Dialog', 'Buttons/forms inside Tooltip → Popover / Dialog']]),
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
        whenEn: [
          'Data has a stable column structure',
          'Users need sorting, filtering, bulk actions, or row actions',
          'Many records must be compared at high density',
        ],
        avoidWhen: ['每条数据结构差异很大', '移动端无法承载横向列结构'],
        avoidWhenEn: ['Each record has a very different structure', 'A horizontal column layout cannot work on mobile'],
        recipe: recipe(
          [
            ['columns + rows（没有 data prop）', 'columns + rows (no data prop)'],
            ['row-key 默认 id；不稳定时显式指定', 'row-key defaults to id; set explicitly when needed'],
            ['全视口主列表可 MPageContent fill + MTable fill；嵌入/短页跳过', 'Full-viewport main lists may use fill; skip for embedded/short pages'],
            ['分页：paginator + rows-per-page 或 v-model:page', 'Paging: paginator + rows-per-page or v-model:page'],
            ['行选择：selectionMode + v-model:selection', 'Row select: selectionMode + v-model:selection'],
          ],
          [
            ['#cell-{key} 自定义单元格', '#cell-{key} custom cells'],
            ['#empty 放 MEmpty', '#empty with MEmpty'],
          ],
        ),
        ...anti([
          [':data → :rows', ':data → :rows'],
          ['手写 <table> → MTable', 'Hand-rolled <table> → MTable'],
          ['嵌入表硬套 fill → 去掉 fill', 'Forced fill on embedded table → remove fill'],
        ]),
      },
      {
        component: 'DataView',
        when: ['数据适合卡片或自定义列表项', '视觉浏览比列对齐更重要', '同一数据需要切换多种展示布局'],
        whenEn: [
          'Data fits cards or custom list items',
          'Visual browsing matters more than column alignment',
          'The same data needs multiple presentation layouts',
        ],
        avoidWhen: ['用户必须精确比较字段', '需要复杂列级排序或固定列'],
        avoidWhenEn: ['Users must compare fields precisely', 'Complex column sorting or frozen columns are required'],
        recipe: recipe(
          [
            ['value / 数据源按文档绑定', 'Bind value / data source per docs'],
            ['layout 切换列表/网格等', 'layout switches list/grid etc.'],
            ['分页与空态按文档配置', 'Configure paging and empty per docs'],
          ],
          [['#list / #grid 等项模板', '#list / #grid item templates']],
        ),
        ...anti([['需要列对齐比较仍用 DataView → Table', 'Need column compare but used DataView → Table']]),
      },
      {
        component: 'TreeTable',
        when: ['数据同时具有表格列和父子层级', '用户需要展开、收起层级节点'],
        whenEn: [
          'Data has both table columns and parent-child hierarchy',
          'Users need to expand and collapse hierarchy nodes',
        ],
        avoidWhen: ['数据没有真实层级关系', '普通 Table 已能表达关系'],
        avoidWhenEn: ['There is no real hierarchy', 'A regular Table already expresses the relationship'],
        recipe: recipe(
          [
            ['columns + 带 children 的行数据', 'columns + rows with children'],
            ['展开相关 prop 按文档（expandedKeys 等）', 'Expansion props per docs (expandedKeys etc.)'],
            ['row-key 稳定', 'Stable row-key'],
          ],
          [['#cell-{key}', '#cell-{key}']],
        ),
        ...anti([['无层级硬用 TreeTable → Table', 'No hierarchy but TreeTable → Table']]),
      },
      {
        component: 'Tree',
        when: ['主要任务是浏览或选择层级节点', '节点信息不需要多列比较'],
        whenEn: [
          'The main task is browsing or selecting hierarchy nodes',
          'Nodes do not need multi-column comparison',
        ],
        avoidWhen: ['每行需要展示多个可比较字段'],
        avoidWhenEn: ['Each row needs several comparable fields'],
        recipe: recipe(
          [
            [':value / value 树节点数据', ':value / value tree nodes'],
            ['selectionMode 单选/多选', 'selectionMode single/multiple'],
            ['v-model:selectionKeys 或文档等价绑定', 'v-model:selectionKeys or documented equivalent'],
          ],
        ),
        ...anti([['表单里选组织树 → 优先 TreeSelect', 'Picking org tree in a form → prefer TreeSelect']]),
      },
    ],
  },
  {
    id: 'selection-choice',
    title: '如何选择选择器',
    titleEn: 'Choosing a selection control',
    question: '选项是平面少量、层级结构、多选标签，还是需要输入搜索？',
    questionEn: 'Are options a small flat set, a hierarchy, multi-select tags, or searchable input?',
    keywords: [
      '选择',
      '下拉',
      '多选',
      '树选择',
      '搜索选择',
      '级联',
      '列表选择',
      '按钮组',
      'select',
      'treeselect',
      'autocomplete',
      'cascadeselect',
      'listbox',
      'selectbutton',
      'radio',
      'dropdown',
    ],
    options: [
      {
        component: 'Select',
        when: ['平面选项数量中等', '需要单选或多选', '表单字段需要明确选项集合'],
        whenEn: [
          'The options are a medium-sized flat set',
          'Single or multiple selection is needed',
          'The form needs a defined option set',
        ],
        avoidWhen: ['选项有明显层级', '用户需要输入自由文本并搜索建议'],
        avoidWhenEn: ['Options have a meaningful hierarchy', 'Users need free text with suggestions'],
        recipe: recipe(
          [
            ['v-model', 'v-model'],
            [':options 选项数组', ':options array'],
            ['表单内 fluid；可 clearable（或 showClear）', 'In forms: fluid; clearable (or showClear)'],
            ['多选按文档 multiple', 'multiple per docs when needed'],
          ],
          undefined,
          [['@change / @update:modelValue', '@change / @update:modelValue']],
        ),
        ...anti([
          ['MDropdown 当枚举选择 → MSelect', 'MDropdown as enum picker → MSelect'],
          ['层级数据用 Select → TreeSelect / CascadeSelect', 'Hierarchical data in Select → TreeSelect / CascadeSelect'],
        ]),
      },
      {
        component: 'TreeSelect',
        when: ['选项有父子层级', '用户需要按组织、分类或资源树选择'],
        whenEn: [
          'Options have parent-child hierarchy',
          'Users select from organizations, categories, or resource trees',
        ],
        avoidWhen: ['选项只是简单平面枚举'],
        avoidWhenEn: ['Options are a simple flat enum'],
        recipe: recipe(
          [
            ['v-model', 'v-model'],
            [':options 树形数据', ':options tree data'],
            ['fluid；selectionMode 按需', 'fluid; selectionMode as needed'],
          ],
        ),
        ...anti([['平面枚举用 TreeSelect → Select', 'Flat enum with TreeSelect → Select']]),
      },
      {
        component: 'AutoComplete',
        when: ['用户需要输入关键词搜索建议', '候选项很多或来自远程接口', '输入值本身也有意义'],
        whenEn: [
          'Users type keywords to search suggestions',
          'There are many or remote candidates',
          'The entered value is meaningful itself',
        ],
        avoidWhen: ['用户只能从固定枚举中选择', '不应该允许自由输入'],
        avoidWhenEn: ['Users must choose from a fixed enum', 'Free input must not be allowed'],
        recipe: recipe(
          [
            ['v-model', 'v-model'],
            ['suggestions / 远程加载按文档', 'suggestions / remote load per docs'],
            ['fluid', 'fluid'],
          ],
          undefined,
          [['@complete 拉取建议', '@complete to fetch suggestions']],
        ),
        ...anti([['固定枚举却允许自由输入 → Select', 'Fixed enum allowing free text → Select']]),
      },
      {
        component: 'SelectButton',
        when: ['选项很少且需要全部露出', '单选或多选都适合按钮组'],
        whenEn: [
          'Only a few options, and all of them should stay visible',
          'Single or multiple selection works as a button group',
        ],
        avoidWhen: ['选项超过大约 5 个', '选项很长或来自远程搜索'],
        avoidWhenEn: ['More than about five options', 'Labels are long or options come from remote search'],
        recipe: recipe(
          [
            ['v-model', 'v-model'],
            [':options', ':options'],
            ['选项文案保持短', 'Keep option labels short'],
          ],
        ),
        ...anti([['>5 个选项仍用 SelectButton → Select', '>5 options still SelectButton → Select']]),
      },
      {
        component: 'Radio',
        when: ['少量互斥选项需要和表单文案一起阅读', '一次只能选一个'],
        whenEn: [
          'A few mutually exclusive options should be read with the form copy',
          'Only one value can be selected',
        ],
        avoidWhen: ['多选', '选项很多需要收进弹出层'],
        avoidWhenEn: ['Multiple selection', 'Too many options for an always-visible list'],
        recipe: recipe(
          [
            ['MRadioGroup v-model', 'MRadioGroup v-model'],
            ['各 MRadio value', 'Each MRadio value'],
            ['与 MFormItem 一起用', 'Use with MFormItem'],
          ],
        ),
        ...anti([['多选需求用 Radio → Checkbox / Select multiple', 'Need multi-select but Radio → Checkbox / Select multiple']]),
      },
      {
        component: 'Listbox',
        when: ['选项需要始终以列表展示', '可筛选，但不希望收成下拉框'],
        whenEn: [
          'Options should stay visible as a list',
          'Filtering is useful, but a collapsed dropdown is not',
        ],
        avoidWhen: ['页面空间紧、只需要一个闭合的选择框'],
        avoidWhenEn: ['Space is tight and a closed select is enough'],
        recipe: recipe(
          [
            ['v-model', 'v-model'],
            [':options', ':options'],
            ['filter 按需开启', 'filter when needed'],
          ],
        ),
        ...anti([['空间紧仍用 Listbox → Select', 'Tight space but Listbox → Select']]),
      },
      {
        component: 'CascadeSelect',
        when: ['值要按多级分栏逐级点选', '层级是路径而不是可勾选的树'],
        whenEn: [
          'The value is chosen column by column through levels',
          'The hierarchy is a path, not a checkable tree',
        ],
        avoidWhen: ['需要勾选树节点或搜索整棵树'],
        avoidWhenEn: ['Users need to check tree nodes or search the whole tree'],
        recipe: recipe(
          [
            ['v-model', 'v-model'],
            [':options 级联数据', ':options cascade data'],
            ['fluid', 'fluid'],
          ],
        ),
        ...anti([['可勾选树节点用 CascadeSelect → TreeSelect', 'Checkable tree nodes with CascadeSelect → TreeSelect']]),
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
        whenEn: [
          'The content is an independent business section',
          'A title, subtitle, footer, or hover surface is useful',
          'A clear boundary and padding are needed',
        ],
        avoidWhen: ['页面已有过多嵌套表面', '内容只是简单分组', '列表表格外层'],
        avoidWhenEn: [
          'The page already has too many nested surfaces',
          'The content is only a simple group',
          'Wrapping a list table',
        ],
        recipe: recipe(
          [
            ['title / subtitle 按需', 'title / subtitle as needed'],
            ['shadow="always"|"hover"|"never"', 'shadow="always"|"hover"|"never"'],
            ['仪表盘图表区可用 shadow="always"', 'Dashboard chart areas may use shadow="always"'],
          ],
          [
            ['#header / #footer / #title 按需', '#header / #footer / #title as needed'],
            ['默认插槽正文', 'Default slot body'],
          ],
        ),
        ...anti([
          ['MPageFilters / MTable 外再套 MCard → 去掉外层 Card', 'MCard around MPageFilters / MTable → remove outer Card'],
          ['表单主体用 Card 叠 PageSection form → 只用 PageSection', 'Card + PageSection form stack → PageSection only'],
        ]),
      },
      {
        component: 'Panel',
        when: ['需要可折叠或强调一个较长内容区块', '内容具有明确的面板标题'],
        whenEn: [
          'A collapsible or prominent longer section is needed',
          'The content has a clear panel heading',
        ],
        avoidWhen: ['只需要普通内容容器', '标题和边界会增加视觉噪音'],
        avoidWhenEn: ['A regular content container is enough', 'A heading and boundary would add visual noise'],
        recipe: recipe(
          [
            ['header 面板标题', 'header panel title'],
            ['toggleable 可折叠时开启', 'toggleable when collapsible'],
            ['collapsed / v-model:collapsed 按文档', 'collapsed / v-model:collapsed per docs'],
          ],
        ),
        ...anti([['装饰性折叠用不必要的 Panel → Card 或纯布局', 'Decorative Panel → Card or plain layout']]),
      },
      {
        component: 'Fieldset',
        when: ['需要语义化分组相关表单字段', '分组标题对理解表单很重要'],
        whenEn: [
          'Related form fields need semantic grouping',
          'A group title is important for understanding the form',
        ],
        avoidWhen: ['内容不是表单字段', '只是为了增加装饰边框'],
        avoidWhenEn: ['The content is not form fields', 'The border would be purely decorative'],
        recipe: recipe(
          [
            ['legend / 标题文案', 'legend / title copy'],
            ['内放 MFormItem 字段', 'Place MFormItem fields inside'],
            ['勿用于非表单装饰框', 'Do not use as a non-form decorative box'],
          ],
        ),
        ...anti([['非表单内容用 Fieldset → Card / PageSection', 'Non-form content in Fieldset → Card / PageSection']]),
      },
    ],
  },
  {
    id: 'layout-spacing-choice',
    title: '如何选择页面间距组件',
    titleEn: 'Choosing page spacing/layout components',
    question: '控件组、页面区块、栅格之间需要哪种间距与对齐方式？',
    questionEn: 'What kind of spacing and alignment is needed between controls, page sections, or grid areas?',
    keywords: [
      '间距',
      '布局',
      'gap',
      'flex',
      'space',
      'page',
      'toolbar',
      'filters',
      'spacing',
      'layout',
      'stack',
    ],
    options: [
      {
        component: 'PageContent',
        when: ['页面主内容区需要统一的 padding 和垂直 gap', '列表/表单/仪表盘区块纵向堆叠'],
        whenEn: [
          'The main content area needs consistent padding and vertical gap',
          'List, form, or dashboard sections stack vertically',
        ],
        avoidWhen: ['只是两个按钮之间的水平间距'],
        avoidWhenEn: ['Only horizontal spacing between two buttons is needed'],
        recipe: recipe(
          [
            ['默认包裹列表/表单主列', 'Default wrapper for list/form main column'],
            ['表单页 width="narrow"', 'Form pages: width="narrow"'],
            ['bands 默认即可；勿再套多余 padding 容器', 'Default bands; avoid extra padding wrappers'],
          ],
        ),
        ...anti([['按钮间距用 PageContent → Space / Flex', 'Button spacing via PageContent → Space / Flex']]),
      },
      {
        component: 'Flex',
        when: ['同一行控件需要 gap 和对齐', '工具栏内操作组、筛选控件组'],
        whenEn: [
          'Controls on one row need gap and alignment',
          'Toolbar action groups or filter control rows',
        ],
        avoidWhen: ['整个页面区块的 padding 和垂直 rhythm'],
        avoidWhenEn: ['Padding and vertical rhythm for whole page sections'],
        recipe: recipe(
          [
            ['gap / align / justify 按需（或等价 class/prop）', 'gap / align / justify as needed'],
            ['筛选行、工具栏内组优先 Flex', 'Prefer Flex for filter rows and toolbar groups'],
            ['不要用 Flex 代替 PageContent 的页面 padding', 'Do not replace PageContent page padding with Flex'],
          ],
        ),
        ...anti([['整页垂直节奏用 Flex → PageContent', 'Whole-page vertical rhythm via Flex → PageContent']]),
      },
      {
        component: 'Space',
        when: ['简单 wrap 控件组且不需要 justify 语义', '表格行内操作按钮组'],
        whenEn: [
          'A simple wrapped control group without justify semantics',
          'Inline row action button groups',
        ],
        avoidWhen: ['页面级标题与主操作两端对齐'],
        avoidWhenEn: ['Page-level title and primary action need space-between alignment'],
        recipe: recipe(
          [
            ['包裹 MButton 组', 'Wrap MButton groups'],
            ['行内操作常用 size="small" text 按钮', 'Row actions often size="small" text buttons'],
            ['Dialog #footer 内可用 Space + justify-content:flex-end', 'In Dialog #footer: Space + justify-content:flex-end'],
          ],
        ),
        ...anti([['标题与主按钮两端对齐只用 Space → PageToolbar / Flex justify', 'Title/actions space-between via Space alone → PageToolbar / Flex']]),
      },
      {
        component: 'Grid',
        when: ['KPI 卡片、仪表盘双栏、响应式列布局'],
        whenEn: ['KPI cards, dashboard two-column layouts, responsive columns'],
        avoidWhen: ['单个筛选行或表单字段列'],
        avoidWhenEn: ['A single filter row or form field column'],
        recipe: recipe(
          [
            ['列数用文档 columns / 响应式配置', 'Column count via docs columns / responsive config'],
            ['KPI：Grid + MPageStat', 'KPIs: Grid + MPageStat'],
            ['gap 走 token，勿写裸 px', 'gap via tokens; no raw px'],
          ],
        ),
        ...anti([['筛选行用 Grid → Flex / PageFilters', 'Filter row via Grid → Flex / PageFilters']]),
      },
    ],
  },
  {
    id: 'page-section-choice',
    title: '如何选择页面区块组件',
    titleEn: 'Choosing page section components',
    question: '这是筛选区、标题区、表单表面、KPI 还是图表占位？',
    questionEn: 'Is this a filter bar, page header, form surface, KPI metric, or chart placeholder?',
    keywords: [
      '筛选',
      '工具栏',
      '标题',
      '表单',
      'kpi',
      '占位',
      'page filters',
      'toolbar',
      'header',
      'stat',
      'placeholder',
    ],
    options: [
      {
        component: 'PageFilters',
        when: ['列表页或搜索页的筛选/查询区域', '需要统一浅色背景与边框'],
        whenEn: ['Filter or search region on list pages', 'A consistent muted background and border is needed'],
        avoidWhen: ['普通表单字段分组', 'KPI 指标展示'],
        avoidWhenEn: ['Regular form field grouping', 'KPI metric display'],
        recipe: recipe(
          [
            ['内放 MInput / MSelect；同行用 MSpace wrap', 'Place MInput / MSelect inside; peers in MSpace wrap'],
            ['查询/重置放 #actions（与折叠切换同列）', 'Query/reset in #actions (trailing with toggle)'],
            ['默认 variant="filled"；dense craft 用 plain + size="small"', 'Default variant="filled"; dense craft: plain + size="small"'],
            ['有次要条件：collapsible + v-model:expanded + #advanced', 'Secondary fields: collapsible + v-model:expanded + #advanced'],
            ['toggle 默认「高级筛选/收起」+ chevron；已选用 FilterChips', 'Toggle defaults to Advanced/Collapse + chevron; active via FilterChips'],
          ],
          [
            ['#actions 查询/重置', '#actions for query / reset'],
            ['#advanced 高级筛选', '#advanced for advanced filters'],
            ['#active 可选；更常见是下方 FilterChips', '#active optional; sibling FilterChips is more common'],
          ],
        ),
        relatedSnippets: [
          'list-filters-stack',
          'list-filters',
          'list-filters-collapsible',
          'list-filter-chips',
          'list-filters-dense',
        ],
        ...anti([
          ['表单字段组用 PageFilters → PageSection form / Fieldset', 'Form field groups via PageFilters → PageSection form / Fieldset'],
          ['手写已选条 → list-filter-chips / list-filters-stack', 'Hand-rolled active bar → list-filter-chips / list-filters-stack'],
        ]),
      },
      {
        component: 'PageToolbar',
        when: ['页面标题 + 右侧主操作', '列表页新建按钮区域'],
        whenEn: ['Page title plus primary actions on the right', 'Create button area on list pages'],
        avoidWhen: ['带长描述的表单引导区'],
        avoidWhenEn: ['Form intro areas with long descriptions'],
        recipe: recipe(
          [
            ['左侧标题、右侧主按钮', 'Title left, primary action right'],
            ['主按钮 severity="primary"；全页仅一个主按钮', 'Primary button severity="primary"; one primary per page'],
            ['批量操作条也可放工具栏区', 'Bulk action bars can sit in the toolbar area'],
          ],
          [['#actions 右侧操作', '#actions for right-side actions']],
        ),
        ...anti([['需要长描述仍用 Toolbar → PageHeader', 'Long description but Toolbar → PageHeader']]),
      },
      {
        component: 'PageHeader',
        when: ['页面标题 + 描述文案', '表单页/详情页引导'],
        whenEn: ['Page title plus descriptive copy', 'Form or detail page intros'],
        avoidWhen: ['只有标题和单个主按钮的列表工具栏'],
        avoidWhenEn: ['List toolbars with only a title and one primary button'],
        recipe: recipe(
          [
            ['title + description', 'title + description'],
            ['详情可用 #breadcrumb / #tags（放 MStatus）', 'Detail: #breadcrumb / #tags (MStatus)'],
            ['列表页仅标题+新建时优先 PageToolbar', 'List title+create only → prefer PageToolbar'],
          ],
          [
            ['#breadcrumb', '#breadcrumb'],
            ['#tags / #actions', '#tags / #actions'],
          ],
        ),
        ...anti([['纯列表标题+新建仍用 Header → PageToolbar', 'List title+create still Header → PageToolbar']]),
      },
      {
        component: 'PageSection',
        when: ['表单主体表面 (variant="form")', '底栏操作区 (variant="actions")'],
        whenEn: ['Form body surface (variant="form")', 'Footer actions (variant="actions")'],
        avoidWhen: ['列表页筛选区', 'KPI 卡片'],
        avoidWhenEn: ['List page filter areas', 'KPI cards'],
        recipe: recipe(
          [
            ['variant="form" 表单主体', 'variant="form" form body'],
            ['variant="actions" 底栏', 'variant="actions" footer bar'],
            ['可选 title 分组', 'Optional title for grouping'],
          ],
        ),
        ...anti([['variant="form" 外再套 MCard → 双边框', 'MCard outside variant="form" → double border']]),
      },
      {
        component: 'PageStat',
        when: ['仪表盘 KPI 单指标卡', '需要 label/value/trend/icon 结构'],
        whenEn: ['Dashboard KPI cards', 'Needs label/value/trend/icon structure'],
        avoidWhen: ['普通内容分组', '表格或表单'],
        avoidWhenEn: ['Generic content grouping', 'Tables or forms'],
        recipe: recipe(
          [
            ['label + value', 'label + value'],
            ['trend / trendSeverity / trendDirection 按需', 'trend / trendSeverity / trendDirection as needed'],
            ['loading 骨架；layout card|plain', 'loading skeleton; layout card|plain'],
          ],
        ),
        ...anti([['普通段落用 PageStat → 文案或 Card', 'Paragraph as PageStat → copy or Card']]),
      },
      {
        component: 'PagePlaceholder',
        when: ['图表、地图或媒体区域尚未接入', '需要 dashed 占位表面'],
        whenEn: ['Charts, maps, or media areas are not wired yet', 'A dashed placeholder surface is needed'],
        avoidWhen: ['真实数据表格或表单'],
        avoidWhenEn: ['Real data tables or forms'],
        recipe: recipe(
          [
            ['description 说明待接入内容', 'description explains pending content'],
            ['可配合 MEmpty 于 Card 内（仪表盘图表区）', 'Or MEmpty inside MCard for dashboard charts'],
            ['minHeight 避免占位塌缩', 'minHeight avoids collapsed placeholders'],
          ],
        ),
        ...anti([['真实表格用 Placeholder → MTable', 'Real table via Placeholder → MTable']]),
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
        avoidWhenEn: [
          'Small regions inside a single card',
          'Dialog/Drawer bodies where apps control scrolling',
        ],
        recipe: recipe(
          [
            ['MLayout fill-viewport（或 :fill-viewport="true"）', 'MLayout fill-viewport (or :fill-viewport="true")'],
            ['内容放 MLayoutContent', 'Content in MLayoutContent'],
            ['是否再 fill 表格：见下方「MPageContent fill + MTable fill」判断', 'Whether to fill the table: see “MPageContent fill + MTable fill” below'],
            ['侧栏用 MLayoutSider + MMenu，不是随便一个 Drawer', 'Sider: MLayoutSider + MMenu, not a random Drawer'],
          ],
        ),
        ...anti([['在 Layout 外再包一层 100vh 滚动 → 去掉', 'Extra 100vh scroll wrapper outside Layout → remove']]),
      },
      {
        component: 'MPageContent fill + MTable fill',
        when: [
          '全视口后台列表，页面主任务就是浏览一张表',
          '内容高度表格会留下大块空白、分页悬在中间不好看',
          '希望只有表体滚动、分页贴在页面最下方',
        ],
        whenEn: [
          'Full-viewport admin list whose main job is browsing one table',
          'A content-sized table would leave a large empty band with mid-page pagination',
          'Only the table body should scroll; pagination should stay at the page bottom',
        ],
        avoidWhen: [
          '仪表盘/详情里的嵌入小表',
          '内容本身很短、内容高度即可',
          '整页应作为文档滚动（长筛选+说明+表格）',
          'Dialog / Drawer 内表格',
        ],
        avoidWhenEn: [
          'Embedded tables on dashboards or detail pages',
          'Short content where a content-sized table is fine',
          'Whole page should scroll as a document',
          'Tables inside Dialog / Drawer',
        ],
        recipe: recipe(
          [
            ['先判断是否适合 fill，再写 MPageContent fill + MTable fill', 'Decide fill first, then MPageContent fill + MTable fill'],
            ['paginator 或同级 MPagination', 'paginator or sibling MPagination'],
            ['适合时不要手写 min-height / calc', 'When fill fits, do not hand-write min-height / calc'],
          ],
        ),
        ...anti([
          ['嵌入/短页硬套 fill → 去掉', 'Forced fill on embedded/short page → remove'],
          ['适合 fill 却手写 calc → 改用 fill', 'Hand-written calc when fill fits → use fill'],
        ]),
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
        recipe: recipe(
          [
            ['显式限高后包裹内容', 'Wrap content after an explicit max-height'],
            ['只包业务自有滚动区', 'Only wrap app-owned scroll regions'],
            ['不要叠两层滚动', 'Do not nest two scroll containers'],
          ],
        ),
        ...anti([['MTable 外包 MScrollbar → 去掉外层', 'MScrollbar around MTable → remove outer']]),
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
        recipe: recipe(
          [
            ['信任组件内置滚动，不再包一层', 'Trust built-in scroll; no extra wrapper'],
            ['Table / LayoutContent 直接用', 'Use Table / LayoutContent directly'],
            ['菜单/Select 弹出层也不要外包滚动', 'Do not wrap menu/Select popups either'],
          ],
        ),
        ...anti([['双重滚动条 → 去掉业务包装层', 'Double scrollbars → remove app wrapper']]),
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
        recipe: recipe(
          [
            ['MPageContent > MPageFilters + MTable', 'MPageContent > MPageFilters + MTable'],
            ['表格直接放 PageContent，不套 Card', 'Table directly under PageContent, no Card'],
            ['高度：全视口主列表再考虑 fill；嵌入/短页跳过', 'Height: consider fill only for full-viewport main lists'],
            ['空态用 Table #empty + MEmpty', 'Empty: Table #empty + MEmpty'],
          ],
        ),
        ...anti([
          ['Table 外包 MCard → 去掉 Card', 'MCard around Table → remove Card'],
          ['嵌入表硬套 fill → 去掉 fill', 'Forced fill on embedded table → remove fill'],
        ]),
      },
      {
        component: 'MCard',
        when: ['仪表盘中的图表区/明细区', '需要 card 标题的内容模块'],
        whenEn: ['Chart or detail areas on dashboards', 'Content modules that need a card title'],
        avoidWhen: ['列表页表格外层', '筛选区外层'],
        avoidWhenEn: ['Wrapping list page tables', 'Wrapping filter regions'],
        recipe: recipe(
          [
            ['title + 正文；图表待接入可用 MEmpty', 'title + body; pending charts may use MEmpty'],
            ['shadow 按仪表盘需要选择', 'Choose shadow for dashboard needs'],
            ['仅用于需要独立标题的模块', 'Only for modules that need their own title'],
          ],
        ),
        ...anti([['列表筛选区套 Card → PageFilters 自带边界', 'Card around filters → PageFilters has its own border']]),
      },
      {
        component: 'PageSection',
        when: ['表单页主体或 actions 底栏', '需要统一 form surface'],
        whenEn: ['Form page bodies or action footers', 'A unified form surface is needed'],
        avoidWhen: ['再套 MCard variant form 导致双边框'],
        avoidWhenEn: ['Wrapping again with MCard and causing double borders'],
        recipe: recipe(
          [
            ['variant="form" / variant="actions"', 'variant="form" / variant="actions"'],
            ['不要再外包 MCard', 'Do not wrap another MCard'],
            ['表单字段放 form 段，按钮放 actions 段', 'Fields in form section; buttons in actions section'],
          ],
        ),
        ...anti([['PageSection form + MCard → 只留 PageSection', 'PageSection form + MCard → PageSection only']]),
      },
    ],
  },
  {
    id: 'loading-choice',
    title: '如何选择加载反馈',
    titleEn: 'Choosing a loading indicator',
    question: '这是区域或全屏等待、已知布局的占位、可量化进度，还是只需要阻止交互？',
    questionEn:
      'Is this a region or fullscreen wait, a placeholder for a known layout, measurable progress, or interaction blocking without a loading message?',
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
        recipe: recipe(
          [
            ['包裹内容：MLoading :loading="…" 或 v-loading', 'Wrap content: MLoading :loading or v-loading'],
            ['全屏：fullscreen / loading.service', 'Fullscreen: fullscreen / loading.service'],
            ['按钮等待用 Button loading，不要盖整表', 'Button waits: Button loading, not a full-form mask'],
          ],
        ),
        ...anti([
          ['区域遮罩用 ProgressSpinner → Loading / v-loading', 'Region mask via ProgressSpinner → Loading / v-loading'],
          ['按钮转圈用整页 Loading → Button :loading', 'Full-page Loading for button wait → Button :loading'],
        ]),
      },
      {
        component: 'Skeleton',
        when: ['内容结构已知，用占位块表示即将出现的卡片、文本或列表', '仪表盘或详情初次进入'],
        whenEn: [
          'The content structure is known and placeholders stand in for cards, text, or lists',
          'First paint of a dashboard or detail view',
        ],
        avoidWhen: ['需要明确的“正在加载”遮罩', '进度可量化'],
        avoidWhenEn: ['An explicit loading mask is required', 'Progress can be measured'],
        recipe: recipe(
          [
            ['shape rectangle|circle；text + repeat 模拟多行', 'shape rectangle|circle; text + repeat for lines'],
            ['width / height 贴近最终布局', 'width / height close to final layout'],
            ['PageStat 可用自带 loading', 'PageStat has its own loading'],
          ],
        ),
        ...anti([['未知时长又要文案遮罩 → Loading', 'Unknown wait needing caption mask → Loading']]),
      },
      {
        component: 'ProgressBar',
        when: ['进度有百分比或可估算完成度', '上传、导入等长任务'],
        whenEn: [
          'Progress has a percentage or an estimated completion',
          'Long tasks such as upload or import',
        ],
        avoidWhen: ['不知道还要等多久', '只是挡住一块区域'],
        avoidWhenEn: ['Duration is unknown', 'The only goal is to cover a region'],
        recipe: recipe(
          [
            ['value 0–100（或文档等价）', 'value 0–100 (or docs equivalent)'],
            ['显示百分比文案', 'Show percent label'],
            ['上传/导入长任务优先', 'Prefer for upload/import long tasks'],
          ],
        ),
        ...anti([['未知进度用 ProgressBar → Loading', 'Unknown progress via ProgressBar → Loading']]),
      },
      {
        component: 'ProgressSpinner',
        when: ['行内或控件旁需要一个很小的转圈，不盖住内容'],
        whenEn: ['A small inline spinner beside a control, without covering content'],
        avoidWhen: ['区域遮罩、全屏等待或带文案的加载态'],
        avoidWhenEn: ['A region mask, fullscreen wait, or loading state with a caption'],
        recipe: recipe(
          [
            ['仅作行内指示', 'Inline indicator only'],
            ['尺寸保持小', 'Keep size small'],
            ['不要盖住整块区域', 'Do not cover a whole region'],
          ],
        ),
        ...anti([['当页面遮罩用 Spinner → Loading', 'Spinner as page mask → Loading']]),
      },
      {
        component: 'BlockUI',
        when: ['只需要阻止点击，不需要表达“正在加载”'],
        whenEn: ['Interaction should be blocked without saying that something is loading'],
        avoidWhen: ['用户需要知道正在等待结果'],
        avoidWhenEn: ['The user needs to know a result is still pending'],
        recipe: recipe(
          [
            ['blocked 控制遮罩', 'blocked toggles the mask'],
            ['包裹需要禁用的区域', 'Wrap the region to disable'],
            ['无加载文案时用，有文案改 Loading', 'Use when no loading caption; otherwise Loading'],
          ],
        ),
        ...anti([['需要“加载中”文案仍用 BlockUI → Loading', 'Need loading caption but BlockUI → Loading']]),
      },
    ],
  },
  {
    id: 'status-label-choice',
    title: '如何选择状态与标签',
    titleEn: 'Choosing status, tag, chip, or badge',
    question: '这是行内业务状态、分类标签、可移除实体，还是挂在控件上的数量？',
    questionEn: 'Is this an inline business status, a category label, a removable entity, or a count on another control?',
    keywords: [
      '行内状态',
      '状态点',
      '角标',
      '徽章',
      '可关闭标签',
      '芯片',
      'status',
      'badge',
      'chip',
      'tag',
      'closable',
    ],
    options: [
      {
        component: 'Status',
        when: ['表格单元格或标题旁的业务状态', '需要圆点或语义图标加短文案'],
        whenEn: [
          'Business status in a table cell or beside a title',
          'A dot or semantic icon plus a short label',
        ],
        avoidWhen: ['可关闭的分类标签', '挂在按钮上的数字'],
        avoidWhenEn: ['A closable category label', 'A count attached to a button'],
        recipe: recipe(
          [
            ['label + severity', 'label + severity'],
            ['variant 默认 dot；可用 tag|text', 'variant default dot; or tag|text'],
            ['表格状态列优先 MStatus，不要一排实心 Tag', 'Prefer MStatus in table status columns over solid Tags'],
          ],
        ),
        ...anti([['可关闭分类用 Status → Tag closable', 'Closable category via Status → Tag closable']]),
      },
      {
        component: 'Tag',
        when: ['分类、筛选结果或可关闭标签', '需要比 Status 更像芯片的表面'],
        whenEn: [
          'A category, filter result, or closable label',
          'A chip-like surface rather than an inline status',
        ],
        avoidWhen: ['只是一行里的轻量状态', '带图片且代表一个可移除实体'],
        avoidWhenEn: ['A lightweight inline status', 'An entity with an image that can be removed'],
        recipe: recipe(
          [
            ['value 或默认插槽文案', 'value or default-slot copy'],
            ['severity；closable + @close', 'severity; closable + @close'],
            ['rounded / bordered 按需', 'rounded / bordered as needed'],
          ],
          undefined,
          [['@close', '@close']],
        ),
        ...anti([['行内启用/停用状态用 Tag → Status', 'Enabled/disabled inline via Tag → Status']]),
      },
      {
        component: 'Chip',
        when: ['短实体信息，可带图标、图片和移除'],
        whenEn: ['A short entity that may include an icon, image, and remove action'],
        avoidWhen: ['纯状态色点', '只是分类色块'],
        avoidWhenEn: ['A status dot only', 'A category color block only'],
        recipe: recipe(
          [
            ['label；icon 或 image', 'label; icon or image'],
            ['removable + @remove', 'removable + @remove'],
            ['severity 按需', 'severity as needed'],
          ],
          undefined,
          [['@remove', '@remove']],
        ),
        ...anti([['纯状态点用 Chip → Status', 'Status dot via Chip → Status']]),
      },
      {
        component: 'Badge',
        when: ['角标数量或圆点，附着在按钮、头像等控件上'],
        whenEn: ['A count or dot attached to a button, avatar, or other control'],
        avoidWhen: ['独立成行的状态文案'],
        avoidWhenEn: ['A standalone status sentence'],
        recipe: recipe(
          [
            ['value 数量；省略则圆点', 'value count; omit for dot'],
            ['severity；max 封顶', 'severity; max cap'],
            ['默认插槽包裹宿主控件', 'Default slot wraps the host control'],
          ],
          [['默认插槽：被角标包裹的控件', 'Default slot: host control']],
        ),
        ...anti([['独立状态文案用 Badge → Status / Tag', 'Standalone status sentence via Badge → Status / Tag']]),
      },
    ],
  },
  {
    id: 'empty-result-choice',
    title: '空态还是结果页',
    titleEn: 'Empty state vs result page',
    question: '这是没有数据，还是流程已经结束的成功、失败或 HTTP 状态？',
    questionEn: 'Is there simply no data, or has a flow ended in success, failure, or an HTTP status?',
    keywords: [
      '空状态',
      '无数据',
      '首次使用',
      '筛选无结果',
      '结果页',
      '404',
      '403',
      '500',
      'empty',
      'result',
    ],
    options: [
      {
        component: 'Empty',
        when: ['列表没有行', '筛选没有命中', '首次使用，需要引导创建'],
        whenEn: [
          'A list has no rows',
          'Filters matched nothing',
          'First use, and the next step is to create something',
        ],
        avoidWhen: ['接口失败', '无权限', '页面不存在', '提交成功回执'],
        avoidWhenEn: [
          'The request failed',
          'Permission was denied',
          'The page does not exist',
          'A submit-success receipt',
        ],
        recipe: recipe(
          [
            ['title + description', 'title + description'],
            ['icon 或 illustration 按需（默认即可）', 'icon or illustration as needed (default OK)'],
            ['表格内放在 #empty', 'Inside tables: #empty slot'],
          ],
          [['#extra 放下一步按钮（创建…）', '#extra for next-step button (Create…)']],
        ),
        relatedSnippets: ['empty-block'],
        ...anti([
          ['403/404 用 Empty → Result', '403/404 via Empty → Result'],
          ['#action → #extra', '#action → #extra'],
        ]),
      },
      {
        component: 'Result',
        when: [
          '提交成功或失败的终点页',
          '403 / 404 / 500 等阻断状态',
          '需要明确的下一步（返回、重试、回首页）',
        ],
        whenEn: [
          'A terminal success or failure page',
          'A blocking 403 / 404 / 500 state',
          'The next step must be explicit (back, retry, home)',
        ],
        avoidWhen: ['正常的无数据', '表格内部的空行'],
        avoidWhenEn: ['A normal empty collection', 'The empty slot inside a table'],
        recipe: recipe(
          [
            ['status：success|error|403|404|500 等', 'status: success|error|403|404|500 etc.'],
            ['title + description', 'title + description'],
            ['size 按页面比重', 'size for page weight'],
          ],
          [['#footer 逃逸/下一步按钮', '#footer escape / next actions']],
        ),
        relatedSnippets: ['result-block'],
        ...anti([
          ['表格无数据用 Result → Empty', 'Table no-rows via Result → Empty'],
          ['操作插槽写成 #extra → #footer', 'Actions slot #extra → #footer'],
        ]),
      },
    ],
  },
  {
    id: 'action-menu-choice',
    title: '如何选择菜单',
    titleEn: 'Choosing a menu',
    question: '这是按钮上的操作项、侧栏导航、右键菜单，还是全局命令搜索？',
    questionEn: 'Is this an action menu on a trigger, sider navigation, a context menu, or a global command search?',
    keywords: [
      '动作菜单',
      '右键',
      '右键菜单',
      '命令面板',
      '导航菜单',
      'context menu',
      'command menu',
      'menubar',
      '上下文菜单',
    ],
    options: [
      {
        component: 'Dropdown',
        when: ['从按钮或图标打开一组操作', '编辑、删除、更多'],
        whenEn: ['Actions open from a button or icon', 'Edit, delete, or more'],
        avoidWhen: ['表单里选一个枚举值', '常驻侧栏导航'],
        avoidWhenEn: ['Choosing an enum in a form', 'Persistent sider navigation'],
        recipe: recipe(
          [
            [':model / items 操作项', ':model / items for actions'],
            ['触发器放默认插槽（按钮/图标）', 'Trigger in default slot (button/icon)'],
            ['危险项用文档 severity / 确认流', 'Danger items: docs severity / confirm flow'],
          ],
        ),
        relatedSnippets: ['row-actions-menu', 'list-row-actions'],
        ...anti([['表单枚举用 Dropdown → Select', 'Form enum via Dropdown → Select']]),
      },
      {
        component: 'Menu',
        when: ['后台侧栏或页面内的常驻导航', '需要选中项与路由同步'],
        whenEn: [
          'Persistent navigation in an admin sider or page',
          'Selection should stay in sync with the route',
        ],
        avoidWhen: ['一次性操作菜单', '右键弹出'],
        avoidWhenEn: ['A one-shot action menu', 'A right-click popup'],
        recipe: recipe(
          [
            [':model 导航项（含 icon）', ':model nav items (with icon)'],
            ['放在 MLayoutSider 内', 'Place inside MLayoutSider'],
            ['与路由选中态同步', 'Sync selection with the route'],
          ],
        ),
        ...anti([['行内「更多」用 Menu → Dropdown', 'Row More via Menu → Dropdown']]),
      },
      {
        component: 'ContextMenu',
        when: ['在指针位置弹出，通常由右键触发'],
        whenEn: ['The menu opens at the pointer, usually from a right-click'],
        avoidWhen: ['可见的导航', '表单选择'],
        avoidWhenEn: ['Visible navigation', 'Form selection'],
        recipe: recipe(
          [
            [':model 菜单项', ':model menu items'],
            ['绑定上下文目标事件（右键）', 'Bind to context target (right-click)'],
            ['在指针位置打开，不是侧栏常驻', 'Opens at pointer; not persistent sider nav'],
          ],
        ),
        ...anti([['常驻导航用 ContextMenu → Menu', 'Persistent nav via ContextMenu → Menu']]),
      },
      {
        component: 'CommandMenu',
        when: ['全局搜索命令或跳转', '键盘优先，例如 Cmd/Ctrl+K'],
        whenEn: ['Global command search or jump', 'Keyboard-first, such as Cmd/Ctrl+K'],
        avoidWhen: ['少量固定操作放在按钮旁即可'],
        avoidWhenEn: ['A few fixed actions fit next to a button'],
        recipe: recipe(
          [
            ['v-model 开关', 'v-model open state'],
            ['命令列表 / 搜索按文档', 'Commands / search per docs'],
            ['全局快捷键打开', 'Open via global shortcut'],
          ],
        ),
        ...anti([['两三个固定操作也用 CommandMenu → Dropdown / 按钮', 'Two fixed actions via CommandMenu → Dropdown / buttons']]),
      },
      {
        component: 'Menubar',
        when: ['顶部应用菜单，项很多且分组'],
        whenEn: ['A top application menu with many grouped items'],
        avoidWhen: ['侧栏只有一层链接'],
        avoidWhenEn: ['The sider is a single level of links'],
        recipe: recipe(
          [
            [':model 分组菜单', ':model grouped menus'],
            ['放在顶栏而非侧栏', 'Place in top bar, not sider'],
            ['项多且需要分组时再用', 'Use when many items need grouping'],
          ],
        ),
        ...anti([['侧栏单层链接用 Menubar → Menu', 'Single-level sider via Menubar → Menu']]),
      },
    ],
  },
  {
    id: 'feedback-choice',
    title: '如何选择操作反馈',
    titleEn: 'Choosing operation feedback',
    question: '这是一句话结果、带详情的通知，还是要留在表单里的错误？',
    questionEn: 'Is this a one-line result, a notice with detail, or an error that must stay in the form?',
    keywords: [
      '反馈',
      '提示',
      '消息',
      'toast',
      'message',
      '已保存',
      '错误',
      'alert',
      'errorMessage',
      '通知',
    ],
    options: [
      {
        component: 'message',
        when: ['CRUD / 保存 / 删除后的单行结果', '不需要单独标题和详情'],
        whenEn: ['One-line result after CRUD / save / delete', 'No separate title and detail needed'],
        avoidWhen: ['需要 summary + detail', '错误必须留在表单直到修正'],
        avoidWhenEn: ['Need summary + detail', 'Error must stay in the form until fixed'],
        recipe: recipe(
          [
            ["import { message } from 'morya-ui'", "import { message } from 'morya-ui'"],
            ["message.success('已保存') / info / warn / error", "message.success('Saved') / info / warn / error"],
            ['大多数操作反馈的默认选择', 'Default for most operation feedback'],
          ],
        ),
        relatedSnippets: ['confirm-delete', 'form-in-dialog'],
        ...anti([
          ["toast.add({ summary: '已保存' }) → message.success('已保存')", "toast.add({ summary: 'Saved' }) → message.success('Saved')"],
          ['<MMessage severity> 当内嵌 Alert → errorMessage / role="alert"', '<MMessage severity> as inline Alert → errorMessage / role="alert"'],
        ]),
      },
      {
        component: 'toast',
        when: ['需要 summary + detail', '异步/后台任务完成感'],
        whenEn: ['Need summary + detail', 'Async / background job completion feel'],
        avoidWhen: ['只有一句话的 CRUD 回执'],
        avoidWhenEn: ['One-sentence CRUD receipts'],
        recipe: recipe(
          [
            ["import { toast } from 'morya-ui'", "import { toast } from 'morya-ui'"],
            ['toast.success({ summary, detail })', 'toast.success({ summary, detail })'],
            ['不要用 toast 代替默认 message', 'Do not replace default message with toast'],
          ],
        ),
        ...anti([['单行「已保存」用 toast → message', 'One-line Saved via toast → message']]),
      },
      {
        component: 'field errorMessage / role="alert"',
        when: ['字段校验错误需常驻', '登录/鉴权失败需留在表单区'],
        whenEn: [
          'Field validation errors must persist',
          'Login/auth failures should stay in the form region',
        ],
        avoidWhen: ['一次性操作成功提示'],
        avoidWhenEn: ['One-shot success toasts/messages'],
        recipe: recipe(
          [
            ['字段：invalid + errorMessage', 'Fields: invalid + errorMessage'],
            ['表单级：token 样式的 role="alert" 条（见 login-page）', 'Form-level: token-styled role="alert" bar (see login-page)'],
            ['<MMessage> 只是 message 宿主，不是内嵌 Alert', '<MMessage> is the message host, not an inline Alert'],
          ],
        ),
        relatedSnippets: ['auth-split-shell'],
        ...anti([
          ['登录失败只闪 Toast → 表单区 alert / errorMessage', 'Login failure only via Toast → form alert / errorMessage'],
          ['编造 MMessage severity 插槽 Alert API', 'Invented MMessage severity slot Alert API'],
        ]),
      },
    ],
  },
  {
    id: 'confirm-choice',
    title: '如何选择确认框',
    titleEn: 'Choosing a confirmation UI',
    question: '危险操作需要居中确认，还是贴着触发点的轻量确认？',
    questionEn: 'Does the destructive action need a centered confirm, or a lightweight confirm near the trigger?',
    keywords: [
      '确认',
      '删除',
      '危险',
      '二次确认',
      'confirm',
      'delete',
      'destructive',
      'ConfirmDialog',
      'ConfirmPopup',
    ],
    options: [
      {
        component: 'ConfirmDialog',
        when: ['删除/不可逆操作需要明确确认', '需要标题、说明与阻塞式决定', '列表行删除的默认选择'],
        whenEn: [
          'Delete / irreversible actions need explicit confirm',
          'Need header, message, and a blocking decision',
          'Default for list-row delete',
        ],
        avoidWhen: ['只需贴着按钮的轻量确认', '复杂编辑表单（那是 Dialog）'],
        avoidWhenEn: ['Only a lightweight confirm near the button', 'Complex edit forms (that is Dialog)'],
        recipe: recipe(
          [
            ['v-model / modelValue', 'v-model / modelValue'],
            ['header + message', 'header + message'],
            ['acceptLabel / rejectLabel', 'acceptLabel / rejectLabel'],
            ['acceptSeverity="danger" 用于删除', 'acceptSeverity="danger" for delete'],
          ],
          undefined,
          [
            ['@accept 执行删除', '@accept to perform delete'],
            ['@reject 关闭', '@reject to dismiss'],
          ],
        ),
        relatedSnippets: ['confirm-delete'],
        ...anti([
          ['普通 Dialog 手写「确定/取消」删除 → ConfirmDialog', 'Hand-rolled Dialog Yes/No delete → ConfirmDialog'],
          ['编辑表单误用 ConfirmDialog → Dialog + Form', 'Edit form via ConfirmDialog → Dialog + Form'],
        ]),
      },
      {
        component: 'ConfirmPopup',
        when: ['确认应贴着触发按钮/行内操作', '文案短、不需要大对话框'],
        whenEn: [
          'Confirm should sit next to the trigger button / row action',
          'Short copy; no large dialog needed',
        ],
        avoidWhen: ['需要醒目标题与强阻塞感的删除', '无定位目标时的全局确认'],
        avoidWhenEn: [
          'High-stakes delete needing a strong blocking title',
          'Global confirm without an anchor target',
        ],
        recipe: recipe(
          [
            ['v-model / modelValue', 'v-model / modelValue'],
            ['message；acceptSeverity="danger" 按需', 'message; acceptSeverity="danger" as needed'],
            ['target 锚定触发元素（或 position）', 'target anchors the trigger (or position)'],
            ['placement top|bottom|left|right', 'placement top|bottom|left|right'],
          ],
          undefined,
          [['@accept / @reject', '@accept / @reject']],
        ),
        relatedSnippets: ['confirm-delete'],
        ...anti([['无 target 的全局危险确认 → ConfirmDialog', 'Global dangerous confirm without target → ConfirmDialog']]),
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

/** Ensures every option carries a non-empty L2 recipe (used by tests / generate script). */
export function assertDecisionRecipes(decisions = componentDecisions): void {
  for (const decision of decisions) {
    for (const option of decision.options) {
      if (!option.recipe?.props?.length) {
        throw new Error(`Missing recipe.props: ${decision.id} / ${option.component}`)
      }
      if (option.recipe.props.length < 3 || option.recipe.props.length > 8) {
        throw new Error(
          `recipe.props must be 3–8 items: ${decision.id} / ${option.component} (${option.recipe.props.length})`,
        )
      }
      if (!option.antiPatterns?.length) {
        throw new Error(`Missing antiPatterns: ${decision.id} / ${option.component}`)
      }
    }
  }
}
