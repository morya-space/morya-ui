---
title: Layout
category: 06 / LAYOUT
description: Page layout shell with Header / Sider / Content / Footer.
---

# Layout

Page-level layout shell. Set `has-sider` on the `WdLayout` that hosts a sider. Give the root layout a fixed `height` (or `min-height`) so `WdLayoutContent` can fill the remaining space.

## Import

```ts
import {
  WdLayout,
  WdLayoutContent,
  WdLayoutFooter,
  WdLayoutHeader,
  WdLayoutSider,
} from '@wex-design/ui'
```

## Basic

Header / Content / Footer. Content fills the leftover height.

```vue preview
<script setup lang="ts">
import { WdLayout, WdLayoutContent, WdLayoutFooter, WdLayoutHeader } from '@wex-design/ui'
</script>

<template>
  <WdLayout style="height:16rem;border:1px solid var(--wd-color-border);border-radius:var(--wd-radius-md);overflow:hidden">
    <WdLayoutHeader bordered style="padding:0.75rem 1rem">
      Header
    </WdLayoutHeader>
    <WdLayoutContent embedded content-style="padding:1rem;display:flex;align-items:center;justify-content:center">
      Content (fills remaining space)
    </WdLayoutContent>
    <WdLayoutFooter bordered style="padding:0.75rem 1rem">
      Footer
    </WdLayoutFooter>
  </WdLayout>
</template>
```

## With Sider

Header + left sider + main. The inner `has-sider` layout consumes all height below the header.

```vue preview
<script setup lang="ts">
import {
  WdLayout,
  WdLayoutContent,
  WdLayoutHeader,
  WdLayoutSider,
} from '@wex-design/ui'
import { ref } from 'vue'

const collapsed = ref(false)
</script>

<template>
  <WdLayout style="height:16rem;border:1px solid var(--wd-color-border);border-radius:var(--wd-radius-md);overflow:hidden">
    <WdLayoutHeader bordered style="padding:0.75rem 1rem;display:flex;align-items:center;justify-content:space-between">
      <strong>App</strong>
      <span style="color:var(--wd-color-text-muted);font-size:0.75rem">{{ collapsed ? 'Collapsed' : 'Expanded' }}</span>
    </WdLayoutHeader>
    <WdLayout has-sider>
      <WdLayoutSider
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
      </WdLayoutSider>
      <WdLayoutContent embedded content-style="padding:1rem">
        Main area stretches both horizontally and vertically.
      </WdLayoutContent>
    </WdLayout>
  </WdLayout>
</template>
```

## Right Sider

```vue preview
<script setup lang="ts">
import {
  WdLayout,
  WdLayoutContent,
  WdLayoutHeader,
  WdLayoutSider,
} from '@wex-design/ui'
</script>

<template>
  <WdLayout style="height:14rem;border:1px solid var(--wd-color-border);border-radius:var(--wd-radius-md);overflow:hidden">
    <WdLayoutHeader bordered style="padding:0.75rem 1rem">
      Inspector
    </WdLayoutHeader>
    <WdLayout has-sider sider-placement="right">
      <WdLayoutSider bordered :width="140" content-style="padding:0.75rem">
        Props panel
      </WdLayoutSider>
      <WdLayoutContent embedded content-style="padding:1rem">
        Canvas / main
      </WdLayoutContent>
    </WdLayout>
  </WdLayout>
</template>
```

## Full Shell

Admin-style shell: header + sider + content + footer.

