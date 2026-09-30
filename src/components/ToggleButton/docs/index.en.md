---
title: ToggleButton
category: 02 / FORM
description: A button that switches between on and off labels.
---

# ToggleButton

A boolean toggle button with configurable on/off labels and icons.

## Import

```ts
import { MToggleButton } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.en.vue"
```

## Size

```vue preview src="./demos/Size.en.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | Whether it is on. |
| `onLabel` / `offLabel` | `string` | `On` / `Off` | Labels. |
| `onIcon` / `offIcon` | `string` | — | Optional icon characters. |
| `size` | [MSizeInput](/docs/types#MSizeInput) | — | `small` / `large`; can inherit from ConfigProvider. |
| `disabled` | `boolean` | `false` | Disabled. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Emitted when the value changes. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Button content. |
