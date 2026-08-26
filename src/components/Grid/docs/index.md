---
title: Grid
category: 05 / PANEL
description: 基于 CSS Grid 的响应式栅格，配合 GridItem 控制跨列。
---

# Grid

24 列栅格布局（可用 `cols` 调整）。子项请使用 `WiGridItem`（别名 `WiGi`）。

## 引入

```ts
import { WiGrid, WiGridItem } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiGrid, WiGridItem } from '@well-insight/ui'
</script>

<template>
  <WiGrid :cols="4" :x-gap="12" :y-gap="12">
    <WiGridItem v-for="n in 4" :key="n" :span="1">
      <div style="padding:0.75rem;border:1px solid var(--wi-color-border);border-radius:var(--wi-radius-md)">
        {{ n }}
      </div>
    </WiGridItem>
  </WiGrid>
</template>
```

## Span & Offset

```vue preview
<script setup lang="ts">
import { WiGrid, WiGridItem } from '@well-insight/ui'
</script>

<template>
  <WiGrid :cols="6" :x-gap="12" :y-gap="12">
    <WiGridItem :span="2">
      <div style="padding:0.75rem;border:1px solid var(--wi-color-border);border-radius:var(--wi-radius-md)">span 2</div>
    </WiGridItem>
    <WiGridItem :span="2" :offset="1">
      <div style="padding:0.75rem;border:1px solid var(--wi-color-border);border-radius:var(--wi-radius-md)">offset 1</div>
    </WiGridItem>
  </WiGrid>
</template>
```

## Responsive

`cols` / `xGap` / `yGap` 与 `WiGridItem` 的 `span` / `offset` 均支持响应式字符串，例如 `1 s:2 m:3`（断点：`xs` `s` `m` `l` `xl` `2xl`）。

当 `cols` / 间距是普通数字、但 item 仍要用响应式 `span` 时，请打开 `itemResponsive`。

```vue preview
<script setup lang="ts">
import { WiGrid, WiGridItem } from '@well-insight/ui'
</script>

<template>
  <WiGrid cols="2 s:3 m:4" :x-gap="12" :y-gap="12" item-responsive>
    <WiGridItem v-for="n in 4" :key="n" span="1 m:2">
      <div style="padding:0.75rem;border:1px solid var(--wi-color-border);border-radius:var(--wi-radius-md)">
        {{ n }}
      </div>
    </WiGridItem>
  </WiGrid>
</template>
```

## Collapsed

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiGrid, WiGridItem, WiButton } from '@well-insight/ui'

const collapsed = ref(true)
</script>

<template>
  <div style="display:grid;gap:0.75rem">
    <WiButton size="small" :label="collapsed ? '展开' : '收起'" @click="collapsed = !collapsed" />
    <WiGrid :cols="4" :x-gap="8" :y-gap="8" :collapsed="collapsed" :collapsed-rows="1">
      <WiGridItem v-for="n in 6" :key="n" :span="1">
        <template #default="{ overflow }">
          <div style="padding:0.5rem;border:1px solid var(--wi-color-border);border-radius:var(--wi-radius-md)">
            {{ n }}{{ overflow && n > 4 ? '' : '' }}
          </div>
        </template>
      </WiGridItem>
      <WiGridItem suffix :span="1">
        <template #default="{ overflow }">
          <div style="padding:0.5rem;color:var(--wi-color-text-muted);font-size:0.75rem">
            {{ overflow ? '还有更多…' : '全部' }}
          </div>
        </template>
      </WiGridItem>
    </WiGrid>
  </div>
</template>
```

## Grid Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `cols` | `number \| string` | `24` | 列数，支持 `"1 s:2 m:3"` 响应式写法。 |
| `xGap` / `yGap` | `number \| string` | `0` | 列 / 行间距（px），同样支持响应式字符串。 |
| `responsive` | `'self' \| 'screen'` | `'self'` | 响应式依据容器宽度或视口宽度。 |
| `itemResponsive` | `boolean` | `false` | 强制按宽度解析 item 的 `span` / `offset`（即使 `cols` 为数字）。 |
| `collapsed` | `boolean` | `false` | 折叠超出行数的项。 |
| `collapsedRows` | `number` | `1` | 折叠时可见行数。 |
| `layoutShiftDisabled` | `boolean` | `false` | 关闭折叠/布局计算，退化为纯 CSS Grid。 |
| `itemStyle` | `string \| object` | — | 应用到每个 GridItem 的样式。 |

## GridItem Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `span` | `number \| string` | `1` | 跨列数。 |
| `offset` | `number \| string` | `0` | 左侧偏移列数。 |
| `suffix` | `boolean` | `false` | 折叠时固定在末尾（常用于「展开」）。 |

## GridItem Slots

| 插槽名 | 参数 | 说明 |
| --- | --- | --- |
| `default` | `{ overflow }` | 内容；`overflow` 表示是否有被折叠隐藏的项。 |
