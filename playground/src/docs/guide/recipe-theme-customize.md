---
title: 主题定制
order: 24
description: 亮暗切换、密度与 createTheme 主色，一条可落地的定制路径。
---

# 主题定制

主题能力内置在 `morya-ui`：`useTheme` / `useDensity` 管亮暗与密度，`createTheme` 从 seed 推导 `--m-*`。本配方串起一条最短落地路径。

## 目标

- 切换浅色 / 深色
- 调整 `compact` / `comfortable` / `spacious`
- 用 `createTheme({ seed: { colorPrimary } })` 改品牌主色，并知道如何清理临时覆盖

## 何时使用

- 产品需要品牌色，或提供浅深色开关
- 同一套组件要在紧凑后台与宽松表单间切换密度
- 想先本地验证 seed，再落到 `:root` 或作用域节点

## 步骤

1. **亮 / 暗**：`useTheme().setTheme('light' | 'dark')`（写 `document.documentElement` 的 `data-theme`）。SSR 首屏优先根级 `MConfigProvider :theme`。
2. **密度**：`useDensity().setDensity(...)`，或 `MConfigProvider density` / `createMoryaUI({ density })`。局部预览可设 `:global-density="false"`。
3. **主色**：

```ts
import { createTheme } from "morya-ui";

const theme = createTheme({
  seed: { colorPrimary: "#0b6e4f", borderRadius: 8 },
  // algorithm: 'dark' | 'compact' | ['dark', 'compact']
});
theme.apply(); // 默认 :root；可传入 HTMLElement
// const dispose = theme.inject()  // <style data-m-theme>，组件覆盖需要
```

4. 在线调参与导出：[主题编辑器](/theme-editor)；完整变量表：[设计令牌](/docs/design-tokens)。

## 预览

```vue preview src="./demos/recipes/ThemeCustomize.zh.vue"

```

演示里亮暗走全局 `useTheme`；密度用局部 `MConfigProvider`；主色只写品牌相关 CSS 变量到预览节点，并在卸载时清除，避免污染文档站。应用里直接 `theme.apply()` / `inject()` 即可。

## 检查清单

- [ ] 已引入 `morya-ui/styles.css`（含默认 `--m-*`）
- [ ] SSR 首屏用 Provider / cookie 定主题，减少闪动
- [ ] 局部预览关掉 `global-density`，避免改整站密度
- [ ] 临时 `apply` / `inject` 有对应的 `remove` / `dispose`
- [ ] 尺寸、locale、浮层仍走 [全局配置](/docs/config)，与视觉主题并行

## 相关

- [主题](/docs/theme) · [设计令牌](/docs/design-tokens) · [动效](/docs/motion)
- [主题编辑器](/theme-editor)
- [全局配置](/docs/config) · [中后台布局](/docs/recipe-admin-layout)
