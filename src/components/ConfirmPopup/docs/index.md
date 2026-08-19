---
title: ConfirmPopup
category: 04 / OVERLAY
description: 锚定在目标旁的确认气泡。
---

# ConfirmPopup

轻量确认浮层，支持 `target` 或坐标定位。

## 引入

```ts
import { WdConfirmPopup } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdButton, WdConfirmPopup } from '@well-insight/ui'

const open = ref(false)
const target = ref<HTMLElement | null>(null)

function ask(event: MouseEvent) {
  target.value = event.currentTarget as HTMLElement
  open.value = true
}
</script>

<template>
  <WdButton label="删除" severity="danger" @click="ask" />
  <WdConfirmPopup v-model="open" :target="target" message="确认删除？" />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | 是否显示。 |
| `message` | `string` | — | 提示文案。 |
| `acceptLabel` / `rejectLabel` | `string` | `确认` / `取消` | 按钮。 |
| `target` | `HTMLElement \| null` | — | 锚点。 |
| `position` | `{ top, left } \| null` | — | 无锚点时的坐标。 |
| `teleport` | `boolean` | `true` | 浮层 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标；`'self'` / `false` 就地渲染。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `boolean` | 显隐。 |
| `accept` / `reject` | — | 确认 / 取消。 |
