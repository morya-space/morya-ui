---
title: IconField
category: 02 / FORM
description: 为输入框添加左/右侧图标的容器。
---

# IconField

在输入控件左侧或右侧放置图标。

## 引入

```ts
import { MIcon, MIconField, MInput } from 'morya-ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { MIcon, MIconField, MInput } from 'morya-ui'
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(24rem,100%)">
    <MIconField>
      <template #icon>
        <MIcon name="info" size="sm" />
      </template>
      <MInput v-model="value" placeholder="Search" fluid />
    </MIconField>
    <MIconField icon-position="right">
      <template #icon>
        <MIcon name="check" size="sm" />
      </template>
      <MInput v-model="value" placeholder="Verified" fluid />
    </MIconField>
  </div>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `iconPosition` | `'left' \| 'right'` | `'left'` | 图标位置。 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Slots

| 名称 | 说明 |
| --- | --- |
| `default` | 输入控件。 |
| `icon` | 图标内容。 |

## Events

无自定义事件。
