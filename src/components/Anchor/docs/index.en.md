---
title: Anchor
category: 03 / NAVIGATION
description: In-page anchor nav with scroll spy and smooth scroll.
---

# Anchor

**In-page navigation** for long docs and settings pages. Highlights the active section while scrolling; link clicks smooth-scroll to targets.


## When to use

- In-page anchor nav with scroll spy and smooth scroll
- Prefer composing documented `M*` APIs; see [Common Props](/docs/common-props).

## Import

```ts
import { MAnchor, MAnchorLink } from 'morya-ui'
```

## Basic

Prefer declarative `items`, or nest `MAnchorLink` children.

```vue preview src="./demos/Basic.vue"
```

## Props — Anchor

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `AnchorLinkItem[]` | — | Link tree |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout |
| `offsetTop` | `number` | `0` | Spy / scroll offset |
| `bounds` / `bound` | `number` | `5` | Highlight threshold |
| `targetOffset` | `number` | — | Click scroll offset; defaults to `offsetTop` |
| `affix` | `boolean` | `true` | Sticky nav |
| `getContainer` | `() => HTMLElement \| Window` | `window` | Scroll container |
| `getCurrentAnchor` | `(link) => string` | — | Customize active href |
| `replace` | `boolean` | `false` | `history.replaceState` on hash click |
| `pt` | `RootPassThrough` | — | Root pass-through |

## Props — AnchorLink

| Prop | Type | Description |
| --- | --- | --- |
| `href` | `string` | Target hash (e.g. `#section-1`) |
| `title` | `string` | Link label |
| `targetOffset` | `number` | Per-link scroll offset |

## Events

| Event | Description |
| --- | --- |
| `change` | Active link changed (raw href) |
| `click` | Link clicked `(event, { href, title })` |

