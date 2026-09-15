---
title: Timeline
category: 03 / DATA
description: Vertical or horizontal timeline with icon markers and custom slots.
---

# Timeline

Display event nodes in chronological order.

## Import

```ts
import { MTimeline } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Horizontal

```vue preview src="./demos/Horizontal.en.vue"
```

## Pending & item slot

`pending` (`true` or a string) appends a trailing item. `#item` replaces the whole event.

```vue preview src="./demos/PendingAndItemSlot.en.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `TimelineEvent[]` | — | Events. |
| `align` | `'left' \| 'right' \| 'alternate'` | `'left'` | Alignment for vertical layout. |
| `layout` | `'vertical' \| 'horizontal'` | `'vertical'` | Direction. |
| `pending` | `boolean \| string` | — | Append a trailing pending item; a string is used as the label. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


`TimelineEvent`: `status` / `content` / `date` / `icon` (`IconName` or text) / `color` / `severity`.

## Slots

| Slot | Description |
| --- | --- |
| `item` | Whole event, `{ item, index }`; falls back to opposite / marker / content. |
| `content` | Main content, `{ item, index }`. |
| `opposite` | Opposite-side content; shows `date` by default. |
| `marker` | Custom node marker. |
| `connector` | Custom connector line. |

## Events

No custom events.

## Types

<h4 id="TimelineEvent">TimelineEvent</h4>

See source `types.ts` for the full definition.

```ts
interface TimelineEvent {
  status?: string
  content?: string
  date?: string
  /** Built-in IconName, or raw text glyph fallback. */
  icon?: IconName | string
  color?: string
  severity?: TimelineSeverity
}
```
