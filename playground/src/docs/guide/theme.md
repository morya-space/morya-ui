---
title: 主题
order: 4
description: 亮暗主题、设计令牌与动效偏好。
---

# 主题

主题能力内置于 `@well-insight/ui`。组件只消费语义化 CSS 变量（`--wi-*`），不自行维护第二套色板。

引入 `@well-insight/ui/styles.css` 时已包含这些变量；主题 JS API（`useTheme` 等）从同一包导入。

## 亮 / 暗色

```ts
import { useTheme } from '@well-insight/ui'

const { isDark, setTheme, toggleTheme } = useTheme()

setTheme('light') // 或 'dark'
toggleTheme()
```

文档站右上角的按钮调用的就是同一套 API。主题偏好会写到 `document.documentElement` 的 `data-theme`。

## 设计令牌

常用变量示例：

| Token | 用途 |
| --- | --- |
| `--wi-color-primary` | 品牌主色 |
| `--wi-color-surface` | 页面底色 |
| `--wi-color-text` | 正文 |
| `--wi-color-border` | 分割线 / 描边 |
| `--wi-radius-sm/md/lg` | 圆角阶梯 |
| `--wi-space-*` | 间距阶梯 |
| `--wi-font-size-xs/sm/md/lg` | 组件正文字号阶梯 |
| `--wi-opacity-disabled` | 禁用态透明度 |
| `--wi-z-base` / `--wi-z-overlay` / `--wi-z-dropdown` / `--wi-z-toast` | 浮层层叠（Config `zIndex` 会写 `--wi-z-base`） |
| `--wi-menu-min-width` / `--wi-control-affix-*` | 菜单最小宽、输入清除区尺寸 |
| `--wi-motion-fast/normal` | 过渡时长 |

## 内容密度

```ts
import { useDensity } from '@well-insight/ui'

const { preference, setDensity } = useDensity()
setDensity('compact') // 'compact' | 'comfortable' | 'spacious'
```

也会写到 `document.documentElement` 的 `data-wi-density`，并缩放 `--wi-space-*` 与 `--wi-control-height-*`。  
应用级可用 `createWellInsight({ density: 'compact' })` 或 `<WiConfigProvider density="compact">`。

在组件页侧栏「主题」可临时改主色、圆角与密度，用于本地预览。

## 动效偏好

```ts
import { useMotion } from '@well-insight/ui'

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
| `small` | `28px`（`--wi-control-height-small`） | `14px` |
| 默认 / `medium` | `34px` | `14px` |
| `large` | `40px` | `15px` |

聚焦样式为 **主色描边 + 2px 淡色光晕**（非外扩 outline ring）：

```css
border-color: var(--wi-color-primary-hover);
box-shadow: var(--wi-focus-shadow); /* 0 0 0 2px primary@20% */
```

相关 token：`--wi-radius-control`、`--wi-control-padding-x-*`、`--wi-button-padding-x-*`、`--wi-focus-shadow` / `--wi-focus-shadow-danger`。

## 与 ConfigProvider

主题切换是「视觉层」；`WiConfigProvider` / `createWellInsight` 负责尺寸、文案、浮层挂载等「行为默认值」。二者可同时使用，详见 [全局配置](/docs/config)。
