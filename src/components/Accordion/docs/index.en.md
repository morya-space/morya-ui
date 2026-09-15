---
title: Accordion
category: 03 / DATA
description: Collapsible panel group. Supports single or multiple open panels; configure headers and disabled state via tabs.
---

# Accordion

Collapsible panels for organizing grouped content in limited space.

## Import

```ts
import { MAccordion } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Multiple

```vue preview src="./demos/Multiple.vue"
```

## Extra

`#extra` renders to the right of the header; clicks do not toggle the panel.

```vue preview src="./demos/Extra.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| string[]` | — | Currently expanded tab key; an array when multiple is enabled. |
| `multiple` | `boolean` | `false` | Allow multiple panels to be expanded at once. |
| `tabs` | `{ value: string; header: string; disabled?: boolean }[]` | — | Panel list. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `string \| string[]` | Fired when the expanded item(s) change. |

## Slots

| Slot | Description |
| --- | --- |
| `[tab.value]` | Panel content; slot name matches `tabs[].value`. |
| `extra` | Header extra, `{ tab }`; clicks do not collapse. |
