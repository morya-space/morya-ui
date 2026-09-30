---
title: Mentions
category: 02 / FORM
description: Suggest and insert mention tokens when typing a prefix.
---

# Mentions

Multi-line field that opens a suggestion list after a **prefix** (default `@`). Choosing an item inserts plain text `prefix + value + split`. Good for comments and collaborative inputs.

## Import

```ts
import { MMentions } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Multiple prefixes

`prefix` may be a string or array; `split` defaults to a space and closes an active mention.

```vue preview src="./demos/Prefix.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | Text |
| `options` | `string[] \| { value, label? }[]` | `[]` | Suggestions |
| `prefix` | `string \| string[]` | `'@'` | Trigger character(s) |
| `split` | `string` | `' '` | Separator appended after selection |
| `rows` | `number` | `3` | Row count |
| `placeholder` | `string` | — | Placeholder |
| `disabled` / `readonly` | `boolean` | `false` | Disabled / read-only |
| `status` | `'error' \| 'warning'` | — | Validate status (like Input) |
| `invalid` / `errorMessage` / `helpText` | — | — | Field feedback |
| `size` / `variant` / `fluid` | — | — | Same ideas as Textarea |
| `emptyMessage` | `string` | locale empty | Copy when nothing matches |
| `clearable` | `boolean` | `false` | Show clear control |
| `allowClear` | `boolean` | — | Alias of `clearable`  |
| `loading` | `boolean` | `false` | Spinner in suggestion panel |
| `pt` | [FieldPassThrough](/docs/types#FieldPassThrough) | — | Field pass-through |

## Async suggestions

No built-in fetch: debounce in your handler, set `loading` while fetching, then replace `options`. The panel stays open while a mention is active.

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `string` | Text changed |
| `select` | `MentionsOption` | Suggestion picked |
| `focus` / `blur` / `change` | — | Native semantics |
