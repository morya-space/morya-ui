---
title: Switch
category: 02 / FORM
description: Toggle switch.
---

# Switch

Toggle switch control.

## Import

```ts
import { MSwitch } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Invalid & inputId

`inputId` is an alias for `id`.

```vue preview src="./demos/InvalidAndInputid.vue"
```

## Disabled

```vue preview src="./demos/Disabled.vue"
```

## Loading & text

```vue preview src="./demos/LoadingAndText.en.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | On/off state. |
| `label` | `string` | — | Label text; the default slot can be used instead. |
| `id` | `string` | — | Native id. |
| `inputId` | `string` | — | Alias for `id`. |
| `name` | `string` | — | Native name. |
| `value` | `string` | — | Native value. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size. |
| `loading` | `boolean` | `false` | Loading; blocks toggle. |
| `checkedText` | `string` | — | Track text when on. |
| `uncheckedText` | `string` | — | Track text when off. |
| `invalid` | `boolean` | `false` | Invalid (validation failed) state. |
| `disabled` | `boolean` | `false` | Disabled. |
| `required` | `boolean` | `false` | Native required. |
| `pt` | [ControlPassThrough](/docs/types#ControlPassThrough) `{ root?, input? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Emitted when the state changes. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Custom label; takes precedence over `label`. |
