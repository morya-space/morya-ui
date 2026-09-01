---
title: SpeedDial
category: 01 / PRIMITIVE
description: 悬浮快捷操作按钮组。
---

# SpeedDial

主按钮展开一组方向性快捷操作。

## 引入

```ts
import { WiSpeedDial } from '@well-insight/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WiSpeedDial } from '@well-insight/ui'
import { ref } from 'vue'

const open = ref(false)
const items = [
  { label: '编辑', icon: '✎' },
  { label: '删除', icon: '🗑' },
  { label: '分享', icon: '↗' },
]
</script>

<template>
  <div style="min-height:8rem;display:flex;align-items:flex-end;justify-content:center">
    <WiSpeedDial v-model="open" :model="items" direction="up" />
  </div>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `model` | `SpeedDialItem[]` | `[]` | 操作项。 |
| `direction` | `'up' \| 'down' \| 'left' \| 'right'` | `'up'` | 展开方向。 |
| `modelValue` | `boolean` | `false` | 是否展开。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `ariaLabel` | `string` | `'快捷操作'` | 主按钮无障碍标签。 |
| `teleport` | `boolean` | `true` | 浮层 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标；`'self'` / `false` 就地渲染。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `boolean` | 展开态变化。 |
