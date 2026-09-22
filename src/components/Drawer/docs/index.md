---
title: Drawer
category: 05 / FEEDBACK
description: 侧边抽屉面板。
---

# Drawer

侧边抽屉，从屏幕边缘滑出，适合导航、筛选或详情面板。

## 引入

```ts
import { MButton, MDrawer } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.vue"
```

## Position

支持 `left` / `right` / `top` / `bottom`。

```vue preview src="./demos/Position.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | 可见性。配合 `v-model` 使用。 |
| `position` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'left'` | 抽屉出现位置。 |
| `modal` | `boolean` | `true` | 显示遮罩层。 |
| `dismissable` | `boolean` | `true` | 点击遮罩关闭。 |
| `showCloseIcon` | `boolean` | `true` | 显示关闭按钮。 |
| `header` | `string` | — | 标题文案。 |
| `width` | `string \| number` | — | 左右抽屉宽度。 |
| `height` | `string \| number` | — | 上下抽屉高度。 |
| `blockScroll` | `boolean` | `true` | 打开时锁定 `body` 滚动。 |
| `teleport` | `boolean` | `true` | 浮层 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标；`'self'` / `false` 就地渲染。 |
| `transition` | `string \| false` | `'drawer'` | 进出场动效预设；`false` / `'none'` 关闭。见[动效](/docs/motion)。 |
| `beforeClose` | [AsyncGuard](/docs/types#AsyncGuard) | — | — |
| `closeOnEsc` | `boolean` | — | — |
| `closeOnOutsideClick` | `boolean` | — | — |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `boolean` | 可见性变化。 |
| `show` | — | 打开时触发。 |
| `hide` | — | 关闭后触发。 |
| `after-leave` | — | 离场动画结束。 |
| `close` | — | — |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 抽屉内容。 |
| `header` | 自定义标题区。 |
