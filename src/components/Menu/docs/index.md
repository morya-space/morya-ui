---
title: Menu
category: 09 / MENU
description: 垂直/水平导航菜单，支持多级嵌套、受控选中、手风琴展开与折叠侧栏飞出层。
---

# Menu

基于 `model` 渲染的**导航菜单**，适合后台侧栏、顶栏导航等场景。支持：

- 多级嵌套 `items` 与受控 `selectedKey`
- 展开路径自动跟随选中项；`accordion` 手风琴
- `collapsed` 图标模式 + 右侧飞出子菜单（Popover）
- 非 popup 时默认 `embedded`，无边框铺满 `WiLayoutSider`

> 单层悬停子菜单见 [TieredMenu](/components/TieredMenu)；顶栏菜单见 [Menubar](/components/Menubar)；操作列表见 [Dropdown](/components/Dropdown)。

## 引入

```ts
import { WiMenu, type MenuItem } from '@well-insight/ui'
```

## 导航选中

为叶子项设置稳定的 `key`，用 `v-model:selected-key` 与路由同步；点击时触发 `select`。

```vue preview
<script setup lang="ts">
import { WiMenu } from '@well-insight/ui'
import { ref } from 'vue'

const selectedKey = ref('dashboard')
const model = [
  { key: 'dashboard', label: '仪表盘', icon: 'layout-dashboard' },
  { key: 'users', label: '用户', icon: 'users' },
  { key: 'settings', label: '设置', icon: 'settings', disabled: true },
]
</script>

<template>
  <div
    style="
      width: 15rem;
      padding: var(--wi-space-3);
      background: var(--wi-color-surface);
      border: 1px solid var(--wi-color-border);
      border-radius: var(--wi-radius-lg);
      box-shadow: var(--wi-shadow-sm);
    "
  >
    <WiMenu
      v-model:selected-key="selectedKey"
      :model="model"
      embedded
      @select="(item) => console.log('select', item.key)"
    />
  </div>
</template>
```

未提供 `key` 时会回退到 `label`；生产环境建议始终显式设置 `key`。

## 嵌套子菜单

点击带子项的节点可展开/收起；选中子项时父级会显示 `child-active` 高亮。

```vue preview
<script setup lang="ts">
import { WiMenu } from '@well-insight/ui'
import { ref } from 'vue'

const selectedKey = ref('reports')
const model = [
  {
    key: 'analytics',
    label: '数据分析',
    icon: 'chart-bar',
    items: [
      { key: 'reports', label: '报表', icon: 'file-text' },
      { key: 'monitor', label: '监控', icon: 'activity' },
    ],
  },
  { key: 'settings', label: '系统设置', icon: 'settings' },
]
</script>

<template>
  <div
    style="
      width: 16rem;
      padding: var(--wi-space-3);
      background: var(--wi-color-surface);
      border: 1px solid var(--wi-color-border);
      border-radius: var(--wi-radius-lg);
      box-shadow: var(--wi-shadow-sm);
    "
  >
    <WiMenu v-model:selected-key="selectedKey" :model="model" embedded />
  </div>
</template>
```

## 手风琴与展开控制

`accordion` 同时只保留一个一级子菜单展开。`defaultExpandedKeys` / `v-model:expanded-keys` 可受控展开项；变更 `selectedKey` 时会自动展开其祖先路径。

```vue preview
<script setup lang="ts">
import { WiMenu } from '@well-insight/ui'
import { ref } from 'vue'

const selectedKey = ref('a1')
const model = [
  { key: 'a', label: '模块 A', items: [{ key: 'a1', label: 'A-1' }] },
  { key: 'b', label: '模块 B', items: [{ key: 'b1', label: 'B-1' }] },
]
</script>

<template>
  <div
    style="
      width: 14rem;
      padding: var(--wi-space-3);
      background: var(--wi-color-surface);
      border: 1px solid var(--wi-color-border);
      border-radius: var(--wi-radius-lg);
      box-shadow: var(--wi-shadow-sm);
    "
  >
    <WiMenu v-model:selected-key="selectedKey" :model="model" accordion embedded />
  </div>
</template>
```

## 折叠与飞出层

`collapsed` 隐藏文案，仅保留图标；悬停/聚焦带子项的节点时，在右侧弹出飞出层（`.wi-menu--flyout`）。`collapsed-width` 应与侧栏折叠宽度一致，用于居中图标。

