---
title: Divider
category: 01 / BASIC
description: 鍐呭鍒嗛殧绾裤€?---

# Divider

鍐呭鍒嗛殧绾匡紝鍙甫鏍囩銆?
## 寮曞叆

```ts
import { MDivider } from 'morya-ui'
```

## 鍩虹鐢ㄦ硶

榛樿姘村钩瀹炵嚎鍒嗛殧銆?
```vue preview src="./demos/Basic.vue"
```

## Type

`type` 鏀寔 `solid`銆乣dashed`銆乣dotted`銆?
```vue preview src="./demos/Type.vue"
```

## Align

姘村钩鍒嗛殧涓斿甫鏍囩鏃讹紝鍙敤 `align` 鎺у埗鏍囩浣嶇疆銆?
```vue preview src="./demos/Align.vue"
```

## Title placement

`titlePlacement` 鏄?`align` 鐨勫埆鍚嶃€?
```vue preview src="./demos/TitlePlacement.vue"
```

## Layout

`layout` 鎺у埗姘村钩 / 鍨傜洿锛沗orientation` 涓哄埆鍚嶃€?
```vue preview src="./demos/Layout.vue"
```

## Plain

`plain` 璁╂爣绛句娇鐢ㄦ鏂囨牱寮忥紙榛樿鍋忔爣棰樺瓧閲嶏級銆?
```vue preview src="./demos/Plain.vue"
```

## Props

| 鍙傛暟 | 绫诲瀷 | 榛樿鍊?| 璇存槑 |
| --- | --- | --- | --- |
| `layout` | `'horizontal' \| 'vertical'` | `'horizontal'` | 甯冨眬鏂瑰悜銆?|
| `orientation` | `'horizontal' \| 'vertical'` | 鈥?| `layout` 鐨勫埆鍚嶃€?|
| `type` | `'solid' \| 'dashed' \| 'dotted'` | `'solid'` | 绾挎潯鏍峰紡锛堝惈铏氱嚎 / 鐐圭嚎锛夈€?|
| `align` | `'left' \| 'center' \| 'right'` | `'center'` | 姘村钩鍒嗛殧甯︽爣绛炬椂鐨勬爣绛惧榻愩€?|
| `titlePlacement` | `'left' \| 'center' \| 'right'` | 鈥?| `align` 鐨勫埆鍚嶏紱浼犲叆鏃朵紭鍏堛€?|
| `plain` | `boolean` | `false` | 鏍囩浣跨敤姝ｆ枃鏍峰紡銆?|
| `size` | `'small' \| 'medium' \| 'large'` | 鈥?| 姘村钩鍒嗛殧鐨勪笂涓嬮棿璺濓紙`--m-space-*`锛夈€?|
| `label` | `string` | 鈥?| 涓棿鏍囩鏂囨銆傚瓨鍦ㄩ粯璁ゆ彃妲芥椂浠ユ彃妲戒负鍑嗐€?|


## Slots

| 鎻掓Ы鍚?| 璇存槑 |
| --- | --- |
| `default` | 鏍囩鍐呭锛屼紭鍏堜簬 `label`銆?|

## Events

鏃犺嚜瀹氫箟浜嬩欢銆?
