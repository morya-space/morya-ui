---
title: PickList
category: 06 / DATA
description: 双列表穿梭选择。
---

# PickList

在 source 与 target 列表间移动条目。

## 引入

```ts
import { WdPickList } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdPickList } from '@well-insight/ui'

const source = ref(['苹果', '香蕉', '樱桃', '葡萄'])
const target = ref(['榴莲'])
</script>

<template>
  <WdPickList
    v-model:source="source"
    v-model:target="target"
    source-header="可选水果"
    target-header="已选水果"
  />
</template>
```

## 自定义条目

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdPickList } from '@well-insight/ui'

const source = ref([
  { id: 1, name: '设计' },
  { id: 2, name: '研发' },
])
const target = ref([{ id: 3, name: '测试' }])
</script>

<template>
  <WdPickList v-model:source="source" v-model:target="target" data-key="id">
    <template #item="{ item }">
      <strong>{{ item.name }}</strong>
    </template>
  </WdPickList>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `source` | `unknown[]` | `[]` | 左侧列表。 |
| `target` | `unknown[]` | `[]` | 右侧列表。 |
| `sourceHeader` | `string` | `'可选'` | 左侧标题。 |
| `targetHeader` | `string` | `'已选'` | 右侧标题。 |
| `dataKey` | `string` | — | 对象唯一键。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:source` | `unknown[]` | 源列表变化。 |
| `update:target` | `unknown[]` | 目标列表变化。 |

## Slots

| 插槽 | 参数 | 说明 |
| --- | --- | --- |
| `item` | `{ item, index }` | 自定义列表项内容。 |
