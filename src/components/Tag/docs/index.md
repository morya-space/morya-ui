---
title: Tag
category: 01 / PRIMITIVE
description: 标签用于展示状态或分类。
---

# Tag

标签用于展示状态或分类。

## 引入

```ts
import { WdTag } from '@well-insight/ui'
```

## Basic

通过 `value` 或默认插槽展示文案。

```vue preview
<script setup lang="ts">
import { WdTag } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WdTag value="Primary" />
    <WdTag>Slot Label</WdTag>
    <WdTag value="Rounded" rounded />
  </div>
</template>
```

## Severity

使用 `severity` 定义语义色；省略时为 primary。兼容旧值 `warning`（映射为 `warn`）。

```vue preview
<script setup lang="ts">
import { WdTag } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WdTag value="Primary" />
    <WdTag value="Secondary" severity="secondary" />
    <WdTag value="Success" severity="success" />
    <WdTag value="Info" severity="info" />
    <WdTag value="Warn" severity="warn" />
    <WdTag value="Danger" severity="danger" />
    <WdTag value="Contrast" severity="contrast" />
  </div>
</template>
```

## Icons

`icon` 传入 `WdIcon` 的图标名称。

```vue preview
<script setup lang="ts">
import { WdTag } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WdTag value="New" icon="plus" severity="info" />
    <WdTag value="Done" icon="check" severity="success" />
    <WdTag value="Alert" icon="info" severity="warn" rounded />
  </div>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `string` | — | 标签文案。存在默认插槽内容时以插槽为准。 |
| `severity` | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warn' \| 'help' \| 'danger' \| 'contrast' \| 'warning'` | `'primary'` | 语义色。`warning` 为兼容别名，映射为 `warn`。 |
| `rounded` | `boolean` | `false` | 全圆角。 |
| `icon` | `IconName` | — | `WdIcon` 图标名称。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 标签内容，优先于 `value`。 |
