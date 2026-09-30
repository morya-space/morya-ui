---
title: Chip
category: 01 / BASIC
description: 鑺墖鐢ㄤ簬灞曠ず鏍囩鍖栦俊鎭紝鍙甫鍥炬爣銆佸浘鐗囦笌绉婚櫎鎿嶄綔銆?---

# Chip

鑺墖鐢ㄤ簬灞曠ず绠€鐭爣绛句俊鎭紝鍙€夊浘鏍?鍥剧墖涓庣Щ闄ゆ寜閽€?
## 寮曞叆

```ts
import { MChip } from 'morya-ui'
```

## 鍩虹鐢ㄦ硶

```vue preview src="./demos/Basic.vue"
```

## Props

| 鍙傛暟 | 绫诲瀷 | 榛樿鍊?| 璇存槑 |
| --- | --- | --- | --- |
| `label` | `string` | 鈥?| 鑺墖鏂囨銆?|
| `icon` | [IconName](/docs/types#IconName) | 鈥?| 鍓嶇疆鍥炬爣鍚嶇О銆?|
| `image` | `string` | 鈥?| 鍓嶇疆鍥剧墖 URL锛堜紭鍏堜簬 icon锛夈€?|
| `removable` | `boolean` | `false` | 鏄剧ず 脳 绉婚櫎鎸夐挳銆?|
| `disabled` | `boolean` | `false` | 绂佺敤浜や簰銆?|
| `severity` | `MTagSeverity \| 'warning'` | 鈥?| 璇箟鑹层€?|
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | 鈥?| 灏哄銆?|


## Events

| 浜嬩欢鍚?| 鍙傛暟 | 璇存槑 |
| --- | --- | --- |
| `remove` | `MouseEvent` | 鐐瑰嚮绉婚櫎鎸夐挳鏃惰Е鍙戙€?|

## Slots

| 鎻掓Ы鍚?| 璇存槑 |
| --- | --- |
| `default` | 鏍囩鍐呭銆?|
| `icon` | 鍓嶇疆鍥炬爣銆?|
