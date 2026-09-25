# Decision recipes (scenario → component → key API)

Generated from `packages/ui-mcp/src/decisions.ts`. **Do not hand-edit** this file — run:

```bash
pnpm --filter @morya-ui/mcp generate:recipes
```

MCP: `recommend_component` (list / read by `decision` / query; options may include `relatedSnippets`). Full prop manuals still come from `get_component` + `validate_usage`. Prefer page snippets for composition; golden pages are optional block-order checks.

This file is the **offline** mirror for agents without MCP.

## `form-surface-choice` — 新建/编辑用弹窗还是独立表单页

> 表单是从列表触发的短录入，还是多分组/长流程的独立配置？

### Dialog

**When**

- 从列表/工具栏打开新建或编辑
- 字段大约 ≤8 个、单段表单
- 希望保存后仍停留在列表上下文

**Avoid when**

- 多步骤向导
- 多分组长配置页

**Recipe · props**

- v-model / modelValue 控制开关（不要用 visible）
- header 或 title 设弹窗标题
- width 约 32rem 适配短表单（见 form-in-dialog snippet）
- 表单字段用 fluid；主按钮 severity="primary"

**Recipe · slots**

- #footer 放取消/保存
- 默认插槽放 MForm + MFormItem

**Recipe · events**

- @close 重置表单模型
- 保存可用按钮 @click，或 MForm @submit + type="submit"

**Related snippets**

- `form-in-dialog`
- `page-header-actions`

**Anti-patterns**

- 用普通 Dialog 手写删除确认 → MConfirmDialog
- 长多分组配置塞进 Dialog → Form 页或 Drawer


### Drawer

**When**

- 表单比 Dialog 更长但仍需对照列表
- 详情+编辑侧滑

**Avoid when**

- 字段极少的确认式录入

**Recipe · props**

- v-model / modelValue 控制开关
- position 常用 right；较长表单可加大 size
- header 标明新建/编辑对象
- 字段 fluid；底栏操作对齐 #footer

**Recipe · slots**

- #footer 取消/保存
- 默认插槽 MForm

**Recipe · events**

- @close 清理草稿

**Related snippets**

- `form-in-drawer`

**Anti-patterns**

- 极短 2–3 字段也用 Drawer → Dialog
- 危险删除只用 Drawer 无确认 → MConfirmDialog


### Form

**When**

- 用户明确要求独立表单页
- 多分组、长校验、离开需确认的配置流

**Avoid when**

- 列表上的常规短 CRUD

**Recipe · props**

- MPageContent width="narrow"
- MPageSection variant="form" 包表单主体
- MPageSection variant="actions" 放底栏按钮
- 字段 v-model + fluid；校验用 invalid / errorMessage

**Recipe · slots**

- 默认插槽：MFormItem 字段

**Recipe · events**

- MForm @submit（或 @submit.prevent）
- 提交按钮 type="submit" + severity="primary"

**Related snippets**

- `page-content-form`
- `form-header`
- `form-body`
- `form-actions`

**Anti-patterns**

- 列表短 CRUD 开独立路由 → form-in-dialog
- 表单外再套装饰性 MCard → 用 PageSection form


---

## `overlay-choice` — 如何选择浮层组件

> 这是确认、短任务、上下文操作，还是需要保留页面上下文的编辑？

### Dialog

**When**

- 需要用户聚焦完成一项短到中等任务
- 列表页上的新建/编辑短表单（约 ≤8 个字段）
- 内容不适合直接放在页面流中

**Avoid when**

- 内容接近完整多分组页面
- 用户需要持续查看底层页面上下文且表单很长
- 只是危险操作确认

**Recipe · props**

- v-model 控制可见
- header / title
- modal 默认阻塞；任务型内容放默认插槽
- 危险确认不要用 Dialog 冒充 → ConfirmDialog

**Recipe · slots**

- #footer 主/次操作

**Recipe · events**

- @close / @update:modelValue

**Related snippets**

- `form-in-dialog`

**Anti-patterns**

