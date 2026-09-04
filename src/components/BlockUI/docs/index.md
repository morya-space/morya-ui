---
title: BlockUI
category: 05 / FEEDBACK
description: 在内容上叠加遮罩以阻止交互。
---

# BlockUI

包裹内容，在 `blocked` 时显示遮罩。

## 引入

```ts
import { WdBlockUI } from '@wex-design/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WdBlockUI, WdButton } from '@wex-design/ui'
import { ref } from 'vue'

const blocked = ref(false)
</script>

<template>
  <WdButton :label="blocked ? '解除' : '锁定'" @click="blocked = !blocked" />
  <WdBlockUI :blocked="blocked" style="margin-top: 1rem">
    <p>面板内容</p>
  </WdBlockUI>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `blocked` | `boolean` | `false` | 是否遮罩。 |

## Events

无自定义事件。

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 默认内容。 |

