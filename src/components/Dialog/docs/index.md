---
title: Dialog
category: 05 / FEEDBACK
description: 模态对话框。支持预设页脚、异步关闭拦截、状态 type。
---

# Dialog

模态对话框。可见性使用 `v-model`（`modelValue`），对应 的 `visible`。

## 引入

```ts
import { MButton, MDialog } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.vue"
```

## Positions

支持 `center` / `top` / `bottom` / `left` / `right` 以及四角位置。

```vue preview src="./demos/Positions.vue"
```

## Footer actions

```vue preview src="./demos/FooterActions.vue"
```

## No dismiss mask

`dismissableMask={false}`（或 `closeOnOutsideClick={false}`）时点击遮罩不关闭。

```vue preview src="./demos/NoDismissMask.vue"
```

## Maximizable

`maximizable` 在标题栏提供最大化 / 还原切换。

```vue preview src="./demos/Maximizable.vue"
```

## 预设页脚与异步关闭

`positiveText` / `negativeText` 生成确认 / 取消按钮（`footer` 插槽优先）。处理函数返回 `false`（含 Promise）则保持打开。确认型流程请用 [ConfirmDialog](/components/ConfirmDialog)；`type` 只负责 Dialog 标题图标。

```vue preview src="./demos/PresetFooterAndAsyncClose.zh.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | 可见性。配合 `v-model` 使用（对应 `visible`）。 |
| `title` | `string` | — | 标题文案。 |
| `header` | `string` | — | `title` 的 别名。 |
| `closeOnEsc` | `boolean` | `true` | 按 Esc 关闭。 |
| `blockScroll` | `boolean` | `true` | 打开时锁定页面滚动（`modal` 时生效）。 |
| `closeOnOutsideClick` | `boolean` | `true` | 点击遮罩关闭。 |
| `dismissableMask` | `boolean` | — | `closeOnOutsideClick` 的 别名。 |
| `closable` | `boolean` | `true` | 显示关闭按钮。 |
| `maximizable` | `boolean` | `false` | 显示最大化 / 还原按钮。 |
| `modal` | `boolean` | `true` | 遮罩层。 |
| `position` | `'center' \| 'top' \| 'bottom' \| 'left' \| 'right' \| 'topleft' \| 'topright' \| 'bottomleft' \| 'bottomright'` | `'center'` | 对话框位置。 |
| `width` | `string` | — | 对话框宽度（最大化时忽略）。 |
| `teleport` | `boolean` | `true` | 浮层 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self'` | `'body'` | 挂载目标；`'self'` 就地渲染。 |
| `type` | `'info' \| 'success' \| 'warning' \| 'error'` | — | 标题状态图标；`warning` 与 `warn` 同义 |
| `positiveText` / `negativeText` | `string` | — | 预设页脚按钮；有 `footer` 插槽时忽略 |
| `positiveSeverity` | [ButtonSeverity](/docs/types#ButtonSeverity) | — | 确认按钮语义色 |
| `onPositiveClick` / `onNegativeClick` | `(e) => unknown \| Promise<unknown>` | — | 返回 `false` 则不关闭 |
| `beforeClose` | `() => unknown \| Promise<unknown>` | — | X / Esc / 遮罩关闭前；返回 `false` 则保持打开 |
| `ariaLabel` | `string` | — | 对话框可访问名称。 |
| `transition` | `string \| false` | `'zoom'` | 进出场动效预设；`false` / `'none'` 关闭。见[动效](/docs/motion)。 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | 遮罩层（backdrop）透传，键名 `root`。 |

## 样式与 attrs

Dialog Teleport 到 `body` 后，你在组件上写的 fallthrough attrs（`class`、`style`、`data-*`、`title` 等）落在**遮罩层**（`.m-dialog-backdrop`），不是内层 `.m-dialog` 面板。面板宽度用 `width` prop；内层 DOM 用 `pt`。详见 [样式与 attrs](/docs/attrs)。

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `boolean` | 可见性变化。 |
| `close` | — | 关闭时触发。 |
| `show` | — | 打开时触发。 |
| `hide` | — | 关闭后触发。 |
| `maximize` | — | 进入最大化。 |
| `unmaximize` | — | 退出最大化。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 对话框内容。 |
| `header` | 自定义标题区。 |
| `footer` | 底部操作区。 |
