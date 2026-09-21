---
title: Menu
category: 04 / NAVIGATION
description: Vertical/horizontal navigation menu with nested items, controlled selection, accordion, and collapsed flyout submenus.
---

# Menu

Navigation menu rendered from a `model`. Typical uses: admin sidebar, top navigation.

- Nested `items` with controlled `selectedKey`
- Auto-expand ancestor path when selection changes; optional `accordion`
- `collapsed` icon rail with right-side flyout submenus (Popover)
- Non-popup menus default to `embedded` (borderless, full-width in `MLayoutSider`)

> One-level hover submenus: [TieredMenu](/components/TieredMenu). Top bar: [Menubar](/components/Menubar). Action lists: [Dropdown](/components/Dropdown).

## Import

```ts
import type {MenuItem} from 'morya-ui';
import {  MMenu } from 'morya-ui'
```

## Selection

Give leaf items stable `key` values; sync with routing via `v-model:selected-key`. Emits `select` on click.

```vue preview src="./demos/Selection.en.vue"
```

If `key` is omitted, `label` is used as fallback. Prefer explicit keys in production.

## Nested submenus

Click a group to expand/collapse. When a child is selected, the parent shows `child-active` styling.

```vue preview src="./demos/NestedSubmenus.en.vue"
```

## Accordion & expanded keys

`accordion` keeps at most one top-level group open. Use `defaultExpandedKeys` or `v-model:expanded-keys` for controlled expansion. Changing `selectedKey` auto-expands its ancestor path.

```vue preview src="./demos/AccordionAndExpandedKeys.en.vue"
```

## Collapsed & flyout

`collapsed` hides labels and keeps icons. Hover shows an `MTooltip` with the label; groups also open a right flyout (`.m-menu--flyout`) via `MPopover` teleported to `body`, so it is not clipped by the sider. Set `collapsed-width` to match the sider width for centered icons.

```vue preview src="./demos/CollapsedAndFlyout.en.vue"
```

## Embed in Layout sider

Recommended shell: **global Header + inner `has-sider` Layout**. Bind menu `collapsed` to `MLayoutSider`.

```vue preview src="./demos/EmbedInLayoutSider.en.vue"
```

## Horizontal mode

`mode="horizontal"` for top nav bars. Submenus open in a `MPopover` dropdown flyout (teleported, themed scrollbar) and close after selection. Popup mode root menus also use built-in `MScrollbar`.

```vue preview src="./demos/HorizontalMode.en.vue"
```

## Inverted (dark sider)

Use `inverted` with `MLayoutSider`'s `inverted` on dark backgrounds.

```vue preview src="./demos/InvertedDarkSider.en.vue"
```

## Popup mode

`popup` + `v-model` renders a floating menu, teleported to `body` by default and positioned against the **default-slot trigger** (falls back to the last pointer position when no slot). Closes on outside click or leaf selection.

```vue preview src="./demos/PopupMode.en.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `MenuItem[]` | — | Menu items; may nest `items`. |
| `popup` | `boolean` | `false` | Overlay mode; use with `v-model`. |
| `modelValue` | `boolean` | `false` | Popup visibility (`v-model`). |
| `placement` | `'bottom-start' \| 'bottom-end' \| 'top-start' \| 'top-end'` | `'bottom-start'` | Popup position relative to the trigger. |
| `selectedKey` | `string \| null` | `null` | Selected item key (`v-model:selected-key`). |
| `collapsed` | `boolean` | `false` | Icon-only; submenus in right flyout. |
| `collapsedWidth` | `number` | `80` | Collapsed width (px) for icon centering. |
| `indent` | `number` | `12` | Extra padding-left per level (px). |
| `rootIndent` | `number` | `16` | Root item padding-left (px). |
| `accordion` | `boolean` | `false` | Only one top-level submenu open at a time. |
| `defaultExpandedKeys` | `string[]` | `[]` | Initially expanded submenu keys. |
| `expandedKeys` | `string[]` | — | Controlled expanded keys (`v-model:expanded-keys`). |
| `defaultExpandAll` | `boolean` | `false` | Expand all submenus initially. |
| `mode` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout direction. |
| `inverted` | `boolean` | `false` | Inverted colors for dark sider. |
| `embedded` | `boolean` | `!popup` | Embed in layout (no border/min-width). |
| `teleport` | `boolean` | `true` | Teleport popup to `appendTo`. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Teleport target; falls back to ConfigProvider. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Popup visibility changed. |
| `update:selectedKey` | `string \| null` | Selected item changed. |
| `update:expandedKeys` | `string[]` | Expanded keys changed. |
| `select` | `MenuItem` | Leaf clicked (not disabled / separator). |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Popup trigger anchor (e.g. a button); menu positions against it. |

## MenuItem

| Field | Type | Description |
| --- | --- | --- |
| `key` | `string` | Unique id; falls back to `label`. |
| `label` | `string` | Display text. |
| `icon` | `string` | [Tabler icon name](/components/Icon) or character. |
| `command` | `() => void` | Click handler (also emits `select`). |
| `disabled` | `boolean` | Disabled state. |
| `separator` | `boolean` | Separator line (ignores other fields). |
| `items` | `MenuItem[]` | Child menu items. |

## Types

<h4 id="MenuItem">MenuItem</h4>

Each entry in `model`; supports nesting:

```ts
interface MenuItem {
  key?: string
  label?: string
  icon?: string
  to?: string | RouteLocationRaw   // RouterLink when vue-router is installed
  command?: () => void
  disabled?: boolean
  separator?: boolean
  items?: MenuItem[]
}
```

When `key` is omitted, `label` is used as the identifier. `separator: true` renders a divider. See also [API types](/docs/types).
