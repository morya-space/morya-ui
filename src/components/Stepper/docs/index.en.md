---
title: Stepper
category: 05 / PANEL
description: Step indicator with optional linear-progress constraint.
---

# Stepper

Shows progress through a multi-step flow and lets users switch steps.

## Import

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
  { label: 'Basic info' },
  { label: 'Confirm' },
  { label: 'Done' },
]
</script>

<template>
  <WiStepper v-model="active" :steps="steps" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `number` | `0` | Current step index (0-based). |
| `steps` | `{ label: string; disabled?: boolean }[]` | — | Step list. |
| `linear` | `boolean` | `false` | Only the current and previous steps can be selected. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `number` | Emitted when the step changes. |
