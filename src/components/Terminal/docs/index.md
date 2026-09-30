---
title: Terminal
category: 03 / DATA
description: 简易命令提示符 UI。
---

# Terminal

展示欢迎语与命令历史，提交时触发 `command`。

## 引入

```ts
import { MTerminal } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.zh.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `welcomeMessage` | `string` | `'Welcome to Morya UI Terminal'` | 顶部欢迎语。 |
| `prompt` | `string` | `'>'` | 提示符。 |
| `lines` | `string[]` | — | — |
| `responses` | `string[]` | — | — |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `command` | `string` | 提交的命令。 |
| `update:lines` | — | — |
| `update:responses` | — | — |

## Methods

| 方法 | 说明 |
| --- | --- |
| `appendResponse(text)` | 追加一条响应输出。 |
| `focus()` | 聚焦命令输入框。 |

## Slots

无插槽。
