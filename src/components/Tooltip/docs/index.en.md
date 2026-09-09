---
title: Tooltip
category: 05 / FEEDBACK
description: A short hint shown on hover or focus. Supports placement, disabled, and showDelay.
---

# Tooltip

Short hint for a trigger element, suited to icon buttons or truncated text.

## Import

```ts
import { MButton, MTooltip } from 'morya-ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { MButton, MTooltip } from 'morya-ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center">
    <MTooltip content="Save changes" placement="top">
      <MButton icon="check" icon-only aria-label="Save" />
    </MTooltip>
    <MTooltip content="Delete item" placement="bottom" :show-delay="200" :hide-delay="120" :max-width="160">
      <MButton icon="trash" icon-only severity="danger" outlined aria-label="Delete" />
    </MTooltip>
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
