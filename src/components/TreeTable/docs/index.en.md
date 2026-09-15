---
title: TreeTable
category: 03 / DATA
description: Expandable tree table.
---

# TreeTable

Display tree data with children using column configuration.

## Import

```ts
import { MTreeTable } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.en.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `TreeTableNode[]` | — | Tree row data. |
| `columns` | `TreeTableColumn[]` | — | Column definitions. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `node-expand` | `TreeTableNode` | Emitted when a node expands. |
| `node-collapse` | `TreeTableNode` | Emitted when a node collapses. |

## Slots

| Slot | Description |
| --- | --- |
| `expansion` | Expanded row `{ row }`. |

## Types

<h4 id="TreeTableColumn">TreeTableColumn</h4>

See source `types.ts` for the full definition.

```ts
interface TreeTableColumn {
  field: string
  header: string
}
```

<h4 id="TreeTableNode">TreeTableNode</h4>

See source `types.ts` for the full definition.

```ts
interface TreeTableNode {
  key: string
  data: Record<string, unknown>
  children?: TreeTableNode[]
}
```
