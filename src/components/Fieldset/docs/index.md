---
title: Fieldset
category: 05 / PANEL
description: 带图例的字段分组，可折叠。
---

# Fieldset

用图例分组表单或相关内容。

## 引入

```ts
import { WdFieldset } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdFieldset } from '@well-insight/ui'

const collapsed = ref(false)
</script>

<template>
  <WdFieldset legend="Account" toggleable :collapsed="collapsed" @update:collapsed="collapsed = $event">
    <p style="margin:0">字段分组内容。</p>
  </WdFieldset>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `legend` | `string` | — | 图例文本。 |
| `toggleable` | `boolean` | `false` | 是否可折叠。 |
| `collapsed` | `boolean` | `false` | 是否折叠。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:collapsed` | `boolean` | 折叠状态变化。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 内容。 |
| `legend` | 自定义图例。 |
