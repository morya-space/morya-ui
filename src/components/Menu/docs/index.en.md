---
title: Menu
category: 04 / NAVIGATION
description: Vertical/horizontal navigation menu with nested items, controlled selection, accordion, and collapsed flyout submenus.
---

# Menu

Navigation menu rendered from a `model`. Typical uses: admin sidebar, top navigation.

- Nested `items` with controlled `selectedKey`
- Auto-expand ancestor path when selection changes; optional `accordion`
- `collapsed` icon rail with right-side flyout submenus (Popover)
- Non-popup menus default to `embedded` (borderless, full-width in `WkLayoutSider`)

> One-level hover submenus: [TieredMenu](/components/TieredMenu). Top bar: [Menubar](/components/Menubar). Action lists: [Dropdown](/components/Dropdown).

## Import

```ts
import { WkMenu, type MenuItem } from '@wise-kit/ui'
```

## Selection

Give leaf items stable `key` values; sync with routing via `v-model:selected-key`. Emits `select` on click.

```vue preview
<script setup lang="ts">
import { WkMenu } from '@wise-kit/ui'
import { ref } from 'vue'

const selectedKey = ref('dashboard')
const model = [
  { key: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
  { key: 'users', label: 'Users', icon: 'users' },
  { key: 'settings', label: 'Settings', icon: 'settings', disabled: true },
]
</script>

<template>
  <div
    style="
      width: 15rem;
      padding: var(--wk-space-3);
      background: var(--wk-color-surface);
      border: 1px solid var(--wk-color-border);
      border-radius: var(--wk-radius-lg);
      box-shadow: var(--wk-shadow-sm);
    "
  >
    <WkMenu
      v-model:selected-key="selectedKey"
      :model="model"
      embedded
      @select="(item) => console.log('select', item.key)"
    />
  </div>
</template>
```

If `key` is omitted, `label` is used as fallback. Prefer explicit keys in production.

## Nested submenus

Click a group to expand/collapse. When a child is selected, the parent shows `child-active` styling.

```vue preview
<script setup lang="ts">
import { WkMenu } from '@wise-kit/ui'
import { ref } from 'vue'

const selectedKey = ref('reports')
const model = [
  {
    key: 'analytics',
    label: 'Analytics',
    icon: 'chart-bar',
    items: [
      { key: 'reports', label: 'Reports', icon: 'file-text' },
      { key: 'monitor', label: 'Monitor', icon: 'activity' },
    ],
  },
  { key: 'settings', label: 'Settings', icon: 'settings' },
]
</script>

<template>
  <div
    style="
      width: 16rem;
      padding: var(--wk-space-3);
      background: var(--wk-color-surface);
      border: 1px solid var(--wk-color-border);
      border-radius: var(--wk-radius-lg);
      box-shadow: var(--wk-shadow-sm);
    "
  >
    <WkMenu v-model:selected-key="selectedKey" :model="model" embedded />
  </div>
</template>
```

## Accordion & expanded keys

`accordion` keeps at most one top-level group open. Use `defaultExpandedKeys` or `v-model:expanded-keys` for controlled expansion. Changing `selectedKey` auto-expands its ancestor path.

```vue preview
<script setup lang="ts">
import { WkMenu } from '@wise-kit/ui'
import { ref } from 'vue'

const selectedKey = ref('a1')
const model = [
  { key: 'a', label: 'Module A', items: [{ key: 'a1', label: 'A-1' }] },
  { key: 'b', label: 'Module B', items: [{ key: 'b1', label: 'B-1' }] },
]
</script>

<template>
  <div
    style="
      width: 14rem;
      padding: var(--wk-space-3);
      background: var(--wk-color-surface);
      border: 1px solid var(--wk-color-border);
      border-radius: var(--wk-radius-lg);
      box-shadow: var(--wk-shadow-sm);
    "
  >
    <WkMenu v-model:selected-key="selectedKey" :model="model" accordion embedded />
  </div>
</template>
```

## Collapsed & flyout

`collapsed` hides labels and keeps icons. Hover/focus on a group opens a right flyout (`.wk-menu--flyout`). Set `collapsed-width` to match the sider width for centered icons.

