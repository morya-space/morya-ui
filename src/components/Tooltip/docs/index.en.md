---
title: Tooltip
category: 04 / OVERLAY
description: A short hint shown on hover or focus. Supports placement, disabled, and showDelay.
---

# Tooltip

Short hint for a trigger element, suited to icon buttons or truncated text.

## Import

```ts
import { WiButton, WiTooltip } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiButton, WiTooltip } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center">
    <WiTooltip content="Save changes" placement="top">
      <WiButton icon="check" icon-only aria-label="Save" />
    </WiTooltip>
    <WiTooltip content="Delete item" placement="bottom" :show-delay="200" :hide-delay="120" :max-width="160">
      <WiButton icon="trash" icon-only severity="danger" outlined aria-label="Delete" />
    </WiTooltip>
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `content` | `string` | — | Tooltip text. |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Position relative to the trigger. |
| `disabled` | `boolean` | `false` | Disable the tooltip. |
| `showDelay` | `number` | `0` | Delay before showing, in milliseconds. |
| `hideDelay` | `number` | `0` | Delay before hiding, in milliseconds. |
| `maxWidth` | `string \| number` | — | Max content width; a number is pixels. |
| `teleport` | `boolean` | `true` | Overlay Teleport; defaults to `body`. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target; `'self'` / `false` renders in place. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Trigger element. |
