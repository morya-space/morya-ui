---
title: Label
category: 01 / BASIC
description: Accessible form label.
---

# Label

Simple label with `htmlFor` / `for` and a default slot.

## Import

```ts
import { RdLabel } from '@roost-design/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { RdInput, RdLabel } from '@roost-design/ui'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:0.5rem">
    <RdLabel html-for="demo-email">
      Email
    </RdLabel>
    <RdInput id="demo-email" placeholder="you@example.com" />
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

## Events

No custom events.
