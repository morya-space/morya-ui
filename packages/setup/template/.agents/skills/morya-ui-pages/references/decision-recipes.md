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
- 表单字段用 fluid；主按钮 type="primary"

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
- 提交按钮 html-type="submit" + type="primary"

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
- 大行数：virtual + maxHeight/tableHeight/fill
- 列宽/表头筛选：resizable / filterable
- 树表：tree-config + v-model:expanded-row-keys（children 或 transform）

**Recipe · slots**

- #cell-{key} 自定义单元格
- #empty 放 MEmpty
- 多级表头 children；表尾 show-footer + footer-method

**Anti-patterns**

- :data → :rows
- 手写 <table> → MTable
- 嵌入表硬套 fill → 去掉 fill
- 无高度开 virtual → 配 maxHeight/tableHeight/fill
- 无层级硬套 treeConfig → 普通 Table


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

- size / gap 控制间距（gap 是 size 的别名，优先用 size）
- align 控制交叉轴对齐（start / center / end / baseline / stretch）
- justify 控制主轴分布（start / center / end / between / around / evenly）
- wrap 允许折行；筛选行、工具栏内组优先 Flex
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

- size 控制间距；默认 wrap 折行
- align 交叉轴对齐（同 Flex）；没有 justify 语义
- vertical 垂直堆叠控件组
- 包裹 MButton 组；行内操作常用 size="small" text 按钮
- Dialog #footer 内可用 Space + style justify-content:flex-end

**Anti-patterns**

- 标题与主按钮两端对齐只用 Space → PageToolbar / Flex justify
- 需要精确对齐控制仍用 Space → Flex


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
- 主按钮 type="primary"；全页仅一个主按钮
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
- trend / trendType / trendDirection 按需
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

- label + type
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
- type；closable + @close
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
- type 按需

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
- type；max 封顶
- 默认插槽包裹宿主控件

**Recipe · slots**

- 默认插槽：被角标包裹的控件

**Anti-patterns**

- 独立状态文案用 Badge → Status / Tag
- MButton badge / badgeColor → 用 MBadge 包裹按钮


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
- 主区域优先 illustration（no-content / no-result…）
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
- 危险项走确认流（ConfirmDialog）

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
- <MMessage type> 当内嵌 Alert → errorMessage / role="alert"


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
- 编造 MMessage type / 插槽 Alert API


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
- acceptColor="danger" 用于删除

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
- message；acceptColor="danger" 按需
- target 锚定触发元素（或 position）
- placement top|bottom|left|right

**Recipe · events**

- @accept / @reject

**Related snippets**

- `confirm-delete`

**Anti-patterns**

- 无 target 的全局危险确认 → ConfirmDialog


---

## `button-icon-choice` — 按钮图标放在哪里

> 按钮需要带图标时，是用 icon prop、#icon 插槽，还是纯图标按钮？

### icon prop

**When**

- 标准图标与文字按钮
- 图标来自 morya-ui 内置图标名

**Avoid when**

- 需要自定义 SVG / 组件图标
- loading 时要换不同图标

**Recipe · props**

- icon="plus" 传内置图标名
- iconPlacement="end" 图标放文字右侧
- 图标随按钮 size 自动缩放
- loading 时自动替换为转圈

**Anti-patterns**

- 手动 <MIcon /> 放默认插槽 → icon prop
- 图标和文字间距手写 margin → 交给组件


### #icon slot

**When**

- 自定义 SVG / 组件图标
- loading 时要用 #loadingicon 换不同图标

**Avoid when**

- 标准内置图标名即可满足

**Recipe · props**

- #icon 放任意 VNode（自定义 SVG / 组件）
- #loadingicon 自定义 loading 态图标
- 图标仍随按钮 size 缩放，对齐由组件保证

**Anti-patterns**

- #icon 和默认插槽混放导致间距错乱 → 只用一个


### iconOnly

**When**

- 工具栏 / 卡片头部等空间紧张处
- 图标含义对用户足够明确（如 删除/编辑/关闭）

**Avoid when**

- 用户可能不认识图标含义
- 表单提交等需要明确文字的操作

**Recipe · props**

- iconOnly + icon="…" 或 #icon
- 必须配 ariaLabel（无视觉文字，屏幕阅读器依赖）
- shape="circle" 圆形图标按钮
- 仍可用 loading 切换转圈

