---
title: 中后台布局
order: 23
description: 用 MLayout 系列拼一套可折叠侧栏的后台外壳。
---

# 中后台布局

中后台常见 chrome：顶栏品牌、可折叠侧栏导航、主内容区。本配方用 `MLayout*` + `MMenu` 搭可直接复制的外壳。

## 目标

- Header 放品牌 / 操作，Sider 放导航，Content 放路由出口
- `v-model:collapsed` 与 `MMenu` 折叠同步
- 文档预览用固定高度；真实应用用 `100dvh` / `fill-viewport`

## 何时使用

- 管理后台、运营控制台、SaaS 工作台需要固定外壳
- 希望各路由只填主内容，不复制侧栏 DOM

登录页、落地页通常用独立壳，不必套这套 Layout。

## 步骤

1. 引入 `MLayout` / `MLayoutHeader` / `MLayoutSider` / `MLayoutContent`（可选 `MLayoutFooter`）。
2. 根布局给明确高度（全屏 `fill-viewport` 或 `100dvh`；文档预览用固定 `rem`）。
3. **直接包裹** `MLayoutSider` 的那一层 `MLayout` 设 `has-sider`。
4. 侧栏用 `v-model:collapsed`、`show-trigger`、`collapse-mode="width"`，并把同一 `collapsed` 传给 `MMenu`。
5. 主内容放进 `MLayoutContent`（可加 `embedded`）；生产环境换成 `<RouterView />`。

嵌入已有相对定位容器时，可用根布局 `position="absolute"`（父级需有高度），见 [Layout](/components/Layout) Absolute Shell。

## 预览

```vue preview src="./demos/recipes/AdminChrome.zh.vue"

```

## 检查清单

- [ ] `has-sider` 写在直接包裹 Sider 的 `MLayout` 上
- [ ] 根布局有明确高度，Content 才能撑开
- [ ] `MLayoutSider` 与 `MMenu` 的折叠状态一致
- [ ] 长内容在 Content 上滚动（`overflow: auto` 或内嵌 `MScrollbar`），不要让整页跟着滚
- [ ] 已引入 `morya-ui` 与样式

## 相关

- [Layout](/components/Layout) · [Menu](/components/Menu)
- [布局](/docs/design-layout) · [间距](/docs/design-spacing)
- [主题定制](/docs/recipe-theme-customize)