```vue preview
<script setup lang="ts">
import { WiMenu } from '@well-insight/ui'
import { ref } from 'vue'

const selectedKey = ref('home')
const model = [
  {
    key: 'workspace',
    label: '工作区',
    icon: 'folder',
    items: [
      { key: 'home', label: '首页', icon: 'home' },
      { key: 'docs', label: '文档', icon: 'file-text' },
    ],
  },
  { key: 'settings', label: '设置', icon: 'settings' },
]
</script>

<template>
  <div style="display: flex; gap: var(--wi-space-4); align-items: stretch">
    <div
      style="
        flex: 1;
        min-width: 0;
        padding: var(--wi-space-3);
        background: var(--wi-color-surface);
        border: 1px solid var(--wi-color-border);
        border-radius: var(--wi-radius-lg);
        box-shadow: var(--wi-shadow-sm);
      "
    >
      <p
        style="
          margin: 0 0 var(--wi-space-3);
          font-size: var(--wi-font-size-xs);
          color: var(--wi-color-text-muted);
        "
      >
        展开
      </p>
      <WiMenu v-model:selected-key="selectedKey" :model="model" embedded />
    </div>
    <div
      style="
        width: 4.5rem;
        padding: var(--wi-space-3) var(--wi-space-2);
        background: var(--wi-color-surface);
        border: 1px solid var(--wi-color-border);
        border-radius: var(--wi-radius-lg);
        box-shadow: var(--wi-shadow-sm);
      "
    >
      <p
        style="
          margin: 0 0 var(--wi-space-3);
          font-size: var(--wi-font-size-xs);
          color: var(--wi-color-text-muted);
          text-align: center;
        "
      >
        折叠
      </p>
      <WiMenu
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

## 嵌入 Layout 侧栏

推荐结构：**全局 Header + 下方 `has-sider` Layout**。菜单放在 `WiLayoutSider` 内，与 `v-model:collapsed` 联动。

```vue preview
<script setup lang="ts">
import {
  WiLayout,
  WiLayoutContent,
  WiLayoutHeader,
  WiLayoutSider,
  WiMenu,
} from '@well-insight/ui'
import { ref } from 'vue'

const collapsed = ref(false)
const selectedKey = ref('dashboard')
const model = [
  { key: 'dashboard', label: '仪表盘', icon: 'layout-dashboard' },
  {
    key: 'system',
    label: '系统',
    icon: 'settings',
    items: [
      { key: 'users', label: '用户', icon: 'users' },
      { key: 'roles', label: '角色', icon: 'shield' },
    ],
  },
]
</script>

<template>
  <WiLayout
    style="
      height: 14rem;
      border: 1px solid var(--wi-color-border);
      border-radius: var(--wi-radius-lg);
      box-shadow: var(--wi-shadow-sm);
      overflow: hidden;
    "
  >
    <WiLayoutHeader
      bordered
      style="
        padding: 0 var(--wi-space-4);
        display: flex;
        align-items: center;
        min-height: var(--wi-layout-header-height);
      "
    >
      <strong style="color: var(--wi-color-primary); font-size: var(--wi-font-size-md)">头部菜单</strong>
    </WiLayoutHeader>
    <WiLayout has-sider>
      <WiLayoutSider
        v-model:collapsed="collapsed"
        bordered
        show-trigger="arrow-circle"
        collapse-mode="width"
        :collapsed-width="120"
      >
        <WiMenu
          v-model:selected-key="selectedKey"
          :model="model"
          :collapsed="collapsed"
          :collapsed-width="64"
        />
      </WiLayoutSider>
      <WiLayoutContent embedded content-style="padding: var(--wi-space-4)">
        <p style="margin: 0; color: var(--wi-color-text-muted); font-size: var(--wi-font-size-sm)">
          当前选中：<strong style="color: var(--wi-color-text)">{{ selectedKey }}</strong>
        </p>
      </WiLayoutContent>
    </WiLayout>
  </WiLayout>
</template>
```

## 水平菜单

`mode="horizontal"` 用于顶栏一级导航；子菜单以下拉飞出层展示，选中后自动关闭。

```vue preview
<script setup lang="ts">
import { WiMenu } from '@well-insight/ui'
import { ref } from 'vue'

const selectedKey = ref('home')
const model = [
  { key: 'home', label: '首页', icon: 'home' },
  {
    key: 'products',
    label: '产品',
    icon: 'box',
    items: [
      { key: 'cloud', label: '云服务', icon: 'cloud' },
      { key: 'edge', label: '边缘计算', icon: 'server' },
    ],
  },
  { key: 'about', label: '关于', icon: 'info-circle' },
]
</script>

