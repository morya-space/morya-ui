---
title: InputTags
category: 02 / FORM
description: Chip-style tag input; press Enter to add, removable.
---

# InputTags

Manage string tags as a chip list.

## Import

```ts
import { MInputTags } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Max & separator

`max` caps the number of tags. `separator` splits pasted or typed values (for example `,`).

```vue preview src="./demos/MaxAndSeparator.en.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string[]` | `[]` | Tag list. |
| `placeholder` | `string` | locale `addTag` | Placeholder when the list is empty. |
| `disabled` | `boolean` | `false` | Disabled. |
| `addOnBlur` | `boolean` | `false` | Also add on blur. |
| `max` | `number` | — | Maximum number of tags. |
| `separator` | `string \| string[]` | — | Extra separators, for example `,`. |
| `pt` | [FieldPassThrough](/docs/types#FieldPassThrough) `{ root?, label?, control?, input? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `string[]` | Tags changed. |

## Slots

| Slot | Description |
| --- | --- |
| `tag` | Tag `{ tag, index }`. |