- Dialog + 手写「确定删除」→ MConfirmDialog
- v-model:visible → v-model / modelValue


### Drawer

**When**

- 需要侧边编辑或查看详情
- 需要保留底层列表或工作区上下文
- 内容比普通确认框更长

**Avoid when**

- 只是简单确认
- 操作必须阻塞用户直到明确确认

**Recipe · props**

- v-model
- position="right"（常用）
- header 说明侧栏任务

**Recipe · slots**

- #footer 操作区

**Recipe · events**

- @close

**Related snippets**

- `form-in-drawer`

**Anti-patterns**

- 简单 Yes/No 确认用 Drawer → ConfirmDialog / ConfirmPopup


### Popover

**When**

- 轻量上下文操作或补充信息
- 不需要阻塞页面
- 内容与触发元素强相关

**Avoid when**

- 需要复杂表单或危险操作确认

**Recipe · props**

- v-model 或触发器控制显示
- placement 相对触发元素
- 内容保持短小

**Recipe · slots**

- 默认插槽：轻量内容

**Anti-patterns**

- 复杂表单塞进 Popover → Dialog / Drawer


### Tooltip

**When**

- 只展示简短说明
- 用户悬停或聚焦控件时需要补充提示

**Avoid when**

- 信息是必需内容
- 需要放置交互控件

**Recipe · props**

- content 或默认插槽短文案
- placement
- 包裹触发元素

**Anti-patterns**

- Tooltip 里放按钮/表单 → Popover / Dialog


---

## `data-display-choice` — 如何选择数据展示组件

> 用户需要比较行列数据、浏览卡片，还是查看树状层级？

### Table

**When**

- 数据有稳定列结构
- 用户需要排序、筛选、批量或行操作
- 需要高密度比较多条记录

**Avoid when**

- 每条数据结构差异很大
- 移动端无法承载横向列结构

**Recipe · props**

- columns + rows（没有 data prop）
- row-key 默认 id；不稳定时显式指定
- 全视口主列表可 MPageContent fill + MTable fill；嵌入/短页跳过
- 分页：paginator + rows-per-page 或 v-model:page
- 行选择：selectionMode + v-model:selection

**Recipe · slots**

- #cell-{key} 自定义单元格
- #empty 放 MEmpty

**Anti-patterns**

- :data → :rows
- 手写 <table> → MTable
- 嵌入表硬套 fill → 去掉 fill


### DataView

**When**

- 数据适合卡片或自定义列表项
- 视觉浏览比列对齐更重要
- 同一数据需要切换多种展示布局

**Avoid when**

- 用户必须精确比较字段
- 需要复杂列级排序或固定列

**Recipe · props**

- value / 数据源按文档绑定
- layout 切换列表/网格等
- 分页与空态按文档配置

**Recipe · slots**

- #list / #grid 等项模板

**Anti-patterns**

- 需要列对齐比较仍用 DataView → Table


### TreeTable

**When**

- 数据同时具有表格列和父子层级
- 用户需要展开、收起层级节点

**Avoid when**

- 数据没有真实层级关系
- 普通 Table 已能表达关系

**Recipe · props**

- columns + 带 children 的行数据
- 展开相关 prop 按文档（expandedKeys 等）
- row-key 稳定

**Recipe · slots**

- #cell-{key}

**Anti-patterns**

- 无层级硬用 TreeTable → Table


### Tree

**When**

- 主要任务是浏览或选择层级节点
- 节点信息不需要多列比较

**Avoid when**

- 每行需要展示多个可比较字段

**Recipe · props**

- :value / value 树节点数据
- selectionMode 单选/多选
- v-model:selectionKeys 或文档等价绑定

**Anti-patterns**

- 表单里选组织树 → 优先 TreeSelect


---

## `selection-choice` — 如何选择选择器

> 选项是平面少量、层级结构、多选标签，还是需要输入搜索？

### Select

**When**

- 平面选项数量中等
- 需要单选或多选
- 表单字段需要明确选项集合

**Avoid when**

