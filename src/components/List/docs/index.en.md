---

title: List

category: 03 / DATA

description: General list with data-driven rows, Meta pattern, pagination, and optional grid.

---



# List



Renders a homogeneous collection (notifications, articles, user rows). Unlike layout-oriented `MDataView`, List focuses on item + meta + actions.




## When to use

- General list with data-driven rows, Meta pattern, pagination, and optional grid
- Prefer composing documented `M*` APIs; see [Common Props](/docs/common-props).

## Import



```ts

import { MList, MListItem, MListItemMeta } from 'morya-ui'

```



## Basic



Primary data prop is `items`; `dataSource` / `data` are aliases of `items`. Use `#item="{ item, index }"` for each row.



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



See the Chinese doc for `ListPaginationConfig` / `ListGridType` field tables (same shapes).



## Props — ListItem / ListItemMeta



| Component | Props | Slots |

| --- | --- | --- |

| Item | `actions`, `extra` | `default`, `actions`, `extra` |

| Meta | `avatar`, `title`, `description` | `avatar`, `title`, `description`, `default` |



## Slots — List



| Slot | Description |

| --- | --- |

| `default` | Manual `MListItem` children when no `items` |

| `item` | Scoped `{ item, index }` for data mode |

| `header` / `footer` / `loadMore` | Chrome and load-more |



Shows `MEmpty` when there is no data and not loading.



