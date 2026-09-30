---
title: Affix
category: 07 / OTHER
description: 滚动到阈值时将子元素固定在视口或滚动容器内。
---

# Affix

将子元素在滚动越过阈值时切换为 `fixed` 定位。

## 引入

```ts
import { MAffix } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.vue"
```

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `offsetTop` | `number` | `0`（未设 `offsetBottom` 时） | 距滚动容器顶部的固定偏移 |
| `offsetBottom` | `number` | — | 距底部的固定偏移 |
| `target` | `() => HTMLElement \| Window \| null` | `window` | 监听滚动的容器 |
| `disabled` | `boolean` | `false` | 禁用固钉 |
| `pt` | `RootPassThrough` | — | 根节点透传 |

## Events

| 事件 |  payload | 说明 |
| --- | --- | --- |
| `change` | `affixed: boolean` | 固钉状态变化 |

## Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 被固钉的内容。 |

