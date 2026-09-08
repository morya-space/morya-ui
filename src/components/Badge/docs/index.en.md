---
title: Badge
category: 01 / BASIC
description: Status badge or dot.
---

# Badge

Status badge or dot for counts and status cues.

## Import

```ts
import { WkBadge } from '@wise-kit/ui'
```

## Basic

Pass `value` to show text or a number; omit `value` to render a dot.

```vue preview
<script setup lang="ts">
import { WkBadge } from '@wise-kit/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WkBadge :value="2" />
    <WkBadge value="New" />
    <WkBadge />
  </div>
</template>
```

## Severity

Use `severity` for semantic color; defaults to primary when omitted. Legacy value `warning` is supported (mapped to `warn`).

```vue preview
<script setup lang="ts">
import { WkBadge } from '@wise-kit/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WkBadge :value="1" />
    <WkBadge :value="2" severity="secondary" />
    <WkBadge :value="3" severity="success" />
    <WkBadge :value="4" severity="info" />
    <WkBadge :value="5" severity="warn" />
    <WkBadge :value="6" severity="danger" />
    <WkBadge :value="7" severity="contrast" />
  </div>
</template>
```

## Size

`size` supports `small` / `large`, plus aliases `sm` / `lg`.

```vue preview
<script setup lang="ts">
import { WkBadge } from '@wise-kit/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WkBadge :value="8" size="small" />
    <WkBadge :value="9" />
    <WkBadge :value="10" size="large" />
  </div>
</template>
```

## Overlay

Wrap content with the default slot. `max` caps numeric values; `processing` pulses.

```vue preview
<script setup lang="ts">
import { WkBadge, WkButton } from '@wise-kit/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1.5rem;align-items:center">
    <WkBadge :value="120" :max="99">
      <WkButton label="Inbox" severity="secondary" />
    </WkBadge>
    <WkBadge processing>
      <WkButton label="Live" icon="check" />
    </WkBadge>
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string \| number` | — | Badge content. Renders as a dot when omitted. |
| `severity` | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warn' \| 'danger' \| 'contrast' \| 'warning'` | `'primary'` | Semantic color. `warning` is a compatibility alias mapped to `warn`. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size; `sm` / `lg` are aliases. |
| `max` | `number` | — | Cap numeric values as `{max}+`. |
| `offset` | `[number, number]` | — | Offset `[x, y]` when wrapping content. |
| `processing` | `boolean` | `false` | Pulse animation. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Content to overlay. |

## Accessibility

- When badge counts matter, update nearby visible text or an `aria-live` region.
- Do not rely on the badge alone as the only status indicator.

## Events

No custom events.
