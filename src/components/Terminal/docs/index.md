---
title: Terminal
category: 07 / MISC
description: 简易命令提示符 UI。
---

# Terminal

展示欢迎语与命令历史，提交时触发 `command`。

## 引入

```ts
import { WdTerminal } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdTerminal } from '@well-insight/ui'

const last = ref('')
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:0.5rem">
    <WdTerminal welcome-message="Well Insight Terminal" @command="last = $event" />
    <div v-if="last">最近命令：{{ last }}</div>
  </div>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `welcomeMessage` | `string` | `'Welcome to Well Insight Terminal'` | 顶部欢迎语。 |
| `prompt` | `string` | `'>'` | 提示符。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `command` | `string` | 提交的命令。 |
