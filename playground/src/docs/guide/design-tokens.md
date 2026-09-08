---
title: 设计令牌
order: 4.5
description: 全部 --wk-* CSS 变量、默认值与用途说明。
---

# 设计令牌

Wise Kit 组件只消费语义化 CSS 变量（`--wk-*`），不维护第二套色板。下面列表从 `src/**/*.css` **自动提取**，运行 `pnpm tokens:generate` 可与源码保持同步。

## 覆盖方式

| 机制 | 作用 |
| --- | --- |
| `[data-theme="dark"]` | 亮 / 暗色主题 |
| `[data-wk-density]` | 间距与控件高度密度 |
| `[data-wk-motion]` | 动效时长 |
| `createWiseKit({ zIndex })` / `WkConfigProvider` | 写入 `--wk-z-base` 等全局配置 |

主题 API 与密度说明见 [主题](/docs/theme)。

## 完整列表

```vue preview
<script setup lang="ts">
import DesignTokenCatalog from '../../components/DesignTokenCatalog.vue'
</script>

<template>
  <DesignTokenCatalog />
</template>
```

## 自定义

在应用入口覆盖变量即可，无需 fork 组件：

```css
:root {
  --wk-color-primary: #0f766e;
  --wk-radius-control: 6px;
}
```

组件局部变量（如 `--wk-button-padding-x-medium`）定义在对应 `styles.css`，同样可通过更高优先级选择器覆盖。
