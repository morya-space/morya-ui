---
title: Result
category: 05 / FEEDBACK
description: Outcome / terminal pages for success, failure, 403, 404, and more.
---

# Result

For submit outcomes, failures, forbidden access, and missing pages. Use [Empty](/components/Empty) for no-data states.

Core API: `status` + `size` + `title` / `description`, slots `icon` / `default` / `footer`.

## Import

```ts
import { MResult } from "morya-ui";
```

## Basic

`status` drives the default icon, tone, and locale title.

```vue preview src="./demos/Basic.en.vue"

```

## Actions

Put buttons in `#footer`. Use `#default` for extra content under the description.

```vue preview src="./demos/Actions.en.vue"

```

## HTTP statuses

`403` / `404` / `500` / `418` show a built-in illustration by default. Pass `icon` or `#icon` to switch back to icon mode.

```vue preview src="./demos/Http.en.vue"

```

## Size

`size`: `small` / `medium` / `large` / `huge`.

```vue preview src="./demos/Compact.en.vue"

```

## Props

| Prop          | Type                                                                              | Default                 | Description                                                           |
| ------------- | --------------------------------------------------------------------------------- | ----------------------- | --------------------------------------------------------------------- |
| `status`      | `'info' \| 'success' \| 'warning' \| 'error' \| '403' \| '404' \| '500' \| '418'` | `'info'`                | Outcome status. HTTP statuses use a built-in illustration by default. |
| `title`       | `string`                                                                          | locale for `status`     | Title.                                                                |
| `description` | `string`                                                                          | —                       | Supporting text.                                                      |
| `icon`        | [IconName](/docs/types#IconName)                                                  | by `status`             | Overrides the default icon; forces icon mode for HTTP statuses.       |
| `size`        | `'small' \| 'medium' \| 'large' \| 'huge' \| 'sm' \| 'md' \| 'lg'`                | `'medium'`              | Size.                                                                 |
| `pt`          | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }`                        | —                       | DOM pass-through; see [attrs](/docs/attrs).                           |

## Slots

| Slot          | Description                          |
| ------------- | ------------------------------------ |
| `icon`        | Custom icon area.                    |
| `title`       | Custom title.                        |
| `description` | Custom description.                  |
| `default`     | Extra content below title/description. |
| `footer`      | Action area.                         |

## Accessibility

- Root uses `role="status"`.
- Do not rely on color alone; keep a visible title.

## Events

No custom events.

## Breaking changes

- Removed `presentation` / `illustration` / `image` / `simple`, and `warn` / `danger` aliases.
- `#extra` renamed to `#footer`.
- HTTP defaults to built-in SVG illustrations (no giant numeric code).
- Illustration catalog moved to [Empty](/components/Empty).
