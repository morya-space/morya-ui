---
title: Badge
category: 07 / MISC
description: Status badge or dot.
---

# Badge

Status badge or dot for counts and status cues.

## Import

```ts
import { WdBadge } from '@well-insight/ui'
```

## Basic

Pass `value` to show text or a number; omit `value` to render a dot.

```vue preview
<script setup lang="ts">
import { WdBadge } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WdBadge :value="2" />
    <WdBadge value="New" />
    <WdBadge />
  </div>
</template>
```

## Severity

Use `severity` for semantic color; defaults to primary when omitted. Legacy value `warning` is supported (mapped to `warn`).

```vue preview
<script setup lang="ts">
import { WdBadge } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WdBadge :value="1" />
    <WdBadge :value="2" severity="secondary" />
    <WdBadge :value="3" severity="success" />
    <WdBadge :value="4" severity="info" />
    <WdBadge :value="5" severity="warn" />
    <WdBadge :value="6" severity="danger" />
    <WdBadge :value="7" severity="contrast" />
  </div>
</template>
```

## Size

`size` supports `small` / `large`, plus aliases `sm` / `lg`.

```vue preview
<script setup lang="ts">
import { WdBadge } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WdBadge :value="8" size="small" />
    <WdBadge :value="9" />
    <WdBadge :value="10" size="large" />
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string \| number` | — | Badge content. Renders as a dot when omitted. |
| `severity` | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warn' \| 'danger' \| 'contrast' \| 'warning'` | `'primary'` | Semantic color. `warning` is a compatibility alias mapped to `warn`. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size; `sm` / `lg` are aliases. |
