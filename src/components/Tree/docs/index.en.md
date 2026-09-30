---
title: Tree
category: 03 / DATA
description: Tree structure. Supports check with indeterminate state, filter, controlled expand, lazy load, and drag-and-drop.
---

# Tree

Hierarchical node tree with expand, check, filter, and drag-and-drop.

The default slot `{ node, data }` customizes node content. `checkStrategy` is `'all' | 'parent' | 'child'` (ignored when `checkStrictly`). Cascade still drives the UI; `v-model:checked-keys` is projected by strategy. Virtual scroll is out of scope.

## Import

```ts
import { MTree } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Checkbox

```vue preview src="./demos/Checkbox.en.vue"
```

## Check strategy

With `check-strategy="child"`, checking a parent binds leaf keys only.

```vue preview src="./demos/CheckStrategy.vue"
```

## Filter

```vue preview src="./demos/Filter.en.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `TreeNode[]` | — | Node tree. |
| `modelValue` / `selectionKeys` / `selectionMode` | — | — | Highlight selection. |
| `showCheckbox` / `checkedKeys` / `checkStrictly` / `checkStrategy` | — | `'all'` | `checkStrategy` defaults to `'all'`; `'parent'` / `'child'` only change which keys are bound. |
| `expandedKeys` / `defaultExpandAll` / `accordion` | — | — | Expand control. |
| `filter` / `filterNode` | — | — | Filter. |
| `lazy` / `load` | — | — | Lazy-load child nodes. |
| `draggable` | `boolean` | `false` | Drag and drop; the drop target is applied by the consumer via `node-drop`. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Slots / Events

| Slot | Description |
| --- | --- |
| `default` | `{ node, data }` custom node content. |

| Event | Description |
| --- | --- |
| `update:checkedKeys` / `update:expandedKeys` / `check` / `node-expand` / `node-collapse` / `node-drop` | Interaction callbacks. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `node-select` | `TreeNode` | Node selected. |
| `node-expand` | `TreeNode` | Node expanded. |
| `node-collapse` | `TreeNode` | Node collapsed. |

## Types

<h4 id="TreeNode">TreeNode</h4>

Each node in `value`:

```ts
interface TreeNode {
  key: string
  label: string
  children?: TreeNode[]
  icon?: string
  disabled?: boolean
  isLeaf?: boolean
}
```

Selection, check, and expand state use `selectionKeys`, `checkedKeys`, and `expandedKeys` (`Record<string, boolean>`). `checkStrategy` is `'all' | 'parent' | 'child'`. See also [API types](/docs/types).