```vue preview
<script setup lang="ts">
import { WkMenu } from '@wise-kit/ui'
import { ref } from 'vue'

const selectedKey = ref('home')
const model = [
  {
    key: 'workspace',
    label: 'Workspace',
    icon: 'folder',
    items: [
      { key: 'home', label: 'Home', icon: 'home' },
      { key: 'docs', label: 'Docs', icon: 'file-text' },
    ],
  },
  { key: 'settings', label: 'Settings', icon: 'settings' },
]
</script>

<template>
  <div style="display: flex; gap: var(--wk-space-4); align-items: stretch">
    <div
      style="
        flex: 1;
        min-width: 0;
        padding: var(--wk-space-3);
        background: var(--wk-color-surface);
        border: 1px solid var(--wk-color-border);
        border-radius: var(--wk-radius-lg);
        box-shadow: var(--wk-shadow-sm);
      "
    >
      <p
        style="
          margin: 0 0 var(--wk-space-3);
          font-size: var(--wk-font-size-xs);
          color: var(--wk-color-text-muted);
        "
      >
        Expanded
      </p>
      <WkMenu v-model:selected-key="selectedKey" :model="model" embedded />
    </div>
    <div
      style="
        width: 4.5rem;
        padding: var(--wk-space-3) var(--wk-space-2);
        background: var(--wk-color-surface);
        border: 1px solid var(--wk-color-border);
        border-radius: var(--wk-radius-lg);
        box-shadow: var(--wk-shadow-sm);
      "
    >
      <p
        style="
          margin: 0 0 var(--wk-space-3);
          font-size: var(--wk-font-size-xs);
          color: var(--wk-color-text-muted);
          text-align: center;
        "
      >
        Collapsed
      </p>
      <WkMenu
        v-model:selected-key="selectedKey"
        :model="model"
        collapsed
        embedded
        :collapsed-width="64"
      />
    </div>
  </div>
</template>
```

## Embed in Layout sider

Recommended shell: **global Header + inner `has-sider` Layout**. Bind menu `collapsed` to `WkLayoutSider`.

```vue preview
<script setup lang="ts">
import {
  WkLayout,
  WkLayoutContent,
  WkLayoutHeader,
  WkLayoutSider,
  WkMenu,
} from '@wise-kit/ui'
import { ref } from 'vue'

const collapsed = ref(false)
const selectedKey = ref('dashboard')
const model = [
  { key: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
  {
    key: 'system',
    label: 'System',
    icon: 'settings',
    items: [
      { key: 'users', label: 'Users', icon: 'users' },
      { key: 'roles', label: 'Roles', icon: 'shield' },
    ],
  },
]
</script>

<template>
  <WkLayout
    style="
      height: 14rem;
      border: 1px solid var(--wk-color-border);
      border-radius: var(--wk-radius-lg);
      box-shadow: var(--wk-shadow-sm);
      overflow: hidden;
    "
  >
    <WkLayoutHeader
      bordered
      style="
        padding: 0 var(--wk-space-4);
        display: flex;
        align-items: center;
        min-height: var(--wk-layout-header-height);
      "
    >
      <strong style="color: var(--wk-color-primary); font-size: var(--wk-font-size-md)">Wise Kit</strong>
    </WkLayoutHeader>
    <WkLayout has-sider>
      <WkLayoutSider
        v-model:collapsed="collapsed"
        bordered
        show-trigger="arrow-circle"
        collapse-mode="width"
        :collapsed-width="64"
      >
        <WkMenu
          v-model:selected-key="selectedKey"
          :model="model"
          :collapsed="collapsed"
          :collapsed-width="64"
          accordion
        />
      </WkLayoutSider>
      <WkLayoutContent embedded content-style="padding: var(--wk-space-4)">
        <p style="margin: 0; color: var(--wk-color-text-muted); font-size: var(--wk-font-size-sm)">
          Selected: <strong style="color: var(--wk-color-text)">{{ selectedKey }}</strong>
        </p>
      </WkLayoutContent>
    </WkLayout>
  </WkLayout>
</template>
```

## Horizontal mode

`mode="horizontal"` for top nav bars. Submenus open in a dropdown flyout and close after selection.

