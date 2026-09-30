---
title: Empty
category: 05 / FEEDBACK
description: Empty states with illustration / icon, title, description, and actions.
---

# Empty

For list no-data, filtered no-results, and first-use prompts. Do not use error colors for normal empty states; use [Result](/components/Result) or Message for failures.

`MEmpty` is a standalone component (no longer a Result wrapper). Rich catalog illustrations load on demand when you pass `illustration`.

By default it shows a lightweight empty glyph and locale `emptyMessage`. Override with `illustration`, `icon`, `image`, or slots.

## Import

```ts
import { MEmpty } from "morya-ui";
```

## Basic

Without `description`, uses locale `emptyMessage`. Without `icon` / `image` / `illustration`, shows the lightweight default icon (catalog SVGs are not bundled into the Empty entry).

```vue preview src="./demos/Basic.vue"

```

## Actions

Put recovery actions in `#extra`. The default slot replaces the description text.

```vue preview src="./demos/WithActions.en.vue"

```

## No results

`icon="search"` or `illustration="no-result"` uses the search-empty illustration (loaded on demand).

```vue preview src="./demos/NoResult.en.vue"

```

## Built-in illustrations

Empty-oriented presets: `no-content` / `no-result` / `no-message` / `no-schedule` / `no-issue`. Each SVG loads only when that `illustration` is used.

```vue preview src="./demos/Illustrations.zh.vue"

```

## Compact

`simple` is a horizontal compact layout for narrow regions such as table groups or sidebars.

```vue preview src="./demos/Simple.en.vue"

```

## Props

| Prop              | Type                                                       | Default               | Description                                                                                          |
| ----------------- | ---------------------------------------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------- |
| `title`           | `string`                                                   | —                     | Optional title; pass `""` to hide.                                                                   |
| `description`     | `string`                                                   | locale `emptyMessage` | Description; default slot overrides.                                                                 |
| `showDescription` | `boolean`                                                  | `true`                | Whether to show the description.                                                                     |
| `showIcon`        | `boolean`                                                  | `true`                | Whether to show the illustration / icon.                                                             |
| `illustration`    | `EmptyIllustration`                                        | —                     | Built-in illustration; loaded on demand; overrides default glyph / `icon="search"` mapping.          |
| `icon`            | [IconName](/docs/types#IconName)                           | —                     | Optional icon; omitted + no image/slot → light default glyph; `search` maps to `no-result`.          |
| `image`           | `string`                                                   | —                     | Image URL; wins over `illustration` / `icon`.                                                        |
| `size`            | `'small' \| 'medium' \| 'large' \| 'sm' \| 'md' \| 'lg'`  | `'medium'`            | Size.                                                                                                |
| `simple`          | `boolean`                                                  | `false`               | Compact horizontal layout.                                                                           |
| `pt`              | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | —                     | DOM pass-through; see [attrs](/docs/attrs).                                                          |

## Slots

| Slot      | Description                |
| --------- | -------------------------- |
| `icon`    | Custom icon area.          |
| `image`   | Custom image area.         |
| `title`   | Custom title.              |
| `default` | Overrides description.     |
| `extra`   | Action area.               |

## Accessibility

- Root uses `role="status"`.
- Decorative icons / illustrations use `aria-hidden`; action buttons need visible labels.

## Events

No custom events.
