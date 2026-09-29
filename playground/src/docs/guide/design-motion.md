---
title: 动效（设计）
order: 4.55
description: 动效时长、缓动、减弱策略与设计原则（API 见动效指南）。
---

# 动效（设计）

本章讲**设计意图**：何时动、动多少、如何减弱。实现与预设注册见独立 API 文档 [动效](/docs/motion)（`useMotion`、`transition`、进出场 id）。

动效两层正交：

1. **强度**：`full` / `reduced` / `none` → `data-m-motion`
2. **形态**：命名进出场（`fade`、`scale-fade`、`dialog`…）

## 原则

- **服务状态变化**：开关浮层、列表更新、加载反馈；不为装饰循环占用注意力。
- **令牌驱动时长**：`--m-motion-fast` / `normal` / `enter` / `exit`，位移 `--m-motion-distance`，缓动 `--m-motion-ease`。
- **强度可关**：组件跟 `useMotion`，**不**读取系统 `prefers-reduced-motion`；产品可把偏好暴露给用户。
- **循环指示器可停**：`reduced` / `none` 下 spin / pulse / skeleton 时长归零。

## 关键令牌（comfortable / full）

| Token | 默认 | 用途 |
| --- | --- | --- |
| `--m-motion-fast` | `150ms` | 微交互、色变 |
| `--m-motion-normal` | `250ms` | 一般过渡 |
| `--m-motion-enter` | `200ms` | 进场 |
| `--m-motion-exit` | `150ms` | 退场（略快于进场） |
| `--m-motion-distance` | `0.5rem` | 滑入位移 |
| `--m-motion-ease` | `cubic-bezier(0.215, 0.61, 0.355, 1)` | 默认缓动 |

`reduced`：时长缩短、位移 `0`、循环动画停。`none`：过渡近似瞬时。

## 场景建议

| 场景 | 建议 |
| --- | --- |
| Dialog / Drawer | 用角色默认或 Config `motion.transitions`；避免夸张 bounce 挡内容 |
| Toast / Message | 短进短出；勿遮挡主按钮过久 |
| 按钮 ripple / press | 默认关闭；需触感时显式 `ripple` / `press`，且在 `none` 下应失效 |
| 骨架屏 | 内容结构已知时用；`reduced` 下停止闪烁 |

浮层解析优先级（摘要）：组件 `transition` → `componentDefaults` → `motion.transitions[role]` → 内置默认。细节与自定义 `registerMotionPreset` 见 [动效](/docs/motion)。

## 建议与避免

| 建议 | 避免 |
| --- | --- |
| 退场 ≤ 进场，减少「拖沓感」 | 同一页面多种无关缓动曲线 |
| 提供 `reduced` / `none` 入口 | 强制长循环动画无法关闭 |
| 遮罩 fade、面板再做强调（Dialog） | 整层遮罩跟面板一起弹跳导致截断 |
| 用令牌改时长 | 组件内写死 `transition: 0.8s` |

下一章：[反馈](/docs/design-feedback)。编程接入与演示回到 [动效](/docs/motion)。
