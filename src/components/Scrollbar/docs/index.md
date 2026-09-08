---
title: Scrollbar
category: 01 / BASIC
description: 可换肤自定义滚动条，提供一致的滚动体验。
---

# Scrollbar

用于替换浏览器原生滚动条，提供跨浏览器一致的可换肤滚动体验。

## 引入

```ts
import { WkScrollbar } from '@wise-kit/ui'
```

## 基础用法

用 `height` 固定可视区域高度；不设时跟随父容器高度。

```vue preview
<script setup lang="ts">
import { WkScrollbar } from '@wise-kit/ui'
</script>

<template>
  <WkScrollbar height="240px" always style="width: 200px">
    <p
      v-for="item in 20"
      :key="item"
      style="
        display:flex;align-items:center;justify-content:center;
        height:48px;margin:8px;border-radius:6px;
        background:color-mix(in srgb, var(--wk-color-primary) 12%, transparent);
        color:var(--wk-color-primary);
      "
    >
      {{ item }}
    </p>
  </WkScrollbar>
</template>
```

## Max height

仅当内容超出 `max-height` 时出现滚动条。

```vue preview
<script setup lang="ts">
import { WkButton, WkScrollbar } from '@wise-kit/ui'
import { ref } from 'vue'

const count = ref(3)
</script>

<template>
  <div style="display:grid;gap:0.75rem">
    <div style="display:flex;gap:0.5rem">
      <WkButton label="Add" size="small" @click="count++" />
      <WkButton label="Remove" severity="secondary" size="small" @click="count = Math.max(0, count - 1)" />
    </div>
    <WkScrollbar max-height="220px" always style="width: 200px">
      <p
        v-for="item in count"
        :key="item"
        style="
          display:flex;align-items:center;justify-content:center;
          height:48px;margin:8px;border-radius:6px;
          background:color-mix(in srgb, var(--wk-color-info) 12%, transparent);
          color:var(--wk-color-info);
        "
      >
        Item {{ item }}
      </p>
    </WkScrollbar>
  </div>
</template>
```

## Horizontal

内容宽度超出容器时显示横向滚动条。`trigger="none"` 与 `always` 都会常显滑块；默认 `trigger="hover"` 在悬停时显示。

`WkLayout` 在 `native-scrollbar={false}` 时会接入本组件。

```vue preview
<script setup lang="ts">
import { WkScrollbar } from '@wise-kit/ui'
</script>

<template>
  <WkScrollbar always>
    <div style="display:flex;width:fit-content">
      <p
        v-for="item in 30"
        :key="item"
        style="
          flex-shrink:0;display:flex;align-items:center;justify-content:center;
          width:96px;height:48px;margin:8px;border-radius:6px;
          background:color-mix(in srgb, var(--wk-color-danger) 12%, transparent);
          color:var(--wk-color-danger);
        "
      >
        {{ item }}
      </p>
    </div>
  </WkScrollbar>
</template>
```

## Always / Native

`always` 常显自定义滑块；`native` 使用浏览器原生滚动条。

```vue preview
<script setup lang="ts">
import { WkScrollbar } from '@wise-kit/ui'
</script>

<template>
  <div style="display:grid;gap:1.25rem;grid-template-columns:1fr 1fr">
    <div>
      <p style="margin:0 0 0.5rem;color:var(--wk-color-text-muted)">
        always
      </p>
      <WkScrollbar height="160px" always>
        <p v-for="n in 12" :key="n" style="margin:0.5rem 0">
          Line {{ n }}
        </p>
      </WkScrollbar>
    </div>
    <div>
      <p style="margin:0 0 0.5rem;color:var(--wk-color-text-muted)">
        native
      </p>
      <WkScrollbar height="160px" native style="width: 200px">
        <p v-for="n in 12" :key="n" style="margin:0.5rem 0">
          Line {{ n }}
        </p>
      </WkScrollbar>
    </div>
  </div>
</template>
```

## Manual scroll

