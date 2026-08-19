---
title: Divider
category: 01 / PRIMITIVE
description: Content divider.
---

# Divider

Content divider, optionally with a label.

## Import

```ts
import { WdDivider } from '@well-insight/ui'
```

## Basic

Default horizontal solid divider.

```vue preview
<script setup lang="ts">
import { WdDivider } from '@well-insight/ui'
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(28rem,100%)">
    <p style="margin:0">Above</p>
    <WdDivider />
    <p style="margin:0">Below</p>
  </div>
</template>
```

## Type

`type` supports `solid`, `dashed`, and `dotted`.

```vue preview
<script setup lang="ts">
import { WdDivider } from '@well-insight/ui'
</script>

<template>
  <div style="display:grid;gap:1.25rem;width:min(28rem,100%)">
    <WdDivider type="solid" label="Solid" />
    <WdDivider type="dashed" label="Dashed" />
    <WdDivider type="dotted" label="Dotted" />
  </div>
</template>
```

## Align

When the divider is horizontal and has a label, use `align` to control the label position.

```vue preview
<script setup lang="ts">
import { WdDivider } from '@well-insight/ui'
</script>

<template>
  <div style="display:grid;gap:1.25rem;width:min(28rem,100%)">
    <WdDivider label="Left" align="left" />
    <WdDivider label="Center" align="center" />
    <WdDivider label="Right" align="right" />
  </div>
</template>
```

## Layout

`layout` (or the compatible `orientation`) controls horizontal / vertical.

```vue preview
<script setup lang="ts">
import { WdDivider } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;align-items:stretch;gap:1rem;min-height:6rem">
    <span>Left</span>
    <WdDivider layout="vertical" />
    <span>Middle</span>
    <WdDivider layout="vertical" type="dashed" />
    <span>Right</span>
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `layout` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction. |
| `orientation` | `'horizontal' \| 'vertical'` | — | **Compatibility alias**; takes effect only when `layout` is not passed. |
| `type` | `'solid' \| 'dashed' \| 'dotted'` | `'solid'` | Line style. |
| `align` | `'left' \| 'center' \| 'right'` | `'center'` | Label alignment for a horizontal divider with a label. |
| `label` | `string` | — | Center label text. The default slot takes precedence when present. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Label content, takes precedence over `label`. |
