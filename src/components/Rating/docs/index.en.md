---
title: Rating
category: 02 / FORM
description: Star rating control with clear and readonly support.
---

# Rating

Click stars to rate. A clear button is shown by default.

## Import

```ts
import { MRating } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Readonly

```vue preview src="./demos/Readonly.vue"
```

## Half

`allowHalf` enables 0.5 increments. `allowClear` is an alias of `cancel` and takes precedence when set.

```vue preview src="./demos/Half.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `number` | `0` | Current rating. |
| `stars` | `number` | `5` | Number of stars. |
| `cancel` | `boolean` | `true` | Show the clear button. |
| `allowClear` | `boolean \| null` | `null` | Alias of `cancel`; takes precedence when set. |
| `allowHalf` | `boolean` | `false` | Allow half-star values. |
| `readonly` | `boolean` | `false` | Read-only. |
| `disabled` | `boolean` | `false` | Disabled. |
| `pt` | [FieldPassThrough](/docs/types#FieldPassThrough) `{ root?, label?, control?, input? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `number` | Emitted when the rating changes. |

## Slots

| Slot | Description |
| --- | --- |
| `icon` | Custom star `{ active }`. |
