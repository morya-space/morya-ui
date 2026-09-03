---
title: Panel
category: 03 / DATA
description: 带可选折叠的内容面板。
---

# Panel

用于分组展示内容的面板，可开启折叠。

## 引入

```ts
import { WiPanel } from '@well-insight/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WiPanel } from '@well-insight/ui'
import { ref } from 'vue'

const collapsed = ref(false)
</script>

<template>
  <WiPanel v-model="collapsed" header="Panel" toggleable>
    <p style="margin:0">
      可折叠面板内容。
    </p>
    <template #footer>
      操作区
    </template>
  </WiPanel>
</template>
```

## Size

```vue preview
<script setup lang="ts">
import { WiPanel } from '@well-insight/ui'
</script>

<template>
  <WiPanel header="Small" size="small">
    <p style="margin:0">
      更紧凑的面板。
    </p>
  </WiPanel>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `header` | `string` | — | 标题文本。 |
| `toggleable` | `boolean` | `false` | 是否可折叠。 |
| `collapsed` | `boolean` | `false` | 折叠状态。 |
| `modelValue` | `boolean` | — | `collapsed` 的 `v-model` 别名。 |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 尺寸。 |
| `defaultCollapsed` | `boolean` | — | — |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:collapsed` | `boolean` | 折叠状态变化。 |
| `update:modelValue` | `boolean` | 同 `update:collapsed`。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 面板内容。 |
| `header` | 自定义标题。 |
| `footer` | 底部区域；折叠时隐藏。 |
