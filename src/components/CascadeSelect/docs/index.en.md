---
title: CascadeSelect
category: 02 / FORM
description: Multi-level cascade select with nested options and column panels.
---

# CascadeSelect

Select a value step by step from nested options.

## Import

```ts
import { MCascadeSelect } from 'morya-ui'
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
| `modelValue` | `string \| number \| null` | `null` | Selected value. |
| `options` | `CascadeSelectOption[]` | — | Nested options. |
| `label` | `string` | — | Field label. |
| `helpText` | `string` | — | Help text. |
| `invalid` | `boolean` | `false` | Invalid state. |
| `errorMessage` | `string` | — | Error text; implies invalid when set. |
| `id` | `string` | — | Control id. |
| `placeholder` | `string` | locale `selectPlaceholder` | Placeholder text. |
| `disabled` | `boolean` | `false` | Disabled. |
| `required` | `boolean` | `false` | Form required hint. |
| `size` | [MSizeInput](/docs/types#MSizeInput) | — | `small` / `large`; can inherit from ConfigProvider. |
| `fluid` | `boolean` | `false` | Full width. |
| `clearable` | `boolean` | `false` | Show clear button when a value is selected (hover suffix slot). |
| `teleport` | `boolean` | `true` | Overlay Teleport; defaults to `body`. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target; `'self'` / `false` renders in place. |
| `pt` | [FieldPassThrough](/docs/types#FieldPassThrough) `{ root?, label?, control?, input? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `CascadeSelectValue` | Selection change. |
| `clear` | — | Fired when the clear button is clicked. |

## Slots

| Slot | Description |
| --- | --- |
| `value` | Trigger display. |
| `option` | Option `{ option }`. |

## Types

<h4 id="CascadeSelectValue">CascadeSelectValue</h4>

See source `types.ts` for the full definition.

```ts
type CascadeSelectValue = string | number | null
```


<h4 id="CascadeSelectOption">CascadeSelectOption</h4>

See source `types.ts` for the full definition.

```ts
interface CascadeSelectOption {
  label: string
  value: string | number
  children?: CascadeSelectOption[]
  disabled?: boolean
}
```
