---
title: SplitButton
category: 01 / BASIC
description: A primary action button with extra dropdown items.
---

# SplitButton

The left primary button emits `click`; items in the right-side menu emit `command`.

## Import

```ts
import { MSplitButton } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.en.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Primary button label. |
| `icon` | `string` | — | Optional icon character. |
| `model` | `{ label, command?, disabled? }[]` | `[]` | Menu items. |
| `severity` / `outlined` / `size` | — | — | Visual variants. |
| `disabled` | `boolean` | `false` | Disabled. |
| `teleport` | `boolean` | `true` | Whether to Teleport the menu. |
| `appendTo` | `string \| HTMLElement \| 'self'` | `'body'` | Mount target; `'self'` keeps it in place. |
| `transition` | `string \| false` | `'scale-fade'` | Enter/exit motion preset; `false` / `'none'` disables. See [Motion](/docs/motion). |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `click` | `MouseEvent` | Primary button click. |
| `command` | `item` | Menu item activated. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Main button content. |
