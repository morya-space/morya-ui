---
title: Card
category: 05 / PANEL
description: 内容容器。通过 title / subtitle 或 header / footer 插槽组织结构。
---

# Card

内容容器，适合分组展示标题、正文与操作。Footer 仅通过插槽扩展（不提供 `footer` prop）。

## 引入

```ts
import { WdCard, WdButton } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdButton, WdCard } from '@well-insight/ui'
</script>

<template>
  <WdCard title="Project overview" subtitle="Updated 2 hours ago">
    <p style="margin:0;color:var(--wd-color-text-muted)">
      Title and subtitle align in the header. Body content stays in the default slot.
    </p>
    <template #footer>
      <div style="display:flex;gap:0.75rem;justify-content:flex-end;width:100%">
        <WdButton label="Dismiss" severity="secondary" text />
        <WdButton label="Continue" />
      </div>
    </template>
  </WdCard>
</template>
```

## Custom Header

```vue preview
<script setup lang="ts">
import { WdCard, WdTag } from '@well-insight/ui'
</script>

<template>
  <WdCard>
    <template #header>
      <div style="display:flex;align-items:center;justify-content:space-between;width:100%;gap:1rem">
        <strong>Custom header</strong>
        <WdTag value="Active" severity="success" />
      </div>
    </template>
    Prefer the header slot when you need more than title/subtitle text.
  </WdCard>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | — | 标题。 |
| `subtitle` | `string` | — | 副标题。 |
| `ariaLabel` | `string` | — | 可访问名称；默认回退到 `title`。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 正文。 |
| `header` | 自定义头部（优先于 `title` / `subtitle`）。 |
| `footer` | 底部区域（推荐用插槽，无 footer prop）。 |
