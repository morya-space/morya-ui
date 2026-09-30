---
title: Menu
category: 04 / NAVIGATION
description: 垂直/水平导航菜单，支持多级嵌套、受控选中、手风琴展开与折叠侧栏飞出层。
---

# Menu

基于 `model` 渲染的**导航菜单**，适合后台侧栏、顶栏导航等场景。支持：

- 多级嵌套 `items` 与受控 `selectedKey`
- 展开路径自动跟随选中项；`accordion` 手风琴
- `collapsed` 图标模式 + 右侧飞出子菜单（Popover）
- 非 popup 时默认 `embedded`，无边框铺满 `MLayoutSider`

> 单层悬停子菜单见 [TieredMenu](/components/TieredMenu)；顶栏菜单见 [Menubar](/components/Menubar)；操作列表见 [Dropdown](/components/Dropdown)。

## 引入

```ts
import type {MenuItem} from 'morya-ui';
import {  MMenu } from 'morya-ui'
```

## 导航选中

为叶子项设置稳定的 `key`，用 `v-model:selected-key` 与路由同步；点击时触发 `select`。

```vue preview src="./demos/Selection.zh.vue"
```

未提供 `key` 时会回退到 `label`；生产环境建议始终显式设置 `key`。

## 嵌套子菜单

点击带子项的节点可展开/收起；选中子项时父级会显示 `child-active` 高亮。

```vue preview src="./demos/NestedSubmenus.zh.vue"
```

## 手风琴与展开控制

`accordion` 同时只保留一个一级子菜单展开。`defaultExpandedKeys` / `v-model:expanded-keys` 可受控展开项；变更 `selectedKey` 时会自动展开其祖先路径。

```vue preview src="./demos/AccordionAndExpandedKeys.zh.vue"
```

## 折叠与飞出层

`collapsed` 隐藏文案，仅保留图标；**每个可折叠展示的菜单项必须提供 `icon`**（否则折叠后几乎空白）。悬停时在右侧显示 `MTooltip` 标签，带子项的节点还会弹出飞出层（`.m-menu--flyout`）。飞出层经 `MPopover` Teleport 到 `body`，不会被侧栏裁剪。`collapsed-width` 应与侧栏折叠宽度一致，用于居中图标。

使用 `item.to` 时菜单项会渲染为 `RouterLink` / `<a>`；组件已重置链接的默认蓝色下划线，视觉与普通菜单项一致。

```vue preview src="./demos/CollapsedAndFlyout.zh.vue"
```

## 嵌入 Layout 侧栏

推荐结构：**全局 Header + 下方 `has-sider` Layout**。菜单放在 `MLayoutSider` 内，与 `v-model:collapsed` 联动。

```vue preview src="./demos/EmbedInLayoutSider.zh.vue"
```

## 水平菜单

`mode="horizontal"` 用于顶栏一级导航；子菜单经 `MPopover` 以下拉飞出层展示（Teleport + 主题滚动条），选中后自动关闭。`popup` 模式的主菜单列表同样内置 `MScrollbar`。

```vue preview src="./demos/HorizontalMode.zh.vue"
```

## 反色（深色侧栏）

`inverted` 配合 `MLayoutSider` 的 `inverted`，用于深色背景侧栏。

```vue preview src="./demos/InvertedDarkSider.zh.vue"
```

## 弹出模式

`popup` + `v-model` 将菜单作为浮层，默认 Teleport 到 `body` 并相对**默认插槽触发器**定位（无插槽时回退到最后一次指针位置）。点击外部或选中叶子项后关闭。

```vue preview src="./demos/PopupMode.zh.vue"
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
| `transition` | `string \| false` | `'scale-fade'` | 进出场动效预设；`false` / `'none'` 关闭。见[动效](/docs/motion)。 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


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

## 类型

<h4 id="MenuItem">MenuItem</h4>

`model` 数组项，支持嵌套：

```ts
interface MenuItem {
  key?: string
  label?: string
  icon?: string
  to?: string | RouteLocationRaw   // 有 vue-router 时用 RouterLink
  command?: () => void
  disabled?: boolean
  separator?: boolean
  items?: MenuItem[]
}
```

`key` 未传时用 `label` 作为标识。`separator: true` 时渲染分隔线。更多见 [API 类型](/docs/types)。
