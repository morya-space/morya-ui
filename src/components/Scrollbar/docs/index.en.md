---
title: Scrollbar
category: 01 / BASIC
description: Themeable custom scrollbar for a consistent scrolling experience.
---

# Scrollbar

Replaces the native browser scrollbar with a themeable, cross-browser scrolling experience.

## Import

```ts
import { RdScrollbar } from '@wise-kit/ui'
```

## Basic

Use `height` to fix the viewport height. If omitted, it follows the parent height.

```vue preview
<script setup lang="ts">
import { RdScrollbar } from '@wise-kit/ui'
</script>

<template>
  <RdScrollbar height="240px" always style="width: 200px">
    <p
      v-for="item in 20"
      :key="item"
      style="
        display:flex;align-items:center;justify-content:center;
        height:48px;margin:8px;border-radius:6px;
        background:color-mix(in srgb, var(--rd-color-primary) 12%, transparent);
        color:var(--rd-color-primary);
      "
    >
      {{ item }}
    </p>
  </RdScrollbar>
</template>
```

## Max height

The scrollbar appears only when content exceeds `max-height`.

```vue preview
<script setup lang="ts">
import { RdButton, RdScrollbar } from '@wise-kit/ui'
import { ref } from 'vue'

const count = ref(3)
</script>

<template>
  <div style="display:grid;gap:0.75rem">
    <div style="display:flex;gap:0.5rem">
      <RdButton label="Add" size="small" @click="count++" />
      <RdButton label="Remove" severity="secondary" size="small" @click="count = Math.max(0, count - 1)" />
    </div>
    <RdScrollbar max-height="220px" always style="width: 200px">
      <p
        v-for="item in count"
        :key="item"
        style="
          display:flex;align-items:center;justify-content:center;
          height:48px;margin:8px;border-radius:6px;
          background:color-mix(in srgb, var(--rd-color-info) 12%, transparent);
          color:var(--rd-color-info);
        "
      >
        Item {{ item }}
      </p>
    </RdScrollbar>
  </div>
</template>
```

## Horizontal

A horizontal scrollbar appears when content is wider than the container. `trigger="none"` and `always` keep the thumb visible; the default `trigger="hover"` shows it on hover.

`RdLayout` uses this component when `native-scrollbar={false}`.

```vue preview
<script setup lang="ts">
import { RdScrollbar } from '@wise-kit/ui'
</script>

<template>
  <RdScrollbar always>
    <div style="display:flex;width:fit-content">
      <p
        v-for="item in 30"
        :key="item"
        style="
          flex-shrink:0;display:flex;align-items:center;justify-content:center;
          width:96px;height:48px;margin:8px;border-radius:6px;
          background:color-mix(in srgb, var(--rd-color-danger) 12%, transparent);
          color:var(--rd-color-danger);
        "
      >
        {{ item }}
      </p>
    </div>
  </RdScrollbar>
</template>
```

## Always / Native

`always` keeps the custom thumb visible. `native` uses the browser scrollbar.

```vue preview
<script setup lang="ts">
import { RdScrollbar } from '@wise-kit/ui'
</script>

<template>
  <div style="display:grid;gap:1.25rem;grid-template-columns:1fr 1fr">
    <div>
      <p style="margin:0 0 0.5rem;color:var(--rd-color-text-muted)">
        always
      </p>
      <RdScrollbar height="160px" always>
        <p v-for="n in 12" :key="n" style="margin:0.5rem 0">
          Line {{ n }}
        </p>
      </RdScrollbar>
    </div>
    <div>
      <p style="margin:0 0 0.5rem;color:var(--rd-color-text-muted)">
        native
      </p>
      <RdScrollbar height="160px" native style="width: 200px">
        <p v-for="n in 12" :key="n" style="margin:0.5rem 0">
          Line {{ n }}
        </p>
      </RdScrollbar>
    </div>
  </div>
</template>
```

## Manual scroll

Control scrolling with instance methods `setScrollTop` / `setScrollLeft` / `scrollTo` / `update`.

```vue preview
<script setup lang="ts">
import type { ScrollbarInstance } from '@wise-kit/ui'
import { RdButton, RdScrollbar } from '@wise-kit/ui'
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
      <RdButton label="Top" size="small" @click="jump(0)" />
      <RdButton label="Mid" size="small" severity="secondary" @click="jump(200)" />
      <RdButton label="Bottom" size="small" severity="secondary" @click="jump(9999)" />
      <span style="color:var(--rd-color-text-muted);font-size:0.875rem">scrollTop: {{ scrollTop }}</span>
    </div>
    <RdScrollbar ref="scrollbarRef" height="200px" always style="width: 200px" @scroll="onScroll">
      <p
        v-for="item in 24"
        :key="item"
        style="
          display:flex;align-items:center;justify-content:center;
          height:48px;margin:8px;border-radius:6px;
          background:color-mix(in srgb, var(--rd-color-success) 12%, transparent);
          color:var(--rd-color-success);
        "
      >
        {{ item }}
      </p>
    </RdScrollbar>
  </div>
</template>
```

## Infinite scroll

Emits `end-reached` at the edge. Use it for infinite loading.

```vue preview
<script setup lang="ts">
import type { ScrollbarDirection } from '@wise-kit/ui'
import { RdScrollbar } from '@wise-kit/ui'
import { ref } from 'vue'

const num = ref(20)

function loadMore(direction: ScrollbarDirection) {
  if (direction === 'bottom') num.value += 5
}
</script>

<template>
  <RdScrollbar height="220px" style="width: 200px" always @end-reached="loadMore">
    <p
      v-for="item in num"
      :key="item"
      style="
        display:flex;align-items:center;justify-content:center;
        height:48px;margin:8px;border-radius:6px;
        background:color-mix(in srgb, var(--rd-color-primary) 12%, transparent);
        color:var(--rd-color-primary);
      "
    >
      {{ item }}
    </p>
  </RdScrollbar>
</template>
```

## API

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| height | `string \| number` | — | Viewport height |
| maxHeight | `string \| number` | — | Maximum height |
| native | `boolean` | `false` | Use the native scrollbar |
| wrapStyle / wrapClass | style / class | — | Wrap container styles |
| viewStyle / viewClass | style / class | — | Content area styles |
| noresize | `boolean` | `false` | Do not listen for size changes |
| tag | `string` | `div` | Content area tag |
| always | `boolean` | `false` | Always show the thumb |
| trigger | `'hover' \| 'none'` | `'hover'` | `none` keeps thumbs visible; `always` still wins |
| minSize | `number` | `20` | Minimum thumb size |
| id / role / ariaLabel / ariaOrientation | a11y | — | Accessible attributes for the content area |
| tabindex | `number \| string` | — | tabindex on the wrap |
| distance | `number` | `0` | Edge distance that triggers `end-reached` |

### Events

| Name | Payload |
| --- | --- |
| scroll | `{ scrollTop, scrollLeft }` |
| end-reached | `'top' \| 'bottom' \| 'left' \| 'right'` |

### Expose

`wrapRef`, `update`, `scrollTo`, `setScrollTop`, `setScrollLeft`, `handleScroll`

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `scroll` | `{ scrollTop, scrollLeft }` | Scroll position change. |
| `end-reached` | `'top' \| 'bottom' \| 'left' \| 'right'` | Scroll boundary reached. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Scrollable content. |
