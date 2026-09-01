---
title: Space
category: 05 / PANEL
description: 在子元素之间自动加入一致间距的布局容器。
---

# Space

在子元素之间自动加入间距。新项目更推荐使用 [`Flex`](/components/Flex/)（直接用 `gap`）。

## 引入

```ts
import { WiSpace } from '@well-insight/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WiButton, WiSpace } from '@well-insight/ui'
</script>

<template>
  <WiSpace>
    <WiButton label="保存" size="small" />
    <WiButton label="取消" size="small" severity="secondary" />
    <WiButton label="重置" size="small" severity="secondary" />
  </WiSpace>
</template>
```

## Vertical

```vue preview
<script setup lang="ts">
import { WiSpace, WiTag } from '@well-insight/ui'
</script>

<template>
  <WiSpace vertical>
    <WiTag value="Alpha" />
    <WiTag value="Bravo" />
    <WiTag value="Charlie" />
  </WiSpace>
</template>
```

## Size

```vue preview
<script setup lang="ts">
import { WiButton, WiSpace } from '@well-insight/ui'
</script>

<template>
  <div style="display:grid;gap:1rem">
    <WiSpace size="small">
      <WiButton label="S" size="small" />
      <WiButton label="S" size="small" severity="secondary" />
    </WiSpace>
    <WiSpace :size="20">
      <WiButton label="20px" size="small" />
      <WiButton label="20px" size="small" severity="secondary" />
    </WiSpace>
  </div>
</template>
```

未传 `size` 时默认 `medium`。可用 `WiConfigProvider` 的 `componentDefaults.Space.size` 改全局间距（与控件 `size` 无关）。

## Without Item Wrapper

`wrapItem=false` 时不再包一层，子节点直接参与 flex 布局（适合已有自身间距的元素）。

```vue preview
<script setup lang="ts">
import { WiSpace, WiTag } from '@well-insight/ui'
</script>

<template>
  <WiSpace :wrap-item="false" :size="8">
    <WiTag value="Direct" />
    <WiTag value="Children" />
  </WiSpace>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `align` | `'start' \| 'end' \| 'center' \| 'baseline' \| 'stretch'` | — | 交叉轴对齐。 |
| `justify` | `'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between' \| 'space-evenly'` | `'start'` | 主轴对齐。 |
| `inline` | `boolean` | `false` | 是否为 `inline-flex`。 |
| `vertical` | `boolean` | `false` | 纵向排列。 |
| `reverse` | `boolean` | `false` | 主轴反向。 |
| `size` | `'small' \| 'medium' \| 'large' \| number \| [number, number]` | `'medium'` | 间距。 |
| `wrap` | `boolean` | `true` | 是否换行。 |
| `wrapItem` | `boolean` | `true` | 是否用容器包裹每个子节点。 |
| `itemClass` / `itemStyle` | — | — | 包裹层 class / style（`wrapItem` 为 true 时生效）。 |
