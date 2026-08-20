---
title: BlockUI
category: 07 / MISC
description: 在内容上叠加遮罩以阻止交互。
---

# BlockUI

包裹内容，在 `blocked` 时显示遮罩。

## 引入

```ts
import { WiBlockUI } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiBlockUI, WiButton } from '@well-insight/ui'

const blocked = ref(false)
</script>

<template>
  <WiButton :label="blocked ? '解除' : '锁定'" @click="blocked = !blocked" />
  <WiBlockUI :blocked="blocked" style="margin-top: 1rem">
    <p>面板内容</p>
  </WiBlockUI>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `blocked` | `boolean` | `false` | 是否遮罩。 |
