# Morya UI 组件清单（AI 选型索引）

> 完整 API 以文档站 `/components` 或 MCP 为准。下表用于**场景选型**，不是 prop 手册。

## 应用壳层

| 组件 | 用途 |
| --- | --- |
| `MConfigProvider` | 根配置：locale、主题、密度、浮层挂载、组件默认 props |
| `MLayout` / `MLayoutHeader` / `MLayoutSider` / `MLayoutContent` / `MLayoutFooter` | 后台整体布局 |
| `MSidebar` | 独立侧栏容器（非 Layout 子项场景） |
| `MBreadcrumb` | 页面路径 |
| `MToolbar` | 顶栏工具区 |

## 表单 · 输入

| 组件 | 用途 |
| --- | --- |
| `MForm` / `MFormItem` | 表单容器、校验、提交 |
| `MInput` | 单行文本 |
| `MInputPassword` | 密码 |
| `MInputNumber` | 数字 |
| `MTextarea` | 多行文本 |
| `MSelect` | 下拉选择（单选/多选/远程/filter） |
| `MTreeSelect` | 树形选择 |
| `MCascadeSelect` | 级联选择 |
| `MDatePicker` | 日期 / 日期范围 |
| `MAutoComplete` | 自动完成 |
| `MCheckbox` / `MCheckboxGroup` | 多选 |
| `MRadio` / `MRadioGroup` | 单选组 |
| `MSwitch` | 开关 |
| `MSlider` | 滑块 |
| `MRating` | 评分 |
| `MInputTags` | 标签输入 |
| `MFileUpload` | 文件上传 |
| `MFloatLabel` | 浮动标签包装 |
| `MIconField` | 输入框前缀/后缀图标 |

## 表单 · 布局

| 组件 | 用途 |
| --- | --- |
| `MGrid` / `MGridItem` | 响应式栅格 |
| `MFlex` | Flex 布局 |
| `MSpace` | 间距 |
| `MFluid` | 子项撑满宽度 |
| `MDivider` | 分隔线 |
| `MFieldset` | 分组fieldset |

## 数据展示

| 组件 | 用途 |
| --- | --- |
| `MTable` | 数据表格 |
| `MTreeTable` | 树形表格 |
| `MDataView` | 卡片/列表数据视图 |
| `MTree` | 树 |
| `MPagination` | 分页 |
| `MStatus` | 行内状态（圆点 + 文案） |
| `MTag` / `MChip` / `MBadge` | 标签、徽章 |
| `MAvatar` / `MAvatarGroup` | 头像 |
| `MTimeline` | 时间线 |
| `MMeterGroup` | 多段进度条 |
| `MVirtualScroller` | 虚拟滚动长列表 |

## 反馈

| API / 组件 | 用途 | 优先级 |
| --- | --- | --- |
| `message` | **默认**：单行操作回执（已保存 / 已删除） | ★ 首选 |
| `toast` | 仅当需要 `summary` + `detail` 或异步通知 | 次要 |
| `<MMessage>` | 表单/认证区**常驻**错误条 | 内嵌场景 |
| `MEmpty` | 无数据 / 首次使用 / 筛选无结果 | 空态 |
| `MResult` | 提交结果、403 / 404 / 500 等阻断页 | 结果页 |
| `MProgressBar` / `MProgressSpinner` | 加载进度 | |
| `MSkeleton` | 骨架屏 | |
| `MBlockUI` | 遮罩阻塞 | |

选型细则：[`feedback-message-vs-toast.md`](./feedback-message-vs-toast.md)

## 浮层

| 组件 | 用途 |
| --- | --- |
| `MDialog` | 模态对话框 |
| `MDrawer` | 抽屉 |
| `MConfirmDialog` / `MConfirmPopup` | 二次确认 |
| `MPopover` | 气泡卡片 |
| `MTooltip` | 文字提示 |
| `MDropdown` | **动作**下拉菜单（非表单选项） |

## 导航 · 菜单

| 组件 | 用途 |
| --- | --- |
| `MMenu` / `MMenubar` / `MTieredMenu` / `MMegaMenu` | 菜单 |
| `MTabs` | 标签页 |
| `MStepper` | 步骤条 |
| `MCommandMenu` | 命令面板 |
| `MSplitButton` / `MSelectButton` / `MToggleButton` | 复合按钮 |

## 展示 · 媒体

| 组件 | 用途 |
| --- | --- |
| `MCard` / `MPanel` | 卡片、面板 |
| `MAccordion` | 折叠面板 |
| `MCarousel` / `MGallery` | 轮播、图库 |
| `MIcon` | 图标（Tabler 集） |
| `MScrollbar` | 主题化滚动条；供组件内置滚动壳与业务显式选用；不要塞进用户可定制插槽 |

## 场景速查

| 我要做… | 首选组件 |
| --- | --- |
| 用户列表 + 搜索 + 分页 | `MTable` + `MInput` + `MPagination` |
| 新建/编辑实体（短表单，列表内） | **`MDialog` + `MForm` + 字段组件**（首选） |
| 新建/编辑实体（长表单 / 多分组） | `MForm` + 独立表单页或 `MDrawer` |
| 删除确认 | `MConfirmDialog` |
| 筛选侧栏 | `MDrawer` + 表单控件 |
| 状态指示（行内） | `MStatus`（圆点 + 文案） |
| 状态芯片 / 可关闭标签 | `MTag`（`severity`: success/warn/danger/info） |
| 空数据 / 首次使用 | `MEmpty` |
| 提交结果 / 403 / 404 / 500 | `MResult` |
| 主/次按钮组 | `MSpace` + `MButton`（primary / secondary text） |
| 后台首页 KPI | `MGrid` + `MCard` |
| 组织架构 | `MTree` 或 `MTreeSelect` |
| 整页后台页（MCP 生成） | `MLayout fillViewport`（主滚动内置 `MScrollbar`） |
| 业务局部限高滚动 | 业务自行使用 `MScrollbar`（可选：`get_page_snippet("scrollable-panel")`） |

## 页面标准

MCP `get_design_rules` → `standards` 汇总推荐实践（非强制）。`validate_page` 仅给参考建议。

## 常见对照

| 错误 | 正确 |
| --- | --- |
| 用 `MDropdown` 做表单枚举 | 用 `MSelect` |
| 手写 `<table>` | 用 `MTable` |
| 手写 modal div | 用 `MDialog` |
| `showClear` 与 `clearable` 混用概念 | Select 两者等价；其他组件看文档是否支持 `clearable` |
| 页面壳手写 `overflow: auto` 替代 Layout 内置滚动 | 依赖 `MLayout` 内置滚动；业务局部滚动再显式用 `MScrollbar` |
| `MPage*` 外包 `MCard` 或 padded `div` | 直接使用 `MPage*` 组件自带间距与表面 |
| 嵌套菜单被滚动容器裁剪 | Dropdown / ContextMenu / TieredMenu 侧向子菜单已 Teleport；Menu 水平/折叠飞出层用 Popover |
