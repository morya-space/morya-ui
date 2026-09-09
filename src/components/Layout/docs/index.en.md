---
title: Layout
category: 06 / LAYOUT
description: Page layout shell with Header / Sider / Content / Footer.
---

# Layout

Page-level layout shell. Set `has-sider` on the `MLayout` that hosts a sider. Give the root layout a fixed `height` (or `min-height`) so `MLayoutContent` can fill the remaining space.

## Import

```ts
import {
  MLayout,
  MLayoutContent,
  MLayoutFooter,
  MLayoutHeader,
  MLayoutSider,
} from 'morya-ui'
```

## Basic

Header / Content / Footer. Content fills the leftover height.

```vue preview
<script setup lang="ts">
import { MLayout, MLayoutContent, MLayoutFooter, MLayoutHeader } from 'morya-ui'
</script>

<template>
  <MLayout style="height:16rem;border:1px solid var(--m-color-border);border-radius:var(--m-radius-md);overflow:hidden">
    <MLayoutHeader bordered style="padding:0.75rem 1rem">
      Header
    </MLayoutHeader>
    <MLayoutContent embedded content-style="padding:1rem;display:flex;align-items:center;justify-content:center">
      Content (fills remaining space)
    </MLayoutContent>
    <MLayoutFooter bordered style="padding:0.75rem 1rem">
      Footer
    </MLayoutFooter>
  </MLayout>
</template>
```

## With Sider

Header + left sider + main. The inner `has-sider` layout consumes all height below the header.

```vue preview
<script setup lang="ts">
import {
  MLayout,
  MLayoutContent,
  MLayoutHeader,
  MLayoutSider,
} from 'morya-ui'
import { ref } from 'vue'

const collapsed = ref(false)
</script>

<template>
  <MLayout style="height:16rem;border:1px solid var(--m-color-border);border-radius:var(--m-radius-md);overflow:hidden">
    <MLayoutHeader bordered style="padding:0.75rem 1rem;display:flex;align-items:center;justify-content:space-between">
      <strong>App</strong>
      <span style="color:var(--m-color-text-muted);font-size:0.75rem">{{ collapsed ? 'Collapsed' : 'Expanded' }}</span>
    </MLayoutHeader>
    <MLayout has-sider>
      <MLayoutSider
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
      </MLayoutSider>
      <MLayoutContent embedded content-style="padding:1rem">
        Main area stretches both horizontally and vertically.
      </MLayoutContent>
    </MLayout>
  </MLayout>
</template>
```

## Right Sider

```vue preview
<script setup lang="ts">
import {
  MLayout,
  MLayoutContent,
  MLayoutHeader,
  MLayoutSider,
} from 'morya-ui'
</script>

<template>
  <MLayout style="height:14rem;border:1px solid var(--m-color-border);border-radius:var(--m-radius-md);overflow:hidden">
    <MLayoutHeader bordered style="padding:0.75rem 1rem">
      Inspector
    </MLayoutHeader>
    <MLayout has-sider sider-placement="right">
      <MLayoutSider bordered :width="140" content-style="padding:0.75rem">
        Props panel
      </MLayoutSider>
      <MLayoutContent embedded content-style="padding:1rem">
        Canvas / main
      </MLayoutContent>
    </MLayout>
  </MLayout>
</template>
```

## Full Shell

Admin-style shell: header + sider + content + footer.

