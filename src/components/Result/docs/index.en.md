---
title: Result
category: 05 / FEEDBACK
description: Outcome / terminal pages for success, failure, 403, 404, and more.
---

# Result

For submit outcomes, failures, forbidden access, and missing pages. Use [Empty](/components/Empty) for no-data states.

## Import

```ts
import { MResult } from 'morya-ui'
```

## Basic

`status` drives the default icon, tone, and locale title.

```vue preview src="./demos/Basic.en.vue"
```

## Actions

```vue preview src="./demos/Actions.en.vue"
```

## HTTP-style statuses

```vue preview src="./demos/Http.en.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `status` | `'success' \| 'info' \| 'warning' \| 'warn' \| 'error' \| 'danger' \| '403' \| '404' \| '500'` | `'info'` | Outcome status. `warn` → warning; `danger` → error. |
| `title` | `string` | locale for `status` | Title. |
| `description` | `string` | — | Supporting copy. |
| `icon` | [IconName](/docs/types#IconName) | from `status` | Override default icon. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |

## Slots

| Slot | Description |
| --- | --- |
| `icon` | Custom icon area. |
| `title` | Custom title. |
| `description` | Custom description. |
| `extra` | Action area. |
| `default` | Same as `extra`, appended in the action area. |

## Accessibility

- Root uses `role="status"`.
- Do not rely on color alone; keep a title.

## Events

No custom events.
