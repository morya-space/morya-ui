---
title: Fluid
category: 01 / BASIC
description: 让子元素宽度撑满的布局包裹。
---

# Fluid

为子控件添加 `width: 100%` 的流体布局容器。

## 引入

```ts
import { WiFluid } from '@well-insight/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WiButton, WiFluid, WiInput } from '@well-insight/ui'
</script>

<template>
  <WiFluid>
    <div style="display:flex;flex-direction:column;gap:0.75rem">
      <WiInput placeholder="流体宽度输入" />
      <WiButton label="提交" />
    </div>
  </WiFluid>
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
