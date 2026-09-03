---
title: Layout
category: 06 / LAYOUT
description: Page layout shell with Header / Sider / Content / Footer.
---

# Layout

Page-level layout shell. Set `has-sider` on the `WiLayout` that hosts a sider. Give the root layout a fixed `height` (or `min-height`) so `WiLayoutContent` can fill the remaining space.

## Import

```ts
import {
  WiLayout,
  WiLayoutContent,
  WiLayoutFooter,
  WiLayoutHeader,
  WiLayoutSider,
} from '@well-insight/ui'
```

## Basic

Header / Content / Footer. Content fills the leftover height.

```vue preview
<script setup lang="ts">
import { WiLayout, WiLayoutContent, WiLayoutFooter, WiLayoutHeader } from '@well-insight/ui'
</script>

<template>
  <WiLayout style="height:16rem;border:1px solid var(--wi-color-border);border-radius:var(--wi-radius-md);overflow:hidden">
    <WiLayoutHeader bordered style="padding:0.75rem 1rem">
      Header
    </WiLayoutHeader>
    <WiLayoutContent embedded content-style="padding:1rem;display:flex;align-items:center;justify-content:center">
      Content (fills remaining space)
    </WiLayoutContent>
    <WiLayoutFooter bordered style="padding:0.75rem 1rem">
      Footer
    </WiLayoutFooter>
  </WiLayout>
</template>
```

## With Sider

Header + left sider + main. The inner `has-sider` layout consumes all height below the header.

```vue preview
<script setup lang="ts">
import {
  WiLayout,
  WiLayoutContent,
  WiLayoutHeader,
  WiLayoutSider,
} from '@well-insight/ui'
import { ref } from 'vue'

const collapsed = ref(false)
</script>

<template>
  <WiLayout style="height:16rem;border:1px solid var(--wi-color-border);border-radius:var(--wi-radius-md);overflow:hidden">
    <WiLayoutHeader bordered style="padding:0.75rem 1rem;display:flex;align-items:center;justify-content:space-between">
      <strong>App</strong>
      <span style="color:var(--wi-color-text-muted);font-size:0.75rem">{{ collapsed ? 'Collapsed' : 'Expanded' }}</span>
    </WiLayoutHeader>
    <WiLayout has-sider>
      <WiLayoutSider
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
      </WiLayoutSider>
      <WiLayoutContent embedded content-style="padding:1rem">
        Main area stretches both horizontally and vertically.
      </WiLayoutContent>
    </WiLayout>
  </WiLayout>
</template>
```

## Right Sider

```vue preview
<script setup lang="ts">
import {
  WiLayout,
  WiLayoutContent,
  WiLayoutHeader,
  WiLayoutSider,
} from '@well-insight/ui'
</script>

<template>
  <WiLayout style="height:14rem;border:1px solid var(--wi-color-border);border-radius:var(--wi-radius-md);overflow:hidden">
    <WiLayoutHeader bordered style="padding:0.75rem 1rem">
      Inspector
    </WiLayoutHeader>
    <WiLayout has-sider sider-placement="right">
      <WiLayoutSider bordered :width="140" content-style="padding:0.75rem">
        Props panel
      </WiLayoutSider>
      <WiLayoutContent embedded content-style="padding:1rem">
        Canvas / main
      </WiLayoutContent>
    </WiLayout>
  </WiLayout>
</template>
```

## Full Shell

Admin-style shell: header + sider + content + footer.

