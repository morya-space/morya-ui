---
title: ConfirmDialog
category: 04 / OVERLAY
description: 确认 / 取消对话框，复用 Dialog 浮层样式。
---

# ConfirmDialog

需要用户明确确认时使用的模态对话框。

## 引入

```ts
import { WdConfirmDialog, WdButton } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdConfirmDialog, WdButton } from '@well-insight/ui'

const visible = ref(false)
</script>

<template>
  <WdButton label="删除" severity="danger" @click="visible = true" />
  <WdConfirmDialog
    v-model="visible"
    header="删除确认"
    message="确定要删除该项吗？此操作不可撤销。"
    accept-label="删除"
    reject-label="取消"
    accept-severity="danger"
  />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | 是否可见。 |
| `header` | `string` | `'确认'` | 标题。 |
| `message` | `string` | — | 正文。 |
| `acceptLabel` | `string` | `'确认'` | 确认按钮文案。 |
| `rejectLabel` | `string` | `'取消'` | 取消按钮文案。 |
| `acceptSeverity` | `ButtonSeverity` | — | 确认按钮语义色。 |
| `teleport` | `boolean` | `true` | 浮层 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标；`'self'` / `false` 就地渲染。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `boolean` | 可见性变化。 |
| `accept` | — | 点击确认。 |
| `reject` | — | 点击取消或关闭。 |
