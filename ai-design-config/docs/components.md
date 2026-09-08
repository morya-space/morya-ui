# Wise Kit 组件清单（AI 选型索引）

> 完整 API 以文档站 `/components` 或 MCP 为准。下表用于**场景选型**，不是 prop 手册。

## 应用壳层

| 组件 | 用途 |
| --- | --- |
| `WkConfigProvider` | 根配置：locale、主题、密度、浮层挂载、组件默认 props |
| `WkLayout` / `WkLayoutHeader` / `WkLayoutSider` / `WkLayoutContent` / `WkLayoutFooter` | 后台整体布局 |
| `WkSidebar` | 独立侧栏容器（非 Layout 子项场景） |
| `WkBreadcrumb` | 页面路径 |
| `WkToolbar` | 顶栏工具区 |

## 表单 · 输入

| 组件 | 用途 |
| --- | --- |
| `WkForm` / `WkFormItem` | 表单容器、校验、提交 |
| `WkInput` | 单行文本 |
| `WkInputPassword` | 密码 |
| `WkInputNumber` | 数字 |
| `WkTextarea` | 多行文本 |
| `WkSelect` | 下拉选择（单选/多选/远程/filter） |
| `WkTreeSelect` | 树形选择 |
| `WkCascadeSelect` | 级联选择 |
| `WkDatePicker` | 日期 / 日期范围 |
| `WkAutoComplete` | 自动完成 |
| `WkCheckbox` / `WkCheckboxGroup` | 多选 |
| `WkRadio` / `WkRadioGroup` | 单选组 |
| `WkSwitch` | 开关 |
| `WkSlider` | 滑块 |
| `WkRating` | 评分 |
| `WkInputTags` | 标签输入 |
| `WkFileUpload` | 文件上传 |
| `WkFloatLabel` | 浮动标签包装 |
| `WkIconField` | 输入框前缀/后缀图标 |

## 表单 · 布局

| 组件 | 用途 |
| --- | --- |
| `WkGrid` / `WkGridItem` | 响应式栅格 |
| `WkFlex` | Flex 布局 |
| `WkSpace` | 间距 |
| `WkFluid` | 子项撑满宽度 |
| `WkDivider` | 分隔线 |
| `WkFieldset` | 分组fieldset |

## 数据展示

| 组件 | 用途 |
| --- | --- |
| `WkTable` | 数据表格 |
| `WkTreeTable` | 树形表格 |
| `WkDataView` | 卡片/列表数据视图 |
| `WkTree` | 树 |
| `WkPagination` | 分页 |
| `WkTag` / `WkChip` / `WkBadge` | 标签、徽章 |
| `WkAvatar` / `WkAvatarGroup` | 头像 |
| `WkTimeline` | 时间线 |
| `WkMeterGroup` | 多段进度条 |
| `WkVirtualScroller` | 虚拟滚动长列表 |

## 反馈

| API / 组件 | 用途 | 优先级 |
| --- | --- | --- |
| `message` | **默认**：单行操作回执（已保存 / 已删除） | ★ 首选 |
| `toast` | 仅当需要 `summary` + `detail` 或异步通知 | 次要 |
| `<WkMessage>` | 表单/认证区**常驻**错误条 | 内嵌场景 |
| `WkProgressBar` / `WkProgressSpinner` | 加载进度 | |
| `WkSkeleton` | 骨架屏 | |
| `WkBlockUI` | 遮罩阻塞 | |

选型细则：[`feedback-message-vs-toast.md`](./feedback-message-vs-toast.md)

## 浮层

| 组件 | 用途 |
| --- | --- |
| `WkDialog` | 模态对话框 |
| `WkDrawer` | 抽屉 |
| `WkConfirmDialog` / `WkConfirmPopup` | 二次确认 |
| `WkPopover` | 气泡卡片 |
| `WkTooltip` | 文字提示 |
| `WkDropdown` | **动作**下拉菜单（非表单选项） |

## 导航 · 菜单

| 组件 | 用途 |
| --- | --- |
| `WkMenu` / `WkMenubar` / `WkTieredMenu` / `WkMegaMenu` | 菜单 |
| `WkTabs` | 标签页 |
| `WkStepper` | 步骤条 |
| `WkCommandMenu` | 命令面板 |
| `WkSplitButton` / `WkSelectButton` / `WkToggleButton` | 复合按钮 |

## 展示 · 媒体

| 组件 | 用途 |
| --- | --- |
| `WkCard` / `WkPanel` | 卡片、面板 |
| `WkAccordion` | 折叠面板 |
| `WkCarousel` / `WkGallery` | 轮播、图库 |
| `WkIcon` | 图标（Tabler 集） |
| `WkScrollbar` | 自定义滚动条 |

## 场景速查

| 我要做… | 首选组件 |
| --- | --- |
| 用户列表 + 搜索 + 分页 | `WkTable` + `WkInput` + `WkPagination` |
| 新建/编辑实体 | `WkForm` + 字段组件 + `WkDialog` 或独立路由页 |
| 删除确认 | `WkConfirmDialog` |
| 筛选侧栏 | `WkDrawer` + 表单控件 |
| 状态标签 | `WkTag`（`severity`: success/warn/danger/info） |
| 主/次按钮组 | `WkSpace` + `WkButton`（primary / secondary text） |
| 后台首页 KPI | `WkGrid` + `WkCard` |
| 组织架构 | `WkTree` 或 `WkTreeSelect` |

## 常见错误

| 错误 | 正确 |
| --- | --- |
| 用 `WkDropdown` 做表单枚举 | 用 `WkSelect` |
| 手写 `<table>` | 用 `WkTable` |
| 手写 modal div | 用 `WkDialog` |
| `showClear` 与 `clearable` 混用概念 | Select 两者等价；其他组件看文档是否支持 `clearable` |
