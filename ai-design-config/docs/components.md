# Well Insight 组件清单（AI 选型索引）

> 完整 API 以文档站 `/components` 或 MCP 为准。下表用于**场景选型**，不是 prop 手册。

## 应用壳层

| 组件 | 用途 |
| --- | --- |
| `WiConfigProvider` | 根配置：locale、主题、密度、浮层挂载、组件默认 props |
| `WiLayout` / `WiLayoutHeader` / `WiLayoutSider` / `WiLayoutContent` / `WiLayoutFooter` | 后台整体布局 |
| `WiSidebar` | 独立侧栏容器（非 Layout 子项场景） |
| `WiBreadcrumb` | 页面路径 |
| `WiToolbar` | 顶栏工具区 |

## 表单 · 输入

| 组件 | 用途 |
| --- | --- |
| `WiForm` / `WiFormItem` | 表单容器、校验、提交 |
| `WiInput` | 单行文本 |
| `WiInputPassword` | 密码 |
| `WiInputNumber` | 数字 |
| `WiTextarea` | 多行文本 |
| `WiSelect` | 下拉选择（单选/多选/远程/filter） |
| `WiTreeSelect` | 树形选择 |
| `WiCascadeSelect` | 级联选择 |
| `WiDatePicker` | 日期 / 日期范围 |
| `WiAutoComplete` | 自动完成 |
| `WiCheckbox` / `WiCheckboxGroup` | 多选 |
| `WiRadio` / `WiRadioGroup` | 单选组 |
| `WiSwitch` | 开关 |
| `WiSlider` | 滑块 |
| `WiRating` | 评分 |
| `WiInputTags` | 标签输入 |
| `WiFileUpload` | 文件上传 |
| `WiFloatLabel` | 浮动标签包装 |
| `WiIconField` | 输入框前缀/后缀图标 |

## 表单 · 布局

| 组件 | 用途 |
| --- | --- |
| `WiGrid` / `WiGridItem` | 响应式栅格 |
| `WiFlex` | Flex 布局 |
| `WiSpace` | 间距 |
| `WiFluid` | 子项撑满宽度 |
| `WiDivider` | 分隔线 |
| `WiFieldset` | 分组fieldset |

## 数据展示

| 组件 | 用途 |
| --- | --- |
| `WiTable` | 数据表格 |
| `WiTreeTable` | 树形表格 |
| `WiDataView` | 卡片/列表数据视图 |
| `WiTree` | 树 |
| `WiPagination` | 分页 |
| `WiTag` / `WiChip` / `WiBadge` | 标签、徽章 |
| `WiAvatar` / `WiAvatarGroup` | 头像 |
| `WiTimeline` | 时间线 |
| `WiMeterGroup` | 多段进度条 |
| `WiVirtualScroller` | 虚拟滚动长列表 |

## 反馈

| 组件 | 用途 |
| --- | --- |
| `WiMessage` | 行内消息 |
| `WiToast` | 全局 toast |
| `WiProgressBar` / `WiProgressSpinner` | 加载进度 |
| `WiSkeleton` | 骨架屏 |
| `WiBlockUI` | 遮罩阻塞 |

## 浮层

| 组件 | 用途 |
| --- | --- |
| `WiDialog` | 模态对话框 |
| `WiDrawer` | 抽屉 |
| `WiConfirmDialog` / `WiConfirmPopup` | 二次确认 |
| `WiPopover` | 气泡卡片 |
| `WiTooltip` | 文字提示 |
| `WiDropdown` | **动作**下拉菜单（非表单选项） |

## 导航 · 菜单

| 组件 | 用途 |
| --- | --- |
| `WiMenu` / `WiMenubar` / `WiTieredMenu` / `WiMegaMenu` | 菜单 |
| `WiTabs` | 标签页 |
| `WiStepper` | 步骤条 |
| `WiCommandMenu` | 命令面板 |
| `WiSplitButton` / `WiSelectButton` / `WiToggleButton` | 复合按钮 |

## 展示 · 媒体

| 组件 | 用途 |
| --- | --- |
| `WiCard` / `WiPanel` | 卡片、面板 |
| `WiAccordion` | 折叠面板 |
| `WiCarousel` / `WiGallery` | 轮播、图库 |
| `WiIcon` | 图标（Tabler 集） |
| `WiScrollbar` | 自定义滚动条 |

## 场景速查

| 我要做… | 首选组件 |
| --- | --- |
| 用户列表 + 搜索 + 分页 | `WiTable` + `WiInput` + `WiPagination` |
| 新建/编辑实体 | `WiForm` + 字段组件 + `WiDialog` 或独立路由页 |
| 删除确认 | `WiConfirmDialog` |
| 筛选侧栏 | `WiDrawer` + 表单控件 |
| 状态标签 | `WiTag`（`severity`: success/warn/danger/info） |
| 主/次按钮组 | `WiSpace` + `WiButton`（primary / secondary text） |
| 后台首页 KPI | `WiGrid` + `WiCard` |
| 组织架构 | `WiTree` 或 `WiTreeSelect` |

## 常见错误

| 错误 | 正确 |
| --- | --- |
| 用 `WiDropdown` 做表单枚举 | 用 `WiSelect` |
| 手写 `<table>` | 用 `WiTable` |
| 手写 modal div | 用 `WiDialog` |
| `showClear` 与 `clearable` 混用概念 | Select 两者等价；其他组件看文档是否支持 `clearable` |
