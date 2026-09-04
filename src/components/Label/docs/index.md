---
title: Label
category: 01 / BASIC
description: 可访问的表单标签。
---

# Label

简单 label，支持 `htmlFor` / `for` 与默认插槽。

## 引入

```ts
import { WdLabel } from '@wex-design/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WdInput, WdLabel } from '@wex-design/ui'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:0.5rem">
    <WdLabel html-for="demo-email">
      邮箱
    </WdLabel>
    <WdInput id="demo-email" placeholder="you@example.com" />
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
