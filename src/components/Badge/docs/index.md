---
title: Badge
category: 07 / MISC
description: 状态角标或圆点。
---

# Badge

状态角标或圆点，用于数量与状态提示。

## 引入

```ts
import { WdBadge } from '@well-insight/ui'
```

## Basic

传入 `value` 展示文案或数字；省略 `value` 时渲染为圆点。

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

使用 `severity` 定义语义色；省略时为 primary。兼容旧值 `warning`（映射为 `warn`）。

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

`size` 支持 `small` / `large`，以及别名 `sm` / `lg`。

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

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `string \| number` | — | 角标内容。省略时显示为圆点。 |
| `severity` | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warn' \| 'danger' \| 'contrast' \| 'warning'` | `'primary'` | 语义色。`warning` 为兼容别名，映射为 `warn`。 |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 尺寸；`sm` / `lg` 为别名。 |
