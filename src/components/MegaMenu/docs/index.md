---
title: MegaMenu
category: 04 / NAVIGATION
description: 水平菜单，子项按多列面板展示。
---

# MegaMenu

顶层水平导航；展开后以**分栏面板**展示子链接，适合站点级导航。

## 引入

```ts
import { WiMegaMenu, type MegaMenuItem } from '@well-insight/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WiMegaMenu } from '@well-insight/ui'

const model = [
  {
    label: '产品',
    items: [
      [{ label: '组件库', command: () => {} }, { label: '主题' }],
      [{ label: '图标' }, { label: '模板' }],
    ],
  },
  { label: '关于', command: () => window.alert('关于') },
]
</script>

<template>
  <WiMegaMenu :model="model" />
</template>
```

## 面板结构

`items` 为**列数组**：外层每一项是一列，列内为同级链接。

```ts
{
  label: '产品',
  items: [
    [ { label: '列 A · 项 1' }, { label: '列 A · 项 2' } ],
    [ { label: '列 B · 项 1' } ],
  ],
}
```

无 `items` 的顶层项为普通链接，点击执行 `command`。

## 菜单项字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `label` | `string` | 展示文案。 |
| `icon` | `string` | 可选前缀字符。 |
| `command` | `() => void` | 点击时执行。 |
| `disabled` | `boolean` | 禁用项。 |
| `items` | `MegaMenuItem[][]` | 分栏子面板。 |

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `model` | `MegaMenuItem[]` | `[]` | 顶层菜单项。 |
| `teleport` | `boolean` | `true` | 面板 Teleport；默认 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标。 |
| `selectedKey` | `string \| null` | — | — |

## 无障碍

- 顶层项使用按钮/链接语义；展开面板请确保键盘可到达子项。
- 复杂站点导航建议配合 Skip link 与当前页 `aria-current`。

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `select` | — | — |
| `update:selectedKey` | — | — |

## Slots

无插槽。
