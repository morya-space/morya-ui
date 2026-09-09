# Morya UI 设计系统（AI 第一信源）

> 基于 `morya-ui` v0.1.x。生成或审查业务页面时，**必须先遵守本文**，再查阅 `docs/components.md` 与 `docs/golden-pages/`。

## 1. 设计原则

1. **组件优先**：布局、表单、表格、浮层一律使用库内 `M*` 组件，不手写等价 DOM 结构。
2. **令牌优先**：颜色、间距、圆角、阴影、动效使用 `--m-*` CSS 变量；禁止裸 `#hex` / `rgb()`（`scripts/check-raw-colors.mjs` 会扫描）。
3. **语义一致**：主操作 `MButton` `severity="primary"`；危险操作用 `severity="danger"` 或 `MConfirmDialog`。
4. **可访问性**：表单控件带 `label`；图标按钮带 `aria-label`；浮层可 Esc 关闭（组件默认支持）。
5. **ConfigProvider 包裹**：应用根节点使用 `MConfigProvider`，统一 locale、主题、密度、浮层挂载。

## 2. 应用骨架

```vue
<script setup lang="ts">
import { MConfigProvider, zhCN } from 'morya-ui'
import 'morya-ui/styles.css'
</script>

<template>
  <MConfigProvider :locale="zhCN">
    <MLayout has-sider>
      <MLayoutSider>...</MLayoutSider>
      <MLayout>
        <MLayoutHeader>...</MLayoutHeader>
        <MLayoutContent>...</MLayoutContent>
      </MLayout>
    </MLayout>
  </MConfigProvider>
</template>
```

- 管理后台：`MLayout` + `MLayoutSider` + `MLayoutHeader` + `MLayoutContent`
- 页面内分区：`MCard` / `MPanel` / `MFieldset`
- 栅格：`MGrid` + `MGridItem` 或 `MFlex` + `MSpace`

## 3. 页面类型与黄金样例

| 类型 | 参考文件 | 必备区块 |
| --- | --- | --- |
| 列表页 | `docs/golden-pages/list-page.vue` | 面包屑、筛选区、工具栏、表格、分页 |
| 表单页 | `docs/golden-pages/form-page.vue` | 面包屑、分组表单、`MForm` / `MFormItem`、提交/取消 |
| 仪表盘 | `docs/golden-pages/dashboard-page.vue` | 统计卡片栅格、图表区占位、快捷入口 / 最近列表 |

生成新页面时：**结构对齐黄金样例，业务字段替换，不另起布局范式**。

## 4. 表单约定

- 使用 `MForm` + `MFormItem`，`name` 与校验规则对应。
- 字段组件自带 `label` / `invalid` / `helpText` 时优先用组件 prop（如 `MInput`、`MSelect`），复杂表单再用 `MFormItem` 包一层。
- 尺寸：默认 medium；密集后台可 `size="small"` 或 ConfigProvider `globalDensity`。
- 宽度：筛选项 `fluid` 慎用；表单页主栏 `max-width: 40rem` 左右。

## 5. 数据展示

- 表格：`MTable` + 列定义；行操作放 `MButton` text/link 或 `MDropdown`。
- 分页：`MPagination` 与表格同级，右对齐或居中。
- 空态：表格 `emptyMessage` 或自定义 `#empty` 插槽；禁止空白区域无提示。

## 6. 浮层与反馈

| 场景 | 组件 |
| --- | --- |
| 确认删除 | `MConfirmDialog` 或 `MConfirmPopup` |
| 详情 / 编辑弹窗 | `MDialog` |
| 侧滑筛选 / 详情 | `MDrawer` |
| **操作结果（默认）** | **`message` API**（单行：已保存 / 已删除） |
| 标题 + 详情 / 异步通知 | `toast` API（`summary` + `detail`） |
| 表单区常驻错误 | `<MMessage>` 或字段 `errorMessage` |
| 字段说明 | `MTooltip` |

**选型细则见 [`docs/feedback-message-vs-toast.md`](docs/feedback-message-vs-toast.md)。AI 生成代码时：无 `detail` 的操作回执一律用 `message`，不要默认 Toast。**

## 7. 设计令牌（摘要）

完整定义见 `design-tokens/tokens.json`。

| 用途 | 变量 |
| --- | --- |
| 页面背景 | `--m-color-surface` |
| 正文 | `--m-color-text` |
| 次要文字 | `--m-color-text-muted` |
| 边框 | `--m-color-border` |
| 品牌 / 链接 | `--m-color-primary` |
| 错误 | `--m-color-danger` |
| 区块间距 | `--m-space-4` / `--m-space-6` |
| 卡片圆角 | `--m-radius-md` |
| 卡片阴影 | `--m-shadow-md` |

## 8. 禁止项

- 禁止引入第二套 UI 库（Element Plus、Naive UI 等）混用同一页面。
- 禁止在业务 CSS 中写死主题色；暗色模式必须能随 `[data-theme="dark"]` 生效。
- 禁止用 `<div onclick>` 代替 `<button>` / `MButton`。
- 禁止 Select 与 Dropdown 混用：选项选择用 `MSelect` / `MTreeSelect`；动作菜单用 `MDropdown`。
- 禁止跳过 `import 'morya-ui/styles.css'`。

## 9. AI 工作流

1. 读本文 → 确定页面类型（列表 / 表单 / 仪表盘）。
2. 打开对应 `docs/golden-pages/*.vue` 与 `src/examples/*.vue`。
3. 查 `docs/components.md` 选型。
4. 不确定 API 时查文档站或 MCP，**不要臆造 prop 名**。
5. 完成后运行 `pnpm check:colors`（若已配置）。
6. 操作反馈见 `docs/feedback-message-vs-toast.md`：**默认 `message`，有 detail 才用 `toast`**。

## 10. 相关资源

- 包入口：`morya-ui`
- 全局样式：`morya-ui/styles.css`
- 按需引入：`morya-ui/button` 等 + 对应 `style`
- 主题 API：`useTheme` / `useDensity` / `useMotion`（同包导出）
