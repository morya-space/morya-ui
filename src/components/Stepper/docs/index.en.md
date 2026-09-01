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
import { WiStepper } from '@well-insight/ui'
import { ref } from 'vue'

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

## Vertical

`vertical` (or `orientation="vertical"`) stacks steps. Each step can include `description` / `status`.

```vue preview
<script setup lang="ts">
import { WiStepper } from '@well-insight/ui'
import { ref } from 'vue'

const active = ref(1)
const steps = [
  { label: 'Basic info', description: 'Fill in details', status: 'finish' },
  { label: 'Confirm', description: 'Review', status: 'process' },
  { label: 'Done', description: 'Submit' },
]
</script>

<template>
  <WiStepper v-model="active" vertical :steps="steps" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `number` | `0` | Current step index (0-based). |
| `steps` | `{ label: string; description?: string; disabled?: boolean; status?: 'wait' \| 'process' \| 'finish' \| 'error' }[]` | — | Step list. |
| `linear` | `boolean` | `false` | Only the current and previous steps can be selected. |
| `vertical` | `boolean` | `false` | Vertical layout. |
| `orientation` | `'horizontal' \| 'vertical'` | — | Alias of `vertical`. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `number` | Emitted when the step changes. |

## Slots

| Slot | Description |
| --- | --- |
| `icon` | Step icon `{ step, index }`. |
