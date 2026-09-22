---
title: SpeedDial
category: 04 / NAVIGATION
description: Floating shortcut action button group.
---

# SpeedDial

A main button that expands a set of directional shortcut actions.

## Import

```ts
import { MSpeedDial } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.en.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `SpeedDialItem[]` | `[]` | Action items. |
| `direction` | `'up' \| 'down' \| 'left' \| 'right'` | `'up'` | Expand direction. |
| `modelValue` | `boolean` | `false` | Whether it is expanded. |
| `disabled` | `boolean` | `false` | Disabled. |
| `ariaLabel` | `string` | locale `speedDial` | Accessible label for the main button. |
| `teleport` | `boolean` | `true` | Overlay Teleport; mounts to `body` by default. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target; `'self'` / `false` renders in place. |
| `transition` | `string \| false` | `'scale-fade'` | Enter/exit motion preset; `false` / `'none'` disables. See [Theme · Motion presets](/docs/guide/theme). |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Emitted when the expanded state changes. |

## Slots

| Slot | Description |
| --- | --- |
| `button` | Custom main button. |
| `item` | Action `{ item }`. |

## Types

<h4 id="SpeedDialItem">SpeedDialItem</h4>

See source `types.ts` for the full definition.

```ts
interface SpeedDialItem extends Omit<MenuNodeBase, 'label'> {
  label: string
}
```