```vue preview
<script setup lang="ts">
import { WkMenu } from '@wise-kit/ui'
import { ref } from 'vue'

const selectedKey = ref('home')
const model = [
  { key: 'home', label: 'Home', icon: 'home' },
  {
    key: 'products',
    label: 'Products',
    icon: 'box',
    items: [
      { key: 'cloud', label: 'Cloud', icon: 'cloud' },
      { key: 'edge', label: 'Edge', icon: 'server' },
    ],
  },
  { key: 'about', label: 'About', icon: 'info-circle' },
]
</script>

<template>
  <div
    style="
      padding: 0 var(--wk-space-2);
      background: var(--wk-color-surface);
      border: 1px solid var(--wk-color-border);
      border-radius: var(--wk-radius-lg);
      box-shadow: var(--wk-shadow-sm);
    "
  >
    <WkMenu v-model:selected-key="selectedKey" :model="model" mode="horizontal" embedded />
  </div>
</template>
```

## Inverted (dark sider)

Use `inverted` with `WkLayoutSider`'s `inverted` on dark backgrounds.

```vue preview
<script setup lang="ts">
import { WkLayout, WkLayoutSider, WkMenu } from '@wise-kit/ui'
import { ref } from 'vue'

const selectedKey = ref('dashboard')
const model = [
  { key: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
  { key: 'users', label: 'Users', icon: 'users' },
]
</script>

<template>
  <WkLayout
    has-sider
    style="
      height: 10rem;
      border-radius: var(--wk-radius-lg);
      box-shadow: var(--wk-shadow-sm);
      overflow: hidden;
    "
  >
    <WkLayoutSider inverted bordered style="width: 12rem">
      <WkMenu v-model:selected-key="selectedKey" :model="model" inverted />
    </WkLayoutSider>
  </WkLayout>
</template>
```

## Popup mode

`popup` + `v-model` renders a floating menu, teleported to `body` by default and positioned against the **default-slot trigger** (falls back to the last pointer position when no slot). Closes on outside click or leaf selection.

```vue preview
<script setup lang="ts">
import { WkButton, WkMenu } from '@wise-kit/ui'
import { ref } from 'vue'

const open = ref(false)
const model = [
  { label: 'Copy', command: () => undefined },
  { separator: true },
  { label: 'Delete', disabled: true },
]
</script>

<template>
  <WkMenu v-model="open" popup :model="model">
    <WkButton label="More" @click="open = !open" />
  </WkMenu>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `MenuItem[]` | — | Menu items; may nest `items`. |
| `popup` | `boolean` | `false` | Overlay mode; use with `v-model`. |
| `modelValue` | `boolean` | `false` | Popup visibility (`v-model`). |
| `placement` | `'bottom-start' \| 'bottom-end' \| 'top-start' \| 'top-end'` | `'bottom-start'` | Popup position relative to the trigger. |
| `selectedKey` | `string \| null` | `null` | Selected item key (`v-model:selected-key`). |
| `collapsed` | `boolean` | `false` | Icon-only; submenus in right flyout. |
| `collapsedWidth` | `number` | `80` | Collapsed width (px) for icon centering. |
| `indent` | `number` | `12` | Extra padding-left per level (px). |
| `rootIndent` | `number` | `16` | Root item padding-left (px). |
| `accordion` | `boolean` | `false` | Only one top-level submenu open at a time. |
| `defaultExpandedKeys` | `string[]` | `[]` | Initially expanded submenu keys. |
| `expandedKeys` | `string[]` | — | Controlled expanded keys (`v-model:expanded-keys`). |
| `defaultExpandAll` | `boolean` | `false` | Expand all submenus initially. |
| `mode` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout direction. |
| `inverted` | `boolean` | `false` | Inverted colors for dark sider. |
| `embedded` | `boolean` | `!popup` | Embed in layout (no border/min-width). |
| `teleport` | `boolean` | `true` | Teleport popup to `appendTo`. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Teleport target; falls back to ConfigProvider. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Popup visibility changed. |
| `update:selectedKey` | `string \| null` | Selected item changed. |
| `update:expandedKeys` | `string[]` | Expanded keys changed. |
| `select` | `MenuItem` | Leaf clicked (not disabled / separator). |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Popup trigger anchor (e.g. a button); menu positions against it. |

## MenuItem

| Field | Type | Description |
| --- | --- | --- |
| `key` | `string` | Unique id; falls back to `label`. |
| `label` | `string` | Display text. |
| `icon` | `string` | [Tabler icon name](/components/Icon) or character. |
| `command` | `() => void` | Click handler (also emits `select`). |
| `disabled` | `boolean` | Disabled state. |
| `separator` | `boolean` | Separator line (ignores other fields). |
| `items` | `MenuItem[]` | Child menu items. |
