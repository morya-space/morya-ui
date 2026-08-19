---
title: Tabs
category: 05 / PANEL
description: 标签页切换。使用 modelValue 与 tabs 列表控制活动项。
---

# Tabs

标签页用于在同一视图内切换内容分区。

## 引入

```ts
import { WdTabs } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdTabs } from '@well-insight/ui'

const active = ref('design')
const tabs = [
  { label: 'Design', value: 'design' },
  { label: 'Code', value: 'code' },
  { label: 'Disabled', value: 'disabled', disabled: true },
]
</script>

<template>
  <WdTabs v-model="active" :tabs="tabs">
    <template #default="{ activeValue }">
      <p style="margin:0">Active panel: {{ activeValue }}</p>
    </template>
  </WdTabs>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | — | 当前活动 tab。 |
| `tabs` | `TabItem[]` | — | 标签列表；支持 `disabled`。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `string` | 活动项变化。 |
| `change` | `string` | 切换完成。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 面板内容，作用域 `{ activeValue }`。 |
