---
title: Layout
category: 06 / LAYOUT
description: Page layout shell with Header / Sider / Content / Footer.
---

# Layout

Page-level layout shell. Set `has-sider` on the `WkLayout` that hosts a sider. Give the root layout a fixed `height` (or `min-height`) so `WkLayoutContent` can fill the remaining space.

## Import

```ts
import {
  WkLayout,
  WkLayoutContent,
  WkLayoutFooter,
  WkLayoutHeader,
  WkLayoutSider,
} from '@wise-kit/ui'
```

## Basic

Header / Content / Footer. Content fills the leftover height.

```vue preview
<script setup lang="ts">
import { WkLayout, WkLayoutContent, WkLayoutFooter, WkLayoutHeader } from '@wise-kit/ui'
</script>

<template>
  <WkLayout style="height:16rem;border:1px solid var(--wk-color-border);border-radius:var(--wk-radius-md);overflow:hidden">
    <WkLayoutHeader bordered style="padding:0.75rem 1rem">
      Header
    </WkLayoutHeader>
    <WkLayoutContent embedded content-style="padding:1rem;display:flex;align-items:center;justify-content:center">
      Content (fills remaining space)
    </WkLayoutContent>
    <WkLayoutFooter bordered style="padding:0.75rem 1rem">
      Footer
    </WkLayoutFooter>
  </WkLayout>
</template>
```

## With Sider

Header + left sider + main. The inner `has-sider` layout consumes all height below the header.

```vue preview
<script setup lang="ts">
import {
  WkLayout,
  WkLayoutContent,
  WkLayoutHeader,
  WkLayoutSider,
} from '@wise-kit/ui'
import { ref } from 'vue'

const collapsed = ref(false)
</script>

<template>
  <WkLayout style="height:16rem;border:1px solid var(--wk-color-border);border-radius:var(--wk-radius-md);overflow:hidden">
    <WkLayoutHeader bordered style="padding:0.75rem 1rem;display:flex;align-items:center;justify-content:space-between">
      <strong>App</strong>
      <span style="color:var(--wk-color-text-muted);font-size:0.75rem">{{ collapsed ? 'Collapsed' : 'Expanded' }}</span>
    </WkLayoutHeader>
    <WkLayout has-sider>
      <WkLayoutSider
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
      </WkLayoutSider>
      <WkLayoutContent embedded content-style="padding:1rem">
        Main area stretches both horizontally and vertically.
      </WkLayoutContent>
    </WkLayout>
  </WkLayout>
</template>
```

## Right Sider

```vue preview
<script setup lang="ts">
import {
  WkLayout,
  WkLayoutContent,
  WkLayoutHeader,
  WkLayoutSider,
} from '@wise-kit/ui'
</script>

<template>
  <WkLayout style="height:14rem;border:1px solid var(--wk-color-border);border-radius:var(--wk-radius-md);overflow:hidden">
    <WkLayoutHeader bordered style="padding:0.75rem 1rem">
      Inspector
    </WkLayoutHeader>
    <WkLayout has-sider sider-placement="right">
      <WkLayoutSider bordered :width="140" content-style="padding:0.75rem">
        Props panel
      </WkLayoutSider>
      <WkLayoutContent embedded content-style="padding:1rem">
        Canvas / main
      </WkLayoutContent>
    </WkLayout>
  </WkLayout>
</template>
```

## Full Shell

Admin-style shell: header + sider + content + footer.

