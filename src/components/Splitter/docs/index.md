---
title: Splitter
category: 06 / LAYOUT
description: 双栏分割布局，支持水平 / 垂直与拖拽调整比例。
---

# Splitter

将内容拆成两个可并排或上下排列的区域，拖动分隔条即可调整比例。对齐 Naive `n-split` 的常用能力，同时保留 Wi 百分比用法。

## 引入

```ts
import { WiSplitter } from '@well-insight/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WiSplitter } from '@well-insight/ui'
</script>

<template>
  <WiSplitter style="min-height: 8rem; border: 1px solid var(--wi-color-border); border-radius: var(--wi-radius-md); overflow: hidden">
    <template #panel1>
      <div style="padding: 0.75rem">
        Panel A — 拖中间分隔条
      </div>
    </template>
    <template #panel2>
      <div style="padding: 0.75rem">
        Panel B
      </div>
    </template>
  </WiSplitter>
</template>
```

## Vertical / direction

`layout` 与 Naive 风格的 `direction` 等价。

```vue preview
<script setup lang="ts">
import { WiSplitter } from '@well-insight/ui'
</script>

<template>
  <WiSplitter direction="vertical" style="min-height: 10rem; border: 1px solid var(--wi-color-border); border-radius: var(--wi-radius-md); overflow: hidden">
    <template #panel1>
      <div style="padding: 0.75rem">
        Top
      </div>
    </template>
    <template #panel2>
      <div style="padding: 0.75rem">
        Bottom
      </div>
    </template>
  </WiSplitter>
</template>
```

## Size modes

- `number > 1`：百分比（Wi 默认，如 `35` → 35%）
- `number ≤ 1`：比例（Naive，如 `0.35` → 35%）
- `string`：像素（如 `'120px'`）

```vue preview
<script setup lang="ts">
import { WiSplitter } from '@well-insight/ui'
import { ref } from 'vue'

const percent = ref(40)
const ratio = ref(0.3)
</script>

<template>
  <div style="display:grid;gap:1rem">
    <WiSplitter
      v-model:size="percent"
      style="min-height: 7rem; border: 1px solid var(--wi-color-border); border-radius: var(--wi-radius-md); overflow: hidden"
    >
      <template #panel1>
        <div style="padding:0.75rem">
          {{ percent }}%
        </div>
      </template>
      <template #panel2>
        <div style="padding:0.75rem">
          rest
        </div>
      </template>
    </WiSplitter>
    <WiSplitter
      v-model:size="ratio"
      :min="0.15"
      :max="0.85"
      style="min-height: 7rem; border: 1px solid var(--wi-color-border); border-radius: var(--wi-radius-md); overflow: hidden"
    >
      <template #panel1>
        <div style="padding:0.75rem">
          ratio {{ ratio }}
        </div>
      </template>
      <template #panel2>
        <div style="padding:0.75rem">
          rest
        </div>
      </template>
    </WiSplitter>
  </div>
</template>
```

## Disabled

```vue preview
<script setup lang="ts">
import { WiSplitter } from '@well-insight/ui'
</script>

<template>
  <WiSplitter disabled :size="40" style="min-height: 7rem; border: 1px solid var(--wi-color-border); border-radius: var(--wi-radius-md); overflow: hidden">
    <template #panel1>
      <div style="padding:0.75rem">
        不可拖拽
      </div>
    </template>
    <template #panel2>
      <div style="padding:0.75rem">
        B
      </div>
    </template>
  </WiSplitter>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `layout` | `'horizontal' \| 'vertical'` | `'horizontal'` | 分割方向。 |
| `direction` | 同上 | — | `layout` 别名（Naive）。 |
| `size` | `number \| string` | — | 受控尺寸；`>1` 为 `%`，`≤1` 为比例，`'Npx'` 为像素。 |
| `defaultSize` | `number \| string` | `50` | 非受控初始尺寸。 |
| `min` / `max` | `number \| string` | 随模式 | 下限 / 上限（单位与 `size` 一致）。 |
| `disabled` | `boolean` | `false` | 禁用拖拽与键盘调整。 |
| `resizeTriggerSize` | `number` | `6` | 分隔条厚度（px）。 |
| `pane1Class` / `pane1Style` | — | — | 主面板 class / style。 |
| `pane2Class` / `pane2Style` | — | — | 次面板 class / style。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `panel1` / `1` | 左侧 / 上方面板。 |
| `panel2` / `2` | 右侧 / 下方面板。 |
| `resize-trigger` | 自定义分隔条内容。 |
| `default` | 未使用命名插槽时取前两个子节点。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:size` | `number \| string` | 尺寸变化。 |
| `resize` | 同上 | 便于单独监听。 |
| `drag-start` / `drag-move` / `drag-end` | `Event` | 拖拽生命周期。 |
