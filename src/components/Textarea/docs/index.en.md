---
title: Textarea
category: 02 / FORM
description: Multi-line text input.
---

# Textarea

Multi-line text input.

## Import

```ts
import { MTextarea } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Size & Variant

```vue preview src="./demos/SizeAndVariant.vue"
```

## AutoResize & Invalid

`autosize` grows with content. Pass `{ minRows, maxRows }` to clamp. `invalid` marks a validation failure.

```vue preview src="./demos/AutoresizeAndInvalid.vue"
```

## Clearable & count

```vue preview src="./demos/ClearableAndCount.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | Bound value. |
| `label` | `string` | — | Label text. |
| `helpText` | `string` | — | Helper text. |
| `invalid` | `boolean` | `false` | Invalid (validation failed) state. |
| `id` | `string` | — | Native id. |
| `rows` | `number` | `4` | Visible rows. |
| `resize` | `'none' \| 'vertical' \| 'horizontal' \| 'both'` | `'vertical'` | CSS resize; forced to `none` when autosize is on. |
| `autosize` | `boolean \| { minRows?: number; maxRows?: number }` | `false` | Auto-grow with content; optional row clamp. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size. |
| `variant` | `'outlined' \| 'filled'` | `'outlined'` | Visual variant. |
| `fluid` | `boolean` | `false` | Full width. |
| `disabled` | `boolean` | `false` | Disabled. |
| `readonly` | `boolean` | `false` | Read-only. |
| `clearable` | `boolean` | `false` | Show a clear button. |
| `maxlength` | `number` | — | Native maxlength. |
| `showCount` | `boolean` | `false` | Show character count. |
| `errorMessage` | `string` | — | Error copy. |
| `placeholder` | `string` | — | Placeholder. |
| `name` | `string` | — | Native name. |
| `autocomplete` | `string` | — | Native autocomplete. |
| `autofocus` | `boolean` | `false` | Focus on mount. |
| `pt` | [FieldPassThrough](/docs/types#FieldPassThrough) `{ root?, label?, control?, input? }` | — | Pass-through per DOM part (`root`, `input`, `label`, …). |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `string` | Emitted when the value changes. |
| `clear` | — | Emitted when the value is cleared. |

## Methods

| Method | Description |
| --- | --- |
| `focus()` | Focus the underlying textarea. |
| `blur()` | Blur the underlying textarea. |
| `select()` | Select all text in the textarea. |

## Slots

No slots.
