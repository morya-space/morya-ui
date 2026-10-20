---
title: Segmented
category: 02 / FORM
description: Single-choice segmented control.
---

# Segmented

Switch between mutually exclusive modes or views. Unlike [SelectButton](/components/SelectButton), Segmented uses a track + raised thumb look and **single-select** `radiogroup` semantics (not `aria-pressed` toggles).

## Import

```ts
import { MSegmented } from 'morya-ui'
```

## Basic

`options` may be `string[]` or `{ label, value, icon?, disabled? }[]`.

```vue preview src="./demos/Basic.vue"
```

## Block and round shape

`block` stretches items evenly; `shape="round"` uses a pill track.

```vue preview src="./demos/BlockAndShape.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number` | — | Selected value |
| `options` | `string[] \| SegmentedOption[]` | — | Options |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size |
| `block` | `boolean` | `false` | Full width, equal segments |
| `disabled` | `boolean` | `false` | Disable the group |
| `shape` | `'default' \| 'round'` | `'default'` | Corner style |
| `label` | `string` | — | Accessible `radiogroup` label |
| `name` | `string` | auto | Native radio group `name` |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) | — | Root pass-through |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | same as `modelValue` | Selection changed |

## Style customization

When customizing Segmented, override its CSS variables on the component root instead of depending on internal DOM structure or deep selectors. The thumb automatically follows the selected item's position and size.

```vue
<MSegmented
  v-model="value"
  :options="options"
  style="
    --m-segmented-track-background: var(--m-color-primary-subtle);
    --m-segmented-thumb-background: var(--m-color-primary);
    --m-segmented-active-text-color: var(--m-color-text-on-primary);
    --m-segmented-radius: var(--m-radius-pill);
  "
/>
```

| Variable | Default | Purpose |
| --- | --- | --- |
| `--m-segmented-track-padding` | `var(--m-space-1)` | Track inset and space between the track and thumb. |
| `--m-segmented-track-background` | Muted-text / surface color mix | Background of the full track. |
| `--m-segmented-thumb-background` | `var(--m-color-surface)` | Background of the selected thumb. |
| `--m-segmented-thumb-shadow` | `var(--m-shadow-sm)` | Shadow of the selected thumb. |
| `--m-segmented-text-color` | `var(--m-color-text-muted)` | Text and icon color of unselected items. |
| `--m-segmented-active-text-color` | `var(--m-color-text)` | Text and icon color of selected and hovered items. |
| `--m-segmented-disabled-text-color` | `var(--m-color-text-disabled)` | Text and icon color of disabled items. |
| `--m-segmented-radius` | `var(--m-radius-control)` | Track corner radius. `shape="round"` overrides it with a pill radius. |
| `--m-segmented-thumb-radius` | Derived from the track radius and inset | Corner radius of the thumb and item content; override for independent control. |
| `--m-segmented-motion-duration` | `var(--m-motion-fast)` | Duration for thumb movement and text color changes. |
| `--m-segmented-motion-easing` | `var(--m-motion-ease)` | Easing for thumb movement and text color changes. |

## vs SelectButton

| | Segmented | SelectButton |
| --- | --- | --- |
| Look | Track + raised segment | Bordered button group |
| Multi | No | `multiple` |
| ARIA | `radiogroup` + `radio` | `group` + `aria-pressed` |
