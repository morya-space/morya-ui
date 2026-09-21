---
title: Icon
category: 01 / BASIC
description: 系统线框图标注册表。业务图标用默认插槽接入 Lucide 等库。
---

# Icon

`MIcon` 维护**组件库系统图标**（关闭、箭头、状态、导航、业务常用等，含 Tabler outline）。完整海量图标请用默认插槽接入 [Lucide](https://lucide.dev) 等库。

## 引入

```ts
import { iconNames, MIcon } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.vue"
```

## 全部系统图标

点击图标即可复制名称（如 `search`），用法：`<MIcon name="search" />`。可按分类筛选，或搜索名称。

```vue preview src="./demos/AllSystemIcons.zh.vue"
```

## 自定义 / Lucide（推荐业务侧）

系统图标不够时，不要往组件库堆 SVG，用默认插槽挂任意图标组件：

```vue
<script setup lang="ts">
import { User } from 'lucide-vue-next'
import { MButton, MIcon, MIconField, MInput } from 'morya-ui'
</script>

<template>
  <MIcon label="用户" size="md">
    <User :size="16" :stroke-width="1.8" />
  </MIcon>

  <MIconField>
    <template #icon>
      <MIcon size="sm">
        <User :size="14" :stroke-width="1.8" />
      </MIcon>
    </template>
    <MInput placeholder="搜索用户" />
  </MIconField>

  <!-- Button 也可直接传组件，不必包 MIcon -->
  <MButton :icon="User" label="资料" />
</template>
```

安装示例：`pnpm add lucide-vue-next`。线宽建议 `1.75`–`2`，与系统图标 `1.8` 接近。

有默认插槽时**优先渲染插槽**，忽略 `name`。

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `name` | [IconName](/docs/types#IconName) | — | 系统图标名；插槽存在时可省略。 |
| `label` | `string` | — | 可访问名称；省略时 `aria-hidden`。 |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸；`sm`/`lg` 映射到 small/large。 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 自定义 SVG / 第三方图标组件。 |

## 工具导出

| 导出 | 说明 |
| --- | --- |
| `iconNames` | 全部系统图标名数组。 |
| `iconCategoryMeta` / `getIconCategory` / `getIconCategoryGroups` | 图标分类元数据与分组。 |
| `iconRegistry` / `getIconDefinition` / `isIconName` | 注册表与类型守卫。 |

## Events

无自定义事件。
