---
title: TreeSelect
category: 02 / FORM
description: Tree select in a dropdown. Supports single/multiple, cascade checks, filter, clear, and path labels.
---

# TreeSelect

Show an expandable tree in a dropdown. `multiple` / `checkable` enable multi-select; `filterable`, `clearable`, and `showPath` are also available.

## Import

```ts
import { MTreeSelect } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.en.vue"
```

## Multiple / filter / path

```vue preview src="./demos/MultipleFilterPath.en.vue"
```

## Size

```vue preview src="./demos/Size.en.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `TreeSelectNode[]` | — | Tree nodes. |
| `modelValue` | `string \| string[] \| null` | `null` | Selected key(s); array when multiple. |
| `placeholder` | `string` | locale `selectPlaceholder` | Placeholder text. |
| `size` | [MSizeInput](/docs/types#MSizeInput) | — | `small` / `large`; can inherit from ConfigProvider. |
| `disabled` | `boolean` | `false` | Disabled. |
| `multiple` | `boolean` | `false` | Multiple selection. |
| `checkable` | `boolean` | `false` | Show checkboxes (cascade like Tree). |
| `checkStrictly` | `boolean` | `false` | Independent parent/child checks. |
| `checkStrategy` | `'all' \| 'parent' \| 'child'` | `'all'` | Which keys to bind when cascading. |
| `clearable` | `boolean` | `false` | Show a clear button. |
| `filterable` | `boolean` | `false` | Filter inside the panel. |
| `showPath` | `boolean` | `false` | Show ancestor labels. |
| `separator` | `string` | `' / '` | Path separator. |
| `maxTagCount` | `number` | — | Max visible tags when multiple. |
| `selectionMode` | `'single' \| 'multiple'` | `'single'` | Compatibility; prefer `multiple`. |
| `teleport` | `boolean` | `true` | Overlay Teleport; defaults to `body`. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target; `'self'` / `false` renders in place. |
| `pt` | [FieldPassThrough](/docs/types#FieldPassThrough) `{ root?, label?, control?, input? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `string \| string[] \| null` | Emitted when the selection changes. |
| `clear` | — | Emitted when cleared. |

## Slots

| Slot | Description |
| --- | --- |
| `value` | Trigger display. |
| `option` | Tree node `{ node }`. |

## Types

<h4 id="TreeSelectNode">TreeSelectNode</h4>

See source `types.ts` for the full definition.

```ts
interface TreeSelectNode {
  key: string
  label: string
  children?: TreeSelectNode[]
  disabled?: boolean
}
```
