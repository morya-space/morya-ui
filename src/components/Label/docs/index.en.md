---
title: Label
category: 01 / BASIC
description: Accessible form label.
---

# Label

Simple label with `htmlFor` / `for` and a default slot.

## Import

```ts
import { WdLabel } from '@wex-design/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdInput, WdLabel } from '@wex-design/ui'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:0.5rem">
    <WdLabel html-for="demo-email">
      Email
    </WdLabel>
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

## Events

No custom events.
