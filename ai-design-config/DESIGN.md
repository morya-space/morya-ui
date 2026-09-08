# Wise Kit 设计系统（AI 第一信源）

> 基于 `@wise-kit/ui` v0.1.x。生成或审查业务页面时，**必须先遵守本文**，再查阅 `docs/components.md` 与 `docs/golden-pages/`。

## 1. 设计原则

1. **组件优先**：布局、表单、表格、浮层一律使用库内 `Rd*` 组件，不手写等价 DOM 结构。
2. **令牌优先**：颜色、间距、圆角、阴影、动效使用 `--wk-*` CSS 变量；禁止裸 `#hex` / `rgb()`（`scripts/check-raw-colors.mjs` 会扫描）。
3. **语义一致**：主操作 `WkButton` `severity="primary"`；危险操作用 `severity="danger"` 或 `WkConfirmDialog`。
4. **可访问性**：表单控件带 `label`；图标按钮带 `aria-label`；浮层可 Esc 关闭（组件默认支持）。
5. **ConfigProvider 包裹**：应用根节点使用 `WkConfigProvider`，统一 locale、主题、密度、浮层挂载。

## 2. 应用骨架

```vue
<script setup lang="ts">
import { WkConfigProvider, zhCN } from '@wise-kit/ui'
import '@wise-kit/ui/styles.css'
</script>

<template>
  <WkConfigProvider :locale="zhCN">
    <WkLayout has-sider>
      <WkLayoutSider>...</WkLayoutSider>
      <WkLayout>
        <WkLayoutHeader>...</WkLayoutHeader>
        <WkLayoutContent>...</WkLayoutContent>
      </WkLayout>
    </WkLayout>
  </WkConfigProvider>
</template>
```

- 管理后台：`WkLayout` + `WkLayoutSider` + `WkLayoutHeader` + `WkLayoutContent`
- 页面内分区：`WkCard` / `WkPanel` / `WkFieldset`
- 栅格：`WkGrid` + `WkGridItem` 或 `WkFlex` + `WkSpace`

## 3. 页面类型与黄金样例

| 类型 | 参考文件 | 必备区块 |
| --- | --- | --- |
| 列表页 | `docs/golden-pages/list-page.vue` | 面包屑、筛选区、工具栏、表格、分页 |
| 表单页 | `docs/golden-pages/form-page.vue` | 面包屑、分组表单、`WkForm` / `WkFormItem`、提交/取消 |
| 仪表盘 | `docs/golden-pages/dashboard-page.vue` | 统计卡片栅格、图表区占位、快捷入口 / 最近列表 |

生成新页面时：**结构对齐黄金样例，业务字段替换，不另起布局范式**。

## 4. 表单约定

- 使用 `WkForm` + `WkFormItem`，`name` 与校验规则对应。
- 字段组件自带 `label` / `invalid` / `helpText` 时优先用组件 prop（如 `WkInput`、`WkSelect`），复杂表单再用 `WkFormItem` 包一层。
- 尺寸：默认 medium；密集后台可 `size="small"` 或 ConfigProvider `globalDensity`。
- 宽度：筛选项 `fluid` 慎用；表单页主栏 `max-width: 40rem` 左右。

## 5. 数据展示

- 表格：`WkTable` + 列定义；行操作放 `WkButton` text/link 或 `WkDropdown`。
- 分页：`WkPagination` 与表格同级，右对齐或居中。
- 空态：表格 `emptyMessage` 或自定义 `#empty` 插槽；禁止空白区域无提示。

## 6. 浮层与反馈

| 场景 | 组件 |
| --- | --- |
| 确认删除 | `WkConfirmDialog` 或 `WkConfirmPopup` |
| 详情 / 编辑弹窗 | `WkDialog` |
| 侧滑筛选 / 详情 | `WkDrawer` |
| **操作结果（默认）** | **`message` API**（单行：已保存 / 已删除） |
| 标题 + 详情 / 异步通知 | `toast` API（`summary` + `detail`） |
| 表单区常驻错误 | `<WkMessage>` 或字段 `errorMessage` |
| 字段说明 | `WkTooltip` |

**选型细则见 [`docs/feedback-message-vs-toast.md`](docs/feedback-message-vs-toast.md)。AI 生成代码时：无 `detail` 的操作回执一律用 `message`，不要默认 Toast。**

## 7. 设计令牌（摘要）

完整定义见 `design-tokens/tokens.json`。

| 用途 | 变量 |
| --- | --- |
| 页面背景 | `--wk-color-surface` |
| 正文 | `--wk-color-text` |
| 次要文字 | `--wk-color-text-muted` |
| 边框 | `--wk-color-border` |
| 品牌 / 链接 | `--wk-color-primary` |
| 错误 | `--wk-color-danger` |
| 区块间距 | `--wk-space-4` / `--wk-space-6` |
| 卡片圆角 | `--wk-radius-md` |
| 卡片阴影 | `--wk-shadow-md` |

## 8. 禁止项

- 禁止引入第二套 UI 库（Element Plus、Naive UI 等）混用同一页面。
- 禁止在业务 CSS 中写死主题色；暗色模式必须能随 `[data-theme="dark"]` 生效。
- 禁止用 `<div onclick>` 代替 `<button>` / `WkButton`。
- 禁止 Select 与 Dropdown 混用：选项选择用 `WkSelect` / `WkTreeSelect`；动作菜单用 `WkDropdown`。
- 禁止跳过 `import '@wise-kit/ui/styles.css'`。

## 9. AI 工作流

1. 读本文 → 确定页面类型（列表 / 表单 / 仪表盘）。
2. 打开对应 `docs/golden-pages/*.vue` 与 `src/examples/*.vue`。
3. 查 `docs/components.md` 选型。
4. 不确定 API 时查文档站或 MCP，**不要臆造 prop 名**。
5. 完成后运行 `pnpm check:colors`（若已配置）。
6. 操作反馈见 `docs/feedback-message-vs-toast.md`：**默认 `message`，有 detail 才用 `toast`**。

## 10. 相关资源

- 包入口：`@wise-kit/ui`
- 全局样式：`@wise-kit/ui/styles.css`
- 按需引入：`@wise-kit/ui/button` 等 + 对应 `style`
- 主题 API：`useTheme` / `useDensity` / `useMotion`（同包导出）
