---
title: Terminal
category: 03 / DATA
description: Simple command-prompt UI.
---

# Terminal

Shows a welcome message and command history; submitting emits `command`.

## Import

```ts
import { MTerminal } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.en.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `welcomeMessage` | `string` | `'Welcome to Morya UI Terminal'` | Welcome message at the top. |
| `prompt` | `string` | `'>'` | Prompt. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `command` | `string` | Submitted command. |

## Methods

| Method | Description |
| --- | --- |
| `appendResponse(text)` | Append a response entry. |
| `focus()` | Focus the command input. |

## Slots

No slots.
