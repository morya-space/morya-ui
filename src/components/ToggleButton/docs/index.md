---
title: ToggleButton
category: 02 / FORM
description: 鍦ㄥ紑/鍏充袱绉嶆爣绛剧姸鎬侀棿鍒囨崲鐨勬寜閽€?---

# ToggleButton

甯冨皵鍒囨崲鎸夐挳锛屽彲閰嶇疆寮€/鍏虫枃妗堜笌鍥炬爣銆?
## 寮曞叆

```ts
import { MToggleButton } from 'morya-ui'
```

## 鍩虹鐢ㄦ硶

```vue preview src="./demos/Basic.zh.vue"
```

## Size

```vue preview src="./demos/Size.zh.vue"
```

## Props

| 鍙傛暟 | 绫诲瀷 | 榛樿鍊?| 璇存槑 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | 鏄惁寮€鍚€?|
| `onLabel` / `offLabel` | `string` | `On` / `Off` | 鏂囨銆?|
| `onIcon` / `offIcon` | `string` | 鈥?| 鍙€夊浘鏍囧瓧绗︺€?|
| `size` | [MSizeInput](/docs/types#MSizeInput) | 鈥?| `small` / `large`锛涘彲缁ф壙 ConfigProvider銆?|
| `disabled` | `boolean` | `false` | 绂佺敤銆?|


## Events

| 浜嬩欢鍚?| 鍙傛暟 | 璇存槑 |
| --- | --- | --- |
| `update:modelValue` | `boolean` | 鍊煎彉鍖栥€?|

## Slots

| 鎻掓Ы鍚?| 璇存槑 |
| --- | --- |
| `default` | 鎸夐挳鍐呭銆?|
