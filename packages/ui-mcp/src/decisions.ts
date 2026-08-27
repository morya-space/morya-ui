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
    id: 'overlay-choice',
    title: '如何选择浮层组件',
    titleEn: 'Choosing an overlay component',
    question: '这是确认、短任务、上下文操作，还是需要保留页面上下文的编辑？',
    questionEn: 'Is this a confirmation, short task, contextual action, or an edit that needs page context?',
    keywords: ['弹窗', '浮层', '模态', '侧栏', '确认', '编辑', 'dialog', 'drawer', 'popover', 'tooltip', 'modal', 'side editing', 'side panel', 'context'],
    options: [
      {
        component: 'Dialog',
        when: ['需要用户聚焦完成一项短到中等任务', '需要确认危险操作', '内容不适合直接放在页面流中'],
        whenEn: ['The user should focus on a short or medium-sized task', 'A destructive action needs confirmation', 'Content should not interrupt the page flow'],
        avoidWhen: ['内容接近完整页面', '用户需要持续查看底层页面上下文'],
        avoidWhenEn: ['The content is effectively a full page', 'The user must continuously reference the underlying page'],
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
    keywords: ['选择', '下拉', '多选', '树选择', '搜索选择', 'select', 'treeselect', 'autocomplete', 'dropdown'],
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