**Anti-patterns**

- iconOnly 把图标放默认插槽 → icon prop 或 #icon
- iconOnly 不写 ariaLabel → 必填
- 含义不明确的图标硬用 iconOnly → 加文字


---

## `input-addon-choice` — 输入框前后缀如何选择

> 输入框需要带图标或文字前缀时，用 MIconField 还是 MInput 插槽？

### MIconField

**When**

- 输入框内左/右侧放一个图标（搜索、清除提示等）

**Avoid when**

- 需要文字前缀 / 后缀
- 需要合并多个控件（输入框 + 按钮）

**Recipe · props**

- iconPosition="left"（默认）或 "right"
- #icon 插槽放 MIcon 或任意图标
- 默认插槽放 MInput / MTextarea 等控件
- 图标随控件主题对齐，无需手写定位

**Recipe · slots**

- #icon 图标内容
- 默认插槽：输入控件

**Anti-patterns**

- 手写 absolute 定位图标 → MIconField
- 文字前缀用 MIconField → MInput 的 #prefix / #suffix 插槽


### MInput #prefix / #suffix

**When**

- 输入框需要文字前缀 / 后缀（如 https://、$、单位）

**Avoid when**

- 只是输入框内放一个图标

**Recipe · slots**

- #prefix 放文字前缀（https://、$）
- #suffix 放文字后缀（单位、.00）
- 前后缀随输入框状态（disabled / invalid / size）自动对齐

**Anti-patterns**

- 输入框内单图标用 #prefix → MIconField


---

## `toggle-input-choice` — 开关、复选框、滑块、标签输入如何选择

> 这个输入是立即生效的设置、表单提交时的勾选、范围调节，还是自由标签输入？

### MSwitch

**When**

- 设置项立即生效，不需要点保存
- 只有开 / 关两种状态

**Avoid when**

- 表单提交时才确认的勾选协议
- 需要从多个选项中选

**Recipe · props**

- v-model 布尔值
- loading 显示转圈并阻止切换
- checkedText / uncheckedText 自定义状态文案
- label 或外部 MFormItem 提供可访问名称

**Anti-patterns**

- 协议确认用 MSwitch → MCheckbox
- 多选需求用多个 MSwitch → MCheckboxGroup / MSelect


### MCheckbox

**When**

- 表单提交时才生效的勾选（协议、批量选择）
- 需要从固定选项中选多个

**Avoid when**

- 设置项需要立即生效

**Recipe · props**

- MCheckboxGroup v-model 数组包多个 MCheckbox
- 单个勾选用 MCheckbox v-model 布尔值
- 与 MFormItem 一起用，提交时校验

**Anti-patterns**

- 立即生效设置用 MCheckbox → MSwitch


### MSlider

**When**

- 范围调节（音量、价格区间、阈值）
- 视觉化比例比精确数值更重要

**Avoid when**

- 需要精确输入数值
- 选项是离散枚举

**Recipe · props**

- v-model 数值或 range 数值数组
- min / max / step 控制范围
- marks 显示刻度标签
- tooltip 拖拽时显示当前值

**Anti-patterns**

- 精确数值输入用 MSlider → MInputNumber
- 离散枚举选择用 MSlider → MSelect / MSelectButton


### MInputTags

**When**

- 自由输入并回车生成标签（关键词、邮箱列表）
- 标签内容不受固定选项约束

**Avoid when**

- 只能从预定义选项中选
- 单个值输入

**Recipe · props**

- v-model 字符串数组
- separator 支持逗号等额外分隔符
- max 限制标签数量
- addOnBlur 失焦时自动添加

**Anti-patterns**

- 固定选项多选用 MInputTags → MSelect mode="multiple"
- 允许创建新选项但要从建议中选 → MSelect mode="tags"


---

## `status-display-choice` — 头像、图片、标签、状态如何选择

> 这是用户头像、可预览图片、分类标签、可移除实体，还是行内业务状态？

### MAvatar

**When**

- 展示单个用户 / 实体头像
- 图片加载失败需要回退到首字母或图标

**Avoid when**

- 需要展示多个用户堆叠
- 需要点击预览大图

**Recipe · props**

- image 头像图片 URL，优先于 icon 和 label
- label 回退首字母；icon 回退内置图标
- shape="circle"（默认）或 "square"
- size 可选 xlarge 用于个人资料页

