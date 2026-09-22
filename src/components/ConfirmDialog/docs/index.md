---
title: ConfirmDialog
category: 05 / FEEDBACK
description: 确认 / 取消对话框，复用 Dialog 浮层样式。
---

# ConfirmDialog

需要用户明确确认时使用的模态对话框。

## 引入

```ts
import { MButton, MConfirmDialog } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.zh.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | 是否可见。 |
| `header` | `string` | `'确认'` | 标题。 |
| `message` | `string` | — | 正文。 |
| `acceptLabel` | `string` | `'确认'` | 确认按钮文案。 |
| `rejectLabel` | `string` | `'取消'` | 取消按钮文案。 |
| `acceptSeverity` | [ButtonSeverity](/docs/types#ButtonSeverity) | — | 确认按钮语义色。 |
| `type` | `'info' \| 'success' \| 'warning' \| 'error'` | — | 正文状态图标；确认流程用本组件，Dialog `type` 只做标题图标。 |
| `loading` | `boolean` | `false` | 确认按钮加载中。 |
| `beforeAccept` | `() => unknown \| Promise<unknown>` | — | 返回 `false` 则不关闭、不触发 `accept`。 |
| `beforeReject` | `() => unknown \| Promise<unknown>` | — | 返回 `false` 则不关闭、不触发 `reject`。 |
| `teleport` | `boolean` | `true` | 浮层 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标；`'self'` / `false` 就地渲染。 |
| `transition` | `string \| false` | `'dialog'` | 进出场动效预设；`false` / `'none'` 关闭。见[主题 · 动效预设](/docs/guide/theme)。 |
| `blockScroll` | `boolean` | — | — |
| `closeOnEsc` | `boolean` | — | — |
| `closeOnOutsideClick` | `boolean` | — | — |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `boolean` | 可见性变化。 |
| `accept` | — | 点击确认。 |
| `reject` | — | 点击取消或关闭。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 对话框正文。 |
| `footer` | 自定义 `footer` 内容。 |
| `header` | 自定义 `header` 内容。 |