- 选项有明显层级
- 用户需要输入自由文本并搜索建议

**Recipe · props**

- v-model
- :options 选项数组
- 表单内 fluid；可 clearable（或 showClear）
- 多选按文档 multiple

**Recipe · events**

- @change / @update:modelValue

**Anti-patterns**

- MDropdown 当枚举选择 → MSelect
- 层级数据用 Select → TreeSelect / CascadeSelect


### TreeSelect

**When**

- 选项有父子层级
- 用户需要按组织、分类或资源树选择

**Avoid when**

- 选项只是简单平面枚举

**Recipe · props**

- v-model
- :options 树形数据
- fluid；selectionMode 按需

**Anti-patterns**

- 平面枚举用 TreeSelect → Select


### AutoComplete

**When**

- 用户需要输入关键词搜索建议
- 候选项很多或来自远程接口
- 输入值本身也有意义

**Avoid when**

- 用户只能从固定枚举中选择
- 不应该允许自由输入

**Recipe · props**

- v-model
- suggestions / 远程加载按文档
- fluid

**Recipe · events**

- @complete 拉取建议

**Anti-patterns**

- 固定枚举却允许自由输入 → Select


### SelectButton

**When**

- 选项很少且需要全部露出
- 单选或多选都适合按钮组

**Avoid when**

- 选项超过大约 5 个
- 选项很长或来自远程搜索

**Recipe · props**

- v-model
- :options
- 选项文案保持短

**Anti-patterns**

- >5 个选项仍用 SelectButton → Select


### Radio

**When**

- 少量互斥选项需要和表单文案一起阅读
- 一次只能选一个

**Avoid when**

- 多选
- 选项很多需要收进弹出层

**Recipe · props**

- MRadioGroup v-model
- 各 MRadio value
- 与 MFormItem 一起用

**Anti-patterns**

- 多选需求用 Radio → Checkbox / Select multiple


### Listbox

**When**

- 选项需要始终以列表展示
- 可筛选，但不希望收成下拉框

**Avoid when**

- 页面空间紧、只需要一个闭合的选择框

**Recipe · props**

- v-model
- :options
- filter 按需开启

**Anti-patterns**

- 空间紧仍用 Listbox → Select


### CascadeSelect

**When**

- 值要按多级分栏逐级点选
- 层级是路径而不是可勾选的树

**Avoid when**

- 需要勾选树节点或搜索整棵树

**Recipe · props**

- v-model
- :options 级联数据
- fluid

**Anti-patterns**

- 可勾选树节点用 CascadeSelect → TreeSelect


---

## `surface-choice` — 如何选择内容容器

> 内容是否需要独立的视觉表面、标题和边界？

### Card

**When**

- 内容是页面中的独立业务区块
- 需要标题、副标题、页脚或 hover 表面
- 需要清晰的边界和内边距

**Avoid when**

- 页面已有过多嵌套表面
- 内容只是简单分组
- 列表表格外层

**Recipe · props**

- title / subtitle 按需
- shadow="always"|"hover"|"never"
- 仪表盘图表区可用 shadow="always"

**Recipe · slots**

- #header / #footer / #title 按需
- 默认插槽正文

**Anti-patterns**

- MPageFilters / MTable 外再套 MCard → 去掉外层 Card
- 表单主体用 Card 叠 PageSection form → 只用 PageSection


### Panel

**When**

- 需要可折叠或强调一个较长内容区块
- 内容具有明确的面板标题

**Avoid when**

- 只需要普通内容容器
- 标题和边界会增加视觉噪音

**Recipe · props**

- header 面板标题
- toggleable 可折叠时开启
- collapsed / v-model:collapsed 按文档

**Anti-patterns**

- 装饰性折叠用不必要的 Panel → Card 或纯布局


### Fieldset

**When**

- 需要语义化分组相关表单字段
- 分组标题对理解表单很重要

**Avoid when**

- 内容不是表单字段
- 只是为了增加装饰边框

**Recipe · props**

