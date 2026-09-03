---
title: Label
category: 01 / BASIC
description: 可访问的表单标签。
---

# Label

简单 label，支持 `htmlFor` / `for` 与默认插槽。

## 引入

```ts
import { WiLabel } from '@well-insight/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WiInput, WiLabel } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:0.5rem">
    <WiLabel html-for="demo-email">
      邮箱
    </WiLabel>
    <WiInput id="demo-email" placeholder="you@example.com" />
  </div>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `htmlFor` | `string` | — | 关联控件 id。 |
| `for` | `string` | — | `htmlFor` 别名。 |

## Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 标签文案。 |

## Events

无自定义事件。
