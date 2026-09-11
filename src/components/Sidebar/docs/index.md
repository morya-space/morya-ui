---
title: Sidebar
category: 04 / NAVIGATION
description: 导航轨侧栏，可折叠。
---

# Sidebar

应用导航侧栏（非 Drawer 浮层）。导出为 `MSidebar`。

## 引入

```ts
import { MSidebar } from 'morya-ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { MButton, MSidebar } from 'morya-ui'
import { ref } from 'vue'

const collapsed = ref(false)
const model = [
  { label: '概览', icon: '▦' },
  {
    label: '项目',
    icon: '☰',
    items: [{ label: '全部' }, { label: '归档' }],
  },
  { label: '设置', icon: '⚙' },
]
</script>

<template>
  <div style="display:flex;gap:1rem;align-items:flex-start">
    <MSidebar :model="model" :collapsed="collapsed" />
    <MButton :label="collapsed ? '展开' : '折叠'" size="small" @click="collapsed = !collapsed" />
  </div>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `model` | `SidebarItem[]` | `[]` | 菜单项。 |
| `collapsed` | `boolean` | `false` | 仅显示图标。 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Events

无自定义事件。

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 侧栏内容。 |
