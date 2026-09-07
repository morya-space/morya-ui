---
title: 主题
order: 4
description: 亮暗主题、设计令牌与动效偏好。
---

# 主题

主题能力内置于 `@roost-design/ui`。组件只消费语义化 CSS 变量（`--rd-*`），不自行维护第二套色板。

引入 `@roost-design/ui/styles.css` 时已包含这些变量；主题 JS API（`useTheme` 等）从同一包导入。

## 亮 / 暗色

```ts
import { useTheme } from '@roost-design/ui'

const { isDark, setTheme, toggleTheme } = useTheme()

setTheme('light') // 或 'dark'
toggleTheme()
```

文档站右上角的按钮调用的就是同一套 API。主题偏好会写到 `document.documentElement` 的 `data-theme`。

## 设计令牌

常用变量示例：

| Token | 用途 |
| --- | --- |
| `--rd-color-primary` | 品牌主色 |
| `--rd-color-surface` | 页面底色 |
| `--rd-color-text` | 正文 |
| `--rd-color-border` | 分割线 / 描边 |
| `--rd-radius-sm/md/lg` | 圆角阶梯 |
| `--rd-space-*` | 间距阶梯 |
| `--rd-font-size-xs/sm/md/lg` | 组件正文字号阶梯 |
| `--rd-opacity-disabled` | 禁用态透明度 |
| `--rd-z-base` / `--rd-z-overlay` / `--rd-z-dropdown` / `--rd-z-toast` | 浮层层叠（Config `zIndex` 会写 `--rd-z-base`） |
| `--rd-menu-min-width` / `--rd-control-affix-*` | 菜单最小宽、输入清除区尺寸 |
| `--rd-motion-fast/normal` | 过渡时长 |

## 内容密度

```ts
import { useDensity } from '@roost-design/ui'

const { preference, setDensity } = useDensity()
setDensity('compact') // 'compact' | 'comfortable' | 'spacious'
```

也会写到 `document.documentElement` 的 `data-rd-density`，并缩放 `--rd-space-*` 与 `--rd-control-height-*`。  
应用级可用 `createRoostDesign({ density: 'compact' })` 或 `<RdConfigProvider density="compact">`。

在组件页侧栏「主题」可临时改主色、圆角与密度，用于本地预览。

## 动效偏好

```ts
import { useMotion } from '@roost-design/ui'

const { preference, setMotion } = useMotion()
setMotion('full') // 'full' | 'reduced' | 'none'
```

- `full`：标准过渡与浮层动画  
- `reduced`：缩短时长、弱化位移  
- `none`：立即切换  

## 控件尺寸与聚焦

默认控件高度采用 compact 节奏：

| Size | 高度 | 字号 |
| --- | --- | --- |
| `small` | `28px`（`--rd-control-height-small`） | `14px` |
| 默认 / `medium` | `34px` | `14px` |
| `large` | `40px` | `15px` |

聚焦样式为 **主色描边 + 2px 淡色光晕**（非外扩 outline ring）：

```css
border-color: var(--rd-color-primary-hover);
box-shadow: var(--rd-focus-shadow); /* 0 0 0 2px primary@20% */
```

相关 token：`--rd-radius-control`、`--rd-control-padding-x-*`、`--rd-button-padding-x-*`、`--rd-focus-shadow` / `--rd-focus-shadow-danger`。

## 与 ConfigProvider

主题切换是「视觉层」；`RdConfigProvider` / `createRoostDesign` 负责尺寸、文案、浮层挂载等「行为默认值」。二者可同时使用，详见 [全局配置](/docs/config)。