<template>
  <div
    style="
      padding: 0 var(--wi-space-2);
      background: var(--wi-color-surface);
      border: 1px solid var(--wi-color-border);
      border-radius: var(--wi-radius-lg);
      box-shadow: var(--wi-shadow-sm);
    "
  >
    <WiMenu v-model:selected-key="selectedKey" :model="model" mode="horizontal" embedded />
  </div>
</template>
```

## 反色（深色侧栏）

`inverted` 配合 `WiLayoutSider` 的 `inverted`，用于深色背景侧栏。

```vue preview
<script setup lang="ts">
import { WiLayout, WiLayoutSider, WiMenu } from '@well-insight/ui'
import { ref } from 'vue'

const selectedKey = ref('dashboard')
const model = [
  { key: 'dashboard', label: '仪表盘', icon: 'layout-dashboard' },
  { key: 'users', label: '用户', icon: 'users' },
]
</script>

<template>
  <WiLayout
    has-sider
    style="
      height: 10rem;
      border-radius: var(--wi-radius-lg);
      box-shadow: var(--wi-shadow-sm);
      overflow: hidden;
    "
  >
    <WiLayoutSider inverted bordered style="width: 12rem">
      <WiMenu v-model:selected-key="selectedKey" :model="model" inverted />
    </WiLayoutSider>
  </WiLayout>
</template>
```

## 弹出模式

`popup` + `v-model` 将菜单作为浮层，默认 Teleport 到 `body` 并相对**默认插槽触发器**定位（无插槽时回退到最后一次指针位置）。点击外部或选中叶子项后关闭。

```vue preview
<script setup lang="ts">
import { WiButton, WiMenu } from '@well-insight/ui'
import { ref } from 'vue'

const open = ref(false)
const model = [
  { label: '复制', command: () => undefined },
  { separator: true },
  { label: '删除', disabled: true },
]
</script>

<template>
  <WiMenu v-model="open" popup :model="model">
    <WiButton label="更多操作" @click="open = !open" />
  </WiMenu>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `model` | `MenuItem[]` | — | 菜单项，可嵌套 `items`。 |
| `popup` | `boolean` | `false` | 浮层模式；配合 `v-model` 控制显隐。 |
| `modelValue` | `boolean` | `false` | popup 可见性（`v-model`）。 |
| `placement` | `'bottom-start' \| 'bottom-end' \| 'top-start' \| 'top-end'` | `'bottom-start'` | popup 相对触发器的位置。 |
| `selectedKey` | `string \| null` | `null` | 当前选中项 key（`v-model:selected-key`）。 |
| `collapsed` | `boolean` | `false` | 图标模式；子菜单以右侧飞出层展示。 |
| `collapsedWidth` | `number` | `80` | 折叠宽度（px），用于居中图标。 |
| `indent` | `number` | `12` | 每层额外左内边距（px）。 |
| `rootIndent` | `number` | `16` | 根级左内边距（px）。 |
| `accordion` | `boolean` | `false` | 手风琴：同时只展开一个一级子菜单。 |
| `defaultExpandedKeys` | `string[]` | `[]` | 默认展开的 submenu keys。 |
| `expandedKeys` | `string[]` | — | 受控展开 keys（`v-model:expanded-keys`）。 |
| `defaultExpandAll` | `boolean` | `false` | 初始展开全部子菜单。 |
| `mode` | `'vertical' \| 'horizontal'` | `'vertical'` | 布局方向。 |
| `inverted` | `boolean` | `false` | 反色样式，适合深色侧栏。 |
| `embedded` | `boolean` | `!popup` | 嵌入布局：去边框与最小宽度。 |
| `teleport` | `boolean` | `true` | popup 时 Teleport 到 `appendTo`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Teleport 目标；未传时使用 ConfigProvider。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `boolean` | popup 可见性变化。 |
| `update:selectedKey` | `string \| null` | 选中项变化。 |
| `update:expandedKeys` | `string[]` | 展开项变化。 |
| `select` | `MenuItem` | 点击叶子项（非 disabled / separator）。 |

## Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | popup 模式的触发器锚点（如按钮）；菜单相对其定位。 |

## MenuItem

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `key` | `string` | 唯一标识；未传时使用 `label`。 |
| `label` | `string` | 展示文本。 |
| `icon` | `string` | [Tabler 图标名](/components/Icon) 或字符。 |
| `command` | `() => void` | 点击回调（与 `select` 事件同时触发）。 |
| `disabled` | `boolean` | 禁用。 |
| `separator` | `boolean` | 分隔线（忽略其他字段）。 |
| `items` | `MenuItem[]` | 子菜单。 |