- legend / 标题文案
- 内放 MFormItem 字段
- 勿用于非表单装饰框

**Anti-patterns**

- 非表单内容用 Fieldset → Card / PageSection


---

## `layout-spacing-choice` — 如何选择页面间距组件

> 控件组、页面区块、栅格之间需要哪种间距与对齐方式？

### PageContent

**When**

- 页面主内容区需要统一的 padding 和垂直 gap
- 列表/表单/仪表盘区块纵向堆叠

**Avoid when**

- 只是两个按钮之间的水平间距

**Recipe · props**

- 默认包裹列表/表单主列
- 表单页 width="narrow"
- bands 默认即可；勿再套多余 padding 容器

**Anti-patterns**

- 按钮间距用 PageContent → Space / Flex


### Flex

**When**

- 同一行控件需要 gap 和对齐
- 工具栏内操作组、筛选控件组

**Avoid when**

- 整个页面区块的 padding 和垂直 rhythm

**Recipe · props**

- gap / align / justify 按需（或等价 class/prop）
- 筛选行、工具栏内组优先 Flex
- 不要用 Flex 代替 PageContent 的页面 padding

**Anti-patterns**

- 整页垂直节奏用 Flex → PageContent


### Space

**When**

- 简单 wrap 控件组且不需要 justify 语义
- 表格行内操作按钮组

**Avoid when**

- 页面级标题与主操作两端对齐

**Recipe · props**

- 包裹 MButton 组
- 行内操作常用 size="small" text 按钮
- Dialog #footer 内可用 Space + justify-content:flex-end

**Anti-patterns**

- 标题与主按钮两端对齐只用 Space → PageToolbar / Flex justify


### Grid

**When**

- KPI 卡片、仪表盘双栏、响应式列布局

**Avoid when**

- 单个筛选行或表单字段列

**Recipe · props**

- 列数用文档 columns / 响应式配置
- KPI：Grid + MPageStat
- gap 走 token，勿写裸 px

**Anti-patterns**

- 筛选行用 Grid → Flex / PageFilters


---

## `page-section-choice` — 如何选择页面区块组件

> 这是筛选区、标题区、表单表面、KPI 还是图表占位？

### PageFilters

**When**

- 列表页或搜索页的筛选/查询区域
- 需要统一浅色背景与边框

**Avoid when**

- 普通表单字段分组
- KPI 指标展示

**Recipe · props**

- 内放 MInput / MSelect；同行用 MSpace wrap
- 查询/重置放 #actions（与折叠切换同列）
- 默认 variant="filled"；dense craft 用 plain + size="small"
- 有次要条件：collapsible + v-model:expanded + #advanced
- toggle 默认「高级筛选/收起」+ chevron；已选用 FilterChips

**Recipe · slots**

- #actions 查询/重置
- #advanced 高级筛选
- #active 可选；更常见是下方 FilterChips

**Related snippets**

- `list-filters-stack`
- `list-filters`
- `list-filters-collapsible`
- `list-filter-chips`
- `list-filters-dense`

**Anti-patterns**

- 表单字段组用 PageFilters → PageSection form / Fieldset
- 手写已选条 → list-filter-chips / list-filters-stack


### PageToolbar

**When**

- 页面标题 + 右侧主操作
- 列表页新建按钮区域

**Avoid when**

- 带长描述的表单引导区

**Recipe · props**

- 左侧标题、右侧主按钮
- 主按钮 severity="primary"；全页仅一个主按钮
- 批量操作条也可放工具栏区

**Recipe · slots**

- #actions 右侧操作

**Anti-patterns**

- 需要长描述仍用 Toolbar → PageHeader


### PageHeader

**When**

- 页面标题 + 描述文案
- 表单页/详情页引导

**Avoid when**

- 只有标题和单个主按钮的列表工具栏

**Recipe · props**

- title + description
- 详情可用 #breadcrumb / #tags（放 MStatus）
- 列表页仅标题+新建时优先 PageToolbar

**Recipe · slots**

- #breadcrumb
- #tags / #actions

