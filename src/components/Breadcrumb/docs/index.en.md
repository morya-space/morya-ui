---
title: Breadcrumb
category: 04 / NAVIGATION
description: Shows the current page position in a hierarchy.
---

# Breadcrumb

Breadcrumb navigation. Items with `to` / `href` render as links; otherwise as text.

## Import

```ts
import { MBreadcrumb } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Separator

`separator` customizes the delimiter; `#separator` can replace it.

```vue preview src="./demos/Separator.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `{ label: string; to?: string; href?: string; disabled?: boolean }[]` | — | Path items; `href` is an alias of `to`. |
| `home` | `{ label?: string; to?: string; href?: string }` | — | Home item; default label is `Home`. |
| `separator` | `string` | `'/'` | Separator text. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Slots

| Slot | Description |
| --- | --- |
| `separator` | Custom separator. |
| `item` | Custom item content. |

## Events

No custom events.
