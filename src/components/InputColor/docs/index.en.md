---
title: InputColor
category: 02 / FORM
description: Color picker with a palette and hexadecimal text input.
---

# InputColor

Edit hex colors with the native color picker and a text field.

## When to use

- Use when a form needs a hex color value.
- Prefer this when native picker + optional `swatches` is enough; not a full standalone color panel.

## Import

```ts
import { MInputColor } from "morya-ui";
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Swatches

`swatches` provides a row of preset colors.

```vue preview src="./demos/Swatches.vue"
```

## Props

| Prop         | Type                                                                                   | Default     | Description                                       |
| ------------ | -------------------------------------------------------------------------------------- | ----------- | ------------------------------------------------- |
| `modelValue` | `string`                                                                               | `'#000000'` | Hexadecimal color.                                |
| `swatches`   | `string[]`                                                                             | —           | Preset color chips.                               |
| `disabled`   | `boolean`                                                                              | `false`     | Disabled.                                         |
| `id`         | `string`                                                                               | —           | Color input id.                                   |
| `pt`         | [FieldPassThrough](/docs/types#FieldPassThrough) `{ root?, label?, control?, input? }` | —           | Pass-through; see [Styling & attrs](/docs/attrs). |

## Events

| Event               | Prop     | Description    |
| ------------------- | -------- | -------------- |
| `update:modelValue` | `string` | Color changed. |

## vs ant-design

Maps to antd `ColorPicker` by role, but morya is **native picker + hex text + optional swatches**, not the full antd panel. Keep the name `InputColor`. See [antd mapping](/docs/antd-mapping).

## Slots

| Slot      | Description           |
| --------- | --------------------- |
| `trigger` | Custom color trigger. |
