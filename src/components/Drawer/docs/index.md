---
title: Drawer
category: 05 / FEEDBACK
description: 侧边抽屉面板。
---

# Drawer

侧边抽屉，从屏幕边缘滑出，适合导航、筛选或详情面板。

## 引入

```ts
import { WiButton, WiDrawer } from '@well-insight/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WiButton, WiDrawer } from '@well-insight/ui'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <div>
    <WiButton label="Open Drawer" @click="open = true" />
    <WiDrawer v-model="open" header="Navigation">
      <p style="margin:0">
        Drawer body content. Esc or mask click closes by default.
      </p>
    </WiDrawer>
  </div>
</template>
```

## Position

支持 `left` / `right` / `top` / `bottom`。

```vue preview
<script setup lang="ts">
import { WiButton, WiDrawer } from '@well-insight/ui'
import { ref } from 'vue'

const open = ref(false)
const position = ref<'left' | 'right' | 'top' | 'bottom'>('right')

function openAt(next: 'left' | 'right' | 'top' | 'bottom') {
  position.value = next
  open.value = true
}
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem">
    <WiButton label="Left" size="small" @click="openAt('left')" />
    <WiButton label="Right" size="small" severity="secondary" @click="openAt('right')" />
    <WiButton label="Top" size="small" severity="secondary" @click="openAt('top')" />
    <WiButton label="Bottom" size="small" severity="secondary" @click="openAt('bottom')" />
    <WiDrawer v-model="open" :header="`Position: ${position}`" :position="position">
      <p style="margin:0">
        Use <code>dismissable</code> to control mask dismiss.
      </p>
    </WiDrawer>
  </div>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | 可见性。配合 `v-model` 使用。 |
| `position` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'left'` | 抽屉出现位置。 |
| `modal` | `boolean` | `true` | 显示遮罩层。 |
| `dismissable` | `boolean` | `true` | 点击遮罩关闭。 |
| `showCloseIcon` | `boolean` | `true` | 显示关闭按钮。 |
| `header` | `string` | — | 标题文案。 |
| `width` | `string \| number` | — | 左右抽屉宽度。 |
| `height` | `string \| number` | — | 上下抽屉高度。 |
| `blockScroll` | `boolean` | `true` | 打开时锁定 `body` 滚动。 |
| `teleport` | `boolean` | `true` | 浮层 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标；`'self'` / `false` 就地渲染。 |
| `beforeClose` | `AsyncGuard` | — | — |
| `closeOnEsc` | `boolean` | — | — |
| `closeOnOutsideClick` | `boolean` | — | — |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `boolean` | 可见性变化。 |
| `show` | — | 打开时触发。 |
| `hide` | — | 关闭后触发。 |
| `after-leave` | — | 离场动画结束。 |
| `close` | — | — |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 抽屉内容。 |
| `header` | 自定义标题区。 |
