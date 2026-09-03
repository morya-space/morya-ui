---
title: Card
category: 03 / DATA
description: Content container. Structure content with title / subtitle or header / footer slots.
---

# Card

Content container for grouping title, body, and actions. Footer is extended via slot only (no `footer` prop).

## Import

```ts
import { WiButton, WiCard } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiButton, WiCard } from '@well-insight/ui'
</script>

<template>
  <WiCard title="Project overview" subtitle="Updated 2 hours ago">
    <p style="margin:0;color:var(--wi-color-text-muted)">
      Title and subtitle align in the header. Body content stays in the default slot.
    </p>
    <template #footer>
      <div style="display:flex;gap:0.75rem;justify-content:flex-end;width:100%">
        <WiButton label="Dismiss" severity="secondary" text />
        <WiButton label="Continue" />
      </div>
    </template>
  </WiCard>
</template>
```

## Custom Header

```vue preview
<script setup lang="ts">
import { WiCard, WiTag } from '@well-insight/ui'
</script>

<template>
  <WiCard>
    <template #header>
      <div style="display:flex;align-items:center;justify-content:space-between;width:100%;gap:1rem">
        <strong>Custom header</strong>
        <WiTag value="Active" severity="success" />
      </div>
    </template>
    Prefer the header slot when you need more than title/subtitle text.
  </WiCard>
</template>
```

## Cover & Hover

```vue preview
<script setup lang="ts">
import { WiCard } from '@well-insight/ui'
</script>

<template>
  <WiCard title="Cover card" hoverable size="small">
    <template #cover>
      <div style="height:6rem;background:color-mix(in srgb, var(--wi-color-primary) 18%, transparent)" />
    </template>
    Hover to lift. Set `bordered` to false for a borderless surface.
  </WiCard>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | Title. |
| `subtitle` | `string` | — | Subtitle. |
| `ariaLabel` | `string` | — | Accessible name; falls back to `title` by default. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Padding size. |
| `bordered` | `boolean` | `true` | Show a border. |
| `hoverable` | `boolean` | `false` | Elevate on hover. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Body. |
| `header` | Custom header (takes precedence over `title` / `subtitle`). |
| `footer` | Footer area (use the slot; there is no footer prop). |
| `cover` | Cover above the header. |

## Accessibility

- When `title` is set it becomes the container `aria-label`; use `#header` for complex headers with readable titles.
- Footer actions should use descriptive button labels.

## Events

No custom events.
