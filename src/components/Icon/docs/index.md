---
title: Icon
category: 01 / BASIC
description: 绯荤粺绾挎鍥炬爣娉ㄥ唽琛ㄣ€備笟鍔″浘鏍囩敤榛樿鎻掓Ы鎺ュ叆 Lucide 绛夊簱銆?---

# Icon

`MIcon` 缁存姢**缁勪欢搴撶郴缁熷浘鏍?*锛堝叧闂€佺澶淬€佺姸鎬併€佸鑸€佷笟鍔″父鐢ㄧ瓑锛岀粺涓€涓?Tabler 24脳24 绾挎椋庢牸锛岀敱 `scripts/generate-system-icons.mjs` 鐢熸垚锛夈€傚畬鏁存捣閲忓浘鏍囪鐢ㄩ粯璁ゆ彃妲芥帴鍏?[Lucide](https://lucide.dev) 绛夊簱銆?
## 寮曞叆

```ts
import { iconNames, MIcon } from 'morya-ui'
```

## 鍩虹鐢ㄦ硶

```vue preview src="./demos/Basic.vue"
```

## 鍏ㄩ儴绯荤粺鍥炬爣

鐐瑰嚮鍥炬爣鍗冲彲澶嶅埗鍚嶇О锛堝 `search`锛夛紝鐢ㄦ硶锛歚<MIcon name="search" />`銆傚彲鎸夊垎绫荤瓫閫夛紝鎴栨悳绱㈠悕绉般€?
```vue preview src="./demos/AllSystemIcons.zh.vue"
```

## 鑷畾涔?/ Lucide锛堟帹鑽愪笟鍔′晶锛?
绯荤粺鍥炬爣涓嶅鏃讹紝涓嶈寰€缁勪欢搴撳爢 SVG锛岀敤榛樿鎻掓Ы鎸備换鎰忓浘鏍囩粍浠讹細

```vue
<script setup lang="ts">
import { User } from 'lucide-vue-next'
import { MButton, MIcon, MIconField, MInput } from 'morya-ui'
</script>

<template>
  <MIcon label="鐢ㄦ埛" size="md">
    <User :size="16" :stroke-width="1.8" />
  </MIcon>

  <MIconField>
    <template #icon>
      <MIcon size="sm">
        <User :size="14" :stroke-width="1.8" />
      </MIcon>
    </template>
    <MInput placeholder="鎼滅储鐢ㄦ埛" />
  </MIconField>

  <!-- Button 涔熷彲鐩存帴浼犵粍浠讹紝涓嶅繀鍖?MIcon -->
  <MButton :icon="User" label="璧勬枡" />
</template>
```

瀹夎绀轰緥锛歚pnpm add lucide-vue-next`銆傜嚎瀹藉缓璁?`2`锛屼笌绯荤粺鍥炬爣锛圱abler outline锛変竴鑷淬€?
鏈夐粯璁ゆ彃妲芥椂**浼樺厛娓叉煋鎻掓Ы**锛屽拷鐣?`name`銆?
## Props

| 鍙傛暟 | 绫诲瀷 | 榛樿鍊?| 璇存槑 |
| --- | --- | --- | --- |
| `name` | [IconName](/docs/types#IconName) | 鈥?| 绯荤粺鍥炬爣鍚嶏紱鎻掓Ы瀛樺湪鏃跺彲鐪佺暐銆?|
| `label` | `string` | 鈥?| 鍙闂悕绉帮紱鐪佺暐鏃?`aria-hidden`銆?|
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | `'md'` | 灏哄锛沗sm`/`lg` 鏄犲皠鍒?small/large銆?|


## Slots

| 鎻掓Ы | 璇存槑 |
| --- | --- |
| `default` | 鑷畾涔?SVG / 绗笁鏂瑰浘鏍囩粍浠躲€?|

## 宸ュ叿瀵煎嚭

| 瀵煎嚭 | 璇存槑 |
| --- | --- |
| `iconNames` | 鍏ㄩ儴绯荤粺鍥炬爣鍚嶆暟缁勩€?|
| `iconCategoryMeta` / `getIconCategory` / `getIconCategoryGroups` | 鍥炬爣鍒嗙被鍏冩暟鎹笌鍒嗙粍銆?|
| `iconRegistry` / `getIconDefinition` / `isIconName` | 娉ㄥ唽琛ㄤ笌绫诲瀷瀹堝崼銆?|

## Events

鏃犺嚜瀹氫箟浜嬩欢銆?