**Anti-patterns**

- 多用户堆叠用多个 MAvatar → MAvatarGroup
- 手写 img 圆形头像 → MAvatar


### MAvatarGroup

**When**

- 多个用户头像堆叠展示
- 超出数量需要 +N 计数

**Avoid when**

- 单个用户头像

**Recipe · props**

- 包裹多个 MAvatar
- max 控制最多显示几个，超出显示 +N
- size 统一控制组内头像尺寸

**Anti-patterns**

- 单个头像用 MAvatarGroup → MAvatar


### MImage

**When**

- 需要点击预览大图
- 需要懒加载或 fit 控制

**Avoid when**

- 纯装饰背景图
- 不需要预览的普通图片

**Recipe · props**

- preview 默认开启，点击放大
- previewSrc 可指定不同于 src 的大图
- fit 控制 object-fit（cover / contain / fill…）
- width / height 显式设置避免布局抖动

**Anti-patterns**

- 需要预览却手写 img → MImage
- 用户头像用 MImage → MAvatar


### MTag

**When**

- 分类、筛选结果或可关闭标签
- 需要比 Status 更像芯片的表面

**Avoid when**

- 只是一行里的轻量状态
- 带图片且代表一个可移除实体

**Recipe · props**

- value 或默认插槽文案
- type 语义色；closable + @close
- checkable + v-model:checked 可选中切换
- icon 加内置图标；rounded 圆角

**Recipe · events**

- @close 关闭标签

**Anti-patterns**

- 行内启用/停用状态用 MTag → MStatus
- 可移除实体（带头像）用 MTag → MChip


---

## `nav-pattern-choice` — 页面内导航模式如何选择

> 这是长页面锚点跳转、滚动固定、内容切换、分步流程，还是层级路径？

### MAnchor

**When**

- 长页面右侧锚点导航
- 内容区块有明确标题层级

**Avoid when**

- 页面很短不需要跳转
- 需要切换显示不同内容面板

**Recipe · props**

- items 手动指定，或根据标题自动生成
- 与 MLayoutContent 长页面配合
- 点击平滑滚动到对应区块

**Anti-patterns**

- 内容切换用 MAnchor → MTabs


### MAffix

**When**

- 元素滚动到某位置后固定（操作栏吸顶、侧栏跟随）

**Avoid when**

- 页面顶部固定导航（那是 MLayoutHeader）
- 元素不需要随滚动变化

**Recipe · props**

- offsetTop 距离顶部多少时固定
- target 指定滚动容器（默认 window）
- z-index 按需调整避免被遮挡

**Anti-patterns**

- 页面顶部导航用 MAffix → MLayoutHeader


### MTabs

**When**

- 多个内容面板切换显示
- 标签数量适中且需要全部可见

**Avoid when**

- 选项是表单值（用 MSelectButton）
- 需要手风琴折叠展开

**Recipe · props**

- v-model:value 控制当前标签
- closable 可关闭标签（配合 @tab-close）
- 与路由结合时用 to 或 @tab-click 导航

**Anti-patterns**

- 表单选项用 MTabs → MSelectButton
- 折叠面板用 MTabs → MAccordion


### MStepper

**When**

- 多步表单 / 流程向导
- 步骤有前后依赖关系

**Avoid when**

- 内容无顺序关系的切换
- 步骤极少（2 步用对话框即可）

**Recipe · props**

- v-model 当前步骤索引
- steps 配置每步标题 / 描述 / 图标
- 线性模式禁止跳步；非线性允许点击跳转
- 与 MForm 分步校验配合

**Anti-patterns**

- 无顺序内容切换用 MStepper → MTabs
- 两步确认也用 MStepper → 对话框


### MBreadcrumb

**When**

- 展示当前页面在层级中的路径
- 层级较深（≥3 层）的后台系统

**Avoid when**

- 层级很浅（首页 → 列表页）
- 移动端空间紧张

**Recipe · props**

- model 数组配置路径项（label + to / icon）
- 首页项常用 home 图标
- 与 MPageHeader #breadcrumb 插槽配合

**Anti-patterns**

- 层级浅硬套 MBreadcrumb → 去掉
- 用 MBreadcrumb 代替 Tabs 切换 → MTabs


---

## `date-input-choice` — 日期时间输入如何选择

> 这是表单内选择日期 / 时间，还是整月视图展示与选择？

