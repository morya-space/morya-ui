---
title: QRCode
category: 07 / OTHER
description: QR code with status overlay and refresh.
---

# QRCode

Canvas QR codes. Encoding uses embedded Nayuki MIT `qrcodegen` (no extra runtime npm deps).

## Import

```ts
import { MQRCode } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Status

```vue preview src="./demos/Status.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | **Required** payload |
| `size` | `number` | `160` | Edge length in px |
| `color` / `bgColor` | `string` | token defaults | Foreground / background |
| `bordered` | `boolean` | `true` | Border wrapper |
| `errorLevel` | `'L' \| 'M' \| 'Q' \| 'H'` | `'M'` | ECC level |
| `status` | `QRCodeStatus` | `'active'` | Overlay state |
| `icon` | `string \| QRCodeIcon` | — | Center icon |
| `pt` | `RootPassThrough` | — | Root pass-through |

## Slots

| Slot | Scope | Description |
| --- | --- | --- |
| `statusRender` | `{ status, refresh }` | Custom overlay for `loading` / `expired` / `scanned`; defaults include copy + refresh |

## Events

| Event | Description |
| --- | --- |
| `refresh` | Fired when user clicks refresh on expired state |
