---
title: Tour
category: 07 / OTHER
description: Step-by-step guided overlay with spotlight and panel.
---

# Tour

**Product tours and onboarding**. Spotlight mask plus floating panel with prev / next / finish / close.

## Import

```ts
import { MTour } from 'morya-ui'
```

## Basic

Use `v-model:open` and `v-model:current`. Each step’s `target` returns the element to highlight.

```vue preview src="./demos/Basic.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `steps` | `TourStep[]` | `[]` | Step definitions |
| `open` | `boolean` | — | Visibility (`v-model:open`) |
| `current` | `number` | `0` | Active index (`v-model:current`) |
| `placement` | overlay placement | `'bottom'` | Default panel placement |
| `mask` | `boolean` | `true` | Dimming + spotlight |
| `gap` | `number` | `4` | Spotlight padding around target (px) |
| `type` | `'default' \| 'primary'` | `'default'` | Panel theme |
| `zIndex` | `number` | global `zIndex` | Stacking |
| `teleport` | `boolean` | `true` | Teleport to `appendTo` |
| `pt` | `RootPassThrough` | — | Root pass-through |

### TourStep

| Field | Type | Description |
| --- | --- | --- |
| `title` / `description` | `string` | Copy |
| `target` | `() => HTMLElement \| null` | Highlight target |
| `cover` | `string` | Optional cover text |
| `placement` | placement | Overrides root |
| `type` | `'default' \| 'primary'` | Overrides root |
| `nextButtonProps` / `prevButtonProps` | button config | Label and `onClick` |

## Events

| Event | Description |
| --- | --- |
| `update:open` | Visibility |
| `update:current` | Step index |
| `change` | Same as `update:current` |
| `close` | Closed |
| `finish` | Finished on last step |

## Keyboard

While open: `Esc` closes; `ArrowRight` next; `ArrowLeft` previous (when not on the first step).
