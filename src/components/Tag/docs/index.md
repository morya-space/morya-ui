---
title: Tag
category: 01 / BASIC
description: 标签用于展示状态或分类。
---

# Tag

标签用于展示状态或分类。

## 引入

```ts
import { WkTag } from '@wise-kit/ui'
```

## 基础用法

通过 `value` 或默认插槽展示文案。

```vue preview
<script setup lang="ts">
import { WkTag } from '@wise-kit/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WkTag value="Primary" />
    <WkTag>Slot Label</WkTag>
    <WkTag value="Rounded" rounded />
  </div>
</template>
```

## Severity

使用 `severity` 定义语义色；省略时为 primary。兼容旧值 `warning`（映射为 `warn`）。

```vue preview
<script setup lang="ts">
import { WkTag } from '@wise-kit/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WkTag value="Primary" />
    <WkTag value="Secondary" severity="secondary" />
    <WkTag value="Success" severity="success" />
    <WkTag value="Info" severity="info" />
    <WkTag value="Warn" severity="warn" />
    <WkTag value="Danger" severity="danger" />
    <WkTag value="Contrast" severity="contrast" />
  </div>
</template>
```

## Icons

`icon` 传入 `WkIcon` 的图标名称。

```vue preview
<script setup lang="ts">
import { WkTag } from '@wise-kit/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WkTag value="New" icon="plus" severity="info" />
    <WkTag value="Done" icon="check" severity="success" />
    <WkTag value="Alert" icon="info" severity="warn" rounded />
  </div>
</template>
```

## Closable

```vue preview
<script setup lang="ts">
import { WkTag } from '@wise-kit/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WkTag value="Draft" closable bordered />
    <WkTag value="Small" size="small" severity="success" closable />
  </div>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `string` | — | 标签文案。存在默认插槽内容时以插槽为准。 |
| `severity` | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warn' \| 'help' \| 'danger' \| 'contrast' \| 'warning'` | `'primary'` | 语义色。`warning` 为兼容别名，映射为 `warn`。 |
| `rounded` | `boolean` | `false` | 全圆角。 |
| `icon` | `IconName` | — | `WkIcon` 图标名称。 |
| `closable` | `boolean` | `false` | 显示关闭按钮。 |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 尺寸。 |
| `bordered` | `boolean` | `false` | 描边。 |
| `color` | `string` | — | 自定义颜色。 |
| `disabled` | `boolean` | `false` | 禁用关闭。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `close` | `MouseEvent` | 点击关闭。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 标签内容，优先于 `value`。 |
