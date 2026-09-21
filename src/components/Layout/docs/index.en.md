---
title: Layout
category: 06 / LAYOUT
description: Page layout shell with Header / Sider / Content / Footer.
---

# Layout

Page-level layout shell. Set `has-sider` on the `MLayout` that hosts a sider. Give the root layout a fixed `height` (or `min-height`) so `MLayoutContent` can fill the remaining space.

## Import

```ts
import {
  MLayout,
  MLayoutContent,
  MLayoutFooter,
  MLayoutHeader,
  MLayoutSider,
} from 'morya-ui'
```

## Basic

Header / Content / Footer. Content fills the leftover height.

```vue preview src="./demos/Basic.en.vue"
```

## With Sider

Header + left sider + main. The sider hosts `MMenu`, bound to `v-model:collapsed`. The inner `has-sider` layout consumes all height below the header.

```vue preview src="./demos/WithSider.en.vue"
```

## Right Sider

```vue preview src="./demos/RightSider.en.vue"
```

## Full Shell

Admin-style shell: header + inverted sider (`MMenu` `inverted`) + content + footer.

```vue preview src="./demos/FullShell.en.vue"
```

## Embedded Content

`embedded` softens the content background so it separates from header / sider.

```vue preview src="./demos/EmbeddedContent.en.vue"
```

## Scrollable Content

When content overflows, set `overflow: auto` on `MLayoutContent` (or wrap with `MScrollbar`); header and sider stay fixed. Root `MLayout` still has built-in `MScrollbar`; `MLayoutContent` / `MLayoutSider` are single-element shells.

```vue preview src="./demos/ScrollableContent.en.vue"
```

## Absolute Shell

Root `position="absolute"` fills a relatively positioned parent with an explicit height.

```vue preview src="./demos/AbsoluteShell.en.vue"
```

## Layout Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `hasSider` | `boolean` | `false` | Horizontal layout for `MLayoutSider`. |
| `siderPlacement` | `'left' \| 'right'` | `'left'` | Sider side. |
| `embedded` | `boolean` | `false` | Soft background for nested content. |
| `position` | `'static' \| 'absolute'` | `'static'` | Positioning mode. |
| `contentClass` / `contentStyle` | — | — | Scroll container class / style. |

## LayoutSider Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `width` | `number \| string` | `272` | Expanded width (always set as `width`). |
| `collapsedWidth` | `number` | `48` | Collapsed `max-width`. |
| `collapsed` | `boolean` | — | Collapsed state (`v-model:collapsed`). |
| `defaultCollapsed` | `boolean` | `false` | Uncontrolled initial collapsed state. |
| `showTrigger` | `boolean \| 'bar' \| 'arrow-circle' \| 'arrow'` | `false` | Collapse trigger; `arrow` aliases `arrow-circle`. |
| `collapseMode` | `'width' \| 'transform'` | `'transform'` | `transform` clips content; `width` shrinks with sider. |
| `showCollapsedContent` | `boolean` | `true` | Keep sider content visible while collapsed. |
| `bordered` / `inverted` | `boolean` | `false` | Border / inverted colors. |
| `triggerClass` / `triggerStyle` | — | — | Expanded trigger styles. |
| `collapsedTriggerClass` / `collapsedTriggerStyle` | — | — | Collapsed trigger styles. |
| `padding` | `number \| string` | — | Optional padding; no default. |
| `radius` | `number \| string` | — | Border radius. |

## Events

| Event | Description |
| --- | --- |
| `scroll` | Fired when the `MLayout` scroll container scrolls. |
| `after-enter` | Fired when the sider expand transition ends. |
| `after-leave` | Fired when the sider collapse transition ends. |
| `collapse` | Fired when the sider starts collapsing. |
| `expand` | Fired when the sider starts expanding. |
| `update:collapsed` | Collapsed state v-model. |

## Expose

`MLayout` exposes `scrollTo(...)`.

## Components

| Component | Description |
| --- | --- |
| `MLayout` | Root layout. |
| `MLayoutHeader` | Header bar. |
| `MLayoutContent` | Main content (fills leftover space by default). |
| `MLayoutFooter` | Footer bar. |
| `MLayoutSider` | Side panel. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Layout regions. |
