---
title: Terminal
category: 03 / DATA
description: 简易命令提示符 UI。
---

# Terminal

展示欢迎语与命令历史，提交时触发 `command`。

## 引入

```ts
import { WkTerminal } from '@wise-kit/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WkTerminal } from '@wise-kit/ui'
import { ref } from 'vue'

const last = ref('')
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:0.5rem">
    <WkTerminal welcome-message="Wise Kit Terminal" @command="last = $event" />
    <div v-if="last">
      最近命令：{{ last }}
    </div>
  </div>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `welcomeMessage` | `string` | `'Welcome to Wise Kit Terminal'` | 顶部欢迎语。 |
| `prompt` | `string` | `'>'` | 提示符。 |
| `lines` | `string[]` | — | — |
| `responses` | `string[]` | — | — |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `command` | `string` | 提交的命令。 |
| `update:lines` | — | — |
| `update:responses` | — | — |

## Slots

无插槽。
