---
title: Fluid
category: 07 / MISC
description: Layout wrapper that stretches children to full width.
---

# Fluid

Fluid layout container that applies `width: 100%` to child controls.

## Import

```ts
import { WdFluid } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdFluid, WdInput, WdButton } from '@well-insight/ui'
</script>

<template>
  <WdFluid>
    <div style="display:flex;flex-direction:column;gap:0.75rem">
      <WdInput placeholder="Fluid-width input" />
      <WdButton label="Submit" />
    </div>
  </WdFluid>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `string` | `'div'` | Root element tag. |
