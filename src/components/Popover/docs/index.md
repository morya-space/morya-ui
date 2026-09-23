---
title: Popover
category: 05 / FEEDBACK
description: 相对触发元素定位的浮层面板。支持 placement、Teleport；点击外部或 Esc 关闭。
---

# Popover

相对触发元素显示的浮层，适合筛选、快捷操作或轻量表单。

## 引入

```ts
import { MButton, MPopover } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.vue"
```

## Placement

```vue preview src="./demos/Placement.vue"
```

## Hover

`trigger` 默认 `manual`（仅 `v-model`）。设为 `hover` / `click` / `focus` 由组件自行开关。

```vue preview src="./demos/Hover.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | 可见性。配合 `v-model` 使用。 |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right' \| 'bottom-start' \| 'bottom-end'` | `'bottom'` | 相对触发元素的位置。 |
| `trigger` | `'manual' \| 'click' \| 'hover' \| 'focus'` | `'manual'` | 打开方式。 |
| `showDelay` / `hideDelay` | `number` | `0` / `200` | hover/focus 延迟（ms）。 |
| `teleport` | `boolean` | `true` | 浮层 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标；`'self'` / `false` 就地渲染。 |
| `transition` | `string \| false` | `'popover'` | 进出场动效预设；`false` / `'none'` 关闭。见[动效](/docs/motion)。 |
| `disabled` | `boolean` | — | — |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `boolean` | 可见性变化。 |
| `show` | — | 打开时触发。 |
| `hide` | — | 关闭后触发。 |

## Methods

| 方法 | 说明 |
| --- | --- |
| `show()` | 显示浮层。 |
| `hide()` | 隐藏浮层。 |
| `toggle()` | 切换显示状态。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 触发元素。 |
| `content` | 浮层内容。 |