**Anti-patterns**

- 纯列表标题+新建仍用 Header → PageToolbar


### PageSection

**When**

- 表单主体表面 (variant="form")
- 底栏操作区 (variant="actions")

**Avoid when**

- 列表页筛选区
- KPI 卡片

**Recipe · props**

- variant="form" 表单主体
- variant="actions" 底栏
- 可选 title 分组

**Anti-patterns**

- variant="form" 外再套 MCard → 双边框


### PageStat

**When**

- 仪表盘 KPI 单指标卡
- 需要 label/value/trend/icon 结构

**Avoid when**

- 普通内容分组
- 表格或表单

**Recipe · props**

- label + value
- trend / trendSeverity / trendDirection 按需
- loading 骨架；layout card|plain

**Anti-patterns**

- 普通段落用 PageStat → 文案或 Card


### PagePlaceholder

**When**

- 图表、地图或媒体区域尚未接入
- 需要 dashed 占位表面

**Avoid when**

- 真实数据表格或表单

**Recipe · props**

- description 说明待接入内容
- 可配合 MEmpty 于 Card 内（仪表盘图表区）
- minHeight 避免占位塌缩

**Anti-patterns**

- 真实表格用 Placeholder → MTable


---

## `page-scroll-choice` — 页面滚动如何选择

> 这是整页滚动、组件内置滚动，还是业务手写的局部滚动区？

### MLayout fillViewport

**When**

- 整页后台列表/表单/仪表盘
- 需要 Header + Content + 可选 Sider 的应用骨架
- 页面主滚动应随 Layout 主题化

**Avoid when**

- 单个卡片内部的小块内容
- 需要业务自行控制滚动的 Dialog/Drawer 内容

**Recipe · props**

- MLayout fill-viewport（或 :fill-viewport="true"）
- 内容放 MLayoutContent
- 是否再 fill 表格：见下方「MPageContent fill + MTable fill」判断
- 侧栏用 MLayoutSider + MMenu，不是随便一个 Drawer

**Anti-patterns**

- 在 Layout 外再包一层 100vh 滚动 → 去掉


### MPageContent fill + MTable fill

**When**

- 全视口后台列表，页面主任务就是浏览一张表
- 内容高度表格会留下大块空白、分页悬在中间不好看
- 希望只有表体滚动、分页贴在页面最下方

**Avoid when**

- 仪表盘/详情里的嵌入小表
- 内容本身很短、内容高度即可
- 整页应作为文档滚动（长筛选+说明+表格）
- Dialog / Drawer 内表格

**Recipe · props**

- 先判断是否适合 fill，再写 MPageContent fill + MTable fill
- paginator 或同级 MPagination
- 适合时不要手写 min-height / calc

**Anti-patterns**

- 嵌入/短页硬套 fill → 去掉
- 适合 fill 却手写 calc → 改用 fill


### MScrollbar

**When**

- 业务自行限高的卡片正文、侧栏、日志列表，且希望主题化滚动条
- Dialog / Drawer 等内容区需要主题滚动时由业务显式包一层
- 组件未内置滚动、又需要统一滚动外观时

**Avoid when**

- Dialog / Drawer / Popover / Splitter 等用户内容插槽被组件库强行包滚动
- Textarea 等原生控件自身的滚动
- MTable / MLayoutContent / Select 弹出层等已内置滚动的区域

**Recipe · props**

- 显式限高后包裹内容
- 只包业务自有滚动区
- 不要叠两层滚动

**Anti-patterns**

- MTable 外包 MScrollbar → 去掉外层


### Built-in (no extra wrapper)

**When**

- MLayout、MTable、MVirtualScroller、菜单/下拉面板等已内置 MScrollbar
- 浮层菜单与子菜单（Dropdown/ContextMenu/TieredMenu/Menu flyout）

**Avoid when**

- 在已内置滚动的组件外再包一层滚动容器

**Recipe · props**

- 信任组件内置滚动，不再包一层
- Table / LayoutContent 直接用
- 菜单/Select 弹出层也不要外包滚动

