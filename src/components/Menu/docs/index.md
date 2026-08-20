---
title: Menu
category: 09 / MENU
description: 垂直菜单列表，支持 popup 模式。
---

# Menu

基于 `model` 渲染的垂直菜单。

## 引入

```ts
import { WiMenu } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiMenu } from '@well-insight/ui'

const model = [
  { label: '新建', command: () => undefined },
  { label: '打开' },
  { separator: true },
  { label: '禁用', disabled: true },
]
</script>

<template>
  <WiMenu :model="model" />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `model` | `MenuItem[]` | — | 菜单项。 |
| `popup` | `boolean` | `false` | 是否作为弹出菜单。 |
| `modelValue` | `boolean` | `false` | popup 可见性。 |
| `teleport` | `boolean` | `true` | 浮层 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标；`'self'` / `false` 就地渲染。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `boolean` | popup 可见性变化。 |