```vue preview
<script setup lang="ts">
import {
  WkButton,
  WkLayout,
  WkLayoutContent,
  WkLayoutFooter,
  WkLayoutHeader,
  WkLayoutSider,
  WkTag,
} from '@wise-kit/ui'
import { ref } from 'vue'

const collapsed = ref(false)
</script>

<template>
  <WkLayout style="height:18rem;border:1px solid var(--wk-color-border);border-radius:var(--wk-radius-md);overflow:hidden">
    <WkLayoutHeader
      bordered
      inverted
      style="padding:0.65rem 1rem;display:flex;align-items:center;gap:0.75rem"
    >
      <strong>Wise Kit</strong>
      <WkTag value="Studio" />
      <span style="flex:1" />
      <WkButton size="small" label="Publish" />
    </WkLayoutHeader>

    <WkLayout has-sider>
      <WkLayoutSider
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
      </WkLayoutSider>

      <WkLayout>
        <WkLayoutContent embedded content-style="padding:1rem;display:grid;gap:0.75rem;align-content:start">
          <strong>Workspace</strong>
          <p style="margin:0;color:var(--wk-color-text-muted);font-size:0.875rem">
            Content fills the space between Header and Footer; collapsing the sider keeps the height.
          </p>
        </WkLayoutContent>
        <WkLayoutFooter bordered style="padding:0.5rem 1rem;color:var(--wk-color-text-muted);font-size:0.75rem">
          Ready · local
        </WkLayoutFooter>
      </WkLayout>
    </WkLayout>
  </WkLayout>
</template>
```

## Embedded Content

`embedded` softens the content background so it separates from header / sider.

```vue preview
<script setup lang="ts">
import { WkLayout, WkLayoutContent, WkLayoutHeader } from '@wise-kit/ui'
</script>

<template>
  <WkLayout style="height:12rem;border:1px solid var(--wk-color-border);border-radius:var(--wk-radius-md);overflow:hidden">
    <WkLayoutHeader bordered style="padding:0.75rem 1rem">
      Settings
    </WkLayoutHeader>
    <WkLayoutContent embedded content-style="padding:1rem">
      Nested forms / lists go here.
    </WkLayoutContent>
  </WkLayout>
</template>
```

## Scrollable Content

Only the content pane scrolls; header and sider stay fixed.

```vue preview
<script setup lang="ts">
import {
  WkLayout,
  WkLayoutContent,
  WkLayoutHeader,
  WkLayoutSider,
} from '@wise-kit/ui'
</script>

<template>
  <WkLayout style="height:14rem;border:1px solid var(--wk-color-border);border-radius:var(--wk-radius-md);overflow:hidden">
    <WkLayoutHeader bordered style="padding:0.75rem 1rem">
      Scroll demo
    </WkLayoutHeader>
    <WkLayout has-sider>
      <WkLayoutSider bordered :width="120" content-style="padding:0.75rem">
        Fixed sider
      </WkLayoutSider>
      <WkLayoutContent embedded content-style="padding:1rem">
        <div style="display:grid;gap:0.5rem">
          <div v-for="n in 20" :key="n">
            Row {{ n }} — scroll down
          </div>
        </div>
      </WkLayoutContent>
    </WkLayout>
  </WkLayout>
</template>
```

## Absolute Shell

Root `position="absolute"` fills a relatively positioned parent with an explicit height.

```vue preview
<script setup lang="ts">
import {
  WkLayout,
  WkLayoutContent,
  WkLayoutHeader,
  WkLayoutSider,
} from '@wise-kit/ui'
</script>

<template>
  <div style="position:relative;height:14rem;border:1px solid var(--wk-color-border);border-radius:var(--wk-radius-md);overflow:hidden">
    <WkLayout position="absolute" has-sider>
      <WkLayoutSider bordered :width="120" content-style="padding:0.75rem">
        Nav
      </WkLayoutSider>
      <WkLayout>
        <WkLayoutHeader bordered style="padding:0.75rem 1rem">
          Absolute layout
        </WkLayoutHeader>
        <WkLayoutContent embedded content-style="padding:1rem">
          Fills the relative container
        </WkLayoutContent>
      </WkLayout>
    </WkLayout>
  </div>
</template>
```

## Layout Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `hasSider` | `boolean` | `false` | Horizontal layout for `WkLayoutSider`. |
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

`WkLayout` / `WkLayoutContent` / `WkLayoutSider` expose `scrollTo(...)`.

## Components

| Component | Description |
| --- | --- |
| `WkLayout` | Root layout. |
| `WkLayoutHeader` | Header bar. |
| `WkLayoutContent` | Main content (fills leftover space by default). |
| `WkLayoutFooter` | Footer bar. |
| `WkLayoutSider` | Side panel. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Layout regions. |
