---
title: TreeSelect
category: 02 / FORM
description: 下拉面板中的树形单选。
---

# TreeSelect

在下拉中展示可展开树并单选节点。

## 引入

```ts
import { WdTreeSelect } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdTreeSelect } from '@well-insight/ui'

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
  <WdTreeSelect v-model="value" :options="options" />
</template>
```

## Size

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdTreeSelect } from '@well-insight/ui'

const a = ref(null)
const b = ref(null)
const c = ref(null)
const options = [{ key: 'docs', label: '文档' }]
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem">
    <WdTreeSelect v-model="a" size="small" :options="options" placeholder="Small" />
    <WdTreeSelect v-model="b" :options="options" placeholder="Default" />
    <WdTreeSelect v-model="c" size="large" :options="options" placeholder="Large" />
  </div>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `options` | `TreeSelectNode[]` | — | 树节点。 |
| `modelValue` | `string \| null` | `null` | 选中节点 key。 |
| `placeholder` | `string` | `'请选择'` | 占位文案。 |
| `size` | `WdSizeInput` | — | `small` / `large`；可继承 ConfigProvider。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `selectionMode` | `'single'` | `'single'` | 选择模式。 |
| `teleport` | `boolean` | `true` | 浮层 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标；`'self'` / `false` 就地渲染。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `string \| null` | 选中变化。 |
