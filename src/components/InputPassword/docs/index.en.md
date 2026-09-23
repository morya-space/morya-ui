---
title: InputPassword
category: 02 / FORM
description: Password input with show/hide toggle and optional strength feedback.
---

# InputPassword

Password input. Includes a show/hide toggle by default; optional password strength feedback.

## Import

```ts
import { MInputPassword } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Feedback

```vue preview src="./demos/Feedback.vue"
```

## Custom icons

Defaults are `eye` / `eye-off`. Swap them with other system icons via props, or replace them entirely with slots.

```vue preview src="./demos/CustomIcons.en.vue"
```

## Hold to peek

`showPasswordOn="mousedown"` reveals while pressed and hides on release (Space / Enter do the same).

```vue preview src="./demos/HoldToPeek.vue"
```

## Clearable & count

```vue preview src="./demos/ClearableAndCount.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | Bound value. |
| `label` | `string` | — | Label text. |
| `feedback` | `boolean` | `false` | Show strength feedback. |
| `toggleMask` | `boolean` | `true` | Show toggle for revealing the password. |
| `showPasswordOn` | `'click' \| 'mousedown'` | `'click'` | How to reveal; `mousedown` is hold-to-peek. |
| `showIcon` | `IconName \| Component` | `'eye'` | Icon while masked (click to reveal). |
| `hideIcon` | `IconName \| Component` | `'eye-off'` | Icon while visible (click to hide). |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size. |
| `variant` | `'outlined' \| 'filled'` | `'outlined'` | Visual variant. |
| `fluid` | `boolean` | `false` | Full width. |
| `invalid` | `boolean` | `false` | Validation failed state. |
| `disabled` | `boolean` | `false` | Disabled. |
| `readonly` | `boolean` | `false` | Read-only. |
| `clearable` | `boolean` | `false` | Show a clear button. |
| `maxlength` | `number` | — | Native maxlength. |
| `showCount` | `boolean` | `false` | Show character count. |
| `pt` | [FieldPassThrough](/docs/types#FieldPassThrough) `{ root?, label?, control?, input? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `string` | Value changed. |
| `clear` | — | Emitted when the value is cleared. |

## Methods

| Method | Description |
| --- | --- |
| `focus()` | Focus the underlying input. |
| `blur()` | Blur the underlying input. |
| `select()` | Select all text in the input. |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `showIcon` | `{ unmasked }` | Replace the show-password icon. |
| `hideIcon` | `{ unmasked }` | Replace the hide-password icon. |