**Anti-patterns**

- 双重滚动条 → 去掉业务包装层


---

## `surface-nesting-choice` — 如何避免双边框与多余容器

> 内容是否已经被 Page 组件或 Table 提供了边界？

### PageContent + MTable

**When**

- 列表页数据表格
- MPageFilters 已提供筛选区边界

**Avoid when**

- 需要独立卡片标题的内容模块

**Recipe · props**

- MPageContent > MPageFilters + MTable
- 表格直接放 PageContent，不套 Card
- 高度：全视口主列表再考虑 fill；嵌入/短页跳过
- 空态用 Table #empty + MEmpty

**Anti-patterns**

- Table 外包 MCard → 去掉 Card
- 嵌入表硬套 fill → 去掉 fill


### MCard

**When**

- 仪表盘中的图表区/明细区
- 需要 card 标题的内容模块

**Avoid when**

- 列表页表格外层
- 筛选区外层

**Recipe · props**

- title + 正文；图表待接入可用 MEmpty
- shadow 按仪表盘需要选择
- 仅用于需要独立标题的模块

**Anti-patterns**

- 列表筛选区套 Card → PageFilters 自带边界


### PageSection

**When**

- 表单页主体或 actions 底栏
- 需要统一 form surface

**Avoid when**

- 再套 MCard variant form 导致双边框

**Recipe · props**

- variant="form" / variant="actions"
- 不要再外包 MCard
- 表单字段放 form 段，按钮放 actions 段

**Anti-patterns**

- PageSection form + MCard → 只留 PageSection


---

## `loading-choice` — 如何选择加载反馈

> 这是区域或全屏等待、已知布局的占位、可量化进度，还是只需要阻止交互？

### Loading

**When**

- 一块区域或整页正在等待，用户暂时不能操作这块内容
- 需要加载文案、多种动效，或用 v-loading / loading.service 盖住已有节点
- 全屏提交、保存、跳转前的短暂等待

**Avoid when**

- 布局已知、希望用占位块避免跳动
- 进度可以量化
- 只是按钮自己的 loading 状态

**Recipe · props**

- 包裹内容：MLoading :loading="…" 或 v-loading
- 全屏：fullscreen / loading.service
- 按钮等待用 Button loading，不要盖整表

**Anti-patterns**

- 区域遮罩用 ProgressSpinner → Loading / v-loading
- 按钮转圈用整页 Loading → Button :loading


### Skeleton

**When**

- 内容结构已知，用占位块表示即将出现的卡片、文本或列表
- 仪表盘或详情初次进入

**Avoid when**

- 需要明确的“正在加载”遮罩
- 进度可量化

**Recipe · props**

- shape rectangle|circle；text + repeat 模拟多行
- width / height 贴近最终布局
- PageStat 可用自带 loading

**Anti-patterns**

- 未知时长又要文案遮罩 → Loading


### ProgressBar

**When**

- 进度有百分比或可估算完成度
- 上传、导入等长任务

**Avoid when**

- 不知道还要等多久
- 只是挡住一块区域

**Recipe · props**

- value 0–100（或文档等价）
- 显示百分比文案
- 上传/导入长任务优先

**Anti-patterns**

- 未知进度用 ProgressBar → Loading


### ProgressSpinner

**When**

- 行内或控件旁需要一个很小的转圈，不盖住内容

**Avoid when**

- 区域遮罩、全屏等待或带文案的加载态

**Recipe · props**

- 仅作行内指示
- 尺寸保持小
- 不要盖住整块区域

**Anti-patterns**

- 当页面遮罩用 Spinner → Loading


### BlockUI

**When**

- 只需要阻止点击，不需要表达“正在加载”

**Avoid when**

- 用户需要知道正在等待结果

**Recipe · props**

- blocked 控制遮罩
- 包裹需要禁用的区域
- 无加载文案时用，有文案改 Loading

**Anti-patterns**

- 需要“加载中”文案仍用 BlockUI → Loading