### MDatePicker

**When**

- 表单内选择日期 / 日期时间 / 月份 / 年份
- 需要范围选择或快捷选项

**Avoid when**

- 需要整月视图展示事件
- 只需要选时间

**Recipe · props**

- type="date"（默认）/ daterange / datetime / datetimerange / month / year
- shortcuts 预设快捷选项（今天 / 最近 7 天…）
- needConfirm 用于 datetime / time，避免误触提交
- mask 允许手动输入并自动补分隔符
- fluid 表单内占满宽度

**Recipe · events**

- @change 提交选择（含 clear 以外的所有变更）

**Anti-patterns**

- 整月事件展示用 MDatePicker → MCalendar
- 只需要时间用 MDatePicker type="time" → MTimePicker


### MTimePicker

**When**

- 只需要选择时间（小时 / 分钟 / 秒）

**Avoid when**

- 需要同时选日期
- 需要整月视图

**Recipe · props**

- 复用 MDatePicker props，type 固定为 time
- showSeconds 显示秒
- needConfirm 推荐开启，避免滚动误触

**Anti-patterns**

- 日期时间混合用 MTimePicker → MDatePicker type="datetime"


### MCalendar

**When**

- 整月视图展示事件 / 排班 / 标记日期
- 需要自定义日期单元格内容

**Avoid when**

- 表单内紧凑选择日期
- 空间紧张

**Recipe · props**

- v-model 选中日期；mode="month"（默认）或 "year"
- fullscreen 占满容器；false 为紧凑卡片
- #dateCell 自定义日期内容（事件标记）
- disabledDate / validRange 限制可选范围

**Recipe · slots**

- #dateCell 自定义日期单元格
- #header 自定义头部（含年月切换）

**Recipe · events**

- @panelChange 面板切换（年月 / 模式）

**Anti-patterns**

- 表单内紧凑日期选择用 MCalendar → MDatePicker
- 简单日期选择也写 #dateCell → 先用默认


---

## `media-display-choice` — 轮播、画廊、时间线、评分如何选择

> 这是内容轮播、图片画廊、事件流，还是用户评分？

### MCarousel

**When**

- 内容轮播（不限图片，卡片 / 图文混排）
- 需要箭头 / 指示点 / 自动播放

**Avoid when**

- 纯图片展示且需要缩略图
- 垂直滚动列表

**Recipe · props**

- MCarouselItem 包每页内容
- effect="slide"（默认）/ fade / card
- autoplay + interval 自动播放；loop 循环
- slidesPerView 一次显示多页

**Recipe · events**

- @update:currentIndex 切换页码

**Anti-patterns**

- 纯图片展示用 MCarousel → MGallery
- 垂直滚动列表用 MCarousel direction="vertical" → 普通滚动


### MGallery

**When**

- 纯图片展示（产品图 / 相册）
- 需要缩略图 + 点击预览

**Avoid when**

- 内容不限于图片
- 需要自动播放

**Recipe · props**

- images 传 URL 数组或 { src, alt, caption } 对象
- 点击主图进入预览模式
- 缩略图条自动同步

**Anti-patterns**

- 图文混排轮播用 MGallery → MCarousel
- 单张图片预览用 MGallery → MImage


### MTimeline

**When**

- 事件流 / 物流跟踪 / 操作记录
- 需要按时间顺序展示状态变化

**Avoid when**

- 静态步骤流程（用 MStepper）
- 无时间属性的普通列表

**Recipe · props**

- value 数组配置事件（status / content / date / icon / type）
- layout="vertical"（默认）或 "horizontal"
- align="alternate" 左右交错
- pending 显示待续节点

**Recipe · slots**

- #content 自定义事件内容

**Anti-patterns**

- 静态步骤流程用 MTimeline → MStepper
- 普通列表用 MTimeline → MList


### MRating

**When**

- 用户评分（商品 / 服务 / 内容）
- 需要半星或只读展示

**Avoid when**

- 需要输入精确数值
- 需要调节设置

**Recipe · props**

- v-model 数值；stars 总星数
- allowHalf 允许 0.5 步进
- readonly 只读展示（评价列表）
- allowClear 允许清除评分

**Anti-patterns**

- 精确数值输入用 MRating → MInputNumber
- 设置调节用 MRating → MSlider / MKnob


---

## `specialized-display-choice` — 水印、二维码、引导、终端如何选择

