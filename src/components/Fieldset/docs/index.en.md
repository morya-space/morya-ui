---
title: Fieldset
category: 02 / FORM
description: Grouped fields with a legend, optionally collapsible.
---

# Fieldset

Group a form or related content with a legend.

## Import

```ts
import { MFieldset } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.en.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `legend` | `string` | — | Legend text. |
| `toggleable` | `boolean` | `false` | Whether the fieldset can be collapsed. |
| `collapsed` | `boolean` | `false` | Whether it is collapsed. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:collapsed` | `boolean` | Collapsed state change. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Content. |
| `legend` | Custom legend. |