```vue preview
<script setup lang="ts">
import {
  MButton,
  MLayout,
  MLayoutContent,
  MLayoutFooter,
  MLayoutHeader,
  MLayoutSider,
  MTag,
} from 'morya-ui'
import { ref } from 'vue'

const collapsed = ref(false)
</script>

<template>
  <MLayout style="height:18rem;border:1px solid var(--m-color-border);border-radius:var(--m-radius-md);overflow:hidden">
    <MLayoutHeader
      bordered
      inverted
      style="padding:0.65rem 1rem;display:flex;align-items:center;gap:0.75rem"
    >
      <strong>Morya UI</strong>
      <MTag value="Studio" />
      <span style="flex:1" />
      <MButton size="small" label="Publish" />
    </MLayoutHeader>

    <MLayout has-sider>
      <MLayoutSider
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
      </MLayoutSider>

      <MLayout>
        <MLayoutContent embedded content-style="padding:1rem;display:grid;gap:0.75rem;align-content:start">
          <strong>Workspace</strong>
          <p style="margin:0;color:var(--m-color-text-muted);font-size:0.875rem">
            Content fills the space between Header and Footer; collapsing the sider keeps the height.
          </p>
        </MLayoutContent>
        <MLayoutFooter bordered style="padding:0.5rem 1rem;color:var(--m-color-text-muted);font-size:0.75rem">
          Ready · local
        </MLayoutFooter>
      </MLayout>
    </MLayout>
  </MLayout>
</template>
```

## Embedded Content

`embedded` softens the content background so it separates from header / sider.

```vue preview
<script setup lang="ts">
import { MLayout, MLayoutContent, MLayoutHeader } from 'morya-ui'
</script>

<template>
  <MLayout style="height:12rem;border:1px solid var(--m-color-border);border-radius:var(--m-radius-md);overflow:hidden">
    <MLayoutHeader bordered style="padding:0.75rem 1rem">
      Settings
    </MLayoutHeader>
    <MLayoutContent embedded content-style="padding:1rem">
      Nested forms / lists go here.
    </MLayoutContent>
  </MLayout>
</template>
```

## Scrollable Content

Only the content pane scrolls; header and sider stay fixed.

```vue preview
<script setup lang="ts">
import {
  MLayout,
  MLayoutContent,
  MLayoutHeader,
  MLayoutSider,
} from 'morya-ui'
</script>

<template>
  <MLayout style="height:14rem;border:1px solid var(--m-color-border);border-radius:var(--m-radius-md);overflow:hidden">
    <MLayoutHeader bordered style="padding:0.75rem 1rem">
      Scroll demo
    </MLayoutHeader>
    <MLayout has-sider>
      <MLayoutSider bordered :width="120" content-style="padding:0.75rem">
        Fixed sider
      </MLayoutSider>
      <MLayoutContent embedded content-style="padding:1rem">
        <div style="display:grid;gap:0.5rem">
          <div v-for="n in 20" :key="n">
            Row {{ n }} — scroll down
          </div>
        </div>
      </MLayoutContent>
    </MLayout>
  </MLayout>
</template>
```

## Absolute Shell

Root `position="absolute"` fills a relatively positioned parent with an explicit height.

```vue preview
<script setup lang="ts">
import {
  MLayout,
  MLayoutContent,
  MLayoutHeader,
  MLayoutSider,
} from 'morya-ui'
</script>

<template>
  <div style="position:relative;height:14rem;border:1px solid var(--m-color-border);border-radius:var(--m-radius-md);overflow:hidden">
    <MLayout position="absolute" has-sider>
      <MLayoutSider bordered :width="120" content-style="padding:0.75rem">
        Nav
      </MLayoutSider>
      <MLayout>
        <MLayoutHeader bordered style="padding:0.75rem 1rem">
          Absolute layout
        </MLayoutHeader>
        <MLayoutContent embedded content-style="padding:1rem">
          Fills the relative container
        </MLayoutContent>
      </MLayout>
    </MLayout>
  </div>
</template>
```

## Layout Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `hasSider` | `boolean` | `false` | Horizontal layout for `MLayoutSider`. |
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

`MLayout` / `MLayoutContent` / `MLayoutSider` expose `scrollTo(...)`.

## Components

| Component | Description |
| --- | --- |
| `MLayout` | Root layout. |
| `MLayoutHeader` | Header bar. |
| `MLayoutContent` | Main content (fills leftover space by default). |
| `MLayoutFooter` | Footer bar. |
| `MLayoutSider` | Side panel. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Layout regions. |