> 这是防泄露水印、扫码链接、新功能引导，还是日志终端？

### MWatermark

**When**

- 页面或区域需要防泄露水印
- 内部系统敏感信息保护

**Avoid when**

- 公开营销页面
- 水印会遮挡核心内容

**Recipe · props**

- content 单行或多行文字水印
- image 图片水印（logo）
- rotate / gap / offset 控制布局
- inherit 子元素继承水印

**Anti-patterns**

- 公开页面加水印 → 去掉
- 核心内容被水印遮挡 → 调低透明度或局部使用


### MQRCode

**When**

- 生成扫码链接 / 分享码
- 需要展示二维码状态（过期 / 加载）

**Avoid when**

- 需要扫码识别（那是摄像头功能）
- 需要条形码

**Recipe · props**

- value 二维码内容（URL / 文本）
- errorLevel="H" 高容错（允许 logo 覆盖）
- icon 中心 logo
- status="expired" 过期遮罩 + @refresh 刷新

**Anti-patterns**

- 需要条形码用 MQRCode → 专用条形码库


### MTour

**When**

- 新功能引导 / 首次使用教学
- 需要高亮页面元素并解释

**Avoid when**

- 常规帮助文档
- 用户已熟悉的功能

**Recipe · props**

- steps 配置每步标题 / 描述 / target 元素
- v-model:open 控制显示；v-model:current 当前步骤
- mask 遮罩背景突出聚焦元素
- @finish 完成引导；@close 提前关闭

**Recipe · events**

- @change 步骤切换

**Anti-patterns**

- 常规帮助用 MTour → 文档 / Tooltip
- 步骤过多（>5）→ 拆分或改为文档


### MTerminal

**When**

- 实时日志展示 / 命令执行回显
- 需要模拟终端外观

**Avoid when**

- 普通代码展示（用 CodePreview / pre）
- 需要复杂文本编辑

**Recipe · props**

- content 日志文本；支持 ANSI 颜色
- readonly 纯展示；非 readonly 可输入命令
- @command 执行自定义命令处理

**Anti-patterns**

- 普通代码块用 MTerminal → pre / code
- 复杂编辑用 MTerminal → Monaco / CodeMirror


---

## `form-label-choice` — 表单标签样式如何选择

> 这是传统上方标签、紧凑浮动标签，还是无边框内嵌标签？

### MFloatLabel

**When**

- 空间紧张的现代表单
- 需要输入框 label 浮动效果

**Avoid when**

- 传统后台表单（label 在上更清晰）
- 需要帮助文本或错误提示常驻

**Recipe · props**

- label 属性设置浮动标签文案
- 包裹 MInput / MSelect 等控件
- 与 variant="filled" / "outlined" 控件配合

**Anti-patterns**

- 传统后台表单硬套 MFloatLabel → 默认 label
- 需要常驻帮助文本仍用 MFloatLabel → 传统 label + helpText


### MInplace

**When**

- 详情页点击编辑单字段
- 浏览模式为主，编辑是例外

**Avoid when**

- 表单页批量编辑
- 需要校验的必填字段

**Recipe · props**

- display 插槽展示态；content 插槽编辑态
- closable 编辑态显示关闭按钮
- @open / @close 控制编辑态切换

**Anti-patterns**

- 表单页批量编辑用 MInplace → MForm
- 必填校验字段用 MInplace → MFormItem + errorMessage


---

## `specialized-input-choice` — 旋钮、进度输入如何选择

> 这是仪表盘式调节、多段进度展示，还是确定进度条？

### MKnob

**When**

- 仪表盘式数值调节（阈值 / 音量 / 参数）
- 视觉化调节比精确输入更重要

**Avoid when**

- 需要精确数值输入
- 范围选择

**Recipe · props**

- v-model 数值；min / max / step 控制范围
- diameter 控制表盘大小
- valueTemplate="{value}%" 自定义显示格式
- ariaLabel 提供可访问名称

**Anti-patterns**

- 精确数值输入用 MKnob → MInputNumber
- 范围选择用 MKnob → MSlider


### MMeterGroup

**When**

- 多段进度展示（磁盘分区 / 预算分配）
- 需要图例 + 百分比标签

**Avoid when**

- 单段进度
- 需要交互调节

**Recipe · props**

