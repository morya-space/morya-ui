---
title: Layout
category: 06 / LAYOUT
description: 页面级布局骨架，含 Header / Sider / Content / Footer。
---

# Layout

页面级布局容器。侧栏场景需在对应 `RdLayout` 上设置 `has-sider`。给根布局固定高度（或 `min-height`）后，`RdLayoutContent` 会自动撑满剩余空间。

## 引入

```ts
import {
  RdLayout,
  RdLayoutContent,
  RdLayoutFooter,
  RdLayoutHeader,
  RdLayoutSider,
} from '@roost-design/ui'
```

## 基础用法

Header / Content / Footer。Content 会占满中间剩余高度。

```vue preview
<script setup lang="ts">
import { RdLayout, RdLayoutContent, RdLayoutFooter, RdLayoutHeader } from '@roost-design/ui'
</script>

<template>
  <RdLayout style="height:16rem;border:1px solid var(--rd-color-border);border-radius:var(--rd-radius-md);overflow:hidden">
    <RdLayoutHeader bordered style="padding:0.75rem 1rem">
      Header
    </RdLayoutHeader>
    <RdLayoutContent embedded content-style="padding:1rem;display:flex;align-items:center;justify-content:center">
      Content（自动撑开）
    </RdLayoutContent>
    <RdLayoutFooter bordered style="padding:0.75rem 1rem">
      Footer
    </RdLayoutFooter>
  </RdLayout>
</template>
```

## With Sider

顶栏 + 左侧栏 + 主内容。内层 `has-sider` 的 Layout 会吃掉 Header 以下的全部高度。

```vue preview
<script setup lang="ts">
import {
  RdLayout,
  RdLayoutContent,
  RdLayoutHeader,
  RdLayoutSider,
} from '@roost-design/ui'
import { ref } from 'vue'

const collapsed = ref(false)
</script>

<template>
  <RdLayout style="height:16rem;border:1px solid var(--rd-color-border);border-radius:var(--rd-radius-md);overflow:hidden">
    <RdLayoutHeader bordered style="padding:0.75rem 1rem;display:flex;align-items:center;justify-content:space-between">
      <strong>App</strong>
      <span style="color:var(--rd-color-text-muted);font-size:0.75rem">{{ collapsed ? '已折叠' : '已展开' }}</span>
    </RdLayoutHeader>
    <RdLayout has-sider>
      <RdLayoutSider
        v-model:collapsed="collapsed"
        bordered
        show-trigger="arrow-circle"
        :width="160"
        content-style="padding:0.75rem"
      >
        <div style="display:grid;gap:0.5rem">
          <div>概览</div>
          <div>项目</div>
          <div>设置</div>
        </div>
      </RdLayoutSider>
      <RdLayoutContent embedded content-style="padding:1rem">
        主内容区会横向、纵向同时撑满。
      </RdLayoutContent>
    </RdLayout>
  </RdLayout>
</template>
```

## Right Sider

```vue preview
<script setup lang="ts">
import {
  RdLayout,
  RdLayoutContent,
  RdLayoutHeader,
  RdLayoutSider,
} from '@roost-design/ui'
</script>

<template>
  <RdLayout style="height:14rem;border:1px solid var(--rd-color-border);border-radius:var(--rd-radius-md);overflow:hidden">
    <RdLayoutHeader bordered style="padding:0.75rem 1rem">
      Inspector
    </RdLayoutHeader>
    <RdLayout has-sider sider-placement="right">
      <RdLayoutSider bordered :width="140" content-style="padding:0.75rem">
        属性面板
      </RdLayoutSider>
      <RdLayoutContent embedded content-style="padding:1rem">
        画布 / 主区域
      </RdLayoutContent>
    </RdLayout>
  </RdLayout>
</template>
```

## Full Shell

完整后台骨架：顶栏 + 侧栏 + 内容 + 底栏。

```vue preview
<script setup lang="ts">
import {
  RdButton,
  RdLayout,
  RdLayoutContent,
  RdLayoutFooter,
  RdLayoutHeader,
  RdLayoutSider,
  RdTag,
} from '@roost-design/ui'
import { ref } from 'vue'

const collapsed = ref(false)
</script>

<template>
  <RdLayout style="height:18rem;border:1px solid var(--rd-color-border);border-radius:var(--rd-radius-md);overflow:hidden">
    <RdLayoutHeader
      bordered
      inverted
      style="padding:0.65rem 1rem;display:flex;align-items:center;gap:0.75rem"
    >
      <strong>Roost Design</strong>
      <RdTag value="Studio" />
      <span style="flex:1" />
      <RdButton size="small" label="发布" />
    </RdLayoutHeader>

    <RdLayout has-sider>
      <RdLayoutSider
        v-model:collapsed="collapsed"
        bordered
        inverted
        show-trigger="bar"
        :width="168"
        :collapsed-width="56"
        content-style="padding:0.75rem"
      >
        <div style="display:grid;gap:0.65rem;font-size:0.875rem">
          <div>仪表盘</div>
          <div>数据源</div>
          <div>组件</div>
          <div>主题</div>
        </div>
      </RdLayoutSider>

      <RdLayout>
        <RdLayoutContent embedded content-style="padding:1rem;display:grid;gap:0.75rem;align-content:start">
          <strong>工作区</strong>
          <p style="margin:0;color:var(--rd-color-text-muted);font-size:0.875rem">
            Content 已撑满 Header 与 Footer 之间的空间；侧栏折叠不影响主区高度。
          </p>
        </RdLayoutContent>
        <RdLayoutFooter bordered style="padding:0.5rem 1rem;color:var(--rd-color-text-muted);font-size:0.75rem">
          Ready · local
        </RdLayoutFooter>
      </RdLayout>
    </RdLayout>
  </RdLayout>
</template>
```

