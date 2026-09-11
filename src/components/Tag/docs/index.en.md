---
title: Tag
category: 01 / BASIC
description: Tag for status or category.
---

# Tag

Tags display status or category.

## Import

```ts
import { MTag } from 'morya-ui'
```

## Basic

Show text via `value` or the default slot.

```vue preview
<script setup lang="ts">
import { MTag } from 'morya-ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <MTag value="Primary" />
    <MTag>Slot Label</MTag>
    <MTag value="Rounded" rounded />
  </div>
</template>
```

## Severity

Use `severity` for semantic color; defaults to primary when omitted. The legacy value `warning` is mapped to `warn`.

```vue preview
<script setup lang="ts">
import { MTag } from 'morya-ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <MTag value="Primary" />
    <MTag value="Secondary" severity="secondary" />
    <MTag value="Success" severity="success" />
    <MTag value="Info" severity="info" />
    <MTag value="Warn" severity="warn" />
    <MTag value="Danger" severity="danger" />
    <MTag value="Contrast" severity="contrast" />
  </div>
</template>
```

## Icons

Pass a `MIcon` icon name to `icon`.

```vue preview
<script setup lang="ts">
import { MTag } from 'morya-ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <MTag value="New" icon="plus" severity="info" />
    <MTag value="Done" icon="check" severity="success" />
    <MTag value="Alert" icon="info" severity="warn" rounded />
  </div>
</template>
```

## Closable

```vue preview
<script setup lang="ts">
import { MTag } from 'morya-ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <MTag value="Draft" closable bordered />
    <MTag value="Small" size="small" severity="success" closable />
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | Tag text. The default slot takes precedence when present. |
| `severity` | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warn' \| 'help' \| 'danger' \| 'contrast' \| 'warning'` | `'primary'` | Semantic color. `warning` is a compatibility alias mapped to `warn`. |
| `rounded` | `boolean` | `false` | Fully rounded. |
| `icon` | [IconName](/docs/types#IconName) | — | `MIcon` icon name. |
| `closable` | `boolean` | `false` | Show a close control. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size. |
| `bordered` | `boolean` | `false` | Draw a border. |
| `color` | `string` | — | Custom color. |
| `disabled` | `boolean` | `false` | Disable the close control. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Payload | Description |
| --- | --- | --- |
| `close` | `MouseEvent` | Fired when close is clicked. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Tag content; takes precedence over `value`. |
