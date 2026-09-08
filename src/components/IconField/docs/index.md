---
title: IconField
category: 02 / FORM
description: 为输入框添加左/右侧图标的容器。
---

# IconField

在输入控件左侧或右侧放置图标。

## 引入

```ts
import { WkIcon, WkIconField, WkInput } from '@wise-kit/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WkIcon, WkIconField, WkInput } from '@wise-kit/ui'
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(24rem,100%)">
    <WkIconField>
      <template #icon>
        <WkIcon name="info" size="sm" />
      </template>
      <WkInput v-model="value" placeholder="Search" fluid />
    </WkIconField>
    <WkIconField icon-position="right">
      <template #icon>
        <WkIcon name="check" size="sm" />
      </template>
      <WkInput v-model="value" placeholder="Verified" fluid />
    </WkIconField>
  </div>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `iconPosition` | `'left' \| 'right'` | `'left'` | 图标位置。 |

## Slots

| 名称 | 说明 |
| --- | --- |
| `default` | 输入控件。 |
| `icon` | 图标内容。 |

## Events

无自定义事件。
