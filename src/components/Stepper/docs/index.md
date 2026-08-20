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

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `number` | `0` | 当前步骤索引（从 0 开始）。 |
| `steps` | `{ label: string; disabled?: boolean }[]` | — | 步骤列表。 |
| `linear` | `boolean` | `false` | 仅允许选择当前及之前步骤。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `number` | 步骤变化。 |
