---
title: Popover
category: 04 / OVERLAY
description: 相对触发元素定位的浮层面板。支持 placement、Teleport；点击外部或 Esc 关闭。
---

# Popover

相对触发元素显示的浮层，适合筛选、快捷操作或轻量表单。

## 引入

```ts
import { WdPopover, WdButton } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdButton, WdPopover } from '@well-insight/ui'

const open = ref(false)
</script>

<template>
  <WdPopover v-model="open" placement="bottom">
    <WdButton label="Toggle Popover" @click="open = !open" />
    <template #content>
      <p style="margin:0">Click outside or press Esc to close.</p>
    </template>
  </WdPopover>
</template>
```

## Placement

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdButton, WdPopover } from '@well-insight/ui'

const open = ref(false)
</script>

<template>
  <div style="display:flex;justify-content:center;padding:2rem">
    <WdPopover v-model="open" placement="bottom-start">
      <WdButton label="bottom-start" severity="secondary" @click="open = !open" />
      <template #content>
        <p style="margin:0">Aligned to the start of the trigger.</p>
      </template>
    </WdPopover>
  </div>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | 可见性。配合 `v-model` 使用。 |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right' \| 'bottom-start' \| 'bottom-end'` | `'bottom'` | 相对触发元素的位置。 |
| `teleport` | `boolean` | `true` | 浮层 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标；`'self'` / `false` 就地渲染。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `boolean` | 可见性变化。 |
| `show` | — | 打开时触发。 |
| `hide` | — | 关闭后触发。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 触发元素。 |
| `content` | 浮层内容。 |
