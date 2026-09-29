---
title: Tour
category: 07 / OTHER
description: 分步引导遮罩，高亮目标并展示说明面板。
---

# Tour

**新手引导 / 功能漫游**。遮罩聚光灯 + 浮层说明，支持上一步、下一步、完成与关闭。


## 何时使用

- 分步引导遮罩，高亮目标并展示说明面板。
- 优先组合文档中的 `M*` API；共性约定见 [Common Props](/docs/common-props)。

## 引入

```ts
import { MTour } from 'morya-ui'
```

## 基础用法

`v-model:open` 控制显隐，`v-model:current` 控制当前步；每步 `target` 返回要高亮的 DOM 节点。

```vue preview src="./demos/Basic.vue"
```

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `steps` | `TourStep[]` | `[]` | 步骤配置 |
| `open` | `boolean` | — | 显隐（`v-model:open`） |
| `current` | `number` | `0` | 当前步（`v-model:current`） |
| `placement` | 浮层方位 | `'bottom'` | 默认面板方位 |
| `mask` | `boolean` | `true` | 遮罩聚光灯 |
| `gap` | `number` | `4` | 聚光灯相对目标的内边距（px） |
| `type` | `'default' \| 'primary'` | `'default'` | 面板主题 |
| `zIndex` | `number` | 全局 `zIndex` | 层级 |
| `teleport` | `boolean` | `true` | 挂载到 `appendTo` |
| `pt` | `RootPassThrough` | — | 透传根节点 |

### TourStep

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `title` / `description` | `string` | 标题与说明 |
| `target` | `() => HTMLElement \| null` | 高亮目标 |
| `cover` | `string` | 可选封面文案 |
| `placement` | 方位 | 覆盖根级 `placement` |
| `type` | `'default' \| 'primary'` | 覆盖根级 `type` |
| `nextButtonProps` / `prevButtonProps` | 按钮配置 | 文案与 `onClick` |

## Events

| 事件 | 说明 |
| --- | --- |
| `update:open` | 显隐变化 |
| `update:current` | 步骤变化 |
| `change` | 同 `update:current` |
| `close` | 关闭时 |
| `finish` | 最后一步点完成 |

## 键盘

打开时：`Esc` 关闭；`ArrowRight` 下一步；`ArrowLeft` 上一步（非首步）。
