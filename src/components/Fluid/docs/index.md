---
title: Fluid
category: 07 / MISC
description: 让子元素宽度撑满的布局包裹。
---

# Fluid

为子控件添加 `width: 100%` 的流体布局容器。

## 引入

```ts
import { WdFluid } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdFluid, WdInput, WdButton } from '@well-insight/ui'
</script>

<template>
  <WdFluid>
    <div style="display:flex;flex-direction:column;gap:0.75rem">
      <WdInput placeholder="流体宽度输入" />
      <WdButton label="提交" />
    </div>
  </WdFluid>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `as` | `string` | `'div'` | 根元素标签。 |