- value 数组配置各段（label / value / color）
- labelTemplate 自定义标签格式
- max 总量（默认 100）

**Anti-patterns**

- 单段进度用 MMeterGroup → MProgressBar
- 交互调节用 MMeterGroup → MSlider / MKnob


---

## `segmented-tabs-choice` — 选项切换控件如何选择

> 这是视图/状态切换、内容面板切换，还是表单内选择？

### MSegmented

**When**

- 选项少（≤5）且需要全部露出
- 切换视图 / 状态 / 密度等即时生效

**Avoid when**

- 选项很多需要滚动
- 需要表单提交值

**Recipe · props**

- v-model 绑定当前值
- options 传字符串数组或 { label, value, icon }
- block 占满容器宽度
- shape="round" 圆角药丸外观

**Anti-patterns**

- 内容面板切换用 MSegmented → MTabs
- 表单提交值用 MSegmented → MSelectButton


### MTabs

**When**

- 多个内容面板切换显示
- 标签数量多时可滚动

**Avoid when**

- 选项是表单值
- 需要手风琴折叠

**Recipe · props**

- v-model:value 控制当前标签
- closable 可关闭标签
- 与路由结合用 to 或 @tab-click

**Anti-patterns**

- 表单选项用 MTabs → MSelectButton
- 视图状态切换用 MTabs → MSegmented


### MSelectButton

**When**

- 表单内选择（需要提交值）
- 选项少且需要全部露出

**Avoid when**

- 选项超过约 5 个
- 切换视图状态

**Recipe · props**

- v-model 绑定选中值
- :options 选项数组
- 与 MFormItem 一起用，参与表单校验

**Anti-patterns**

- >5 个选项仍用 MSelectButton → MSelect
- 视图切换用 MSelectButton → MSegmented


---

## `split-action-choice` — 主操作+更多操作如何选择

> 这是一个主操作配更多操作，还是完全自定义的按钮组？

### MSplitButton

**When**

- 一个高频主操作 + 低频相关操作
- 如 保存 / 保存并继续 / 另存为

**Avoid when**

- 操作之间无主次关系
- 需要完全自定义触发器

**Recipe · props**

- label 主操作文案；model 下拉操作项
- 主按钮 @click 执行主操作
- @command 执行下拉操作
- color / variant / size 与 MButton 一致

**Recipe · events**

- @command(item) 下拉操作回调

**Anti-patterns**

- 无主次关系操作用 MSplitButton → MButtonGroup / MSpace
- 完全自定义触发器用 MSplitButton → MButton + MDropdown


### MButton + MDropdown

**When**

- 需要完全自定义按钮组布局
- 触发器不是标准按钮（图标 / 头像）

**Avoid when**

- 标准主操作+更多操作模式

**Recipe · props**

- MButton 放主操作；MDropdown 放更多操作
- MDropdown 触发器放默认插槽
- 危险操作走 MConfirmDialog 确认

**Anti-patterns**

- 标准主操作+更多用 MButton + MDropdown → MSplitButton


---

## `detail-display-choice` — 详情数据展示如何选择

> 这是键值对字段展示、行列数据比较，还是自由布局列表？

### MDescriptions

**When**

- 详情页字段展示（label: value 键值对）
- 需要 bordered / column 控制布局

**Avoid when**

- 需要排序 / 筛选 / 行操作
- 需要自由布局列表项

**Recipe · props**

- MDescriptions 包裹 MDescriptionsItem
- column 每行列数；bordered 显示边框
- layout="horizontal"（默认）或 "vertical"
- #label 自定义标签内容

**Recipe · slots**

- MDescriptionsItem label 字段名；span 跨列

**Anti-patterns**

- 需要排序筛选用 MDescriptions → MTable
- 自由布局列表用 MDescriptions → MList


### MTable

**When**

- 行列数据比较多条记录
- 需要排序 / 筛选 / 行操作

**Avoid when**

- 单条记录的字段展示
- 自由布局列表项

**Recipe · props**

- columns + rows 定义数据结构
- #cell-{key} 自定义单元格
- paginator 分页；selectionMode 行选择

**Anti-patterns**

- 单条记录字段展示用 MTable → MDescriptions


### MList

**When**

- 自由布局列表项（头像+标题+描述+操作）
- 需要分页或 grid 布局

**Avoid when**

- 键值对字段展示
- 需要排序筛选

**Recipe · props**

