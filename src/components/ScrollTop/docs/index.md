---
title: ScrollTop
category: 04 / NAVIGATION
description: 滚动超过阈值后显示回到顶部按钮。
---

# ScrollTop

监听窗口或父容器滚动，一键回到顶部。

## 引入

```ts
import { MScrollTop } from 'morya-ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { MScrollbar, MScrollTop } from 'morya-ui'
</script>

<template>
  <div style="height: 8rem; position: relative">
    <MScrollbar height="8rem">
      <div style="height: 40rem; padding: var(--m-space-3)">
        向下滚动…
      </div>
      <MScrollTop :threshold="80" target="parent" :right="16" :bottom="16" />
    </MScrollbar>
  </div>
</template>
```

## 与 MScrollbar 配合

`target="parent"` 时会向上查找最近的 `.m-scrollbar__wrap`（或原生 overflow 容器）作为滚动源。推荐将 `MScrollTop` 放在 `MScrollbar` 内容 slot 内，并保留 `teleport`（默认）以便按钮固定在视口角落。

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `threshold` | `number` | `400` | 显示阈值（px）。 |
| `target` | `'window' \| 'parent'` | `'window'` | 滚动目标。 |
| `right` | `string \| number` | — | 距右边缘；数字为 px。 |
| `bottom` | `string \| number` | — | 距底边缘；数字为 px。 |
| `teleport` | `boolean` | `true` | 浮层 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标；`'self'` / `false` 就地渲染。 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Events

无自定义事件。

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 默认内容。 |

