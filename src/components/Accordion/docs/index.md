---
title: Accordion
category: 05 / PANEL
description: 可折叠面板组。支持单开 / 多开，tabs 配置 header 与 disabled。
---

# Accordion

可折叠面板，用于在有限空间内组织分组内容。

## 引入

```ts
import { WdAccordion } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdAccordion } from '@well-insight/ui'

const active = ref('design')
const tabs = [
  { value: 'design', header: 'Design' },
  { value: 'code', header: 'Code' },
  { value: 'disabled', header: 'Disabled', disabled: true },
]
</script>

<template>
  <WdAccordion v-model="active" :tabs="tabs">
    <template #design>
      <p style="margin:0">Design system tokens and layout rules.</p>
    </template>
    <template #code>
      <p style="margin:0">Implementation notes and API contracts.</p>
    </template>
  </WdAccordion>
</template>
```

## Multiple

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdAccordion } from '@well-insight/ui'

const active = ref<string[]>(['a'])
const tabs = [
  { value: 'a', header: 'Section A' },
  { value: 'b', header: 'Section B' },
]
</script>

<template>
  <WdAccordion v-model="active" multiple :tabs="tabs">
    <template #a>
      <p style="margin:0">First section content.</p>
    </template>
    <template #b>
      <p style="margin:0">Second section content.</p>
    </template>
  </WdAccordion>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| string[]` | — | 当前展开的 tab key；多开时为数组。 |
| `multiple` | `boolean` | `false` | 允许多个面板同时展开。 |
| `tabs` | `{ value: string; header: string; disabled?: boolean }[]` | — | 面板列表。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `string \| string[]` | 展开项变化。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `[tab.value]` | 对应面板内容，插槽名与 `tabs[].value` 一致。 |
