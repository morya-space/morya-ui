---
title: 布局
order: 4.54
description: 页面骨架、间距容器与后台高频布局约定。
---

# 布局

布局分三层：**应用外壳**（`MLayout*`）、**页面区块**（`MPage*`）、**局部排版**（`MSpace` / `MFlex` / `MGrid`）。不要把某一种后台侧栏当成所有页面的默认结构——外壳随场景选择。

## 原则

- **组件优先**：骨架与栅格用库内组件，少手写等价 DOM。
- **间距令牌化**：外边距 / gap 用 `--m-space-*` 或布局组件的 `gap` / `size`，见 [间距](/docs/design-spacing)。
- **密度一次生效**：`data-m-density` 会改 header / footer 高度与导航轨宽（`--m-layout-*`、`--m-nav-rail-*`）。
- **浮层离文档流**：Dialog / Drawer / Select 菜单 Teleport；`appendTo` / `zIndex` 见 [全局配置](/docs/config)。

## 应用外壳

| 能力                               | 说明                       |
| ---------------------------------- | -------------------------- |
| `MLayout` 系列                     | 头 / 侧 / 内容 / 底栏组合  |
| `--m-layout-header-height`         | 顶栏高度（随控件高与密度） |
| `--m-layout-footer-height`         | 底栏高度                   |
| `--m-nav-rail-width` / `collapsed` | 导航轨展开 / 收起宽        |

`compact` 下 header 约 `3rem`，`spacious` 约 `4rem`。登录 / 落地页可用独立壳，不必套后台 Layout。

## 页面区块

列表、筛选、统计、详情高频块用 `MPage*`（具体选型见组件文档与 MCP `get_design_rules`）。原则：

- 筛选条与表格标题区对齐同一水平节奏。
- KPI / 统计与主表分区用 `space-6` / `space-8`，避免贴死。
- 空态用 `MEmpty`，结果页用 `MResult`，不要空白撑高伪装「已加载」。

## 局部排版

| 组件           | 用途                           |
| -------------- | ------------------------------ |
| `MSpace`       | 线性间距（相邻按钮、表单项行） |
| `MFlex`        | 弹性行 / 列                    |
| `MGrid`        | 响应栅格                       |
| `MButtonGroup` | 相邻按钮拼组（取消双边框缝）   |
| `fluid` prop   | 控件通栏占满父宽               |

字段类组件的布局 `class` 落在 **field 根**，不是内层 input——见 [样式与 attrs](/docs/attrs)。

## 建议与避免

| 建议                              | 避免                                  |
| --------------------------------- | ------------------------------------- |
| 先定外壳再填 `MPage*` 区块        | 每个路由复制一套侧栏 DOM              |
| 表单两列用 `MGrid` + 字段 `class` | 用绝对定位硬凑对齐                    |
| 主内容区限制最大阅读宽（长文）    | 后台表格区域被无意义的大 padding 吃掉 |
| 浮层 `zIndex` 统一从 Config 抬升  | 业务里到处写 `z-index: 9999`          |

相关：[约定](/docs/conventions)、[Common Props](/docs/common-props)。下一章：[动效](/docs/motion)。
