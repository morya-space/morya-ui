---
title: Card
category: 05 / PANEL
description: 内容容器。通过 title / subtitle 或 header / footer 插槽组织结构。
---

# Card

内容容器，适合分组展示标题、正文与操作。Footer 仅通过插槽扩展（不提供 `footer` prop）。

## 引入

```ts
import { WiButton, WiCard } from '@well-insight/ui'
```

## 基础用法

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

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | — | 标题。 |
| `subtitle` | `string` | — | 副标题。 |
| `ariaLabel` | `string` | — | 可访问名称；默认回退到 `title`。 |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 内边距尺寸。 |
| `bordered` | `boolean` | `true` | 是否描边。 |
| `hoverable` | `boolean` | `false` | 悬停抬起。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 正文。 |
| `header` | 自定义头部（优先于 `title` / `subtitle`）。 |
| `footer` | 底部区域（推荐用插槽，无 footer prop）。 |
| `cover` | 封面，渲染在头部上方。 |