```vue preview
<script setup lang="ts">
import {
  WiButton,
  WiLayout,
  WiLayoutContent,
  WiLayoutFooter,
  WiLayoutHeader,
  WiLayoutSider,
  WiTag,
} from '@well-insight/ui'
import { ref } from 'vue'

const collapsed = ref(false)
</script>

<template>
  <WiLayout style="height:18rem;border:1px solid var(--wi-color-border);border-radius:var(--wi-radius-md);overflow:hidden">
    <WiLayoutHeader
      bordered
      inverted
      style="padding:0.65rem 1rem;display:flex;align-items:center;gap:0.75rem"
    >
      <strong>Well Design</strong>
      <WiTag value="Studio" />
      <span style="flex:1" />
      <WiButton size="small" label="Publish" />
    </WiLayoutHeader>

    <WiLayout has-sider>
      <WiLayoutSider
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
      </WiLayoutSider>

      <WiLayout>
        <WiLayoutContent embedded content-style="padding:1rem;display:grid;gap:0.75rem;align-content:start">
          <strong>Workspace</strong>
          <p style="margin:0;color:var(--wi-color-text-muted);font-size:0.875rem">
            Content fills the space between Header and Footer; collapsing the sider keeps the height.
          </p>
        </WiLayoutContent>
        <WiLayoutFooter bordered style="padding:0.5rem 1rem;color:var(--wi-color-text-muted);font-size:0.75rem">
          Ready · local
        </WiLayoutFooter>
      </WiLayout>
    </WiLayout>
  </WiLayout>
</template>
```

## Embedded Content

`embedded` softens the content background so it separates from header / sider.

```vue preview
<script setup lang="ts">
import { WiLayout, WiLayoutContent, WiLayoutHeader } from '@well-insight/ui'
</script>

<template>
  <WiLayout style="height:12rem;border:1px solid var(--wi-color-border);border-radius:var(--wi-radius-md);overflow:hidden">
    <WiLayoutHeader bordered style="padding:0.75rem 1rem">
      Settings
    </WiLayoutHeader>
    <WiLayoutContent embedded content-style="padding:1rem">
      Nested forms / lists go here.
    </WiLayoutContent>
  </WiLayout>
</template>
```

## Scrollable Content

Only the content pane scrolls; header and sider stay fixed.

```vue preview
<script setup lang="ts">
import {
  WiLayout,
  WiLayoutContent,
  WiLayoutHeader,
  WiLayoutSider,
} from '@well-insight/ui'
</script>

<template>
  <WiLayout style="height:14rem;border:1px solid var(--wi-color-border);border-radius:var(--wi-radius-md);overflow:hidden">
    <WiLayoutHeader bordered style="padding:0.75rem 1rem">
      Scroll demo
    </WiLayoutHeader>
    <WiLayout has-sider>
      <WiLayoutSider bordered :width="120" content-style="padding:0.75rem">
        Fixed sider
      </WiLayoutSider>
      <WiLayoutContent embedded content-style="padding:1rem">
        <div style="display:grid;gap:0.5rem">
          <div v-for="n in 20" :key="n">
            Row {{ n }} — scroll down
          </div>
        </div>
      </WiLayoutContent>
    </WiLayout>
  </WiLayout>
</template>
```

## Absolute Shell

Root `position="absolute"` fills a relatively positioned parent with an explicit height.

```vue preview
<script setup lang="ts">
import {
  WiLayout,
  WiLayoutContent,
  WiLayoutHeader,
  WiLayoutSider,
} from '@well-insight/ui'
</script>

<template>
  <div style="position:relative;height:14rem;border:1px solid var(--wi-color-border);border-radius:var(--wi-radius-md);overflow:hidden">
    <WiLayout position="absolute" has-sider>
      <WiLayoutSider bordered :width="120" content-style="padding:0.75rem">
        Nav
      </WiLayoutSider>
      <WiLayout>
        <WiLayoutHeader bordered style="padding:0.75rem 1rem">
          Absolute layout
        </WiLayoutHeader>
        <WiLayoutContent embedded content-style="padding:1rem">
          Fills the relative container
        </WiLayoutContent>
      </WiLayout>
    </WiLayout>
  </div>
</template>
```

## Layout Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `hasSider` | `boolean` | `false` | Horizontal layout for `WiLayoutSider`. |
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

`WiLayout` / `WiLayoutContent` / `WiLayoutSider` expose `scrollTo(...)`.

## Components

| Component | Description |
| --- | --- |
| `WiLayout` | Root layout. |
| `WiLayoutHeader` | Header bar. |
| `WiLayoutContent` | Main content (fills leftover space by default). |
| `WiLayoutFooter` | Footer bar. |
| `WiLayoutSider` | Side panel. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Layout regions. |
