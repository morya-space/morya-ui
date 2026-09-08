---
title: Fluid
category: 01 / BASIC
description: 让子元素宽度撑满的布局包裹。
---

# Fluid

为子控件添加 `width: 100%` 的流体布局容器。

## 引入

```ts
import { WkFluid } from '@wise-kit/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WkButton, WkFluid, WkInput } from '@wise-kit/ui'
</script>

<template>
  <WkFluid>
    <div style="display:flex;flex-direction:column;gap:0.75rem">
      <WkInput placeholder="流体宽度输入" />
      <WkButton label="提交" />
    </div>
  </WkFluid>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `as` | `string` | `'div'` | 根元素标签。 |

## Events

无自定义事件。

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 撑满宽度的子内容。 |
