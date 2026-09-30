---
title: Tooltip
category: 05 / FEEDBACK
description: 鎮仠鎴栬仛鐒︽椂鏄剧ず鐨勭煭鎻愮ず銆傛敮鎸?placement銆乨isabled 涓?showDelay銆?---

# Tooltip

涓鸿Е鍙戝厓绱犳彁渚涚煭鎻愮ず锛岄€傚悎鍥炬爣鎸夐挳鎴栨埅鏂枃鏈鏄庛€?
## 寮曞叆

```ts
import { MButton, MTooltip } from 'morya-ui'
```

## 鍩虹鐢ㄦ硶

```vue preview src="./demos/Basic.vue"
```

## Props

| 鍙傛暟 | 绫诲瀷 | 榛樿鍊?| 璇存槑 |
| --- | --- | --- | --- |
| `content` | `string` | 鈥?| 鎻愮ず鏂囨銆?|
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | 鐩稿瑙﹀彂鍏冪礌鐨勪綅缃€?|
| `disabled` | `boolean` | `false` | 绂佺敤鎻愮ず銆?|
| `showDelay` | `number` | `0` | 鏄剧ず鍓嶅欢杩燂紙姣锛夈€?|
| `hideDelay` | `number` | `0` | 闅愯棌鍓嶅欢杩燂紙姣锛夈€?|
| `maxWidth` | `string \| number` | 鈥?| 鎻愮ず鏈€澶у搴︼紱鏁板瓧涓?px銆?|
| `teleport` | `boolean` | `true` | 娴眰 Teleport锛涢粯璁ゆ寕鍒?`body`銆?|
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 鎸傝浇鐩爣锛沗'self'` / `false` 灏卞湴娓叉煋銆?|
| `transition` | `string \| false` | `'fade'` | 杩涘嚭鍦哄姩鏁堥璁撅紱`false` / `'none'` 鍏抽棴銆傝[鍔ㄦ晥](/docs/motion)銆?|


## Slots

| 鎻掓Ы鍚?| 璇存槑 |
| --- | --- |
| `default` | 瑙﹀彂鍏冪礌銆?|

## 鏃犻殰纰?
- 鎻愮ず鍐呭浼氶€氳繃 `role="tooltip"` 鍏宠仈鍒拌Е鍙戝厓绱狅紙hover / focus 鏄剧ず锛夈€?- 瑙﹀彂鎺т欢闇€鍙仛鐒︼紱绾浘鏍囨寜閽璁剧疆 `aria-label`銆?- 閲嶈淇℃伅涓嶈鍙斁鍦?Tooltip 涓紝搴旀彁渚涘彲瑙佹枃妗堟垨 `aria-label`銆?
## Events

鏃犺嚜瀹氫箟浜嬩欢銆?
