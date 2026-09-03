---
title: Fluid
category: 01 / BASIC
description: Layout wrapper that stretches children to full width.
---

# Fluid

Fluid layout container that applies `width: 100%` to child controls.

## Import

```ts
import { WiFluid } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiButton, WiFluid, WiInput } from '@well-insight/ui'
</script>

<template>
  <WiFluid>
    <div style="display:flex;flex-direction:column;gap:0.75rem">
      <WiInput placeholder="Fluid-width input" />
      <WiButton label="Submit" />
    </div>
  </WiFluid>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `string` | `'div'` | Root element tag. |

## Events

No custom events.

## Slots

| Slot | Description |
| --- | --- |
| `default` | Full-width child content. |
