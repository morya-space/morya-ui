---
title: Label
category: 02 / FORM
description: Accessible form label.
---

# Label

Simple label with `htmlFor` / `for` and a default slot.

## Import

```ts
import { WdLabel } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdLabel, WdInput } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:0.5rem">
    <WdLabel html-for="demo-email">Email</WdLabel>
    <WdInput id="demo-email" placeholder="you@example.com" />
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `htmlFor` | `string` | — | Associated control id. |
| `for` | `string` | — | Alias for `htmlFor`. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Label text. |
