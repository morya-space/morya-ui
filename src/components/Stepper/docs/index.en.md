---
title: Stepper
category: 04 / NAVIGATION
description: Step indicator with optional linear-progress constraint.
---

# Stepper

Shows progress through a multi-step flow and lets users switch steps.

## Import

```ts
import { MStepper } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.en.vue"
```

## Vertical

`vertical` (or `orientation="vertical"`) stacks steps. Each step can include `description` / `status`.

```vue preview src="./demos/Vertical.en.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `number` | `0` | Current step index (0-based). |
| `steps` | `{ label: string; description?: string; disabled?: boolean; status?: 'wait' \| 'process' \| 'finish' \| 'error' }[]` | — | Step list. |
| `linear` | `boolean` | `false` | Only the current and previous steps can be selected. |
| `vertical` | `boolean` | `false` | Vertical layout. |
| `orientation` | `'horizontal' \| 'vertical'` | — | Alias of `vertical`. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `number` | Emitted when the step changes. |

## Slots

| Slot | Description |
| --- | --- |
| `icon` | Step icon `{ step, index }`. |