- MList 包裹 MListItem；MListItemMeta 带头像标题描述
- pagination 配置分页；grid 配置网格布局
- #actions 列表项操作按钮

**Recipe · slots**

- MListItem #actions 操作区

**Anti-patterns**

- 键值对字段展示用 MList → MDescriptions


---

## `collapse-container-choice` — 折叠容器如何选择

> 这是多面板手风琴、单个可折叠区块，还是独立视觉表面？

### MAccordion

**When**

- 多面板手风琴展开/收起
- FAQ / 设置分组 / 多段内容

**Avoid when**

- 单个可折叠区块
- 不需要折叠的独立表面

**Recipe · props**

- tabs 配置每面板（value / header / disabled）
- v-model 控制展开的面板 key（数组 multiple）
- multiple 允许多面板同时展开

**Recipe · events**

- @update:modelValue 展开状态变化

**Anti-patterns**

- 单个折叠区块用 MAccordion → MPanel
- 不需要折叠用 MAccordion → MCard


### MPanel

**When**

- 单个可折叠区块
- 需要标题 + 展开/收起

**Avoid when**

- 多面板手风琴
- 独立视觉表面

**Recipe · props**

- header 面板标题
- toggleable 开启折叠功能
- v-model:collapsed 控制折叠状态

**Recipe · events**

- @update:collapsed 折叠状态变化

**Anti-patterns**

- 多面板手风琴用 MPanel → MAccordion
- 独立表面用 MPanel → MCard


### MCard

**When**

- 独立视觉表面（标题 / 内容 / 页脚）
- 不一定需要折叠

**Avoid when**

- 多面板手风琴
- 单个可折叠区块

**Recipe · props**

- title / subtitle 头部信息
- shadow="always" / "hover" / "never" 控制阴影
- #header / #footer / #title 自定义区域

**Anti-patterns**

- 需要折叠用 MCard → MPanel / MAccordion


---

## `sort-transfer-choice` — 排序和穿梭选择如何实现

> 这是单列表拖拽排序、左右穿梭选择，还是纯展示列表？

### MOrderList

**When**

- 单列表拖拽排序
- 需要上下移动 / 置顶 / 置底

**Avoid when**

- 左右穿梭选择
- 纯展示列表

**Recipe · props**

- v-model 绑定排序后的数组
- dragdrop 开启拖拽（默认 true）
- v-model:selection 控制选中项
- @reorder 排序后回调（含 from / to / item）

**Recipe · events**

- @reorder 排序完成回调

**Anti-patterns**

- 左右穿梭用 MOrderList → MPickList
- 纯展示用 MOrderList → MList


### MPickList

**When**

- 左右穿梭选择（从源到目标）
- 如 权限分配 / 字段选择

**Avoid when**

- 单列表排序
- 纯展示列表

**Recipe · props**

- v-model:source 源列表；v-model:target 目标列表
- sourceHeader / targetHeader 列表标题
- dataKey 唯一标识字段

**Anti-patterns**

- 单列表排序用 MPickList → MOrderList
- 纯展示用 MPickList → MList


### MList

**When**

- 纯展示列表（不支持排序 / 穿梭）
- 需要分页或 grid 布局

**Avoid when**

- 需要排序
- 需要穿梭选择

**Recipe · props**

- items / dataSource 数据数组
- MListItem + MListItemMeta 自定义布局
- pagination 分页；grid 网格布局

**Anti-patterns**

- 需要排序用 MList → MOrderList
- 需要穿梭用 MList → MPickList


---

## `upload-mode-choice` — 文件上传模式如何选择

> 这是选择即上传、拖拽+预览+进度，还是完全自定义上传？

### MFileUpload mode="basic"

**When**

- 选择文件后立即上传
- 不需要预览和进度展示

**Avoid when**

- 需要拖拽上传
- 需要图片预览

**Recipe · props**

- action 上传地址；autoUpload 自动上传
- accept 限制文件类型；maxSize 限制大小
- @success / @error 上传结果回调

**Recipe · events**

- @success 上传成功

**Anti-patterns**

- 需要拖拽预览用 basic → mode="advanced"


### MFileUpload mode="advanced"

**When**

- 拖拽上传 + 文件预览 + 进度展示
- 图片上传需要缩略图

**Avoid when**

- 选择即上传的简单场景

**Recipe · props**

