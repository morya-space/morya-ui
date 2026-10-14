---
title: ColorPicker
category: 02 / FORM
description: Color picker with panel, alpha, and preset swatches.
---

# ColorPicker

Color picker with HSB panel, alpha slider, preset swatches, and multiple display formats.

## When to use

- When you need a full color picking experience, not just hex input.
- When you need alpha channel support.
- When you want to provide preset color palettes.

## Import

```ts
import { MColorPicker } from "morya-ui";
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Presets

```vue preview src="./demos/Presets.vue"
```

## Show text and clear

```vue preview src="./demos/ShowText.vue"
```

## Gradient

Enable `gradient` for linear/radial gradient editing with draggable color stops.

```vue preview src="./demos/Gradient.vue"
```

## Gradient Value Binding

```vue preview src="./demos/GradientValue.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string` | `'#1677ff'` | Current color value (hex) or CSS gradient string. |
| `gradient` | `boolean` | `false` | Enable gradient mode. |
| `disabled` | `boolean` | `false` | Disabled. |
| `disabledAlpha` | `boolean` | `false` | Disable alpha channel. |
| `clearable` | `boolean` | `false` | Show clear button. |
| `format` | `'hex' \| 'rgb' \| 'hsb'` | `'hex'` | Display format. |
| `presets` | `ColorPickerPreset[]` | — | Preset color palettes. |
| `showText` | `boolean` | `false` | Show color text in trigger. |
| `size` | `MSizeInput` | — | Size. |
| `placement` | `ColorPickerPlacement` | `'bottom-start'` | Popup placement. |
| `teleport` | `boolean` | `true` | Teleport to body. |
| `appendTo` | `MAppendTo` | `'body'` | Mount target. |
| `transition` | `MotionPresetId \| false` | — | Transition. |
| `pt` | `FieldPassThrough` | — | DOM pass-through. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `string` | Color changed. |
| `change` | `string` | Color changed. |
| `clear` | — | Clear clicked. |
| `show` | — | Panel opened. |
| `hide` | — | Panel closed. |

## ColorPickerPreset

| Prop | Type | Description |
| --- | --- | --- |
| `label` | `string` | Group label. |
| `colors` | `string[]` | Color array. |
| `defaultOpen` | `boolean` | Default expanded. |

## Slots

| Name | Description |
| --- | --- |
| — | No custom slots yet. |

## Methods

| Method | Description |
| --- | --- |
| `open` | Open the color picker panel. |
| `close` | Close the color picker panel. |
| `toggle` | Toggle the color picker panel visibility. |
