---
title: Fluid
category: 07 / MISC
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
import { WiFluid, WiInput, WiButton } from '@well-insight/ui'
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
