---
title: Layout
category: 06 / LAYOUT
description: 页面级布局骨架，含 Header / Sider / Content / Footer。
---

# Layout

页面级布局容器。侧栏场景需在对应 `MLayout` 上设置 `has-sider`。给根布局固定高度（或 `min-height`）后，`MLayoutContent` 会自动撑满剩余空间。

## 引入

```ts
import {
  MLayout,
  MLayoutContent,
  MLayoutFooter,
  MLayoutHeader,
  MLayoutSider,
} from 'morya-ui'
```

## 基础用法

Header / Content / Footer。Content 会占满中间剩余高度。

```vue preview src="./demos/Basic.zh.vue"
```

## With Sider

顶栏 + 左侧栏 + 主内容。内层 `has-sider` 的 Layout 会吃掉 Header 以下的全部高度。

```vue preview src="./demos/WithSider.zh.vue"
```

## Right Sider

```vue preview src="./demos/RightSider.zh.vue"
```

## Full Shell

完整后台骨架：顶栏 + 侧栏 + 内容 + 底栏。

```vue preview src="./demos/FullShell.zh.vue"
```

## Embedded Content

`embedded` 给内容区柔和背景，便于和顶栏/侧栏区分。

```vue preview src="./demos/EmbeddedContent.zh.vue"
```

## Scrollable Content

内容超出时仅 Content 区域滚动，Header / Sider 保持固定。`MLayout` / `MLayoutContent` / `MLayoutSider` 通过内置 `MScrollbar` 提供统一滚动条。

```vue preview src="./demos/ScrollableContent.zh.vue"
```

## Absolute Shell

根布局 `position="absolute"` 铺满父级（父级需 `position: relative` + 明确高度）。

```vue preview src="./demos/AbsoluteShell.zh.vue"
```

## Layout Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `hasSider` | `boolean` | `false` | 横向容纳 `MLayoutSider`。 |
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
| `contentClass` / `contentStyle` | — | — | 滚动容器 class / style。 |

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

`MLayout` / `MLayoutContent` / `MLayoutSider` 均暴露 `scrollTo(...)`。

## Components

| 组件 | 说明 |
| --- | --- |
| `MLayout` | 根布局。 |
| `MLayoutHeader` | 顶栏。 |
| `MLayoutContent` | 主内容区（默认撑满剩余空间）。 |
| `MLayoutFooter` | 底栏。 |
| `MLayoutSider` | 侧栏。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 布局区域。 |
