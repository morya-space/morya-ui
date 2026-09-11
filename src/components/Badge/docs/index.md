---
title: Badge
category: 01 / BASIC
description: 状态角标或圆点。
---

# Badge

状态角标或圆点，用于数量与状态提示。

## 引入

```ts
import { MBadge } from 'morya-ui'
```

## 基础用法

传入 `value` 展示文案或数字；省略 `value` 时渲染为圆点。

```vue preview
<script setup lang="ts">
import { MBadge } from 'morya-ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <MBadge :value="2" />
    <MBadge value="New" />
    <MBadge />
  </div>
</template>
```

## Severity

使用 `severity` 定义语义色；省略时为 primary。兼容旧值 `warning`（映射为 `warn`）。

```vue preview
<script setup lang="ts">
import { MBadge } from 'morya-ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <MBadge :value="1" />
    <MBadge :value="2" severity="secondary" />
    <MBadge :value="3" severity="success" />
    <MBadge :value="4" severity="info" />
    <MBadge :value="5" severity="warn" />
    <MBadge :value="6" severity="danger" />
    <MBadge :value="7" severity="contrast" />
  </div>
</template>
```

## Size

`size` 支持 `small` / `large`，以及别名 `sm` / `lg`。

```vue preview
<script setup lang="ts">
import { MBadge } from 'morya-ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <MBadge :value="8" size="small" />
    <MBadge :value="9" />
    <MBadge :value="10" size="large" />
  </div>
</template>
```

## Overlay

默认插槽包裹子节点；`max` 超出时显示 `99+`，`processing` 显示脉冲。

```vue preview
<script setup lang="ts">
import { MBadge, MButton } from 'morya-ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1.5rem;align-items:center">
    <MBadge :value="120" :max="99">
      <MButton label="Inbox" severity="secondary" />
    </MBadge>
    <MBadge processing>
      <MButton label="Live" icon="check" />
    </MBadge>
  </div>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `string \| number` | — | 角标内容。省略时显示为圆点。 |
| `severity` | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warn' \| 'danger' \| 'contrast' \| 'warning'` | `'primary'` | 语义色。`warning` 为兼容别名，映射为 `warn`。 |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 尺寸；`sm` / `lg` 为别名。 |
| `max` | `number` | — | 数字上限，超出显示 `{max}+`。 |
| `offset` | `[number, number]` | — | 包裹模式下的位移 `[x, y]`。 |
| `processing` | `boolean` | `false` | 脉冲动画。 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 被角标包裹的内容。 |

## 无障碍

- 角标数字变化时，若状态重要，请同步更新附近可见文案或 `aria-live` 区域。
- 包裹模式下，勿让角标成为唯一的状态提示。

## Events

无自定义事件。
