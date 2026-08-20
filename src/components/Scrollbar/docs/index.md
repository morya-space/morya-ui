---
title: Scrollbar
category: 01 / PRIMITIVE
description: 可换肤自定义滚动条，提供一致的滚动体验。
---

# Scrollbar

用于替换浏览器原生滚动条，提供跨浏览器一致的可换肤滚动体验。

## 引入

```ts
import { WiScrollbar } from '@well-insight/ui'
```

## Basic

用 `height` 固定可视区域高度；不设时跟随父容器高度。

```vue preview
<script setup lang="ts">
import { WiScrollbar } from '@well-insight/ui'
</script>

<template>
  <WiScrollbar height="240px" always style="width: 200px">
    <p
      v-for="item in 20"
      :key="item"
      style="
        display:flex;align-items:center;justify-content:center;
        height:48px;margin:8px;border-radius:6px;
        background:color-mix(in srgb, var(--wi-color-primary) 12%, transparent);
        color:var(--wi-color-primary);
      "
    >
      {{ item }}
    </p>
  </WiScrollbar>
</template>
```

## Max height

仅当内容超出 `max-height` 时出现滚动条。

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiButton, WiScrollbar } from '@well-insight/ui'

const count = ref(3)
</script>

<template>
  <div style="display:grid;gap:0.75rem">
    <div style="display:flex;gap:0.5rem">
      <WiButton label="Add" size="small" @click="count++" />
      <WiButton label="Remove" severity="secondary" size="small" @click="count = Math.max(0, count - 1)" />
    </div>
    <WiScrollbar max-height="220px" always style="width: 200px">
      <p
        v-for="item in count"
        :key="item"
        style="
          display:flex;align-items:center;justify-content:center;
          height:48px;margin:8px;border-radius:6px;
          background:color-mix(in srgb, var(--wi-color-info) 12%, transparent);
          color:var(--wi-color-info);
        "
      >
        Item {{ item }}
      </p>
    </WiScrollbar>
  </div>
</template>
```

## Horizontal

内容宽度超出容器时显示横向滚动条。

```vue preview
<script setup lang="ts">
import { WiScrollbar } from '@well-insight/ui'
</script>

<template>
  <WiScrollbar always>
    <div style="display:flex;width:fit-content">
      <p
        v-for="item in 30"
        :key="item"
        style="
          flex-shrink:0;display:flex;align-items:center;justify-content:center;
          width:96px;height:48px;margin:8px;border-radius:6px;
          background:color-mix(in srgb, var(--wi-color-danger) 12%, transparent);
          color:var(--wi-color-danger);
        "
      >
        {{ item }}
      </p>
    </div>
  </WiScrollbar>
</template>
```

## Always / Native

`always` 常显自定义滑块；`native` 使用浏览器原生滚动条。

```vue preview
<script setup lang="ts">
import { WiScrollbar } from '@well-insight/ui'
</script>

<template>
  <div style="display:grid;gap:1.25rem;grid-template-columns:1fr 1fr">
    <div>
      <p style="margin:0 0 0.5rem;color:var(--wi-color-text-muted)">always</p>
      <WiScrollbar height="160px" always>
        <p v-for="n in 12" :key="n" style="margin:0.5rem 0">Line {{ n }}</p>
      </WiScrollbar>
    </div>
    <div>
      <p style="margin:0 0 0.5rem;color:var(--wi-color-text-muted)">native</p>
      <WiScrollbar height="160px" native  style="width: 200px">
        <p v-for="n in 12" :key="n" style="margin:0.5rem 0">Line {{ n }}</p>
      </WiScrollbar>
    </div>
  </div>
</template>
```

## Manual scroll

通过实例方法 `setScrollTop` / `setScrollLeft` / `scrollTo` / `update` 控制滚动。

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiButton, WiScrollbar } from '@well-insight/ui'
import type { ScrollbarInstance } from '@well-insight/ui'

const scrollbarRef = ref<ScrollbarInstance>()
const scrollTop = ref(0)

function jump(top: number) {
  scrollbarRef.value?.setScrollTop(top)
}

function onScroll(payload: { scrollTop: number }) {
  scrollTop.value = Math.round(payload.scrollTop)
}
</script>

<template>
  <div style="display:grid;gap:0.75rem">
    <div style="display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center">
      <WiButton label="Top" size="small" @click="jump(0)" />
      <WiButton label="Mid" size="small" severity="secondary" @click="jump(200)" />
      <WiButton label="Bottom" size="small" severity="secondary" @click="jump(9999)" />
      <span style="color:var(--wi-color-text-muted);font-size:0.875rem">scrollTop: {{ scrollTop }}</span>
    </div>
    <WiScrollbar ref="scrollbarRef" height="200px" style="width: 200px" always @scroll="onScroll">
      <p
        v-for="item in 24"
        :key="item"
        style="
          display:flex;align-items:center;justify-content:center;
          height:48px;margin:8px;border-radius:6px;
          background:color-mix(in srgb, var(--wi-color-success) 12%, transparent);
          color:var(--wi-color-success);
        "
      >
        {{ item }}
      </p>
    </WiScrollbar>
  </div>
</template>
```

## Infinite scroll

滚动到边缘时触发 `end-reached`，可用于无限加载。

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiScrollbar } from '@well-insight/ui'
import type { ScrollbarDirection } from '@well-insight/ui'

const num = ref(20)

function loadMore(direction: ScrollbarDirection) {
  if (direction === 'bottom') num.value += 5
}
</script>

<template>
  <WiScrollbar height="220px" always @end-reached="loadMore" style="width: 200px">
    <p
      v-for="item in num"
      :key="item"
      style="
        display:flex;align-items:center;justify-content:center;
        height:48px;margin:8px;border-radius:6px;
        background:color-mix(in srgb, var(--wi-color-primary) 12%, transparent);
        color:var(--wi-color-primary);
      "
    >
      {{ item }}
    </p>
  </WiScrollbar>
</template>
```

## API

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| height | `string \| number` | — | 可视区域高度 |
| maxHeight | `string \| number` | — | 最大高度 |
| native | `boolean` | `false` | 使用原生滚动条 |
| wrapStyle / wrapClass | style / class | — | wrap 容器样式 |
| viewStyle / viewClass | style / class | — | 内容区样式 |
| noresize | `boolean` | `false` | 不监听尺寸变化 |
| tag | `string` | `div` | 内容区标签 |
| always | `boolean` | `false` | 始终显示滑块 |
| minSize | `number` | `20` | 滑块最小尺寸 |
| id / role / ariaLabel / ariaOrientation | a11y | — | 内容区无障碍属性 |
| tabindex | `number \| string` | — | wrap 的 tabindex |
| distance | `number` | `0` | 触发 `end-reached` 的边缘距离 |

### Events

| Name | Payload |
| --- | --- |
| scroll | `{ scrollTop, scrollLeft }` |
| end-reached | `'top' \| 'bottom' \| 'left' \| 'right'` |

### Expose

`wrapRef`、`update`、`scrollTo`、`setScrollTop`、`setScrollLeft`、`handleScroll`
