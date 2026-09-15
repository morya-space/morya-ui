---
title: Tabs
category: 04 / NAVIGATION
description: Tab switcher with line/card types, closable/addable tabs, extra slot, and overflow scrolling.
---

# Tabs

Tabs switch content panels within the same view.

## Import

```ts
import { MTabs } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Card / closable / extra

```vue preview src="./demos/CardClosableExtra.en.vue"
```

When tabs overflow the container, scroll buttons appear at both ends.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string` | — | Currently active tab. |
| `tabs` | `TabItem[]` | — | Tab list; supports `disabled` / `closable`. |
| `type` | `'line' \| 'card'` | `'line'` | Appearance. |
| `closable` | `boolean` | `false` | Show close buttons; per-item `closable` wins. |
| `addable` | `boolean` | `false` | Show an add button. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `string` | Emitted when the active item changes. |
| `change` | `string` | Emitted after the switch completes. |
| `close` | `string` | Emitted when a close button is clicked. |
| `add` | — | Emitted when the add button is clicked. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Panel content; scoped slot `{ activeValue }`. |
| `extra` | Extra content on the right of the tab bar. |

## Types

<h4 id="TabItem">TabItem</h4>

See source `types.ts` for the full definition.

```ts
interface TabItem {
  label: string
  value: string
  disabled?: boolean
  /** When set, overrides the Tabs `closable` prop for this item. */
  closable?: boolean
}
```
