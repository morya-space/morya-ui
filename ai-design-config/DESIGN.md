# Well Insight 设计系统（AI 第一信源）

> 基于 `@well-insight/ui` v0.1.x。生成或审查业务页面时，**必须先遵守本文**，再查阅 `docs/components.md` 与 `docs/golden-pages/`。

## 1. 设计原则

1. **组件优先**：布局、表单、表格、浮层一律使用库内 `Wi*` 组件，不手写等价 DOM 结构。
2. **令牌优先**：颜色、间距、圆角、阴影、动效使用 `--wi-*` CSS 变量；禁止裸 `#hex` / `rgb()`（`scripts/check-raw-colors.mjs` 会扫描）。
3. **语义一致**：主操作 `WiButton` `severity="primary"`；危险操作用 `severity="danger"` 或 `WiConfirmDialog`。
4. **可访问性**：表单控件带 `label`；图标按钮带 `aria-label`；浮层可 Esc 关闭（组件默认支持）。
5. **ConfigProvider 包裹**：应用根节点使用 `WiConfigProvider`，统一 locale、主题、密度、浮层挂载。

## 2. 应用骨架

```vue
<script setup lang="ts">
import { WiConfigProvider, zhCN } from '@well-insight/ui'
import '@well-insight/ui/styles.css'
</script>

<template>
  <WiConfigProvider :locale="zhCN">
    <WiLayout has-sider>
      <WiLayoutSider>...</WiLayoutSider>
      <WiLayout>
        <WiLayoutHeader>...</WiLayoutHeader>
        <WiLayoutContent>...</WiLayoutContent>
      </WiLayout>
    </WiLayout>
  </WiConfigProvider>
</template>
```

- 管理后台：`WiLayout` + `WiLayoutSider` + `WiLayoutHeader` + `WiLayoutContent`
- 页面内分区：`WiCard` / `WiPanel` / `WiFieldset`
- 栅格：`WiGrid` + `WiGridItem` 或 `WiFlex` + `WiSpace`

## 3. 页面类型与黄金样例

| 类型 | 参考文件 | 必备区块 |
| --- | --- | --- |
| 列表页 | `docs/golden-pages/list-page.vue` | 面包屑、筛选区、工具栏、表格、分页 |
| 表单页 | `docs/golden-pages/form-page.vue` | 面包屑、分组表单、`WiForm` / `WiFormItem`、提交/取消 |
| 仪表盘 | `docs/golden-pages/dashboard-page.vue` | 统计卡片栅格、图表区占位、快捷入口 / 最近列表 |

生成新页面时：**结构对齐黄金样例，业务字段替换，不另起布局范式**。

## 4. 表单约定

- 使用 `WiForm` + `WiFormItem`，`name` 与校验规则对应。
- 字段组件自带 `label` / `invalid` / `helpText` 时优先用组件 prop（如 `WiInput`、`WiSelect`），复杂表单再用 `WiFormItem` 包一层。
- 尺寸：默认 medium；密集后台可 `size="small"` 或 ConfigProvider `globalDensity`。
- 宽度：筛选项 `fluid` 慎用；表单页主栏 `max-width: 40rem` 左右。

## 5. 数据展示

- 表格：`WiTable` + 列定义；行操作放 `WiButton` text/link 或 `WiDropdown`。
- 分页：`WiPagination` 与表格同级，右对齐或居中。
- 空态：表格 `emptyMessage` 或自定义 `#empty` 插槽；禁止空白区域无提示。

## 6. 浮层与反馈

| 场景 | 组件 |
| --- | --- |
| 确认删除 | `WiConfirmDialog` 或 `WiConfirmPopup` |
| 详情 / 编辑弹窗 | `WiDialog` |
| 侧滑筛选 / 详情 | `WiDrawer` |
| 全局提示 | `WiToast` / `WiMessage` |
| 字段说明 | `WiTooltip` |

## 7. 设计令牌（摘要）

完整定义见 `design-tokens/tokens.json`。

| 用途 | 变量 |
| --- | --- |
| 页面背景 | `--wi-color-surface` |
| 正文 | `--wi-color-text` |
| 次要文字 | `--wi-color-text-muted` |
| 边框 | `--wi-color-border` |
| 品牌 / 链接 | `--wi-color-primary` |
| 错误 | `--wi-color-danger` |
| 区块间距 | `--wi-space-4` / `--wi-space-6` |
| 卡片圆角 | `--wi-radius-md` |
| 卡片阴影 | `--wi-shadow-md` |

## 8. 禁止项

- 禁止引入第二套 UI 库（Element Plus、Naive UI 等）混用同一页面。
- 禁止在业务 CSS 中写死主题色；暗色模式必须能随 `[data-theme="dark"]` 生效。
- 禁止用 `<div onclick>` 代替 `<button>` / `WiButton`。
- 禁止 Select 与 Dropdown 混用：选项选择用 `WiSelect` / `WiTreeSelect`；动作菜单用 `WiDropdown`。
- 禁止跳过 `import '@well-insight/ui/styles.css'`。

## 9. AI 工作流

1. 读本文 → 确定页面类型（列表 / 表单 / 仪表盘）。
2. 打开对应 `docs/golden-pages/*.vue` 与 `src/examples/*.vue`。
3. 查 `docs/components.md` 选型。
4. 不确定 API 时查文档站或 MCP，**不要臆造 prop 名**。
5. 完成后运行 `pnpm check:colors`（若已配置）。

## 10. 相关资源

- 包入口：`@well-insight/ui`
- 全局样式：`@well-insight/ui/styles.css`
- 按需引入：`@well-insight/ui/button` 等 + 对应 `style`
- 主题 API：`useTheme` / `useDensity` / `useMotion`（同包导出）
