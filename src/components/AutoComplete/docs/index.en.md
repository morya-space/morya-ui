---
title: AutoComplete
category: 02 / FORM
description: Shows suggestion lists while typing; filter locally or supply suggestions from the parent.
---

# AutoComplete

Input suggestions and completion; the `complete` event makes async loading from the parent easy.

## Import

```ts
import { MAutoComplete } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.en.vue"
```

## Size

```vue preview src="./demos/Size.vue"
```

## Options & loading

`suggestions` can be strings or `{ label, value }` objects. `loading` / `clearable` control the spinner and clear button.

```vue preview src="./demos/OptionsAndLoading.en.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | Input value. |
| `suggestions` | `(string \| { label: string; value: string })[]` | `[]` | Suggestion list. |
| `loading` | `boolean` | `false` | Loading state. |
| `clearable` | `boolean` | `false` | Show a clear button. |
| `dropdown` | `boolean` | `false` | Show dropdown button. |
| `placeholder` | `string` | — | Placeholder. |
| `size` | [MSizeInput](/docs/types#MSizeInput) | — | `small` / `large`; can inherit from ConfigProvider. |
| `disabled` | `boolean` | `false` | Disabled. |
| `teleport` | `boolean` | `true` | Overlay Teleport; defaults to `body`. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target; `'self'` / `false` renders in place. |
| `transition` | `string \| false` | `'scale-fade'` | Enter/exit motion preset; `false` / `'none'` disables. See [Motion](/docs/motion). |
| `virtual` | `boolean` | auto | `true` forces virtual scroll; `false` disables; default enables when suggestions ≥ 80. |
| `pt` | [FieldPassThrough](/docs/types#FieldPassThrough) `{ root?, label?, control?, input? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `string` | Value change. |
| `complete` | `query: string` | Request completion. |
| `clear` | — | Fired when the clear button is clicked. |

## Slots

| Slot | Description |
| --- | --- |
| `item` | Option row `{ option }`. |
| `empty` | No matches. |
