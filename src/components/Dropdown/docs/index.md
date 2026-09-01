---
title: Dropdown
category: 04 / OVERLAY
description: 动作菜单覆盖层（非表单选择器）。与 Select 不同：用于触发编辑、删除等操作项。
---

# Dropdown

动作菜单（action menu overlay）。用于从触发器打开一组操作项。

**与 Select 的区别：** `WiDropdown` 是菜单覆盖层；表单选项选择请使用 `WiSelect`。

支持分组（`type: 'group'`）、分割线（`separator` / `type: 'divider'`）、嵌套 `items`，以及 `trigger: 'hover'` + `showDelay` / `hideDelay`。键盘高亮仍只覆盖顶层叶子项。

## 引入

```ts
import { WiButton, WiDropdown } from '@well-insight/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WiButton, WiDropdown } from '@well-insight/ui'
import { ref } from 'vue'

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

## Nested / group / hover

```vue preview
<script setup lang="ts">
import { WiButton, WiDropdown } from '@well-insight/ui'
import { ref } from 'vue'

const open = ref(false)
const items = [
  { type: 'group' as const, label: '编辑', items: [{ value: 'cut', label: '剪切' }, { value: 'copy', label: '复制' }] },
  { separator: true },
  { value: 'more', label: '更多', items: [{ value: 'deep', label: '深层操作' }] },
]
</script>

<template>
  <WiDropdown v-model="open" :items="items" trigger="hover" :show-delay="0" :hide-delay="200">
    <template #trigger>
      <WiButton label="悬停打开" severity="secondary" />
    </template>
  </WiDropdown>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | 菜单是否打开。 |
| `items` | `DropdownItem[]` | — | 菜单项；可含 `type` / `separator` / `items` / `icon` / `command`。 |
| `placement` | `'bottom-start' \| 'bottom-end'` | `'bottom-start'` | 对齐方式。 |
| `closeOnSelect` | `boolean` | `true` | 选择后关闭。 |
| `trigger` | `'click' \| 'hover'` | `'click'` | 打开方式。 |
| `showDelay` / `hideDelay` | `number` | `0` / `200` | hover 延迟（ms）。 |
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