```vue preview
<script setup lang="ts">
import {
  WdButton,
  WdLayout,
  WdLayoutContent,
  WdLayoutFooter,
  WdLayoutHeader,
  WdLayoutSider,
  WdTag,
} from '@wex-design/ui'
import { ref } from 'vue'

const collapsed = ref(false)
</script>

<template>
  <WdLayout style="height:18rem;border:1px solid var(--wd-color-border);border-radius:var(--wd-radius-md);overflow:hidden">
    <WdLayoutHeader
      bordered
      inverted
      style="padding:0.65rem 1rem;display:flex;align-items:center;gap:0.75rem"
    >
      <strong>Well Design</strong>
      <WdTag value="Studio" />
      <span style="flex:1" />
      <WdButton size="small" label="Publish" />
    </WdLayoutHeader>

    <WdLayout has-sider>
      <WdLayoutSider
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
      </WdLayoutSider>

      <WdLayout>
        <WdLayoutContent embedded content-style="padding:1rem;display:grid;gap:0.75rem;align-content:start">
          <strong>Workspace</strong>
          <p style="margin:0;color:var(--wd-color-text-muted);font-size:0.875rem">
            Content fills the space between Header and Footer; collapsing the sider keeps the height.
          </p>
        </WdLayoutContent>
        <WdLayoutFooter bordered style="padding:0.5rem 1rem;color:var(--wd-color-text-muted);font-size:0.75rem">
          Ready · local
        </WdLayoutFooter>
      </WdLayout>
    </WdLayout>
  </WdLayout>
</template>
```

## Embedded Content

`embedded` softens the content background so it separates from header / sider.

```vue preview
<script setup lang="ts">
import { WdLayout, WdLayoutContent, WdLayoutHeader } from '@wex-design/ui'
</script>

<template>
  <WdLayout style="height:12rem;border:1px solid var(--wd-color-border);border-radius:var(--wd-radius-md);overflow:hidden">
    <WdLayoutHeader bordered style="padding:0.75rem 1rem">
      Settings
    </WdLayoutHeader>
    <WdLayoutContent embedded content-style="padding:1rem">
      Nested forms / lists go here.
    </WdLayoutContent>
  </WdLayout>
</template>
```

## Scrollable Content

Only the content pane scrolls; header and sider stay fixed.

```vue preview
<script setup lang="ts">
import {
  WdLayout,
  WdLayoutContent,
  WdLayoutHeader,
  WdLayoutSider,
} from '@wex-design/ui'
</script>

<template>
  <WdLayout style="height:14rem;border:1px solid var(--wd-color-border);border-radius:var(--wd-radius-md);overflow:hidden">
    <WdLayoutHeader bordered style="padding:0.75rem 1rem">
      Scroll demo
    </WdLayoutHeader>
    <WdLayout has-sider>
      <WdLayoutSider bordered :width="120" content-style="padding:0.75rem">
        Fixed sider
      </WdLayoutSider>
      <WdLayoutContent embedded content-style="padding:1rem">
        <div style="display:grid;gap:0.5rem">
          <div v-for="n in 20" :key="n">
            Row {{ n }} — scroll down
          </div>
        </div>
      </WdLayoutContent>
    </WdLayout>
  </WdLayout>
</template>
```

## Absolute Shell

Root `position="absolute"` fills a relatively positioned parent with an explicit height.

```vue preview
<script setup lang="ts">
import {
  WdLayout,
  WdLayoutContent,
  WdLayoutHeader,
  WdLayoutSider,
} from '@wex-design/ui'
</script>

<template>
  <div style="position:relative;height:14rem;border:1px solid var(--wd-color-border);border-radius:var(--wd-radius-md);overflow:hidden">
    <WdLayout position="absolute" has-sider>
      <WdLayoutSider bordered :width="120" content-style="padding:0.75rem">
        Nav
      </WdLayoutSider>
      <WdLayout>
        <WdLayoutHeader bordered style="padding:0.75rem 1rem">
          Absolute layout
        </WdLayoutHeader>
        <WdLayoutContent embedded content-style="padding:1rem">
          Fills the relative container
        </WdLayoutContent>
      </WdLayout>
    </WdLayout>
  </div>
</template>
```

## Layout Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `hasSider` | `boolean` | `false` | Horizontal layout for `WdLayoutSider`. |
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

`WdLayout` / `WdLayoutContent` / `WdLayoutSider` expose `scrollTo(...)`.

## Components

| Component | Description |
| --- | --- |
| `WdLayout` | Root layout. |
| `WdLayoutHeader` | Header bar. |
| `WdLayoutContent` | Main content (fills leftover space by default). |
| `WdLayoutFooter` | Footer bar. |
| `WdLayoutSider` | Side panel. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Layout regions. |
