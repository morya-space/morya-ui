---
title: QRCode
category: 07 / OTHER
description: 生成二维码，支持状态遮罩与刷新。
---

# QRCode

Canvas 二维码。编码使用内嵌 Nayuki MIT `qrcodegen`，无额外 npm 运行时依赖。

## 引入

```ts
import { MQRCode } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.vue"
```

## 状态

`status`：`active` | `expired` | `loading` | `scanned`。过期态点击刷新触发 `refresh`。

```vue preview src="./demos/Status.vue"
```

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `value` | `string` | — | **必填** 编码内容 |
| `size` | `number` | `160` | 边长 px |
| `color` / `bgColor` | `string` | `--m-color-text` / `--m-color-surface` | 前景/背景 |
| `bordered` | `boolean` | `true` | 外框 |
| `errorLevel` | `'L' \| 'M' \| 'Q' \| 'H'` | `'M'` | 纠错 |
| `status` | `QRCodeStatus` | `'active'` | 遮罩状态 |
| `icon` | `string \| QRCodeIcon` | — | 中心图标 |
| `pt` | `RootPassThrough` | — | 根透传 |

## 插槽

| 插槽 | 作用域 | 说明 |
| --- | --- | --- |
| `statusRender` | `{ status, refresh }` | 自定义 `loading` / `expired` / `scanned` 遮罩；默认内置文案与刷新按钮 |

## Events

| 事件 | 说明 |
| --- | --- |
| `refresh` | 过期态用户点击刷新 |

