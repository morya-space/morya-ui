---
title: List
category: 03 / DATA
description: General list with data-driven rows, Meta pattern, pagination, and optional grid.
---

# List

Renders a homogeneous collection (notifications, articles, user rows). Unlike layout-oriented `MDataView`, List focuses on item + meta + actions.

## Import

```ts
import { MList, MListItem, MListItemMeta } from 'morya-ui'
```

## Basic

Primary data prop is `items`; `dataSource` / `data` are aliases. Use `#item="{ item, index }"` for each row.

```vue preview src="./demos/Basic.vue"
```

## Vertical layout

`itemLayout="vertical"` fits card-like rows with `#extra` media or side content.

```vue preview src="./demos/Vertical.vue"
```

## Props — List

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `unknown[]` | — | Data array (primary name) |
| `dataSource` | `unknown[]` | — | Alias of `items` |
| `data` | `unknown[]` | — | Alias of `items` |
| `bordered` | `boolean` | `false` | Outer border |
| `split` | `boolean` | `true` | Dividers between items |
| `loading` | `boolean` | `false` | `MLoading` overlay |
| `size` | `ListSize` | — | Density |
| `itemLayout` | `'horizontal' \| 'vertical'` | `'horizontal'` | Row layout |
| `header` / `footer` | `string` | — | Text; slots override |
| `pagination` | `ListPaginationConfig \| false` | `false` | Uses `MPagination` |
| `grid` | `ListGridType` | — | CSS grid columns |
| `rowKey` | `string \| (item, index) => string` | — | Stable keys |
| `pt` | `RootPassThrough` | — | Pass-through |

### ListPaginationConfig

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `page` | `number` | `1` | Current page |
| `pageSize` | `number` | `10` | Page size |
| `total` | `number` | `items.length` | Total count (may exceed local array; remote mode skips slicing) |
| `position` | `'top' \| 'bottom' \| 'both'` | `'bottom'` | Pagination placement |
| `align` | `'start' \| 'center' \| 'end'` | `'end'` | Pagination alignment |

### ListGridType

| Field | Description |
| --- | --- |
| `column` | Default column count |
| `gutter` | Gap (number as px, or CSS length) |
| `xs` / `sm` / `md` / `lg` / `xl` | Breakpoint columns |

## Props — ListItem

| Prop | Type | Description |
| --- | --- | --- |
| `actions` | `VNodeChild[]` | Right-side actions; prefer `#actions` |
| `extra` | `VNodeChild` | Extra region; prefer `#extra` |

## Props — ListItemMeta

| Prop | Type | Description |
| --- | --- | --- |
| `avatar` | `VNodeChild` | Avatar area |
| `title` | `VNodeChild` | Title |
| `description` | `VNodeChild` | Description |

## Slots

| Slot | Component | Description |
| --- | --- | --- |
| `default` | List | Manual `MListItem` children when no `items` |
| `item` | List | Scoped `{ item, index }` for data mode |
| `header` / `footer` / `loadMore` | List | Chrome and load-more |
| `default` / `actions` / `extra` | Item | Body / actions / extra |
| `avatar` / `title` / `description` | Meta | Meta sections |

Shows `MEmpty` when there is no data and not loading.
