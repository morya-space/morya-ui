---
title: Tooltip
category: 05 / FEEDBACK
description: A short hint shown on hover or focus. Supports placement, disabled, and showDelay.
---

# Tooltip

Short hint for a trigger element, suited to icon buttons or truncated text.

## Import

```ts
import { WdButton, WdTooltip } from '@wex-design/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdButton, WdTooltip } from '@wex-design/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center">
    <WdTooltip content="Save changes" placement="top">
      <WdButton icon="check" icon-only aria-label="Save" />
    </WdTooltip>
    <WdTooltip content="Delete item" placement="bottom" :show-delay="200" :hide-delay="120" :max-width="160">
      <WdButton icon="trash" icon-only severity="danger" outlined aria-label="Delete" />
    </WdTooltip>
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

## Accessibility

- Tooltip content is exposed with `role="tooltip"` on hover/focus.
- Triggers must be focusable; icon-only controls need `aria-label`.
- Do not hide critical information in tooltips only—provide visible text or labels.

## Events

No custom events.
