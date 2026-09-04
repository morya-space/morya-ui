---
title: Tooltip
category: 05 / FEEDBACK
description: 悬停或聚焦时显示的短提示。支持 placement、disabled 与 showDelay。
---

# Tooltip

为触发元素提供短提示，适合图标按钮或截断文本说明。

## 引入

```ts
import { WdButton, WdTooltip } from '@wex-design/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WdButton, WdTooltip } from '@wex-design/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center">
    <WdTooltip content="Save changes" placement="top">
      <WdButton icon="check" icon-only aria-label="Save" />
    </WdTooltip>
    <WdTooltip content="Delete item" placement="bottom" :show-delay="200" :hide-delay="120" :max-width="160">
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
| `hideDelay` | `number` | `0` | 隐藏前延迟（毫秒）。 |
| `maxWidth` | `string \| number` | — | 提示最大宽度；数字为 px。 |
| `teleport` | `boolean` | `true` | 浮层 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标；`'self'` / `false` 就地渲染。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 触发元素。 |

## 无障碍

- 提示内容会通过 `role="tooltip"` 关联到触发元素（hover / focus 显示）。
- 触发控件需可聚焦；纯图标按钮请设置 `aria-label`。
- 重要信息不要只放在 Tooltip 中，应提供可见文案或 `aria-label`。

## Events

无自定义事件。
