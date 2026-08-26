---
title: Stepper
category: 05 / PANEL
description: 步骤指示器，支持线性前进约束。
---

# Stepper

展示多步流程的当前进度，并可切换步骤。

## 引入

```ts
import { WiStepper } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiStepper } from '@well-insight/ui'

const active = ref(0)
const steps = [
  { label: '基本信息' },
  { label: '确认' },
  { label: '完成' },
]
</script>

<template>
  <WiStepper v-model="active" :steps="steps" />
</template>
```

## Vertical

`vertical`（或 `orientation="vertical"`）竖排。步骤可带 `description` / `status`。

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiStepper } from '@well-insight/ui'

const active = ref(1)
const steps = [
  { label: '基本信息', description: '填写资料', status: 'finish' },
  { label: '确认', description: '核对内容', status: 'process' },
  { label: '完成', description: '提交' },
]
</script>

<template>
  <WiStepper v-model="active" vertical :steps="steps" />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `number` | `0` | 当前步骤索引（从 0 开始）。 |
| `steps` | `{ label: string; description?: string; disabled?: boolean; status?: 'wait' \| 'process' \| 'finish' \| 'error' }[]` | — | 步骤列表。 |
| `linear` | `boolean` | `false` | 仅允许选择当前及之前步骤。 |
| `vertical` | `boolean` | `false` | 竖排。 |
| `orientation` | `'horizontal' \| 'vertical'` | — | `vertical` 的别名。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `number` | 步骤变化。 |
