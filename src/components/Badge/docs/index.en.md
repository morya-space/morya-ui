---
title: Badge
category: 07 / MISC
description: Status badge or dot.
---

# Badge

Status badge or dot for counts and status cues.

## Import

```ts
import { WiBadge } from '@well-insight/ui'
```

## Basic

Pass `value` to show text or a number; omit `value` to render a dot.

```vue preview
<script setup lang="ts">
import { WiBadge } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WiBadge :value="2" />
    <WiBadge value="New" />
    <WiBadge />
  </div>
</template>
```

## Severity

Use `severity` for semantic color; defaults to primary when omitted. Legacy value `warning` is supported (mapped to `warn`).

```vue preview
<script setup lang="ts">
import { WiBadge } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WiBadge :value="1" />
    <WiBadge :value="2" severity="secondary" />
    <WiBadge :value="3" severity="success" />
    <WiBadge :value="4" severity="info" />
    <WiBadge :value="5" severity="warn" />
    <WiBadge :value="6" severity="danger" />
    <WiBadge :value="7" severity="contrast" />
  </div>
</template>
```

## Size

`size` supports `small` / `large`, plus aliases `sm` / `lg`.

```vue preview
<script setup lang="ts">
import { WiBadge } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WiBadge :value="8" size="small" />
    <WiBadge :value="9" />
    <WiBadge :value="10" size="large" />
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string \| number` | — | Badge content. Renders as a dot when omitted. |
| `severity` | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warn' \| 'danger' \| 'contrast' \| 'warning'` | `'primary'` | Semantic color. `warning` is a compatibility alias mapped to `warn`. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size; `sm` / `lg` are aliases. |
