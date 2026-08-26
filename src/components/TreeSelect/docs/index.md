---
title: TreeSelect
category: 02 / FORM
description: 下拉树选择。支持单选/多选、勾选级联、过滤、清空与路径展示。
---

# TreeSelect

在下拉中展示可展开树。`multiple` / `checkable` 打开多选；`filterable`、`clearable`、`showPath` 对照 Naive `n-tree-select` 常用能力。

## 引入

```ts
import { WiTreeSelect } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiTreeSelect } from '@well-insight/ui'

const value = ref<string | null>(null)
const options = [
  {
    key: 'docs',
    label: '文档',
    children: [
      { key: 'resume', label: '简历' },
      { key: 'home', label: '家居' },
    ],
  },
]
</script>

<template>
  <WiTreeSelect v-model="value" :options="options" />
</template>
```

## Multiple / filter / path

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiTreeSelect } from '@well-insight/ui'

const value = ref<string[]>([])
const options = [
  {
    key: 'docs',
    label: '文档',
    children: [
      { key: 'resume', label: '简历' },
      { key: 'home', label: '家居' },
    ],
  },
]
</script>

<template>
  <WiTreeSelect
    v-model="value"
    :options="options"
    multiple
    checkable
    filterable
    clearable
    show-path
    placeholder="选择节点"
    style="min-width: 16rem"
  />
</template>
```

## Size

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiTreeSelect } from '@well-insight/ui'

const a = ref(null)
const b = ref(null)
const c = ref(null)
const options = [{ key: 'docs', label: '文档' }]
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem">
    <WiTreeSelect v-model="a" size="small" :options="options" placeholder="Small" />
    <WiTreeSelect v-model="b" :options="options" placeholder="Default" />
    <WiTreeSelect v-model="c" size="large" :options="options" placeholder="Large" />
  </div>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `options` | `TreeSelectNode[]` | — | 树节点。 |
| `modelValue` | `string \| string[] \| null` | `null` | 选中节点 key；多选为数组。 |
| `placeholder` | `string` | locale | 占位文案。 |
| `size` | `WiSizeInput` | — | `small` / `large`；可继承 ConfigProvider。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `multiple` | `boolean` | `false` | 多选。 |
| `checkable` | `boolean` | `false` | 显示勾选框（级联语义同 Tree）。 |
| `checkStrictly` | `boolean` | `false` | 父子不关联。 |
| `checkStrategy` | `'all' \| 'parent' \| 'child'` | `'all'` | 级联时绑定哪些 keys。 |
| `clearable` | `boolean` | `false` | 显示清空。 |
| `filterable` | `boolean` | `false` | 面板内过滤。 |
| `showPath` | `boolean` | `false` | 展示祖先路径。 |
| `separator` | `string` | `' / '` | 路径分隔符。 |
| `maxTagCount` | `number` | — | 多选最多展示的 tag 数。 |
| `selectionMode` | `'single' \| 'multiple'` | `'single'` | 兼容字段；请优先用 `multiple`。 |
| `teleport` | `boolean` | `true` | 浮层 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标；`'self'` / `false` 就地渲染。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `string \| string[] \| null` | 选中变化。 |
| `clear` | — | 点击清空。 |
