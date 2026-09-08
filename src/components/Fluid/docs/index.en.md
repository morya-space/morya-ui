---
title: Fluid
category: 01 / BASIC
description: Layout wrapper that stretches children to full width.
---

# Fluid

Fluid layout container that applies `width: 100%` to child controls.

## Import

```ts
import { RdFluid } from '@wise-kit/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { RdButton, RdFluid, RdInput } from '@wise-kit/ui'
</script>

<template>
  <RdFluid>
    <div style="display:flex;flex-direction:column;gap:0.75rem">
      <RdInput placeholder="Fluid-width input" />
      <RdButton label="Submit" />
    </div>
  </RdFluid>
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
