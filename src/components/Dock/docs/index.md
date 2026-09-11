---
title: Dock
category: 04 / NAVIGATION
description: macOS 风格图标坞。
---

# Dock

以图标列表展示快捷入口。

## 引入

```ts
import { MDock } from 'morya-ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { MDock } from 'morya-ui'

const model = [
  { label: '主页', icon: '⌂' },
  { label: '搜索', icon: '⌕' },
  { label: '设置', icon: '⚙' },
]
</script>

<template>
  <MDock :model="model" />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `model` | `DockItem[]` | `[]` | 图标项。 |
| `position` | `'bottom' \| 'top'` | `'bottom'` | 视觉位置修饰。 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Events

无自定义事件。

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 停靠项。 |

## 类型

<h4 id="DockItem">DockItem</h4>

完整定义见源码 `types.ts`。

```ts
interface DockItem extends Omit<MenuNodeBase, 'label'> {
  label: string
}
```
