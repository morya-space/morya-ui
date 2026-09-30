---
title: Radio
category: 02 / FORM
description: Radio button. Supports invalid.
---

# Radio

Radio button.

## Import

```ts
import { MRadio } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Invalid

```vue preview src="./demos/Invalid.vue"
```

## Disabled

```vue preview src="./demos/Disabled.vue"
```

## Group

```vue preview src="./demos/Group.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| boolean` | — | Currently selected value. |
| `value` | `string \| number \| boolean` | — | **Required.** Value of this option. |
| `label` | `string` | — | Label text. You can also use the default slot. |
| `id` | `string` | — | Native id. |
| `name` | `string` | — | Native name. Must match within a group. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size. |
| `invalid` | `boolean` | `false` | Invalid state. |
| `disabled` | `boolean` | `false` | Disabled. |
| `required` | `boolean` | `false` | Native required. |
| `pt` | [ControlPassThrough](/docs/types#ControlPassThrough) `{ root?, input? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `string \| number \| boolean` | Emitted when the selected value changes. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Custom label. Takes precedence over `label`. |
