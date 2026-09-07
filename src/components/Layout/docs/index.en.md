---
title: Layout
category: 06 / LAYOUT
description: Page layout shell with Header / Sider / Content / Footer.
---

# Layout

Page-level layout shell. Set `has-sider` on the `RdLayout` that hosts a sider. Give the root layout a fixed `height` (or `min-height`) so `RdLayoutContent` can fill the remaining space.

## Import

```ts
import {
  RdLayout,
  RdLayoutContent,
  RdLayoutFooter,
  RdLayoutHeader,
  RdLayoutSider,
} from '@roost-design/ui'
```

## Basic

Header / Content / Footer. Content fills the leftover height.

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
      Content (fills remaining space)
    </RdLayoutContent>
    <RdLayoutFooter bordered style="padding:0.75rem 1rem">
      Footer
    </RdLayoutFooter>
  </RdLayout>
</template>
```

## With Sider

Header + left sider + main. The inner `has-sider` layout consumes all height below the header.

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
      <span style="color:var(--rd-color-text-muted);font-size:0.75rem">{{ collapsed ? 'Collapsed' : 'Expanded' }}</span>
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
          <div>Overview</div>
          <div>Projects</div>
          <div>Settings</div>
        </div>
      </RdLayoutSider>
      <RdLayoutContent embedded content-style="padding:1rem">
        Main area stretches both horizontally and vertically.
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
        Props panel
      </RdLayoutSider>
      <RdLayoutContent embedded content-style="padding:1rem">
        Canvas / main
      </RdLayoutContent>
    </RdLayout>
  </RdLayout>
</template>
```

## Full Shell

Admin-style shell: header + sider + content + footer.

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
      <RdButton size="small" label="Publish" />
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
          <div>Dashboard</div>
          <div>Datasources</div>
          <div>Widgets</div>
          <div>Theme</div>
        </div>
      </RdLayoutSider>

      <RdLayout>
        <RdLayoutContent embedded content-style="padding:1rem;display:grid;gap:0.75rem;align-content:start">
          <strong>Workspace</strong>
          <p style="margin:0;color:var(--rd-color-text-muted);font-size:0.875rem">
            Content fills the space between Header and Footer; collapsing the sider keeps the height.
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

`embedded` softens the content background so it separates from header / sider.

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
      Nested forms / lists go here.
    </RdLayoutContent>
  </RdLayout>
</template>
```

## Scrollable Content

Only the content pane scrolls; header and sider stay fixed.

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
        Fixed sider
      </RdLayoutSider>
      <RdLayoutContent embedded content-style="padding:1rem">
        <div style="display:grid;gap:0.5rem">
          <div v-for="n in 20" :key="n">
            Row {{ n }} — scroll down
          </div>
        </div>
      </RdLayoutContent>
    </RdLayout>
  </RdLayout>
</template>
```

## Absolute Shell

Root `position="absolute"` fills a relatively positioned parent with an explicit height.

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
          Fills the relative container
        </RdLayoutContent>
      </RdLayout>
    </RdLayout>
  </div>
</template>
```

## Layout Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `hasSider` | `boolean` | `false` | Horizontal layout for `RdLayoutSider`. |
| `siderPlacement` | `'left' \| 'right'` | `'left'` | Sider side. |
| `embedded` | `boolean` | `false` | Soft background for nested content. |
| `position` | `'static' \| 'absolute'` | `'static'` | Positioning mode. |
| `contentClass` / `contentStyle` | — | — | Scroll container class / style. |

## LayoutSider Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `width` | `number \| string` | `272` | Expanded width (always set as `width`). |
| `collapsedWidth` | `number` | `48` | Collapsed `max-width`. |
| `collapsed` | `boolean` | — | Collapsed state (`v-model:collapsed`). |
| `defaultCollapsed` | `boolean` | `false` | Uncontrolled initial collapsed state. |
| `showTrigger` | `boolean \| 'bar' \| 'arrow-circle' \| 'arrow'` | `false` | Collapse trigger; `arrow` aliases `arrow-circle`. |
| `collapseMode` | `'width' \| 'transform'` | `'transform'` | `transform` clips content; `width` shrinks with sider. |
| `showCollapsedContent` | `boolean` | `true` | Keep sider content visible while collapsed. |
| `bordered` / `inverted` | `boolean` | `false` | Border / inverted colors. |
| `triggerClass` / `triggerStyle` | — | — | Expanded trigger styles. |
| `collapsedTriggerClass` / `collapsedTriggerStyle` | — | — | Collapsed trigger styles. |

## Events

| Event | Description |
| --- | --- |
| `scroll` | Fired when the scroll container scrolls. |

## Expose

`RdLayout` / `RdLayoutContent` / `RdLayoutSider` expose `scrollTo(...)`.

## Components

| Component | Description |
| --- | --- |
| `RdLayout` | Root layout. |
| `RdLayoutHeader` | Header bar. |
| `RdLayoutContent` | Main content (fills leftover space by default). |
| `RdLayoutFooter` | Footer bar. |
| `RdLayoutSider` | Side panel. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Layout regions. |
