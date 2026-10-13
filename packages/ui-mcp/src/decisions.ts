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
            ['表单字段用 fluid；主按钮 type="primary"', 'Form fields use fluid; primary button type="primary"'],
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
            ['提交按钮 html-type="submit" + type="primary"', 'Submit button html-type="submit" + type="primary"'],
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
            ['大行数：virtual + maxHeight/tableHeight/fill', 'Large row sets: virtual + maxHeight/tableHeight/fill'],
            ['列宽/表头筛选：resizable / filterable', 'Column resize/header filter: resizable / filterable'],
            ['树表：tree-config + v-model:expanded-row-keys（children 或 transform）', 'Tree: tree-config + v-model:expanded-row-keys (children or transform)'],
          ],
          [
            ['#cell-{key} 自定义单元格', '#cell-{key} custom cells'],
            ['#empty 放 MEmpty', '#empty with MEmpty'],
            ['多级表头 children；表尾 show-footer + footer-method', 'Grouped headers via children; footer via show-footer + footer-method'],
          ],
        ),
        ...anti([
          [':data → :rows', ':data → :rows'],
          ['手写 <table> → MTable', 'Hand-rolled <table> → MTable'],
          ['嵌入表硬套 fill → 去掉 fill', 'Forced fill on embedded table → remove fill'],
          ['无高度开 virtual → 配 maxHeight/tableHeight/fill', 'virtual without height → set maxHeight/tableHeight/fill'],
          ['无层级硬套 treeConfig → 普通 Table', 'No hierarchy but treeConfig → plain Table'],
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
            ['size / gap 控制间距（gap 是 size 的别名，优先用 size）', 'size / gap for spacing (gap is an alias of size; prefer size)'],
            ['align 控制交叉轴对齐（start / center / end / baseline / stretch）', 'align controls cross-axis (start / center / end / baseline / stretch)'],
            ['justify 控制主轴分布（start / center / end / between / around / evenly）', 'justify controls main-axis distribution'],
            ['wrap 允许折行；筛选行、工具栏内组优先 Flex', 'wrap allows wrapping; prefer Flex for filter rows and toolbar groups'],
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
            ['size 控制间距；默认 wrap 折行', 'size for spacing; wraps by default'],
            ['align 交叉轴对齐（同 Flex）；没有 justify 语义', 'align for cross-axis (same as Flex); no justify semantics'],
            ['vertical 垂直堆叠控件组', 'vertical stacks the group vertically'],
            ['包裹 MButton 组；行内操作常用 size="small" text 按钮', 'Wrap MButton groups; row actions often size="small" text buttons'],
            ['Dialog #footer 内可用 Space + style justify-content:flex-end', 'In Dialog #footer: Space + style justify-content:flex-end'],
          ],
        ),
        ...anti([
          ['标题与主按钮两端对齐只用 Space → PageToolbar / Flex justify', 'Title/actions space-between via Space alone → PageToolbar / Flex'],
          ['需要精确对齐控制仍用 Space → Flex', 'Need precise alignment control but using Space → Flex'],
        ]),
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
            ['主按钮 type="primary"；全页仅一个主按钮', 'Primary button type="primary"; one primary per page'],
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
            ['trend / trendType / trendDirection 按需', 'trend / trendType / trendDirection as needed'],
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
            ['label + type', 'label + type'],
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
            ['type；closable + @close', 'type; closable + @close'],
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
            ['type 按需', 'type as needed'],
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
            ['type；max 封顶', 'type; max cap'],
            ['默认插槽包裹宿主控件', 'Default slot wraps the host control'],
          ],
          [['默认插槽：被角标包裹的控件', 'Default slot: host control']],
        ),
        ...anti([
          ['独立状态文案用 Badge → Status / Tag', 'Standalone status sentence via Badge → Status / Tag'],
          ['MButton badge / badgeColor → 用 MBadge 包裹按钮', 'MButton badge / badgeColor → wrap the button with MBadge'],
        ]),
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
            ['主区域优先 illustration（no-content / no-result…）', 'Prefer illustration on main regions (no-content / no-result…)'],
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
            ['危险项走确认流（ConfirmDialog）', 'Danger items: confirm flow (ConfirmDialog)'],
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
          ['<MMessage type> 当内嵌 Alert → errorMessage / role="alert"', '<MMessage type> as inline Alert → errorMessage / role="alert"'],
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
          ['编造 MMessage type / 插槽 Alert API', 'Invented MMessage type / slot Alert API'],
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
            ['acceptColor="danger" 用于删除', 'acceptColor="danger" for delete'],
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
            ['message；acceptColor="danger" 按需', 'message; acceptColor="danger" as needed'],
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
  {
    id: 'button-icon-choice',
    title: '按钮图标放在哪里',
    titleEn: 'Where to put a button icon',
    question: '按钮需要带图标时，是用 icon prop、#icon 插槽，还是纯图标按钮？',
    questionEn: 'When a button needs an icon, should it use the icon prop, the #icon slot, or be an icon-only button?',
    keywords: [
      '按钮图标',
      '图标按钮',
      '纯图标',
      'button icon',
      'icon button',
      'icon-only',
      'iconPlacement',
      'loading icon',
    ],
    options: [
      {
        component: 'icon prop',
        when: ['标准图标与文字按钮', '图标来自 morya-ui 内置图标名'],
        whenEn: ['Standard icon + label buttons', 'The icon is a built-in MIcon name'],
        avoidWhen: ['需要自定义 SVG / 组件图标', 'loading 时要换不同图标'],
        avoidWhenEn: ['Custom SVG / component icons are needed', 'The loading state needs a different icon'],
        recipe: recipe(
          [
            ['icon="plus" 传内置图标名', 'icon="plus" passes a built-in icon name'],
            ['iconPlacement="end" 图标放文字右侧', 'iconPlacement="end" places icon after the label'],
            ['图标随按钮 size 自动缩放', 'Icon size follows button size automatically'],
            ['loading 时自动替换为转圈', 'Loading swaps the icon to a spinner automatically'],
          ],
        ),
        ...anti([
          ['手动 <MIcon /> 放默认插槽 → icon prop', 'Hand-placed <MIcon /> in default slot → icon prop'],
          ['图标和文字间距手写 margin → 交给组件', 'Hand-written margin between icon and label → let the component handle it'],
        ]),
      },
      {
        component: '#icon slot',
        when: ['自定义 SVG / 组件图标', 'loading 时要用 #loadingicon 换不同图标'],
        whenEn: ['Custom SVG / component icons', 'Loading state needs #loadingicon with a different icon'],
        avoidWhen: ['标准内置图标名即可满足'],
        avoidWhenEn: ['A built-in icon name is enough'],
        recipe: recipe(
          [
            ['#icon 放任意 VNode（自定义 SVG / 组件）', '#icon accepts any VNode (custom SVG / component)'],
            ['#loadingicon 自定义 loading 态图标', '#loadingicon customizes the loading icon'],
            ['图标仍随按钮 size 缩放，对齐由组件保证', 'Icon still scales with button size; alignment is handled'],
          ],
        ),
        ...anti([
          ['#icon 和默认插槽混放导致间距错乱 → 只用一个', 'Mixing #icon and default slot breaks spacing → use one'],
        ]),
      },
      {
        component: 'iconOnly',
        when: ['工具栏 / 卡片头部等空间紧张处', '图标含义对用户足够明确（如 删除/编辑/关闭）'],
        whenEn: ['Space-constrained areas like toolbars or card headers', 'The icon meaning is unambiguous to users (delete / edit / close)'],
        avoidWhen: ['用户可能不认识图标含义', '表单提交等需要明确文字的操作'],
        avoidWhenEn: ['Users may not recognize the icon', 'Actions that need an explicit label like form submit'],
        recipe: recipe(
          [
            ['iconOnly + icon="…" 或 #icon', 'iconOnly + icon="…" or #icon'],
            ['必须配 ariaLabel（无视觉文字，屏幕阅读器依赖）', 'ariaLabel is required (no visible label for screen readers)'],
            ['shape="circle" 圆形图标按钮', 'shape="circle" for a round icon button'],
            ['仍可用 loading 切换转圈', 'loading still swaps to spinner'],
          ],
        ),
        ...anti([
          ['iconOnly 把图标放默认插槽 → icon prop 或 #icon', 'Icon in default slot with iconOnly → icon prop or #icon'],
          ['iconOnly 不写 ariaLabel → 必填', 'iconOnly without ariaLabel → required'],
          ['含义不明确的图标硬用 iconOnly → 加文字', 'Ambiguous icon with iconOnly → add a label'],
        ]),
      },
    ],
  },
  {
    id: 'input-addon-choice',
    title: '输入框前后缀如何选择',
    titleEn: 'Choosing input prefix / suffix',
    question: '输入框需要带图标、文字前缀或多个控件合并时，用 MIconField 还是 MInputGroup？',
    questionEn: 'When an input needs an icon, a text prefix, or merged controls, should it use MIconField or MInputGroup?',
    keywords: [
      '输入框图标',
      '前缀',
      '后缀',
      'input icon',
      'prefix',
      'suffix',
      'addon',
      'input group',
      'iconfield',
    ],
    options: [
      {
        component: 'MIconField',
        when: ['输入框内左/右侧放一个图标（搜索、清除提示等）'],
        whenEn: ['A single icon inside the input on the left or right (search, clear hint, etc.)'],
        avoidWhen: ['需要文字前缀 / 后缀', '需要合并多个控件（输入框 + 按钮）'],
        avoidWhenEn: ['A text prefix / suffix is needed', 'Multiple controls need to merge (input + button)'],
        recipe: recipe(
          [
            ['iconPosition="left"（默认）或 "right"', 'iconPosition="left" (default) or "right"'],
            ['#icon 插槽放 MIcon 或任意图标', '#icon slot holds MIcon or any icon'],
            ['默认插槽放 MInput / MTextarea 等控件', 'Default slot holds MInput / MTextarea etc.'],
            ['图标随控件主题对齐，无需手写定位', 'Icon aligns with control theme; no manual positioning'],
          ],
          [
            ['#icon 图标内容', '#icon for the icon'],
            ['默认插槽：输入控件', 'Default: the input control'],
          ],
        ),
        ...anti([
          ['手写 absolute 定位图标 → MIconField', 'Hand-written absolute icon → MIconField'],
          ['文字前缀用 MIconField → MInputGroup + MInputGroupAddon', 'Text prefix via MIconField → MInputGroup + MInputGroupAddon'],
        ]),
      },
      {
        component: 'MInputGroup',
        when: ['输入框需要文字前缀 / 后缀（如 https://、$、单位）', '输入框 + 按钮 / 下拉合并成一个整体'],
        whenEn: ['Input needs a text prefix / suffix (https://, $, units)', 'Input merged with a button or select into one control'],
        avoidWhen: ['只是输入框内放一个图标'],
        avoidWhenEn: ['Only a single icon inside the input'],
        recipe: recipe(
          [
            ['MInputGroup 包裹 MInput + MInputGroupAddon', 'MInputGroup wraps MInput + MInputGroupAddon'],
            ['MInputGroupAddon 放文字前缀 / 后缀', 'MInputGroupAddon holds the text prefix / suffix'],
            ['可混合 MButton 作为后置操作', 'MButton can mix in as a trailing action'],
          ],
        ),
        ...anti([
          ['输入框内单图标用 MInputGroup → MIconField', 'Single in-input icon via MInputGroup → MIconField'],
          ['手写 flex 拼输入框和按钮 → MInputGroup', 'Hand-flexed input + button → MInputGroup'],
        ]),
      },
    ],
  },
  {
    id: 'toggle-input-choice',
    title: '开关、复选框、滑块、标签输入如何选择',
    titleEn: 'Choosing switch, checkbox, slider, or tag input',
    question: '这个输入是立即生效的设置、表单提交时的勾选、范围调节，还是自由标签输入？',
    questionEn: 'Is this an instant setting toggle, a form-submitted checkbox, a range adjustment, or free-form tag entry?',
    keywords: [
      '开关',
      '复选框',
      '滑块',
      '标签输入',
      '多选',
      'switch',
      'checkbox',
      'slider',
      'inputtags',
      'tags',
      'toggle',
      'range',
    ],
    options: [
      {
        component: 'MSwitch',
        when: ['设置项立即生效，不需要点保存', '只有开 / 关两种状态'],
        whenEn: ['A setting takes effect immediately without saving', 'Only on / off states'],
        avoidWhen: ['表单提交时才确认的勾选协议', '需要从多个选项中选'],
        avoidWhenEn: ['A terms checkbox confirmed on form submit', 'Selection from multiple options'],
        recipe: recipe(
          [
            ['v-model 布尔值', 'v-model boolean'],
            ['loading 显示转圈并阻止切换', 'loading shows a spinner and blocks toggles'],
            ['checkedText / uncheckedText 自定义状态文案', 'checkedText / uncheckedText for state copy'],
            ['label 或外部 MFormItem 提供可访问名称', 'label or wrapping MFormItem provides the accessible name'],
          ],
        ),
        ...anti([
          ['协议确认用 MSwitch → MCheckbox', 'Terms confirmation via MSwitch → MCheckbox'],
          ['多选需求用多个 MSwitch → MCheckboxGroup / MSelect', 'Multi-select via stacked MSwitch → MCheckboxGroup / MSelect'],
        ]),
      },
      {
        component: 'MCheckbox',
        when: ['表单提交时才生效的勾选（协议、批量选择）', '需要从固定选项中选多个'],
        whenEn: ['A checkbox that takes effect on form submit (terms, bulk select)', 'Selecting multiple from fixed options'],
        avoidWhen: ['设置项需要立即生效'],
        avoidWhenEn: ['A setting must take effect immediately'],
        recipe: recipe(
          [
            ['MCheckboxGroup v-model 数组包多个 MCheckbox', 'MCheckboxGroup v-model array wraps multiple MCheckbox'],
            ['单个勾选用 MCheckbox v-model 布尔值', 'Single checkbox: MCheckbox v-model boolean'],
            ['与 MFormItem 一起用，提交时校验', 'Use with MFormItem for submit-time validation'],
          ],
        ),
        ...anti([['立即生效设置用 MCheckbox → MSwitch', 'Instant setting via MCheckbox → MSwitch']]),
      },
      {
        component: 'MSlider',
        when: ['范围调节（音量、价格区间、阈值）', '视觉化比例比精确数值更重要'],
        whenEn: ['Range adjustment (volume, price range, threshold)', 'Visual proportion matters more than exact value'],
        avoidWhen: ['需要精确输入数值', '选项是离散枚举'],
        avoidWhenEn: ['Exact numeric input is required', 'Options are discrete enums'],
        recipe: recipe(
          [
            ['v-model 数值或 range 数值数组', 'v-model number or range number array'],
            ['min / max / step 控制范围', 'min / max / step for the range'],
            ['marks 显示刻度标签', 'marks for tick labels'],
            ['tooltip 拖拽时显示当前值', 'tooltip shows current value while dragging'],
          ],
        ),
        ...anti([
          ['精确数值输入用 MSlider → MInputNumber', 'Exact numeric input via MSlider → MInputNumber'],
          ['离散枚举选择用 MSlider → MSelect / MSelectButton', 'Discrete enum via MSlider → MSelect / MSelectButton'],
        ]),
      },
      {
        component: 'MInputTags',
        when: ['自由输入并回车生成标签（关键词、邮箱列表）', '标签内容不受固定选项约束'],
        whenEn: ['Free-form entry generating tags on Enter (keywords, email lists)', 'Tag content is not constrained to fixed options'],
        avoidWhen: ['只能从预定义选项中选', '单个值输入'],
        avoidWhenEn: ['Selection must be from predefined options', 'Single value input'],
        recipe: recipe(
          [
            ['v-model 字符串数组', 'v-model string array'],
            ['separator 支持逗号等额外分隔符', 'separator supports extra delimiters like comma'],
            ['max 限制标签数量', 'max caps the tag count'],
            ['addOnBlur 失焦时自动添加', 'addOnBlur adds on blur'],
          ],
        ),
        ...anti([
          ['固定选项多选用 MInputTags → MSelect mode="multiple"', 'Fixed multi-select via MInputTags → MSelect mode="multiple"'],
          ['允许创建新选项但要从建议中选 → MSelect mode="tags"', 'Create new options from suggestions → MSelect mode="tags"'],
        ]),
      },
    ],
  },
  {
    id: 'status-display-choice',
    title: '头像、图片、标签、状态如何选择',
    titleEn: 'Choosing avatar, image, tag, or status display',
    question: '这是用户头像、可预览图片、分类标签、可移除实体，还是行内业务状态？',
    questionEn: 'Is this a user avatar, a previewable image, a category tag, a removable entity, or an inline business status?',
    keywords: [
      '头像',
      '图片',
      '标签',
      '状态',
      'avatar',
      'image',
      'tag',
      'chip',
      'status',
      'badge',
      '预览',
      '角标',
    ],
    options: [
      {
        component: 'MAvatar',
        when: ['展示单个用户 / 实体头像', '图片加载失败需要回退到首字母或图标'],
        whenEn: ['Displaying a single user / entity avatar', 'Fallback to initials or an icon when the image fails'],
        avoidWhen: ['需要展示多个用户堆叠', '需要点击预览大图'],
        avoidWhenEn: ['Multiple users need to stack', 'Click-to-preview a larger image is needed'],
        recipe: recipe(
          [
            ['image 头像图片 URL，优先于 icon 和 label', 'image URL takes priority over icon and label'],
            ['label 回退首字母；icon 回退内置图标', 'label falls back to initials; icon falls back to a built-in icon'],
            ['shape="circle"（默认）或 "square"', 'shape="circle" (default) or "square"'],
            ['size 可选 xlarge 用于个人资料页', 'size up to xlarge for profile pages'],
          ],
        ),
        ...anti([
          ['多用户堆叠用多个 MAvatar → MAvatarGroup', 'Multiple users via stacked MAvatar → MAvatarGroup'],
          ['手写 img 圆形头像 → MAvatar', 'Hand-written circular img → MAvatar'],
        ]),
      },
      {
        component: 'MAvatarGroup',
        when: ['多个用户头像堆叠展示', '超出数量需要 +N 计数'],
        whenEn: ['Stacking multiple user avatars', 'Overflow needs a +N count'],
        avoidWhen: ['单个用户头像'],
        avoidWhenEn: ['A single user avatar'],
        recipe: recipe(
          [
            ['包裹多个 MAvatar', 'Wraps multiple MAvatar'],
            ['max 控制最多显示几个，超出显示 +N', 'max caps visible avatars; overflow shows +N'],
            ['size 统一控制组内头像尺寸', 'size applies a uniform avatar size'],
          ],
        ),
        ...anti([['单个头像用 MAvatarGroup → MAvatar', 'Single avatar via MAvatarGroup → MAvatar']]),
      },
      {
        component: 'MImage',
        when: ['需要点击预览大图', '需要懒加载或 fit 控制'],
        whenEn: ['Click-to-preview a larger image', 'Lazy loading or fit control is needed'],
        avoidWhen: ['纯装饰背景图', '不需要预览的普通图片'],
        avoidWhenEn: ['Purely decorative background images', 'Plain images that do not need preview'],
        recipe: recipe(
          [
            ['preview 默认开启，点击放大', 'preview is on by default; click to enlarge'],
            ['previewSrc 可指定不同于 src 的大图', 'previewSrc can differ from src'],
            ['fit 控制 object-fit（cover / contain / fill…）', 'fit controls object-fit (cover / contain / fill…)'],
            ['width / height 显式设置避免布局抖动', 'width / height avoids layout shift'],
          ],
        ),
        ...anti([
          ['需要预览却手写 img → MImage', 'Need preview but hand-written img → MImage'],
          ['用户头像用 MImage → MAvatar', 'User avatar via MImage → MAvatar'],
        ]),
      },
      {
        component: 'MTag',
        when: ['分类、筛选结果或可关闭标签', '需要比 Status 更像芯片的表面'],
        whenEn: ['A category, filter result, or closable label', 'A chip-like surface rather than an inline status'],
        avoidWhen: ['只是一行里的轻量状态', '带图片且代表一个可移除实体'],
        avoidWhenEn: ['A lightweight inline status', 'An entity with an image that can be removed'],
        recipe: recipe(
          [
            ['value 或默认插槽文案', 'value or default-slot copy'],
            ['type 语义色；closable + @close', 'type semantic color; closable + @close'],
            ['checkable + v-model:checked 可选中切换', 'checkable + v-model:checked for toggleable tags'],
            ['icon 加内置图标；rounded 圆角', 'icon for a built-in icon; rounded for pill shape'],
          ],
          undefined,
          [['@close 关闭标签', '@close when the tag is closed']],
        ),
        ...anti([
          ['行内启用/停用状态用 MTag → MStatus', 'Enabled/disabled inline via MTag → MStatus'],
          ['可移除实体（带头像）用 MTag → MChip', 'Removable entity with avatar via MTag → MChip'],
        ]),
      },
    ],
  },
  {
    id: 'nav-pattern-choice',
    title: '页面内导航模式如何选择',
    titleEn: 'Choosing in-page navigation patterns',
    question: '这是长页面锚点跳转、滚动固定、内容切换、分步流程，还是层级路径？',
    questionEn: 'Is this anchor jump in a long page, scroll pinning, content switching, a step flow, or a hierarchy path?',
    keywords: [
      '锚点',
      '固钉',
      '标签页',
      '步骤条',
      '面包屑',
      'anchor',
      'affix',
      'tabs',
      'stepper',
      'breadcrumb',
      '分步',
      '向导',
    ],
    options: [
      {
        component: 'MAnchor',
        when: ['长页面右侧锚点导航', '内容区块有明确标题层级'],
        whenEn: ['Anchor navigation on the right of a long page', 'Content sections have clear heading hierarchy'],
        avoidWhen: ['页面很短不需要跳转', '需要切换显示不同内容面板'],
        avoidWhenEn: ['The page is too short to need jumps', 'Different content panels need to switch'],
        recipe: recipe(
          [
            ['items 手动指定，或根据标题自动生成', 'items set manually, or auto-generated from headings'],
            ['与 MLayoutContent 长页面配合', 'Pairs with long MLayoutContent pages'],
            ['点击平滑滚动到对应区块', 'Click smooth-scrolls to the section'],
          ],
        ),
        ...anti([['内容切换用 MAnchor → MTabs', 'Content switching via MAnchor → MTabs']]),
      },
      {
        component: 'MAffix',
        when: ['元素滚动到某位置后固定（操作栏吸顶、侧栏跟随）'],
        whenEn: ['An element pins after scrolling to a position (sticky action bar, following sider)'],
        avoidWhen: ['页面顶部固定导航（那是 MLayoutHeader）', '元素不需要随滚动变化'],
        avoidWhenEn: ['Top-fixed navigation (that is MLayoutHeader)', 'The element does not change with scroll'],
        recipe: recipe(
          [
            ['offsetTop 距离顶部多少时固定', 'offsetTop pins at a distance from the top'],
            ['target 指定滚动容器（默认 window）', 'target sets the scroll container (window by default)'],
            ['z-index 按需调整避免被遮挡', 'Adjust z-index to avoid occlusion'],
          ],
        ),
        ...anti([['页面顶部导航用 MAffix → MLayoutHeader', 'Top page nav via MAffix → MLayoutHeader']]),
      },
      {
        component: 'MTabs',
        when: ['多个内容面板切换显示', '标签数量适中且需要全部可见'],
        whenEn: ['Switching between multiple content panels', 'A moderate number of tabs all visible'],
        avoidWhen: ['选项是表单值（用 MSelectButton）', '需要手风琴折叠展开'],
        avoidWhenEn: ['Options are form values (use MSelectButton)', 'Accordion expand/collapse is needed'],
        recipe: recipe(
          [
            ['v-model:value 控制当前标签', 'v-model:value controls the active tab'],
            ['closable 可关闭标签（配合 @tab-close）', 'closable for dismissible tabs (with @tab-close)'],
            ['与路由结合时用 to 或 @tab-click 导航', 'Use to or @tab-click for route navigation'],
          ],
        ),
        ...anti([
          ['表单选项用 MTabs → MSelectButton', 'Form options via MTabs → MSelectButton'],
          ['折叠面板用 MTabs → MAccordion', 'Collapse panels via MTabs → MAccordion'],
        ]),
      },
      {
        component: 'MStepper',
        when: ['多步表单 / 流程向导', '步骤有前后依赖关系'],
        whenEn: ['Multi-step forms / process wizards', 'Steps have sequential dependencies'],
        avoidWhen: ['内容无顺序关系的切换', '步骤极少（2 步用对话框即可）'],
        avoidWhenEn: ['Content switching without order', 'Very few steps (a dialog works for 2)'],
        recipe: recipe(
          [
            ['v-model 当前步骤索引', 'v-model for the current step index'],
            ['steps 配置每步标题 / 描述 / 图标', 'steps configures title / description / icon per step'],
            ['线性模式禁止跳步；非线性允许点击跳转', 'Linear mode blocks skipping; non-linear allows click jumps'],
            ['与 MForm 分步校验配合', 'Pair with MForm for per-step validation'],
          ],
        ),
        ...anti([
          ['无顺序内容切换用 MStepper → MTabs', 'Unordered content via MStepper → MTabs'],
          ['两步确认也用 MStepper → 对话框', 'Two-step confirm via MStepper → dialog'],
        ]),
      },
      {
        component: 'MBreadcrumb',
        when: ['展示当前页面在层级中的路径', '层级较深（≥3 层）的后台系统'],
        whenEn: ['Showing the current page path in a hierarchy', 'Deep hierarchies (≥3 levels) in admin systems'],
        avoidWhen: ['层级很浅（首页 → 列表页）', '移动端空间紧张'],
        avoidWhenEn: ['Shallow hierarchy (home → list)', 'Tight mobile space'],
        recipe: recipe(
          [
            ['model 数组配置路径项（label + to / icon）', 'model array configures path items (label + to / icon)'],
            ['首页项常用 home 图标', 'The home item often uses a home icon'],
            ['与 MPageHeader #breadcrumb 插槽配合', 'Pairs with MPageHeader #breadcrumb slot'],
          ],
        ),
        ...anti([
          ['层级浅硬套 MBreadcrumb → 去掉', 'Shallow hierarchy with MBreadcrumb → remove it'],
          ['用 MBreadcrumb 代替 Tabs 切换 → MTabs', 'Using MBreadcrumb as tab switching → MTabs'],
        ]),
      },
    ],
  },
  {
    id: 'date-input-choice',
    title: '日期时间输入如何选择',
    titleEn: 'Choosing date and time inputs',
    question: '这是表单内选择日期 / 时间，还是整月视图展示与选择？',
    questionEn: 'Is this picking a date / time in a form, or displaying and selecting on a full calendar?',
    keywords: [
      '日期',
      '时间',
      '日历',
      '范围',
      'date',
      'time',
      'calendar',
      'datepicker',
      'timepicker',
      'range',
      '月份',
      '年份',
    ],
    options: [
      {
        component: 'MDatePicker',
        when: ['表单内选择日期 / 日期时间 / 月份 / 年份', '需要范围选择或快捷选项'],
        whenEn: ['Picking date / datetime / month / year in a form', 'Range selection or shortcuts are needed'],
        avoidWhen: ['需要整月视图展示事件', '只需要选时间'],
        avoidWhenEn: ['A full calendar view is needed for events', 'Only time selection is needed'],
        recipe: recipe(
          [
            ['type="date"（默认）/ daterange / datetime / datetimerange / month / year', 'type="date" (default) / daterange / datetime / datetimerange / month / year'],
            ['shortcuts 预设快捷选项（今天 / 最近 7 天…）', 'shortcuts for presets (today / last 7 days…)'],
            ['needConfirm 用于 datetime / time，避免误触提交', 'needConfirm for datetime / time to avoid accidental commits'],
            ['mask 允许手动输入并自动补分隔符', 'mask allows manual entry with auto separators'],
            ['fluid 表单内占满宽度', 'fluid for full width in forms'],
          ],
          undefined,
          [['@change 提交选择（含 clear 以外的所有变更）', '@change commits the selection (all changes except clear)']],
        ),
        ...anti([
          ['整月事件展示用 MDatePicker → MCalendar', 'Full-month event display via MDatePicker → MCalendar'],
          ['只需要时间用 MDatePicker type="time" → MTimePicker', 'Time-only via MDatePicker type="time" → MTimePicker'],
        ]),
      },
      {
        component: 'MTimePicker',
        when: ['只需要选择时间（小时 / 分钟 / 秒）'],
        whenEn: ['Only time selection is needed (hour / minute / second)'],
        avoidWhen: ['需要同时选日期', '需要整月视图'],
        avoidWhenEn: ['Date selection is also needed', 'A full calendar view is needed'],
        recipe: recipe(
          [
            ['复用 MDatePicker props，type 固定为 time', 'Reuses MDatePicker props with type fixed to time'],
            ['showSeconds 显示秒', 'showSeconds for seconds'],
            ['needConfirm 推荐开启，避免滚动误触', 'needConfirm recommended to avoid scroll accidents'],
          ],
        ),
        ...anti([['日期时间混合用 MTimePicker → MDatePicker type="datetime"', 'Date+time via MTimePicker → MDatePicker type="datetime"']]),
      },
      {
        component: 'MCalendar',
        when: ['整月视图展示事件 / 排班 / 标记日期', '需要自定义日期单元格内容'],
        whenEn: ['Full-month view for events / schedules / date marking', 'Custom date cell content is needed'],
        avoidWhen: ['表单内紧凑选择日期', '空间紧张'],
        avoidWhenEn: ['Compact date picking in a form', 'Space is tight'],
        recipe: recipe(
          [
            ['v-model 选中日期；mode="month"（默认）或 "year"', 'v-model for the selected date; mode="month" (default) or "year"'],
            ['fullscreen 占满容器；false 为紧凑卡片', 'fullscreen fills the container; false for a compact card'],
            ['#dateCell 自定义日期内容（事件标记）', '#dateCell customizes cell content (event markers)'],
            ['disabledDate / validRange 限制可选范围', 'disabledDate / validRange constrains selectable dates'],
          ],
          [
            ['#dateCell 自定义日期单元格', '#dateCell for custom date cells'],
            ['#header 自定义头部（含年月切换）', '#header for a custom header (with year/month switch)'],
          ],
          [['@panelChange 面板切换（年月 / 模式）', '@panelChange on panel switch (year/month / mode)']],
        ),
        ...anti([
          ['表单内紧凑日期选择用 MCalendar → MDatePicker', 'Compact form date via MCalendar → MDatePicker'],
          ['简单日期选择也写 #dateCell → 先用默认', 'Custom #dateCell for simple picking → use default first'],
        ]),
      },
    ],
  },
  {
    id: 'media-display-choice',
    title: '轮播、画廊、时间线、评分如何选择',
    titleEn: 'Choosing carousel, gallery, timeline, or rating',
    question: '这是内容轮播、图片画廊、事件流，还是用户评分？',
    questionEn: 'Is this a content carousel, an image gallery, an event stream, or a user rating?',
    keywords: [
      '轮播',
      '画廊',
      '时间线',
      '评分',
      'carousel',
      'gallery',
      'timeline',
      'rating',
      '图片展示',
      '事件流',
    ],
    options: [
      {
        component: 'MCarousel',
        when: ['内容轮播（不限图片，卡片 / 图文混排）', '需要箭头 / 指示点 / 自动播放'],
        whenEn: ['Content carousel (not just images; cards / mixed content)', 'Arrows / dots / autoplay are needed'],
        avoidWhen: ['纯图片展示且需要缩略图', '垂直滚动列表'],
        avoidWhenEn: ['Pure image display with thumbnails', 'A vertical scrolling list'],
        recipe: recipe(
          [
            ['MCarouselItem 包每页内容', 'MCarouselItem wraps each slide'],
            ['effect="slide"（默认）/ fade / card', 'effect="slide" (default) / fade / card'],
            ['autoplay + interval 自动播放；loop 循环', 'autoplay + interval for auto-play; loop for infinite'],
            ['slidesPerView 一次显示多页', 'slidesPerView for multiple visible slides'],
          ],
          undefined,
          [['@update:currentIndex 切换页码', '@update:currentIndex on slide change']],
        ),
        ...anti([
          ['纯图片展示用 MCarousel → MGallery', 'Pure image display via MCarousel → MGallery'],
          ['垂直滚动列表用 MCarousel direction="vertical" → 普通滚动', 'Vertical list via MCarousel → normal scroll'],
        ]),
      },
      {
        component: 'MGallery',
        when: ['纯图片展示（产品图 / 相册）', '需要缩略图 + 点击预览'],
        whenEn: ['Pure image display (product photos / albums)', 'Thumbnails + click-to-preview are needed'],
        avoidWhen: ['内容不限于图片', '需要自动播放'],
        avoidWhenEn: ['Content is not only images', 'Autoplay is needed'],
        recipe: recipe(
          [
            ['images 传 URL 数组或 { src, alt, caption } 对象', 'images takes URLs or { src, alt, caption } objects'],
            ['点击主图进入预览模式', 'Click the main image to enter preview'],
            ['缩略图条自动同步', 'The thumbnail strip syncs automatically'],
          ],
        ),
        ...anti([
          ['图文混排轮播用 MGallery → MCarousel', 'Mixed content carousel via MGallery → MCarousel'],
          ['单张图片预览用 MGallery → MImage', 'Single image preview via MGallery → MImage'],
        ]),
      },
      {
        component: 'MTimeline',
        when: ['事件流 / 物流跟踪 / 操作记录', '需要按时间顺序展示状态变化'],
        whenEn: ['Event streams / logistics tracking / activity logs', 'Status changes shown in time order'],
        avoidWhen: ['静态步骤流程（用 MStepper）', '无时间属性的普通列表'],
        avoidWhenEn: ['Static step flows (use MStepper)', 'Plain lists without time attributes'],
        recipe: recipe(
          [
            ['value 数组配置事件（status / content / date / icon / type）', 'value array configures events (status / content / date / icon / type)'],
            ['layout="vertical"（默认）或 "horizontal"', 'layout="vertical" (default) or "horizontal"'],
            ['align="alternate" 左右交错', 'align="alternate" for alternating sides'],
            ['pending 显示待续节点', 'pending shows a trailing pending node'],
          ],
          [['#content 自定义事件内容', '#content for custom event content']],
        ),
        ...anti([
          ['静态步骤流程用 MTimeline → MStepper', 'Static step flow via MTimeline → MStepper'],
          ['普通列表用 MTimeline → MList', 'Plain list via MTimeline → MList'],
        ]),
      },
      {
        component: 'MRating',
        when: ['用户评分（商品 / 服务 / 内容）', '需要半星或只读展示'],
        whenEn: ['User ratings (products / services / content)', 'Half-star or read-only display is needed'],
        avoidWhen: ['需要输入精确数值', '需要调节设置'],
        avoidWhenEn: ['Exact numeric input is required', 'A setting needs adjustment'],
        recipe: recipe(
          [
            ['v-model 数值；stars 总星数', 'v-model number; stars for total count'],
            ['allowHalf 允许 0.5 步进', 'allowHalf for 0.5 increments'],
            ['readonly 只读展示（评价列表）', 'readonly for display-only (review lists)'],
            ['allowClear 允许清除评分', 'allowClear to reset the rating'],
          ],
        ),
        ...anti([
          ['精确数值输入用 MRating → MInputNumber', 'Exact numeric input via MRating → MInputNumber'],
          ['设置调节用 MRating → MSlider / MKnob', 'Setting adjustment via MRating → MSlider / MKnob'],
        ]),
      },
    ],
  },
  {
    id: 'specialized-display-choice',
    title: '水印、二维码、引导、终端如何选择',
    titleEn: 'Choosing watermark, QR code, tour, or terminal',
    question: '这是防泄露水印、扫码链接、新功能引导，还是日志终端？',
    questionEn: 'Is this a leak-prevention watermark, a scannable link, a feature tour, or a log terminal?',
    keywords: [
      '水印',
      '二维码',
      '引导',
      '终端',
      'watermark',
      'qrcode',
      'tour',
      'terminal',
      '防泄露',
      '扫码',
      '新功能',
    ],
    options: [
      {
        component: 'MWatermark',
        when: ['页面或区域需要防泄露水印', '内部系统敏感信息保护'],
        whenEn: ['A page or region needs a leak-prevention watermark', 'Sensitive info protection in internal systems'],
        avoidWhen: ['公开营销页面', '水印会遮挡核心内容'],
        avoidWhenEn: ['Public marketing pages', 'The watermark would obscure core content'],
        recipe: recipe(
          [
            ['content 单行或多行文字水印', 'content for single or multi-line text'],
            ['image 图片水印（logo）', 'image for a logo watermark'],
            ['rotate / gap / offset 控制布局', 'rotate / gap / offset for layout'],
            ['inherit 子元素继承水印', 'inherit lets children inherit the watermark'],
          ],
        ),
        ...anti([
          ['公开页面加水印 → 去掉', 'Watermark on a public page → remove it'],
          ['核心内容被水印遮挡 → 调低透明度或局部使用', 'Core content obscured → lower opacity or scope it'],
        ]),
      },
      {
        component: 'MQRCode',
        when: ['生成扫码链接 / 分享码', '需要展示二维码状态（过期 / 加载）'],
        whenEn: ['Generating scannable links / share codes', 'QR code status display is needed (expired / loading)'],
        avoidWhen: ['需要扫码识别（那是摄像头功能）', '需要条形码'],
        avoidWhenEn: ['Scanning recognition is needed (that is camera work)', 'A barcode is needed'],
        recipe: recipe(
          [
            ['value 二维码内容（URL / 文本）', 'value for the QR content (URL / text)'],
            ['errorLevel="H" 高容错（允许 logo 覆盖）', 'errorLevel="H" for high fault tolerance (allows logo overlay)'],
            ['icon 中心 logo', 'icon for a center logo'],
            ['status="expired" 过期遮罩 + @refresh 刷新', 'status="expired" for an expired mask + @refresh'],
          ],
        ),
        ...anti([
          ['需要条形码用 MQRCode → 专用条形码库', 'Barcode via MQRCode → use a dedicated barcode library'],
        ]),
      },
      {
        component: 'MTour',
        when: ['新功能引导 / 首次使用教学', '需要高亮页面元素并解释'],
        whenEn: ['New feature onboarding / first-use tutorials', 'Highlighting page elements with explanations'],
        avoidWhen: ['常规帮助文档', '用户已熟悉的功能'],
        avoidWhenEn: ['Regular help documentation', 'Features the user already knows'],
        recipe: recipe(
          [
            ['steps 配置每步标题 / 描述 / target 元素', 'steps configures title / description / target per step'],
            ['v-model:open 控制显示；v-model:current 当前步骤', 'v-model:open for visibility; v-model:current for the step'],
            ['mask 遮罩背景突出聚焦元素', 'mask dims the background to spotlight the target'],
            ['@finish 完成引导；@close 提前关闭', '@finish on completion; @close on early exit'],
          ],
          undefined,
          [['@change 步骤切换', '@change on step switch']],
        ),
        ...anti([
          ['常规帮助用 MTour → 文档 / Tooltip', 'Regular help via MTour → docs / Tooltip'],
          ['步骤过多（>5）→ 拆分或改为文档', 'Too many steps (>5) → split or use docs'],
        ]),
      },
      {
        component: 'MTerminal',
        when: ['实时日志展示 / 命令执行回显', '需要模拟终端外观'],
        whenEn: ['Real-time log display / command echo', 'A terminal look is needed'],
        avoidWhen: ['普通代码展示（用 CodePreview / pre）', '需要复杂文本编辑'],
        avoidWhenEn: ['Plain code display (use CodePreview / pre)', 'Complex text editing is needed'],
        recipe: recipe(
          [
            ['content 日志文本；支持 ANSI 颜色', 'content for log text; ANSI colors supported'],
            ['readonly 纯展示；非 readonly 可输入命令', 'readonly for display-only; otherwise commands can be entered'],
            ['@command 执行自定义命令处理', '@command for custom command handling'],
          ],
        ),
        ...anti([
          ['普通代码块用 MTerminal → pre / code', 'Plain code block via MTerminal → pre / code'],
          ['复杂编辑用 MTerminal → Monaco / CodeMirror', 'Complex editing via MTerminal → Monaco / CodeMirror'],
        ]),
      },
    ],
  },
  {
    id: 'form-label-choice',
    title: '表单标签样式如何选择',
    titleEn: 'Choosing form label styles',
    question: '这是传统上方标签、紧凑浮动标签，还是无边框内嵌标签？',
    questionEn: 'Is this a traditional top label, a compact floating label, or a borderless inline label?',
    keywords: [
      '标签',
      '浮动标签',
      'floatlabel',
      'label',
      '表单布局',
      '紧凑',
      'inplace',
    ],
    options: [
      {
        component: 'MFloatLabel',
        when: ['空间紧张的现代表单', '需要输入框 label 浮动效果'],
        whenEn: ['Space-constrained modern forms', 'A floating label effect on inputs is needed'],
        avoidWhen: ['传统后台表单（label 在上更清晰）', '需要帮助文本或错误提示常驻'],
        avoidWhenEn: ['Traditional admin forms (top label is clearer)', 'Help text or error messages need to persist'],
        recipe: recipe(
          [
            ['label 属性设置浮动标签文案', 'label prop sets the floating label copy'],
            ['包裹 MInput / MSelect 等控件', 'Wraps MInput / MSelect etc.'],
            ['与 variant="filled" / "outlined" 控件配合', 'Pairs with variant="filled" / "outlined" controls'],
          ],
        ),
        ...anti([
          ['传统后台表单硬套 MFloatLabel → 默认 label', 'Traditional admin form with MFloatLabel → default label'],
          ['需要常驻帮助文本仍用 MFloatLabel → 传统 label + helpText', 'Persistent help text with MFloatLabel → traditional label + helpText'],
        ]),
      },
      {
        component: 'MInplace',
        when: ['详情页点击编辑单字段', '浏览模式为主，编辑是例外'],
        whenEn: ['Click-to-edit single fields on detail pages', 'Read mode is primary; edit is the exception'],
        avoidWhen: ['表单页批量编辑', '需要校验的必填字段'],
        avoidWhenEn: ['Batch editing on a form page', 'Required fields needing validation'],
        recipe: recipe(
          [
            ['display 插槽展示态；content 插槽编辑态', 'display slot for read mode; content slot for edit mode'],
            ['closable 编辑态显示关闭按钮', 'closable shows a close button in edit mode'],
            ['@open / @close 控制编辑态切换', '@open / @close for edit mode toggle'],
          ],
        ),
        ...anti([
          ['表单页批量编辑用 MInplace → MForm', 'Batch editing via MInplace → MForm'],
          ['必填校验字段用 MInplace → MFormItem + errorMessage', 'Required validated field via MInplace → MFormItem + errorMessage'],
        ]),
      },
    ],
  },
  {
    id: 'specialized-input-choice',
    title: '旋钮、进度输入如何选择',
    titleEn: 'Choosing knob, meter, or progress inputs',
    question: '这是仪表盘式调节、多段进度展示，还是确定进度条？',
    questionEn: 'Is this a dial-style adjustment, a multi-segment progress display, or a determinate progress bar?',
    keywords: [
      '旋钮',
      '仪表盘',
      '进度',
      'knob',
      'meter',
      'progress',
      '调节',
      '阈值',
    ],
    options: [
      {
        component: 'MKnob',
        when: ['仪表盘式数值调节（阈值 / 音量 / 参数）', '视觉化调节比精确输入更重要'],
        whenEn: ['Dial-style value adjustment (threshold / volume / params)', 'Visual adjustment matters more than exact input'],
        avoidWhen: ['需要精确数值输入', '范围选择'],
        avoidWhenEn: ['Exact numeric input is required', 'A range selection is needed'],
        recipe: recipe(
          [
            ['v-model 数值；min / max / step 控制范围', 'v-model number; min / max / step for the range'],
            ['diameter 控制表盘大小', 'diameter for the dial size'],
            ['valueTemplate="{value}%" 自定义显示格式', 'valueTemplate="{value}%" for custom display'],
            ['ariaLabel 提供可访问名称', 'ariaLabel for the accessible name'],
          ],
        ),
        ...anti([
          ['精确数值输入用 MKnob → MInputNumber', 'Exact numeric input via MKnob → MInputNumber'],
          ['范围选择用 MKnob → MSlider', 'Range selection via MKnob → MSlider'],
        ]),
      },
      {
        component: 'MMeterGroup',
        when: ['多段进度展示（磁盘分区 / 预算分配）', '需要图例 + 百分比标签'],
        whenEn: ['Multi-segment progress display (disk partitions / budget allocation)', 'Legend + percentage labels are needed'],
        avoidWhen: ['单段进度', '需要交互调节'],
        avoidWhenEn: ['Single-segment progress', 'Interactive adjustment is needed'],
        recipe: recipe(
          [
            ['value 数组配置各段（label / value / color）', 'value array configures segments (label / value / color)'],
            ['labelTemplate 自定义标签格式', 'labelTemplate for custom label format'],
            ['max 总量（默认 100）', 'max for the total (default 100)'],
          ],
        ),
        ...anti([
          ['单段进度用 MMeterGroup → MProgressBar', 'Single-segment progress via MMeterGroup → MProgressBar'],
          ['交互调节用 MMeterGroup → MSlider / MKnob', 'Interactive adjustment via MMeterGroup → MSlider / MKnob'],
        ]),
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
