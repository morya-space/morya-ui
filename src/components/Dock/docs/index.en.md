---
title: Dock
category: 04 / NAVIGATION
description: macOS-style icon dock.
---

# Dock

Shortcut entries shown as an icon list.

## When to use

- Use for a persistent icon launch strip (app entries / tools), not a single FAB.
- Distinguish by role from [SpeedDial](/components/SpeedDial) (floating action cluster) and [ScrollTop](/components/ScrollTop) (back to top).

## Import

```ts
import { MDock } from "morya-ui";
```

## Basic

```vue preview src="./demos/Basic.en.vue"
```

## Props

| Prop       | Type                                                       | Default    | Description                                       |
| ---------- | ---------------------------------------------------------- | ---------- | ------------------------------------------------- |
| `model`    | `DockItem[]`                                               | `[]`       | Icon items.                                       |
| `position` | `'bottom' \| 'top'`                                        | `'bottom'` | Visual position modifier.                         |
| `pt`       | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | —          | Pass-through; see [Styling & attrs](/docs/attrs). |

## Events

No custom events.

## Slots

| Slot      | Description |
| --------- | ----------- |
| `default` | Dock items. |

## Types

<h4 id="DockItem">DockItem</h4>

See source `types.ts` for the full definition.

```ts
interface DockItem extends Omit<MenuNodeBase, "label"> {
  label: string;
}
```

## vs ant-design

Maps to the **app launcher bar** role within antd `FloatButton` scenarios; not a single floating button. See [antd mapping](/docs/antd-mapping).
