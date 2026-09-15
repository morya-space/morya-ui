---
title: Card
category: 03 / DATA
description: Content container. Structure content with title / subtitle or header / footer slots.
---

# Card

Content container for grouping title, body, and actions. Footer is extended via slot only (no `footer` prop).

## Import

```ts
import { MButton, MCard } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Custom Header

```vue preview src="./demos/CustomHeader.vue"
```

## Cover & Hover

```vue preview src="./demos/CoverAndHover.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | Title. |
| `subtitle` | `string` | — | Subtitle. |
| `ariaLabel` | `string` | — | Accessible name; falls back to `title` by default. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Padding size. |
| `bordered` | `boolean` | `true` | Show a border. |
| `hoverable` | `boolean` | `false` | Elevate on hover. |
| `headingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `2` | Heading level for the title. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Root pass-through; key `root`. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Body. |
| `header` | Custom header (takes precedence over `title` / `subtitle`). |
| `footer` | Footer area (use the slot; there is no footer prop). |
| `cover` | Cover above the header. |

## Accessibility

- When `title` is set it becomes the container `aria-label`; use `#header` for complex headers with readable titles.
- Footer actions should use descriptive button labels.

## Events

No custom events.
