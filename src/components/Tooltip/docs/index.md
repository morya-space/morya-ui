---
title: Tooltip
category: 04 / OVERLAY
description: 悬停或聚焦时显示的短提示。支持 placement、disabled 与 showDelay。
---

# Tooltip

为触发元素提供短提示，适合图标按钮或截断文本说明。

## 引入

```ts
import { WdTooltip, WdButton } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdButton, WdTooltip } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center">
    <WdTooltip content="Save changes" placement="top">
      <WdButton icon="check" icon-only aria-label="Save" />
    </WdTooltip>
    <WdTooltip content="Delete item" placement="bottom" :show-delay="200">
      <WdButton icon="trash" icon-only severity="danger" outlined aria-label="Delete" />
    </WdTooltip>
  </div>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `content` | `string` | — | 提示文案。 |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | 相对触发元素的位置。 |
| `disabled` | `boolean` | `false` | 禁用提示。 |
| `showDelay` | `number` | `0` | 显示前延迟（毫秒）。 |
| `teleport` | `boolean` | `true` | 浮层 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标；`'self'` / `false` 就地渲染。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 触发元素。 |
