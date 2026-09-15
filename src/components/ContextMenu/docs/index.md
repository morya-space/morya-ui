---
title: ContextMenu
category: 04 / NAVIGATION
description: 右键上下文菜单，支持 show(event) / hide()。
---

# ContextMenu

在指针位置弹出的上下文菜单。支持嵌套 `items`。也可用 `useContextMenu()` 绑定 `v-model` / `v-model:position`。

## 引入

```ts
import { MContextMenu, useContextMenu } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.zh.vue"
```

## Nested + useContextMenu

```vue preview src="./demos/NestedUsecontextmenu.zh.vue"
```

## 滚动与嵌套子菜单

菜单列表与嵌套 `items` 飞出层使用内置 `MScrollbar`（`max-height: min(18rem, 45vh)`）。嵌套层 Teleport 到 `body` 相对父项定位，避免长列表滚动时侧向菜单被裁剪。

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `model` | `ContextMenuItem[]` | — | 菜单项，可嵌套 `items`；项可含 `key` / `icon`。 |
| `modelValue` | `boolean` | `false` | 是否可见。 |
| `position` | `{ x: number; y: number }` | — | 菜单坐标。 |
| `teleport` | `boolean` | `true` | 浮层 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标；`'self'` / `false` 就地渲染。 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `boolean` | 可见性变化。 |
| `update:position` | `{ x; y }` | 位置变化。 |

## Methods

| 方法 | 说明 |
| --- | --- |
| `show(event)` | 根据鼠标事件或坐标显示。 |
| `hide()` | 隐藏菜单。 |

`useContextMenu()` 返回 `{ visible, position, show, hide }`，便于命令式打开。

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 触发元素（非 popup 模式）。 |

## 类型

<h4 id="ContextMenuItem">ContextMenuItem</h4>

完整定义见源码 `types.ts`。

```ts
interface ContextMenuItem extends MenuNodeBase {
  items?: ContextMenuItem[]
}
```