---

## `status-label-choice` — 如何选择状态与标签

> 这是行内业务状态、分类标签、可移除实体，还是挂在控件上的数量？

### Status

**When**

- 表格单元格或标题旁的业务状态
- 需要圆点或语义图标加短文案

**Avoid when**

- 可关闭的分类标签
- 挂在按钮上的数字

**Recipe · props**

- label + severity
- variant 默认 dot；可用 tag|text
- 表格状态列优先 MStatus，不要一排实心 Tag

**Anti-patterns**

- 可关闭分类用 Status → Tag closable


### Tag

**When**

- 分类、筛选结果或可关闭标签
- 需要比 Status 更像芯片的表面

**Avoid when**

- 只是一行里的轻量状态
- 带图片且代表一个可移除实体

**Recipe · props**

- value 或默认插槽文案
- severity；closable + @close
- rounded / bordered 按需

**Recipe · events**

- @close

**Anti-patterns**

- 行内启用/停用状态用 Tag → Status


### Chip

**When**

- 短实体信息，可带图标、图片和移除

**Avoid when**

- 纯状态色点
- 只是分类色块

**Recipe · props**

- label；icon 或 image
- removable + @remove
- severity 按需

**Recipe · events**

- @remove

**Anti-patterns**

- 纯状态点用 Chip → Status


### Badge

**When**

- 角标数量或圆点，附着在按钮、头像等控件上

**Avoid when**

- 独立成行的状态文案

**Recipe · props**

- value 数量；省略则圆点
- severity；max 封顶
- 默认插槽包裹宿主控件

**Recipe · slots**

- 默认插槽：被角标包裹的控件

**Anti-patterns**

- 独立状态文案用 Badge → Status / Tag


---

## `empty-result-choice` — 空态还是结果页

> 这是没有数据，还是流程已经结束的成功、失败或 HTTP 状态？

### Empty

**When**

- 列表没有行
- 筛选没有命中
- 首次使用，需要引导创建

**Avoid when**

- 接口失败
- 无权限
- 页面不存在
- 提交成功回执

**Recipe · props**

- title + description
- icon 或 illustration 按需（默认即可）
- 表格内放在 #empty

**Recipe · slots**

- #extra 放下一步按钮（创建…）

**Related snippets**

- `empty-block`

**Anti-patterns**

- 403/404 用 Empty → Result
- #action → #extra


### Result

**When**

- 提交成功或失败的终点页
- 403 / 404 / 500 等阻断状态
- 需要明确的下一步（返回、重试、回首页）

**Avoid when**

- 正常的无数据
- 表格内部的空行

**Recipe · props**

- status：success|error|403|404|500 等
- title + description
- size 按页面比重

**Recipe · slots**

- #footer 逃逸/下一步按钮

**Related snippets**

- `result-block`

**Anti-patterns**

- 表格无数据用 Result → Empty
- 操作插槽写成 #extra → #footer


---

## `action-menu-choice` — 如何选择菜单

> 这是按钮上的操作项、侧栏导航、右键菜单，还是全局命令搜索？

### Dropdown

**When**

- 从按钮或图标打开一组操作
- 编辑、删除、更多

**Avoid when**

- 表单里选一个枚举值
- 常驻侧栏导航

**Recipe · props**

- :model / items 操作项
- 触发器放默认插槽（按钮/图标）
- 危险项用文档 severity / 确认流

**Related snippets**

- `row-actions-menu`
- `list-row-actions`

**Anti-patterns**

- 表单枚举用 Dropdown → Select


### Menu

**When**

- 后台侧栏或页面内的常驻导航
- 需要选中项与路由同步

**Avoid when**

- 一次性操作菜单
- 右键弹出

**Recipe · props**

- :model 导航项（含 icon）
- 放在 MLayoutSider 内
- 与路由选中态同步

**Anti-patterns**

- 行内「更多」用 Menu → Dropdown


### ContextMenu

**When**

- 在指针位置弹出，通常由右键触发

**Avoid when**

