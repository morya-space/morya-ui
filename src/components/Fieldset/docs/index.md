---
title: Fieldset
category: 02 / FORM
description: 带图例的字段分组，可折叠。
---

# Fieldset

用图例分组表单或相关内容。

## 引入

```ts
import { WdFieldset } from '@wex-design/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WdFieldset } from '@wex-design/ui'
import { ref } from 'vue'

const collapsed = ref(false)
</script>

<template>
  <WdFieldset legend="Account" toggleable :collapsed="collapsed" @update:collapsed="collapsed = $event">
    <p style="margin:0">
      字段分组内容。
    </p>
  </WdFieldset>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `legend` | `string` | — | 图例文本。 |
| `toggleable` | `boolean` | `false` | 是否可折叠。 |
| `collapsed` | `boolean` | `false` | 是否折叠。 |
| `defaultCollapsed` | `boolean` | — | — |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:collapsed` | `boolean` | 折叠状态变化。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 内容。 |
| `legend` | 自定义图例。 |
