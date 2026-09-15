---
title: Scrollbar
category: 01 / BASIC
description: Themeable custom scrollbar for a consistent scrolling experience.
---

# Scrollbar

Replaces the native browser scrollbar with a themeable, cross-browser scrolling experience.

## Import

```ts
import { MScrollbar } from 'morya-ui'
```

## Basic

Use `height` to fix the viewport height. If omitted, it follows the parent height.

```vue preview src="./demos/Basic.vue"
```

## Max height

The scrollbar appears only when content exceeds `max-height`.

```vue preview src="./demos/MaxHeight.vue"
```

## Horizontal

A horizontal scrollbar appears when content is wider than the container. `trigger="none"` and `always` keep the thumb visible; the default `trigger="hover"` shows it on hover.

`MLayout`, `MLayoutContent`, `MLayoutSider`, `MDialog`, `MConfirmDialog`, `MDrawer`, `MSplitter`, `MTable`, `MSelect`, `MTreeSelect`, `MDropdown`, `MContextMenu`, `MPopover`, `MConfirmPopup`, `MMenu` (popup), `MMenubar`, `MTieredMenu`, `MTabs`, `MGallery`, `MTimeline` (horizontal), `MTextarea` (autosize `maxRows`), `MTerminal`, `MOrderList`, `MPickList`, `MTreeTable`, and `MVirtualScroller` integrate this component internally.

```vue preview src="./demos/Horizontal.vue"
```

## Always / Native

`always` keeps the custom thumb visible. `native` uses the browser scrollbar.

```vue preview src="./demos/AlwaysNative.vue"
```

## Manual scroll

Control scrolling with instance methods `setScrollTop` / `setScrollLeft` / `scrollTo` / `update`.

```vue preview src="./demos/ManualScroll.en.vue"
```

## Infinite scroll

Emits `end-reached` at the edge. Use it for infinite loading.

```vue preview src="./demos/InfiniteScroll.en.vue"
```

## API

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| height | `string \| number` | — | Viewport height |
| maxHeight | `string \| number` | — | Maximum height |
| fitContent | `boolean` | `false` | Grow with content; pair with CSS `max-height` on the root (dropdown panels) |
| native | `boolean` | `false` | Use the native scrollbar |
| wrapStyle / wrapClass | style / class | — | Wrap container styles |
| viewStyle / viewClass | style / class | — | Content area styles |
| noresize | `boolean` | `false` | Do not listen for size changes |
| tag | `string` | `div` | Content area tag |
| always | `boolean` | `false` | Always show the thumb |
| trigger | `'hover' \| 'none'` | `'hover'` | `none` keeps thumbs visible; `always` still wins |
| minSize | `number` | `20` | Minimum thumb size |
| id / role / ariaLabel / ariaOrientation | a11y | — | Accessible attributes for the content area |
| tabindex | `number \| string` | — | tabindex on the wrap |
| distance | `number` | `0` | Edge distance that triggers `end-reached` |

### Events

| Name | Payload |
| --- | --- |
| scroll | `{ scrollTop, scrollLeft }` |
| end-reached | `'top' \| 'bottom' \| 'left' \| 'right'` |

### Expose

`wrapRef`, `update`, `scrollTo`, `setScrollTop`, `setScrollLeft`, `handleScroll`

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `scroll` | `{ scrollTop, scrollLeft }` | Scroll position change. |
| `end-reached` | `'top' \| 'bottom' \| 'left' \| 'right'` | Scroll boundary reached. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Scrollable content. |
