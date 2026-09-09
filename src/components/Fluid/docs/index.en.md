---
title: Fluid
category: 01 / BASIC
description: Layout wrapper that stretches children to full width.
---

# Fluid

Fluid layout container that applies `width: 100%` to child controls.

## Import

```ts
import { MFluid } from 'morya-ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { MButton, MFluid, MInput } from 'morya-ui'
</script>

<template>
  <MFluid>
    <div style="display:flex;flex-direction:column;gap:0.75rem">
      <MInput placeholder="Fluid-width input" />
      <MButton label="Submit" />
    </div>
  </MFluid>
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