- drag 开启拖拽区域
- listType="picture-card" 图片缩略图卡片
- v-model:file-list 绑定文件列表
- autoUpload=false 手动控制；submit() 触发上传

**Recipe · events**

- @progress 上传进度
- @remove 移除文件

**Anti-patterns**

- 简单选择即上传用 advanced → mode="basic"
- 完全自定义上传 UI 用 advanced → httpRequest 自定义


---

## `suggestion-input-choice` — 带建议的输入如何选择

> 这是自由输入+下拉建议、@人/#话题提及，还是纯文本输入？

### MAutoComplete

**When**

- 自由输入 + 下拉建议（搜索历史 / 邮箱后缀）
- 输入值本身也有意义

**Avoid when**

- 只能从固定选项选
- 需要 @人 / #话题

**Recipe · props**

- v-model 绑定输入值
- suggestions 建议数组（字符串或 { label, value }）
- @complete 输入时拉取建议（支持远程）
- loading 建议加载中状态

**Recipe · events**

- @complete 输入变化时拉取建议

**Anti-patterns**

- 固定选项用 MAutoComplete → MSelect
- @人 / #话题用 MAutoComplete → MMentions


### MMentions

**When**

- @人 / #话题触发下拉选择
- 社交 / 协作场景

**Avoid when**

- 自由输入建议
- 纯文本输入

**Recipe · props**

- v-model 绑定输入值
- options 提及选项数组
- prefix="@" 触发字符（可数组多个）
- split 插入后追加字符（默认空格）

**Recipe · events**

- @select 选中提及项

**Anti-patterns**

- 自由输入建议用 MMentions → MAutoComplete
- 纯文本输入用 MMentions → MInput


---

## `number-input-choice` — 数值输入方式如何选择

> 这是精确数值输入、范围调节，还是仪表盘式调节？

### MInputNumber

**When**

- 需要精确数值输入
- 需要 min/max/step 约束

**Avoid when**

- 范围调节
- 仪表盘式调节

**Recipe · props**

- v-model 绑定数值
- min / max / step 控制范围步进
- showButtons 显示加减按钮
- precision 小数位数

**Anti-patterns**

- 范围调节用 MInputNumber → MSlider
- 仪表盘调节用 MInputNumber → MKnob


### MSlider

**When**

- 范围调节（音量 / 价格区间 / 阈值）
- 视觉化比例比精确数值更重要

**Avoid when**

- 需要精确输入
- 单点精确值

**Recipe · props**

- v-model 数值或 range 数组
- min / max / step 控制范围
- marks 显示刻度标签
- tooltip 拖拽时显示当前值

**Anti-patterns**

- 精确输入用 MSlider → MInputNumber
- 仪表盘调节用 MSlider → MKnob


### MKnob

**When**

- 仪表盘式数值调节（阈值 / 参数）
- 视觉化调节比精确输入更重要

**Avoid when**

- 需要精确输入
- 范围选择

**Recipe · props**

- v-model 绑定数值
- min / max / step 控制范围
- diameter 控制表盘大小
- valueTemplate="{value}%" 自定义显示

**Anti-patterns**

- 精确输入用 MKnob → MInputNumber
- 范围选择用 MKnob → MSlider


---

## `large-data-choice` — 大数据量列表渲染策略

> 这是万级数据虚拟滚动，还是普通数据量的直接渲染？

### MVirtualScroller

**When**

- 万级以上数据列表
- 需要固定 itemSize 优化渲染

**Avoid when**

- 数据量小（<1000）
- 需要复杂动态高度

**Recipe · props**

- items 数据数组；itemSize 固定高度（px）
- height 可视区域高度
- buffer 上下缓冲数量（减少白屏）
- scrollToIndex 编程滚动到指定项

**Recipe · slots**

- #item 自定义列表项内容

**Anti-patterns**

- 小数据量用 MVirtualScroller → 普通 v-for / MList
- 动态高度列表用 MVirtualScroller → 需要固定 itemSize


### 普通 v-for / MList

**When**

- 数据量小（<1000）
- 需要复杂动态高度布局

**Avoid when**

- 万级以上数据
- 性能敏感场景

**Recipe · props**

- MList items / dataSource 直接渲染
- v-for 自定义模板渲染
- 无需 itemSize 约束

**Anti-patterns**

- 万级数据用普通 v-for → MVirtualScroller
