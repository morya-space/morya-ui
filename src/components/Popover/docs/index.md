---
title: Popover
category: 05 / FEEDBACK
description: 相对触发元素定位的浮层面板。支持 placement、Teleport；点击外部或 Esc 关闭。
---

# Popover

相对触发元素显示的浮层，适合筛选、快捷操作或轻量表单。

## 引入

```ts
import { WiButton, WiPopover } from '@well-insight/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WiButton, WiPopover } from '@well-insight/ui'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <WiPopover v-model="open" placement="bottom">
    <WiButton label="Toggle Popover" @click="open = !open" />
    <template #content>
      <p style="margin:0">
        Click outside or press Esc to close.
      </p>
    </template>
  </WiPopover>
</template>
```

## Placement

```vue preview
<script setup lang="ts">
import { WiButton, WiPopover } from '@well-insight/ui'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <div style="display:flex;justify-content:center;padding:2rem">
    <WiPopover v-model="open" placement="bottom-start">
      <WiButton label="bottom-start" severity="secondary" @click="open = !open" />
      <template #content>
        <p style="margin:0">
          Aligned to the start of the trigger.
        </p>
      </template>
    </WiPopover>
  </div>
</template>
```

## Hover

`trigger` 默认 `manual`（仅 `v-model`）。设为 `hover` / `click` / `focus` 由组件自行开关。

```vue preview
<script setup lang="ts">
import { WiButton, WiPopover } from '@well-insight/ui'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <WiPopover v-model="open" trigger="hover" :show-delay="80" :hide-delay="120">
    <WiButton label="Hover me" severity="secondary" />
    <template #content>
      <p style="margin:0">
        Opens on hover.
      </p>
    </template>
  </WiPopover>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | 可见性。配合 `v-model` 使用。 |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right' \| 'bottom-start' \| 'bottom-end'` | `'bottom'` | 相对触发元素的位置。 |
| `trigger` | `'manual' \| 'click' \| 'hover' \| 'focus'` | `'manual'` | 打开方式。 |
| `showDelay` / `hideDelay` | `number` | `0` / `200` | hover/focus 延迟（ms）。 |
| `teleport` | `boolean` | `true` | 浮层 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标；`'self'` / `false` 就地渲染。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `boolean` | 可见性变化。 |
| `show` | — | 打开时触发。 |
| `hide` | — | 关闭后触发。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 触发元素。 |
| `content` | 浮层内容。 |
