---
title: 约定
order: 35
description: morya-ui 的命名、语义色、尺寸与主题约定。
---

# 约定

Morya UI 用自己的词表描述界面：组件前缀 `M*`、语义色 `severity`、外观 `variant`、设计令牌 `--m-*`。写业务页时直接跟这套约定走。

## 组件与令牌

| 约定 | 说明 |
| --- | --- |
| 组件名 | 一律 `M` 前缀：`MButton`、`MDialog`、`MTable` |
| 主题 | `MConfigProvider` + `useTheme` / `useDensity` / `useMotion` |
| 颜色与几何 | 只用 `--m-*`，品牌色改 `--m-color-primary` |
| 控件高度 | 默认 medium `32px`，圆角 `--m-control-radius` |
| 字重 | 控件文案默认 400 |

完整变量见 [设计令牌](/docs/design-tokens)，覆盖方式见 [主题](/docs/theme)。

## 语义与外观

| 词 | 用在 |
| --- | --- |
| `severity` | 语义色：`primary` / `secondary` / `success` / `info` / `warning` / `danger` |
| `variant` | 外观：`outlined` / `dashed` / `text` / `link` / `ghost` 等 |
| `fluid` | 通栏（占满父级宽度） |
| `size` | `small` / `medium` / `large`（部分控件仍接受 `sm` / `md` / `lg`） |
| `status` | 表单控件校验态：`error` / `warning` |

按钮默认就是主色实心；次要操作用 `severity="secondary"`，危险操作用 `severity="danger"`。

## 反馈

| 场景 | 用法 |
| --- | --- |
| 短操作结果 | `message` / `MMessage` |
| 摘要 + 详情、异步过程 | `toast` / `MToast` |
| 需要确认 | `MConfirmDialog` / `MConfirmPopup` / `useConfirm` |
| 页面内常驻说明 | `MAlert` |
| 阻塞等待 | `MLoading`（细环可用 `MProgressSpinner`） |
| 进度 | `MProgressBar` |
| 空态 / 结果页 | `MEmpty` / `MResult` |

## 布局与页面

后台骨架用 `MLayout` 系列；列表/筛选/统计块用 `MPage*`。间距容器是 `MSpace` / `MFlex` / `MGrid`，相邻按钮拼组用 `MButtonGroup`。

## 本库特有的能力

Dock、Terminal、Knob、Page 套件、以及 MCP / Agent Skill 是同一套令牌上的产品面。选型看 [组件文档](/components/Button) 和仓库 `DESIGN.md`。
