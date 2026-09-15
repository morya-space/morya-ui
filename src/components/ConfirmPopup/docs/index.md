---
title: ConfirmPopup
category: 05 / FEEDBACK
description: 锚定在目标旁的确认气泡。
---

# ConfirmPopup

轻量确认浮层，支持 `target` 或坐标定位。

## 引入

```ts
import { MConfirmPopup } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.zh.vue"
```

## Before accept

`beforeAccept` 返回 `false` 时保持打开且不触发 `accept`。

```vue preview src="./demos/BeforeAccept.zh.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | 是否显示。 |
| `message` | `string` | — | 提示文案。 |
| `acceptLabel` / `rejectLabel` | `string` | `确认` / `取消` | 按钮。 |
| `icon` | [IconName](/docs/types#IconName) | — | 文案旁图标。 |
| `beforeAccept` | `() => boolean \| Promise<boolean>` | — | 返回 `false` 时保持打开。 |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | 相对 `target` 的位置。 |
| `target` | `HTMLElement \| null` | — | 锚点。 |
| `position` | `{ top, left } \| null` | — | 无锚点时的坐标。 |
| `teleport` | `boolean` | `true` | 浮层 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标；`'self'` / `false` 就地渲染。 |
| `acceptSeverity` | [ButtonSeverity](/docs/types#ButtonSeverity) | — | — |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `boolean` | 显隐。 |
| `accept` / `reject` | — | 确认 / 取消。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 弹出层正文。 |
