---
title: Badge
category: 01 / BASIC
description: 鐘舵€佽鏍囨垨鍦嗙偣銆?---

# Badge

鐘舵€佽鏍囨垨鍦嗙偣锛岀敤浜庢暟閲忎笌鐘舵€佹彁绀恒€?
## 寮曞叆

```ts
import { MBadge } from 'morya-ui'
```

## 鍩虹鐢ㄦ硶

浼犲叆 `value` 灞曠ず鏂囨鎴栨暟瀛楋紱鐪佺暐 `value` 鏃舵覆鏌撲负鍦嗙偣銆?
```vue preview src="./demos/Basic.vue"
```

## Severity

浣跨敤 `severity` 瀹氫箟璇箟鑹诧紱鐪佺暐鏃朵负 primary銆傚吋瀹规棫鍊?`warning`锛堟槧灏勪负 `warn`锛夈€?
```vue preview src="./demos/Severity.vue"
```

## Size

`size` 鏀寔 `small` / `large`锛屼互鍙婂埆鍚?`sm` / `lg`銆?
```vue preview src="./demos/Size.vue"
```

## Overlay

榛樿鎻掓Ы鍖呰９瀛愯妭鐐癸紱`max` 瓒呭嚭鏃舵樉绀?`99+`锛宍processing` 鏄剧ず鑴夊啿銆?
```vue preview src="./demos/Overlay.vue"
```

## Props

| 鍙傛暟 | 绫诲瀷 | 榛樿鍊?| 璇存槑 |
| --- | --- | --- | --- |
| `value` | `string \| number` | 鈥?| 瑙掓爣鍐呭銆傜渷鐣ユ椂鏄剧ず涓哄渾鐐广€?|
| `severity` | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warn' \| 'danger' \| 'contrast' \| 'warning'` | `'primary'` | 璇箟鑹层€俙warning` 涓哄吋瀹瑰埆鍚嶏紝鏄犲皠涓?`warn`銆?|
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | 鈥?| 灏哄锛沗sm` / `lg` 涓哄埆鍚嶃€?|
| `max` | `number` | 鈥?| 鏁板瓧涓婇檺锛岃秴鍑烘樉绀?`{max}+`銆?|
| `offset` | `[number, number]` | 鈥?| 鍖呰９妯″紡涓嬬殑浣嶇Щ `[x, y]`銆?|
| `processing` | `boolean` | `false` | 鑴夊啿鍔ㄧ敾銆?|


## Slots

| 鎻掓Ы鍚?| 璇存槑 |
| --- | --- |
| `default` | 琚鏍囧寘瑁圭殑鍐呭銆?|

## 鏃犻殰纰?
- 瑙掓爣鏁板瓧鍙樺寲鏃讹紝鑻ョ姸鎬侀噸瑕侊紝璇峰悓姝ユ洿鏂伴檮杩戝彲瑙佹枃妗堟垨 `aria-live` 鍖哄煙銆?- 鍖呰９妯″紡涓嬶紝鍕胯瑙掓爣鎴愪负鍞竴鐨勭姸鎬佹彁绀恒€?
## Events

鏃犺嚜瀹氫箟浜嬩欢銆?
