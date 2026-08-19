---
title: CommandMenu
category: 09 / MENU
description: 可搜索的命令面板对话框。
---

# CommandMenu

命令面板：搜索并执行 model 中的命令。

## 引入

```ts
import { WdCommandMenu } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdButton, WdCommandMenu } from '@well-insight/ui'

const visible = ref(false)
const model = [
  { label: '新建文件', icon: '+', shortcut: '⌘N' },
  { label: '打开设置', icon: '⚙', shortcut: '⌘,' },
  { label: '切换主题', icon: '◐' },
]
</script>

<template>
  <WdButton label="打开命令面板" @click="visible = true" />
  <WdCommandMenu v-model="visible" :model="model" />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `model` | `CommandMenuItem[]` | `[]` | 命令列表。 |
| `modelValue` | `boolean` | `false` | 是否可见。 |
| `placeholder` | `string` | `'搜索命令…'` | 搜索框占位。 |
| `teleport` | `boolean` | `true` | 浮层 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标；`'self'` / `false` 就地渲染。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `boolean` | 可见性变化。 |
