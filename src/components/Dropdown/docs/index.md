---
title: Dropdown
category: 04 / OVERLAY
description: 动作菜单覆盖层（非表单选择器）。与 Select 不同：用于触发编辑、删除等操作项。
---

# Dropdown

动作菜单（action menu overlay）。用于从触发器打开一组操作项。

**与 Select 的区别：** `WiDropdown` 是菜单覆盖层；表单选项选择请使用 `WiSelect`（

## 引入

```ts
import { WiDropdown, WiButton } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiButton, WiDropdown } from '@well-insight/ui'

const open = ref(false)
const items = [
  { value: 'edit', label: 'Edit' },
  { value: 'duplicate', label: 'Duplicate' },
  { value: 'delete', label: 'Delete', disabled: true },
]

function onSelect(item: { value: string; label: string }) {
  open.value = false
  console.log(item.value)
}
</script>

<template>
  <WiDropdown v-model="open" :items="items" @select="onSelect">
    <template #trigger>
      <WiButton label="Actions" icon="chevron-down" icon-pos="right" severity="secondary" />
    </template>
  </WiDropdown>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | 菜单是否打开。 |
| `items` | `DropdownItem[]` | — | 菜单项；`disabled` 项不可选。 |
| `placement` | `'bottom-start' \| 'bottom-end'` | `'bottom-start'` | 对齐方式。 |
| `closeOnSelect` | `boolean` | `true` | 选择后关闭。 |
| `teleport` | `boolean` | `true` | 将菜单 Teleport 出去；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标；`'self'` / `false` 表示就地渲染。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `boolean` | 打开状态变化。 |
| `select` | `DropdownItem` | 选中启用项时触发。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `trigger` | 触发器。 |
| `item` | 自定义菜单项，作用域 `{ item }`。 |
