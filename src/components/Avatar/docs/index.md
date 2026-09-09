---
title: Avatar
category: 03 / DATA
description: 头像用于展示用户或实体标识。支持图片、图标与文字回退，形状与尺寸可配置。
---

# Avatar

头像用于展示用户或实体标识。展示优先级：`image` > `icon` > `label`。

## 引入

```ts
import { MAvatar } from 'morya-ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { MAvatar } from 'morya-ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <MAvatar label="AB" />
    <MAvatar icon="check" />
    <MAvatar label="SQ" shape="square" />
    <MAvatar label="LG" size="large" />
    <MAvatar label="XL" size="xlarge" />
  </div>
</template>
```

## Group

`MAvatarGroup` 可叠放头像，`max` 超出时显示 `+N`。图片加载失败会回退到 `icon` / `label` 并触发 `error`。

```vue preview
<script setup lang="ts">
import { MAvatar, MAvatarGroup } from 'morya-ui'
</script>

<template>
  <MAvatarGroup :max="3">
    <MAvatar label="AL" />
    <MAvatar label="BK" />
    <MAvatar label="CN" />
    <MAvatar label="DY" />
  </MAvatarGroup>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `label` | `string` | — | 无图片/图标时的文字回退。 |
| `image` | `string` | — | 图片 URL，优先级最高。 |
| `icon` | `IconName` | — | `MIcon` 图标名称。 |
| `shape` | `'circle' \| 'square'` | `'circle'` | 形状。 |
| `size` | `'normal' \| 'large' \| 'xlarge' \| 'sm' \| 'lg'` | `'normal'` | 尺寸；`sm`/`lg` 为别名。 |
| `max` | `number` | — | `MAvatarGroup`：最多展示个数，超出显示 +N。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `error` | `Event` | 图片加载失败。 |

`MAvatarGroup`：`max` 最多展示个数；`size` 作用于溢出标记。

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 无 `src` 时的占位内容。 |
