# Wise Kit 组件清单（AI 选型索引）

> 完整 API 以文档站 `/components` 或 MCP 为准。下表用于**场景选型**，不是 prop 手册。

## 应用壳层

| 组件 | 用途 |
| --- | --- |
| `RdConfigProvider` | 根配置：locale、主题、密度、浮层挂载、组件默认 props |
| `RdLayout` / `RdLayoutHeader` / `RdLayoutSider` / `RdLayoutContent` / `RdLayoutFooter` | 后台整体布局 |
| `RdSidebar` | 独立侧栏容器（非 Layout 子项场景） |
| `RdBreadcrumb` | 页面路径 |
| `RdToolbar` | 顶栏工具区 |

## 表单 · 输入

| 组件 | 用途 |
| --- | --- |
| `RdForm` / `RdFormItem` | 表单容器、校验、提交 |
| `RdInput` | 单行文本 |
| `RdInputPassword` | 密码 |
| `RdInputNumber` | 数字 |
| `RdTextarea` | 多行文本 |
| `RdSelect` | 下拉选择（单选/多选/远程/filter） |
| `RdTreeSelect` | 树形选择 |
| `RdCascadeSelect` | 级联选择 |
| `RdDatePicker` | 日期 / 日期范围 |
| `RdAutoComplete` | 自动完成 |
| `RdCheckbox` / `RdCheckboxGroup` | 多选 |
| `RdRadio` / `RdRadioGroup` | 单选组 |
| `RdSwitch` | 开关 |
| `RdSlider` | 滑块 |
| `RdRating` | 评分 |
| `RdInputTags` | 标签输入 |
| `RdFileUpload` | 文件上传 |
| `RdFloatLabel` | 浮动标签包装 |
| `RdIconField` | 输入框前缀/后缀图标 |

## 表单 · 布局

| 组件 | 用途 |
| --- | --- |
| `RdGrid` / `RdGridItem` | 响应式栅格 |
| `RdFlex` | Flex 布局 |
| `RdSpace` | 间距 |
| `RdFluid` | 子项撑满宽度 |
| `RdDivider` | 分隔线 |
| `RdFieldset` | 分组fieldset |

## 数据展示

| 组件 | 用途 |
| --- | --- |
| `RdTable` | 数据表格 |
| `RdTreeTable` | 树形表格 |
| `RdDataView` | 卡片/列表数据视图 |
| `RdTree` | 树 |
| `RdPagination` | 分页 |
| `RdTag` / `RdChip` / `RdBadge` | 标签、徽章 |
| `RdAvatar` / `RdAvatarGroup` | 头像 |
| `RdTimeline` | 时间线 |
| `RdMeterGroup` | 多段进度条 |
| `RdVirtualScroller` | 虚拟滚动长列表 |

## 反馈

| API / 组件 | 用途 | 优先级 |
| --- | --- | --- |
| `message` | **默认**：单行操作回执（已保存 / 已删除） | ★ 首选 |
| `toast` | 仅当需要 `summary` + `detail` 或异步通知 | 次要 |
| `<RdMessage>` | 表单/认证区**常驻**错误条 | 内嵌场景 |
| `RdProgressBar` / `RdProgressSpinner` | 加载进度 | |
| `RdSkeleton` | 骨架屏 | |
| `RdBlockUI` | 遮罩阻塞 | |

选型细则：[`feedback-message-vs-toast.md`](./feedback-message-vs-toast.md)

## 浮层

| 组件 | 用途 |
| --- | --- |
| `RdDialog` | 模态对话框 |
| `RdDrawer` | 抽屉 |
| `RdConfirmDialog` / `RdConfirmPopup` | 二次确认 |
| `RdPopover` | 气泡卡片 |
| `RdTooltip` | 文字提示 |
| `RdDropdown` | **动作**下拉菜单（非表单选项） |

## 导航 · 菜单

| 组件 | 用途 |
| --- | --- |
| `RdMenu` / `RdMenubar` / `RdTieredMenu` / `RdMegaMenu` | 菜单 |
| `RdTabs` | 标签页 |
| `RdStepper` | 步骤条 |
| `RdCommandMenu` | 命令面板 |
| `RdSplitButton` / `RdSelectButton` / `RdToggleButton` | 复合按钮 |

## 展示 · 媒体

| 组件 | 用途 |
| --- | --- |
| `RdCard` / `RdPanel` | 卡片、面板 |
| `RdAccordion` | 折叠面板 |
| `RdCarousel` / `RdGallery` | 轮播、图库 |
| `RdIcon` | 图标（Tabler 集） |
| `RdScrollbar` | 自定义滚动条 |

## 场景速查

| 我要做… | 首选组件 |
| --- | --- |
| 用户列表 + 搜索 + 分页 | `RdTable` + `RdInput` + `RdPagination` |
| 新建/编辑实体 | `RdForm` + 字段组件 + `RdDialog` 或独立路由页 |
| 删除确认 | `RdConfirmDialog` |
| 筛选侧栏 | `RdDrawer` + 表单控件 |
| 状态标签 | `RdTag`（`severity`: success/warn/danger/info） |
| 主/次按钮组 | `RdSpace` + `RdButton`（primary / secondary text） |
| 后台首页 KPI | `RdGrid` + `RdCard` |
| 组织架构 | `RdTree` 或 `RdTreeSelect` |

## 常见错误

| 错误 | 正确 |
| --- | --- |
| 用 `RdDropdown` 做表单枚举 | 用 `RdSelect` |
| 手写 `<table>` | 用 `RdTable` |
| 手写 modal div | 用 `RdDialog` |
| `showClear` 与 `clearable` 混用概念 | Select 两者等价；其他组件看文档是否支持 `clearable` |
