---
title: Label
category: 01 / BASIC
description: Accessible form label.
---

# Label

Simple label with `htmlFor` / `for` and a default slot.

## Import

```ts
import { WiLabel } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiInput, WiLabel } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:0.5rem">
    <WiLabel html-for="demo-email">
      Email
    </WiLabel>
    <WiInput id="demo-email" placeholder="you@example.com" />
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
