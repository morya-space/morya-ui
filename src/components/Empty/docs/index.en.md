---
title: Empty
category: 05 / FEEDBACK
description: Empty state with icon/image, title, description, and actions.
---

# Empty

For no-data lists, filtered results, and first-use screens. Do not style normal emptiness as an error; use [Result](/components/Result) or Message for failures.

## Import

```ts
import { MEmpty } from 'morya-ui'
```

## Basic

When `title` is omitted, locale `emptyMessage` is used.

```vue preview src="./demos/Basic.vue"
```

## Actions

Put recovery actions in `#extra` (or the default slot).

```vue preview src="./demos/WithActions.en.vue"
```

## No results

```vue preview src="./demos/NoResult.en.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | locale `emptyMessage` | Title. |
| `description` | `string` | — | Supporting copy. |
| `icon` | [IconName](/docs/types#IconName) | `'database'` | Visual mark; ignored when `image` is set. |
| `image` | `string` | — | Image URL; takes precedence over `icon`. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |

## Slots

| Slot | Description |
| --- | --- |
| `icon` | Custom icon area. |
| `image` | Custom image area. |
| `title` | Custom title. |
| `description` | Custom description. |
| `extra` | Action area. |
| `default` | Same as `extra`, appended in the action area. |

## Accessibility

- Root uses `role="status"`.
- Decorative icon/image is `aria-hidden`; action buttons need visible labels.

## Events

No custom events.
