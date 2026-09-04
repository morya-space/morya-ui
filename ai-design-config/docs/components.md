# Wex Design 组件清单（AI 选型索引）

> 完整 API 以文档站 `/components` 或 MCP 为准。下表用于**场景选型**，不是 prop 手册。

## 应用壳层

| 组件 | 用途 |
| --- | --- |
| `WdConfigProvider` | 根配置：locale、主题、密度、浮层挂载、组件默认 props |
| `WdLayout` / `WdLayoutHeader` / `WdLayoutSider` / `WdLayoutContent` / `WdLayoutFooter` | 后台整体布局 |
| `WdSidebar` | 独立侧栏容器（非 Layout 子项场景） |
| `WdBreadcrumb` | 页面路径 |
| `WdToolbar` | 顶栏工具区 |

## 表单 · 输入

| 组件 | 用途 |
| --- | --- |
| `WdForm` / `WdFormItem` | 表单容器、校验、提交 |
| `WdInput` | 单行文本 |
| `WdInputPassword` | 密码 |
| `WdInputNumber` | 数字 |
| `WdTextarea` | 多行文本 |
| `WdSelect` | 下拉选择（单选/多选/远程/filter） |
| `WdTreeSelect` | 树形选择 |
| `WdCascadeSelect` | 级联选择 |
| `WdDatePicker` | 日期 / 日期范围 |
| `WdAutoComplete` | 自动完成 |
| `WdCheckbox` / `WdCheckboxGroup` | 多选 |
| `WdRadio` / `WdRadioGroup` | 单选组 |
| `WdSwitch` | 开关 |
| `WdSlider` | 滑块 |
| `WdRating` | 评分 |
| `WdInputTags` | 标签输入 |
| `WdFileUpload` | 文件上传 |
| `WdFloatLabel` | 浮动标签包装 |
| `WdIconField` | 输入框前缀/后缀图标 |

## 表单 · 布局

| 组件 | 用途 |
| --- | --- |
| `WdGrid` / `WdGridItem` | 响应式栅格 |
| `WdFlex` | Flex 布局 |
| `WdSpace` | 间距 |
| `WdFluid` | 子项撑满宽度 |
| `WdDivider` | 分隔线 |
| `WdFieldset` | 分组fieldset |

## 数据展示

| 组件 | 用途 |
| --- | --- |
| `WdTable` | 数据表格 |
| `WdTreeTable` | 树形表格 |
| `WdDataView` | 卡片/列表数据视图 |
| `WdTree` | 树 |
| `WdPagination` | 分页 |
| `WdTag` / `WdChip` / `WdBadge` | 标签、徽章 |
| `WdAvatar` / `WdAvatarGroup` | 头像 |
| `WdTimeline` | 时间线 |
| `WdMeterGroup` | 多段进度条 |
| `WdVirtualScroller` | 虚拟滚动长列表 |

## 反馈

| API / 组件 | 用途 | 优先级 |
| --- | --- | --- |
| `message` | **默认**：单行操作回执（已保存 / 已删除） | ★ 首选 |
| `toast` | 仅当需要 `summary` + `detail` 或异步通知 | 次要 |
| `<WdMessage>` | 表单/认证区**常驻**错误条 | 内嵌场景 |
| `WdProgressBar` / `WdProgressSpinner` | 加载进度 | |
| `WdSkeleton` | 骨架屏 | |
| `WdBlockUI` | 遮罩阻塞 | |

选型细则：[`feedback-message-vs-toast.md`](./feedback-message-vs-toast.md)

## 浮层

| 组件 | 用途 |
| --- | --- |
| `WdDialog` | 模态对话框 |
| `WdDrawer` | 抽屉 |
| `WdConfirmDialog` / `WdConfirmPopup` | 二次确认 |
| `WdPopover` | 气泡卡片 |
| `WdTooltip` | 文字提示 |
| `WdDropdown` | **动作**下拉菜单（非表单选项） |

## 导航 · 菜单

| 组件 | 用途 |
| --- | --- |
| `WdMenu` / `WdMenubar` / `WdTieredMenu` / `WdMegaMenu` | 菜单 |
| `WdTabs` | 标签页 |
| `WdStepper` | 步骤条 |
| `WdCommandMenu` | 命令面板 |
| `WdSplitButton` / `WdSelectButton` / `WdToggleButton` | 复合按钮 |

## 展示 · 媒体

| 组件 | 用途 |
| --- | --- |
| `WdCard` / `WdPanel` | 卡片、面板 |
| `WdAccordion` | 折叠面板 |
| `WdCarousel` / `WdGallery` | 轮播、图库 |
| `WdIcon` | 图标（Tabler 集） |
| `WdScrollbar` | 自定义滚动条 |

## 场景速查

| 我要做… | 首选组件 |
| --- | --- |
| 用户列表 + 搜索 + 分页 | `WdTable` + `WdInput` + `WdPagination` |
| 新建/编辑实体 | `WdForm` + 字段组件 + `WdDialog` 或独立路由页 |
| 删除确认 | `WdConfirmDialog` |
| 筛选侧栏 | `WdDrawer` + 表单控件 |
| 状态标签 | `WdTag`（`severity`: success/warn/danger/info） |
| 主/次按钮组 | `WdSpace` + `WdButton`（primary / secondary text） |
| 后台首页 KPI | `WdGrid` + `WdCard` |
| 组织架构 | `WdTree` 或 `WdTreeSelect` |

## 常见错误

| 错误 | 正确 |
| --- | --- |
| 用 `WdDropdown` 做表单枚举 | 用 `WdSelect` |
| 手写 `<table>` | 用 `WdTable` |
| 手写 modal div | 用 `WdDialog` |
| `showClear` 与 `clearable` 混用概念 | Select 两者等价；其他组件看文档是否支持 `clearable` |