通过实例方法 `setScrollTop` / `setScrollLeft` / `scrollTo` / `update` 控制滚动。

```vue preview
<script setup lang="ts">
import type { ScrollbarInstance } from '@wise-kit/ui'
import { WkButton, WkScrollbar } from '@wise-kit/ui'
import { ref } from 'vue'

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
      <WkButton label="Top" size="small" @click="jump(0)" />
      <WkButton label="Mid" size="small" severity="secondary" @click="jump(200)" />
      <WkButton label="Bottom" size="small" severity="secondary" @click="jump(9999)" />
      <span style="color:var(--wk-color-text-muted);font-size:0.875rem">scrollTop: {{ scrollTop }}</span>
    </div>
    <WkScrollbar ref="scrollbarRef" height="200px" style="width: 200px" always @scroll="onScroll">
      <p
        v-for="item in 24"
        :key="item"
        style="
          display:flex;align-items:center;justify-content:center;
          height:48px;margin:8px;border-radius:6px;
          background:color-mix(in srgb, var(--wk-color-success) 12%, transparent);
          color:var(--wk-color-success);
        "
      >
        {{ item }}
      </p>
    </WkScrollbar>
  </div>
</template>
```

## Infinite scroll

滚动到边缘时触发 `end-reached`，可用于无限加载。

```vue preview
<script setup lang="ts">
import type { ScrollbarDirection } from '@wise-kit/ui'
import { WkScrollbar } from '@wise-kit/ui'
import { ref } from 'vue'

const num = ref(20)

function loadMore(direction: ScrollbarDirection) {
  if (direction === 'bottom') num.value += 5
}
</script>

<template>
  <WkScrollbar height="220px" always style="width: 200px" @end-reached="loadMore">
    <p
      v-for="item in num"
      :key="item"
      style="
        display:flex;align-items:center;justify-content:center;
        height:48px;margin:8px;border-radius:6px;
        background:color-mix(in srgb, var(--wk-color-primary) 12%, transparent);
        color:var(--wk-color-primary);
      "
    >
      {{ item }}
    </p>
  </WkScrollbar>
</template>
```

## API

### Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `always` | `boolean` | — | — |
| `ariaLabel` | `string` | — | — |
| `ariaOrientation` | `ScrollbarAriaOrientation` | — | — |
| `distance` | `number` | — | — |
| `height` | `string \| number` | — | — |
| `id` | `string` | — | — |
| `maxHeight` | `string \| number` | — | — |
| `minSize` | `number` | — | — |
| `native` | `boolean` | — | — |
| `noresize` | `boolean` | — | — |
| `role` | `string` | — | — |
| `tabindex` | `number \| string` | — | — |
| `tag` | `string` | — | — |
| `trigger` | `'hover' \| 'none'` | — | — |
| `viewClass` | `ScrollbarClassValue` | — | — |
| `viewStyle` | `StyleValue` | — | — |
| `wrapClass` | `ScrollbarClassValue` | — | — |
| `wrapStyle` | `StyleValue` | — | — |

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| height | `string \| number` | — | 可视区域高度 |
| maxHeight | `string \| number` | — | 最大高度 |
| fitContent | `boolean` | `false` | 随内容增高，配合根节点 CSS `max-height` 使用（下拉面板） |
| native | `boolean` | `false` | 使用原生滚动条 |
| wrapStyle / wrapClass | style / class | — | wrap 容器样式 |
| viewStyle / viewClass | style / class | — | 内容区样式 |
| noresize | `boolean` | `false` | 不监听尺寸变化 |
| tag | `string` | `div` | 内容区标签 |
| always | `boolean` | `false` | 始终显示滑块 |
| trigger | `'hover' \| 'none'` | `'hover'` | `none` 常显滑块；`always` 为 true 时仍常显 |
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

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `scroll` | `{ scrollTop, scrollLeft }` | 滚动位置变化。 |
| `end-reached` | `'top' \| 'bottom' \| 'left' \| 'right'` | 滚动到边缘。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 可滚动内容。 |
