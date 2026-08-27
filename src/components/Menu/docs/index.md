---
title: Menu
category: 09 / MENU
description: 垂直菜单列表，支持 popup 模式。
---

# Menu

基于 `model` 渲染的垂直菜单。嵌套 `items` 就地展开；`collapsed` 为图标密度（子菜单仍就地展开，不做飞出层）。

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

## Nested / selectedKey / collapsed

```vue preview
<script setup lang="ts">
import { WiMenu } from '@well-insight/ui'
import { ref } from 'vue'

const selectedKey = ref('home')
const model = [
  {
    key: 'file',
    label: '文件',
    icon: 'edit',
    items: [
      { key: 'home', label: '首页', icon: 'home' },
      { key: 'open', label: '打开' },
    ],
  },
]
</script>

<template>
  <div style="display:flex;gap:1.5rem;align-items:flex-start">
    <WiMenu v-model:selected-key="selectedKey" :model="model" />
    <WiMenu :model="model" collapsed />
  </div>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `model` | `MenuItem[]` | — | 菜单项，可嵌套 `items`；项可含 `key` / `icon`。 |
| `popup` | `boolean` | `false` | 是否作为弹出菜单。 |
| `modelValue` | `boolean` | `false` | popup 可见性。 |
| `selectedKey` | `string \| null` | — | 选中项（`item.key` 或 `item.label`）。 |
| `collapsed` | `boolean` | `false` | 仅显示图标；嵌套项仍就地展开。 |
| `indent` | `number` | `16` | 每层额外左内边距（px）。 |
| `teleport` | `boolean` | `true` | 浮层 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标；`'self'` / `false` 就地渲染。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `boolean` | popup 可见性变化。 |
| `update:selectedKey` | `string \| null` | 选中项变化。 |
| `select` | `MenuItem` | 点击叶子项。 |
