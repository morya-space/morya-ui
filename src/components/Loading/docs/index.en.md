---
title: Loading
category: 05 / FEEDBACK
description: Loading indicator and mask, with multiple effects, a region overlay, the v-loading directive, and an imperative service.
---

# Loading

Region or fullscreen loading feedback. Render an indicator on its own, cover a block of content, or open a mask on any node with the directive or service.

Built-in graphics are a circular spinner, aurora ring, bouncing balls, wave bars, pulse rings, and stardust. The default is the circular spinner (`effect="circular"`). Set `componentDefaults.Loading.effect` to change the global default.

Fullscreen masks teleport to `body` so parent `overflow` / `transform` cannot clip them. Only one fullscreen instance stays open at a time.

## Import

```ts
import { loading, MLoading, useLoading, vLoading } from 'morya-ui'
```

`app.use(MoryaUI)` registers `v-loading`. For on-demand usage, import `vLoading` in `<script setup>` and the template can use the directive.

## Effects

```vue preview src="./demos/Effects.vue"
```

## Region

Wrap content with the component, or put `v-loading` on an element. Omit `text` to hide the caption; screen readers still get the locale `loading` string. Use `delay` to avoid a flash on short requests.

```vue preview src="./demos/Region.en.vue"
```

## Service

With no `target`, the mask covers the viewport. `close()` plays the leave transition before unmounting, and `setText()` changes the caption. `useLoading()` closes automatically when the caller unmounts.

```vue preview src="./demos/Service.en.vue"
```

```ts
const instance = loading.service({
  text: 'Submitting',
  effect: 'wave',
  lock: true,
})
instance.setText('Almost done')
instance.close()
```

Cover one node, or pass a custom indicator:

```ts
loading.service({
  target: '#panel',
  text: 'Loading',
})

loading.service({
  spinner: () => h('span', '…'),
  text: 'Custom',
})
```

```ts
const { open, close } = useLoading({ effect: 'wave' })
open({ text: 'Saving' })
close()
```

## Directive

| Form | Description |
| --- | --- |
| `v-loading` | A boolean, or an object with `text`, `effect`, `background`, `lock`, `delay`, `spinner`, and related fields. |
| `v-loading.fullscreen` | Fullscreen mask. |
| `v-loading.lock` | Lock page scrolling while open. |
| `v-loading.body` | Mount the mask on `body`, positioned over the element (tracks size changes). |
| `m-loading-text` | Caption. |
| `m-loading-effect` | `circular` / `aurora` / `bounce` / `wave` / `pulse` / `stardust`. |
| `m-loading-background` | Mask background. |
| `m-loading-custom-class` | Extra class on the mask. |
| `m-loading-delay` | Delay before showing (ms). |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `loading` | `boolean` | `true` | Mask visibility when wrapping content or using `fullscreen`. A bare indicator is always shown. |
| `effect` | `'circular' \| 'aurora' \| 'bounce' \| 'wave' \| 'pulse' \| 'stardust'` | `'circular'` | Graphic. Override the default with `componentDefaults.Loading.effect`. |
| `text` | `string` | — | Caption under the indicator. Hidden when omitted. |
| `ariaLabel` | `string` | locale `loading` | Accessible name when there is no caption. A caption is used as the name when present. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Indicator scale. |
| `background` | `string` | — | Mask background, any CSS color. |
| `customClass` | `string` | — | Extra class on the mask. |
| `fullscreen` | `boolean` | `false` | Cover the viewport (teleported to `body`). |
| `lock` | `boolean` | `false` | Prevent page scrolling while visible. |
| `delay` | `number` | `0` | Delay before showing (ms). |
| `transition` | `string \| false` | `'loading'` | Enter/exit motion preset; `false` / `'none'` disables. See [Motion](/docs/motion). |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |

## Events

No custom events.

## Slots

| Slot | Description |
| --- | --- |
| `default` | Content covered by the mask. |
| `indicator` | Replaces the indicator inside the mask. Used when there is a default slot or `fullscreen`. |

## Service

`loading.service(options)` returns `{ close, setText }`. `useLoading(defaults)` returns `{ open, close, setText }`.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `target` | `string \| HTMLElement` | — | Element or selector to cover. Omit for fullscreen. |
| `fullscreen` | `boolean` | `true` when `target` is omitted | Cover the viewport. |
| `body` | `boolean` | `false` | Mount the mask on `body`, positioned over `target`. |
| `lock` | `boolean` | `false` | Lock page scrolling. |
| `text` | `string` | — | Caption. |
| `effect` | same as the component | `'circular'` | Graphic. |
| `spinner` | `MRenderable` | — | Custom indicator; skips built-in effects when set. |
| `background` | `string` | — | Mask background. |
| `customClass` | `string` | — | Extra mask class. |
| `size` | same as the component | — | Indicator size. |
| `delay` | `number` | — | Delay before showing (ms). |

## Theme

Indicator colors use semantic tokens: `--m-color-primary`, `--m-color-success`, `--m-color-warning`, `--m-color-danger`, and `--m-color-text-muted`. The mask defaults to a translucent surface mix. Override it with `background` or `--m-loading-mask-bg`. Fullscreen stacking uses `--m-loading-z-index` (default `--m-z-base + 200`).

Looping motion stops when theme motion is `reduced` or `none`.

## Accessibility

- The indicator uses `role="status"`.
- The masked region sets `aria-busy`, and covered content is `inert`.
- Do not rely on motion alone; pass `text` when the wait needs an explanation.
