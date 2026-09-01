---
title: CommandMenu
category: 09 / MENU
description: 可搜索的命令面板对话框。
---

# CommandMenu

命令面板：搜索并执行 `model` 中的命令。适合全局快捷键（如 Cmd/Ctrl+K）场景。

## 引入

```ts
import { WiCommandMenu, type CommandMenuItem } from '@well-insight/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WiButton, WiCommandMenu } from '@well-insight/ui'
import { ref } from 'vue'

const visible = ref(false)
const model = [
  { label: '新建文件', icon: '+', shortcut: '⌘N', command: () => window.alert('新建') },
  { label: '打开设置', icon: '⚙', shortcut: '⌘,', command: () => window.alert('设置') },
  { label: '切换主题', icon: '◐', disabled: true },
]
</script>

<template>
  <WiButton label="打开命令面板" @click="visible = true" />
  <WiCommandMenu v-model="visible" :model="model" placeholder="搜索命令…" />
</template>
```

## 命令项结构

`CommandMenuItem` 字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `label` | `string` | 展示文案，参与本地过滤。 |
| `icon` | `string` | 可选前缀字符（非 WiIcon 名）。 |
| `shortcut` | `string` | 可选快捷键展示。 |
| `command` | `() => void` | 选中后执行；执行完自动关闭面板。 |
| `disabled` | `boolean` | 禁用项不可激活。 |

## 键盘

面板打开时：

| 按键 | 行为 |
| --- | --- |
| `↑` / `↓` | 移动高亮项 |
| `Enter` | 激活当前项 |
| `Escape` | 关闭面板 |

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `model` | `CommandMenuItem[]` | `[]` | 命令列表。 |
| `modelValue` | `boolean` | `false` | 是否可见（`v-model`）。 |
| `placeholder` | `string` | 语言包 `searchCommands` | 搜索框占位。 |
| `teleport` | `boolean` | `true` | 浮层 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标；`'self'` / `false` 就地渲染。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `boolean` | 可见性变化。 |

## 无障碍

- 面板为 `role="dialog"`、`aria-modal="true"`。
- 打开后焦点落在搜索框；请为触发按钮提供可访问名称。

## Slots

无插槽。
