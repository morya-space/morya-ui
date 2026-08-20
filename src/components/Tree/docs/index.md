---
title: Tree
category: 06 / DATA
description: 树形结构。支持勾选半选、过滤、受控展开、懒加载与拖拽。
---

# Tree

层级节点树，支持展开、勾选、过滤与拖拽等常用能力。

## 引入

```ts
import { WiTree } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiTree } from '@well-insight/ui'

const selected = ref<string | null>(null)
const nodes = [
  {
    key: '0',
    label: 'Documents',
    icon: 'menu',
    children: [
      { key: '0-0', label: 'Work', icon: 'edit' },
      { key: '0-1', label: 'Home', icon: 'home' },
    ],
  },
]
</script>

<template>
  <WiTree v-model="selected" :value="nodes" default-expand-all />
</template>
```

## Checkbox

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiTree } from '@well-insight/ui'

const checkedKeys = ref({})
const nodes = [
  {
    key: '1',
    label: '指南',
    children: [
      { key: '1-1', label: '安装' },
      { key: '1-2', label: '快速上手' },
    ],
  },
]
</script>

<template>
  <WiTree
    v-model:checked-keys="checkedKeys"
    :value="nodes"
    show-checkbox
    default-expand-all
  />
</template>
```

## Filter

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiInput, WiTree } from '@well-insight/ui'

const query = ref('')
const nodes = [
  {
    key: 'a',
    label: '组件',
    children: [
      { key: 'a-1', label: 'Button' },
      { key: 'a-2', label: 'Table' },
      { key: 'a-3', label: 'Tree' },
    ],
  },
]
</script>

<template>
  <div style="display:grid;gap:0.75rem;max-width:20rem">
    <WiInput v-model="query" placeholder="过滤节点" clearable fluid />
    <WiTree :value="nodes" :filter="query" default-expand-all />
  </div>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `TreeNode[]` | — | 节点树。 |
| `modelValue` / `selectionKeys` / `selectionMode` | — | — | 高亮选择。 |
| `showCheckbox` / `checkedKeys` / `checkStrictly` | — | — | 勾选与半选。 |
| `expandedKeys` / `defaultExpandAll` / `accordion` | — | — | 展开控制。 |
| `filter` / `filterNode` | — | — | 过滤。 |
| `lazy` / `load` | — | — | 懒加载子节点。 |
| `draggable` | `boolean` | `false` | 拖拽；落点通过 `node-drop` 由业务改树。 |

## Slots / Events

| 插槽 | 说明 |
| --- | --- |
| `default` | `{ node, data }` 自定义节点内容。 |

| 事件 | 说明 |
| --- | --- |
| `update:checkedKeys` / `update:expandedKeys` / `check` / `node-expand` / `node-collapse` / `node-drop` | 交互回调。 |
