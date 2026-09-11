---
title: Label
category: 01 / BASIC
description: Accessible form label.
---

# Label

Simple label with `htmlFor` / `for` and a default slot.

## Import

```ts
import { MLabel } from 'morya-ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { MInput, MLabel } from 'morya-ui'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:0.5rem">
    <MLabel html-for="demo-email">
      Email
    </MLabel>
    <MInput id="demo-email" placeholder="you@example.com" />
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `htmlFor` | `string` | — | Associated control id. |
| `for` | `string` | — | Alias for `htmlFor`. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Slots

| Slot | Description |
| --- | --- |
| `default` | Label text. |

## Events

No custom events.
