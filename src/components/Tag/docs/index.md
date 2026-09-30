---
title: Tag
category: 01 / BASIC
description: 鏍囩鐢ㄤ簬灞曠ず鐘舵€佹垨鍒嗙被銆?---

# Tag

鏍囩鐢ㄤ簬灞曠ず鐘舵€佹垨鍒嗙被銆?
## 寮曞叆

```ts
import { MTag } from 'morya-ui'
```

## 鍩虹鐢ㄦ硶

閫氳繃 `value` 鎴栭粯璁ゆ彃妲藉睍绀烘枃妗堛€?
```vue preview src="./demos/Basic.vue"
```

## Severity

浣跨敤 `severity` 瀹氫箟璇箟鑹诧紱鐪佺暐鏃朵负 primary銆傚吋瀹规棫鍊?`warning`锛堟槧灏勪负 `warn`锛夈€?
```vue preview src="./demos/Severity.vue"
```

## Icons

`icon` 浼犲叆 `MIcon` 鐨勫浘鏍囧悕绉般€?
```vue preview src="./demos/Icons.vue"
```

## Bordered

`bordered` 浣跨敤鑹茶皟鎻忚竟銆傞粯璁ゆ棤鎻忚竟銆佸～鍏呰壊璋冭儗鏅€?
```vue preview src="./demos/Bordered.vue"
```

## Closable

```vue preview src="./demos/Closable.vue"
```

## Checkable

`checkable` + `v-model:checked` 鍙垏鎹㈤€変腑銆備笌 `closable` 鍚屾椂璁剧疆鏃跺叧闂寜閽笉鏄剧ず銆?
```vue preview src="./demos/Checkable.vue"
```

## Props

| 鍙傛暟 | 绫诲瀷 | 榛樿鍊?| 璇存槑 |
| --- | --- | --- | --- |
| `value` | `string` | 鈥?| 鏍囩鏂囨銆傚瓨鍦ㄩ粯璁ゆ彃妲藉唴瀹规椂浠ユ彃妲戒负鍑嗐€?|
| `severity` | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warn' \| 'help' \| 'danger' \| 'contrast' \| 'warning'` | `'primary'` | 璇箟鑹层€俙warning` 涓哄吋瀹瑰埆鍚嶏紝鏄犲皠涓?`warn`銆?|
| `rounded` | `boolean` | `false` | 鍏ㄥ渾瑙掋€?|
| `icon` | [IconName](/docs/types#IconName) | 鈥?| `MIcon` 鍥炬爣鍚嶇О銆?|
| `closable` | `boolean` | `false` | 鏄剧ず鍏抽棴鎸夐挳锛坄checkable` 鏃跺拷鐣ワ級銆?|
| `size` | `'small' \| 'medium' \| 'large' \| 'sm' \| 'md' \| 'lg'` | 鈥?| 灏哄銆?|
| `bordered` | `boolean` | `false` | 鎻忚竟銆?|
| `color` | `string` | 鈥?| 鑷畾涔夐鑹层€?|
| `disabled` | `boolean` | `false` | 绂佺敤浜や簰銆?|
| `checkable` | `boolean` | `false` | 鍙垏鎹㈤€変腑銆?|
| `checked` | `boolean` | `false` | 閫変腑鎬侊紱閰嶅悎 `v-model:checked`銆?|


## Events

| 浜嬩欢鍚?| 鍙傛暟 | 璇存槑 |
| --- | --- | --- |
| `close` | `MouseEvent` | 鐐瑰嚮鍏抽棴銆?|
| `update:checked` | `boolean` | 閫変腑鎬佸彉鏇达紙`v-model:checked`锛夈€?|
| `change` | `boolean` | 閫変腑鎬佸彉鏇淬€?|

## Slots

| 鎻掓Ы鍚?| 璇存槑 |
| --- | --- |
| `default` | 鏍囩鍐呭锛屼紭鍏堜簬 `value`銆?|