## Embedded Content

`embedded` 给内容区柔和背景，便于和顶栏/侧栏区分。

```vue preview
<script setup lang="ts">
import { RdLayout, RdLayoutContent, RdLayoutHeader } from '@roost-design/ui'
</script>

<template>
  <RdLayout style="height:12rem;border:1px solid var(--rd-color-border);border-radius:var(--rd-radius-md);overflow:hidden">
    <RdLayoutHeader bordered style="padding:0.75rem 1rem">
      Settings
    </RdLayoutHeader>
    <RdLayoutContent embedded content-style="padding:1rem">
      嵌套表单 / 列表放在这里。
    </RdLayoutContent>
  </RdLayout>
</template>
```

## Scrollable Content

内容超出时仅 Content 区域滚动，Header / Sider 保持固定。

```vue preview
<script setup lang="ts">
import {
  RdLayout,
  RdLayoutContent,
  RdLayoutHeader,
  RdLayoutSider,
} from '@roost-design/ui'
</script>

<template>
  <RdLayout style="height:14rem;border:1px solid var(--rd-color-border);border-radius:var(--rd-radius-md);overflow:hidden">
    <RdLayoutHeader bordered style="padding:0.75rem 1rem">
      Scroll demo
    </RdLayoutHeader>
    <RdLayout has-sider>
      <RdLayoutSider bordered :width="120" content-style="padding:0.75rem">
        固定侧栏
      </RdLayoutSider>
      <RdLayoutContent embedded content-style="padding:1rem">
        <div style="display:grid;gap:0.5rem">
          <div v-for="n in 20" :key="n">
            行 {{ n }} — 向下滚动
          </div>
        </div>
      </RdLayoutContent>
    </RdLayout>
  </RdLayout>
</template>
```

## Absolute Shell

根布局 `position="absolute"` 铺满父级（父级需 `position: relative` + 明确高度）。

```vue preview
<script setup lang="ts">
import {
  RdLayout,
  RdLayoutContent,
  RdLayoutHeader,
  RdLayoutSider,
} from '@roost-design/ui'
</script>

<template>
  <div style="position:relative;height:14rem;border:1px solid var(--rd-color-border);border-radius:var(--rd-radius-md);overflow:hidden">
    <RdLayout position="absolute" has-sider>
      <RdLayoutSider bordered :width="120" content-style="padding:0.75rem">
        Nav
      </RdLayoutSider>
      <RdLayout>
        <RdLayoutHeader bordered style="padding:0.75rem 1rem">
          Absolute layout
        </RdLayoutHeader>
        <RdLayoutContent embedded content-style="padding:1rem">
          填满相对定位容器
        </RdLayoutContent>
      </RdLayout>
    </RdLayout>
  </div>
</template>
```

## Layout Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `hasSider` | `boolean` | `false` | 横向容纳 `RdLayoutSider`。 |
| `siderPlacement` | `'left' \| 'right'` | `'left'` | 侧栏位置。 |
| `embedded` | `boolean` | `false` | 柔和背景（嵌套内容区）。 |
| `position` | `'static' \| 'absolute'` | `'static'` | 定位模式。 |
| `contentClass` / `contentStyle` | — | — | 滚动容器 class / style。 |
| `height` | `number \| string` | — | — |
| `padding` | `number \| string` | — | — |
| `radius` | `number \| string` | — | — |

## LayoutSider Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `width` | `number \| string` | `272` | 展开宽度（始终写在 `width` 上）。 |
| `collapsedWidth` | `number` | `48` | 折叠时的 `max-width`。 |
| `collapsed` | `boolean` | — | 折叠状态，支持 `v-model:collapsed`。 |
| `defaultCollapsed` | `boolean` | `false` | 非受控初始折叠。 |
| `showTrigger` | `boolean \| 'bar' \| 'arrow-circle' \| 'arrow'` | `false` | 折叠触发器；`arrow` 等同 `arrow-circle`。 |
| `collapseMode` | `'width' \| 'transform'` | `'transform'` | `transform` 裁切内容；`width` 随侧栏收缩。 |
| `showCollapsedContent` | `boolean` | `true` | 折叠后是否仍显示侧栏内容。 |
| `bordered` / `inverted` | `boolean` | `false` | 边框 / 反色。 |
| `triggerClass` / `triggerStyle` | — | — | 展开态触发器样式。 |
| `collapsedTriggerClass` / `collapsedTriggerStyle` | — | — | 折叠态触发器样式。 |

## Events

| 事件 | 说明 |
| --- | --- |
| `scroll` | 滚动容器滚动时触发。 |
| `after-enter` | 侧栏展开动画结束。 |
| `after-leave` | 侧栏收起动画结束。 |
| `collapse` | 侧栏开始收起。 |
| `expand` | 侧栏开始展开。 |
| `update:collapsed` | 折叠状态 v-model。 |

## Expose

`RdLayout` / `RdLayoutContent` / `RdLayoutSider` 均暴露 `scrollTo(...)`。

## Components

| 组件 | 说明 |
| --- | --- |
| `RdLayout` | 根布局。 |
| `RdLayoutHeader` | 顶栏。 |
| `RdLayoutContent` | 主内容区（默认撑满剩余空间）。 |
| `RdLayoutFooter` | 底栏。 |
| `RdLayoutSider` | 侧栏。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 布局区域。 |