- 可见的导航
- 表单选择

**Recipe · props**

- :model 菜单项
- 绑定上下文目标事件（右键）
- 在指针位置打开，不是侧栏常驻

**Anti-patterns**

- 常驻导航用 ContextMenu → Menu


### CommandMenu

**When**

- 全局搜索命令或跳转
- 键盘优先，例如 Cmd/Ctrl+K

**Avoid when**

- 少量固定操作放在按钮旁即可

**Recipe · props**

- v-model 开关
- 命令列表 / 搜索按文档
- 全局快捷键打开

**Anti-patterns**

- 两三个固定操作也用 CommandMenu → Dropdown / 按钮


### Menubar

**When**

- 顶部应用菜单，项很多且分组

**Avoid when**

- 侧栏只有一层链接

**Recipe · props**

- :model 分组菜单
- 放在顶栏而非侧栏
- 项多且需要分组时再用

**Anti-patterns**

- 侧栏单层链接用 Menubar → Menu


---

## `feedback-choice` — 如何选择操作反馈

> 这是一句话结果、带详情的通知，还是要留在表单里的错误？

### message

**When**

- CRUD / 保存 / 删除后的单行结果
- 不需要单独标题和详情

**Avoid when**

- 需要 summary + detail
- 错误必须留在表单直到修正

**Recipe · props**

- import { message } from 'morya-ui'
- message.success('已保存') / info / warn / error
- 大多数操作反馈的默认选择

**Related snippets**

- `confirm-delete`
- `form-in-dialog`

**Anti-patterns**

- toast.add({ summary: '已保存' }) → message.success('已保存')
- <MMessage severity> 当内嵌 Alert → errorMessage / role="alert"


### toast

**When**

- 需要 summary + detail
- 异步/后台任务完成感

**Avoid when**

- 只有一句话的 CRUD 回执

**Recipe · props**

- import { toast } from 'morya-ui'
- toast.success({ summary, detail })
- 不要用 toast 代替默认 message

**Anti-patterns**

- 单行「已保存」用 toast → message


### field errorMessage / role="alert"

**When**

- 字段校验错误需常驻
- 登录/鉴权失败需留在表单区

**Avoid when**

- 一次性操作成功提示

**Recipe · props**

- 字段：invalid + errorMessage
- 表单级：token 样式的 role="alert" 条（见 login-page）
- <MMessage> 只是 message 宿主，不是内嵌 Alert

**Related snippets**

- `auth-split-shell`

**Anti-patterns**

- 登录失败只闪 Toast → 表单区 alert / errorMessage
- 编造 MMessage severity 插槽 Alert API


---

## `confirm-choice` — 如何选择确认框

> 危险操作需要居中确认，还是贴着触发点的轻量确认？

### ConfirmDialog

**When**

- 删除/不可逆操作需要明确确认
- 需要标题、说明与阻塞式决定
- 列表行删除的默认选择

**Avoid when**

- 只需贴着按钮的轻量确认
- 复杂编辑表单（那是 Dialog）

**Recipe · props**

- v-model / modelValue
- header + message
- acceptLabel / rejectLabel
- acceptSeverity="danger" 用于删除

**Recipe · events**

- @accept 执行删除
- @reject 关闭

**Related snippets**

- `confirm-delete`

**Anti-patterns**

- 普通 Dialog 手写「确定/取消」删除 → ConfirmDialog
- 编辑表单误用 ConfirmDialog → Dialog + Form


### ConfirmPopup

**When**

- 确认应贴着触发按钮/行内操作
- 文案短、不需要大对话框

**Avoid when**

- 需要醒目标题与强阻塞感的删除
- 无定位目标时的全局确认

**Recipe · props**

- v-model / modelValue
- message；acceptSeverity="danger" 按需
- target 锚定触发元素（或 position）
- placement top|bottom|left|right

**Recipe · events**

- @accept / @reject

**Related snippets**

- `confirm-delete`

**Anti-patterns**

- 无 target 的全局危险确认 → ConfirmDialog
