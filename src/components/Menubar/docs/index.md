---
title: Menubar
category: 04 / NAVIGATION
description: 水平菜单栏，支持一级下拉。
---

# Menubar

水平导航菜单，子项以一层下拉展示。`selectedKey` / `icon` 用于高亮与图标；响应式折叠本期不做。

## 引入

```ts
import { MMenubar } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.zh.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `model` | `MenubarItem[]` | — | 菜单项，可含一层 `items`；项可含 `key` / `icon`。 |
| `selectedKey` | `string \| null` | — | 选中项（`item.key` 或 `item.label`）。 |
| `teleport` | `boolean` | `true` | 浮层 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标；`'self'` / `false` 就地渲染。 |
| `transition` | `string \| false` | `'scale-fade'` | 进出场动效预设；`false` / `'none'` 关闭。见[主题 · 动效预设](/docs/guide/theme)。 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:selectedKey` | `string \| null` | 选中项变化。 |
| `select` | `MenubarItem` | 点击叶子项。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `start` | 菜单栏起始区域。 |
| `end` | 菜单栏末尾区域。 |

## 类型

<h4 id="MenubarItem">MenubarItem</h4>

完整定义见源码 `types.ts`。

```ts
interface MenubarItem extends Omit<MenuNodeBase, 'label' | 'items'> {
  label: string
  items?: MenubarItem[]
}
```
