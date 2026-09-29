---
title: Anchor
category: 03 / NAVIGATION
description: 页内锚点导航，滚动高亮与平滑定位。
---

# Anchor

长页/文档场景的**页内导航**。滚动时高亮当前区块；点击链接触发平滑滚动。


## 何时使用

- 页内锚点导航，滚动高亮与平滑定位。
- 优先组合文档中的 `M*` API；共性约定见 [Common Props](/docs/common-props)。

## 引入

```ts
import { MAnchor, MAnchorLink } from 'morya-ui'
```

## 基础用法

推荐 `items` 声明链接；亦可用 `MAnchorLink` 子组件嵌套。

```vue preview src="./demos/Basic.vue"
```

## Props — Anchor

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `items` | `AnchorLinkItem[]` | — | 链接树 |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | 布局方向 |
| `offsetTop` | `number` | `0` | 滚动监听/定位偏移 |
| `bounds` / `bound` | `number` | `5` | 高亮判定边界 |
| `targetOffset` | `number` | — | 点击滚动偏移；默认 `offsetTop` |
| `affix` | `boolean` | `true` | 粘性定位导航 |
| `getContainer` | `() => HTMLElement \| Window` | `window` | 滚动容器 |
| `getCurrentAnchor` | `(link) => string` | — | 自定义高亮 href |
| `replace` | `boolean` | `false` | 点击 hash 时用 `replaceState` |
| `pt` | `RootPassThrough` | — | 透传根节点 |

## Props — AnchorLink

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `href` | `string` | 目标 hash（如 `#section-1`） |
| `title` | `string` | 链接文案 |
| `targetOffset` | `number` | 单项滚动偏移 |

## Events

| 事件 | 说明 |
| --- | --- |
| `change` | 高亮链接变化（原始 href） |
| `click` | 点击链接 `(event, { href, title })` |

