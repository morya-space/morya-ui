---
title: Divider
category: 01 / BASIC
description: Content divider.
---

# Divider

Content divider, optionally with a label.

## Import

```ts
import { RdDivider } from '@roost-design/ui'
```

## Basic

Default horizontal solid divider.

```vue preview
<script setup lang="ts">
import { RdDivider } from '@roost-design/ui'
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(28rem,100%)">
    <p style="margin:0">
      Above
    </p>
    <RdDivider />
    <p style="margin:0">
      Below
    </p>
  </div>
</template>
```

## Type

`type` supports `solid`, `dashed`, and `dotted`.

```vue preview
<script setup lang="ts">
import { RdDivider } from '@roost-design/ui'
</script>

<template>
  <div style="display:grid;gap:1.25rem;width:min(28rem,100%)">
    <RdDivider type="solid" label="Solid" />
    <RdDivider type="dashed" label="Dashed" />
    <RdDivider type="dotted" label="Dotted" />
  </div>
</template>
```

## Align

When the divider is horizontal and has a label, use `align` to control the label position.

```vue preview
<script setup lang="ts">
import { RdDivider } from '@roost-design/ui'
</script>

<template>
  <div style="display:grid;gap:1.25rem;width:min(28rem,100%)">
    <RdDivider label="Left" align="left" />
    <RdDivider label="Center" align="center" />
    <RdDivider label="Right" align="right" />
  </div>
</template>
```

## Title placement

`titlePlacement` is an alias of `align`.

```vue preview
<script setup lang="ts">
import { RdDivider } from '@roost-design/ui'
</script>

<template>
  <RdDivider label="Or" title-placement="right" />
</template>
```

## Layout

`layout` controls horizontal / vertical orientation.

```vue preview
<script setup lang="ts">
import { RdDivider } from '@roost-design/ui'
</script>

<template>
  <div style="display:flex;align-items:stretch;gap:1rem;min-height:6rem">
    <span>Left</span>
    <RdDivider layout="vertical" />
    <span>Middle</span>
    <RdDivider layout="vertical" type="dashed" />
    <span>Right</span>
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `layout` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction. |
| `type` | `'solid' \| 'dashed' \| 'dotted'` | `'solid'` | Line style. |
| `align` | `'left' \| 'center' \| 'right'` | `'center'` | Label alignment for a horizontal divider with a label. |
| `titlePlacement` | `'left' \| 'center' \| 'right'` | — | Alias of `align`; takes precedence when set. |
| `label` | `string` | — | Center label text. The default slot takes precedence when present. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Label content, takes precedence over `label`. |

## Events

No custom events.
