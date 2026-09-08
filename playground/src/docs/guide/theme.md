---
title: 主题
order: 4
description: 亮暗主题、设计令牌与动效偏好。
---

# 主题

主题能力内置于 `@wise-kit/ui`。组件只消费语义化 CSS 变量（`--wk-*`），不自行维护第二套色板。

引入 `@wise-kit/ui/styles.css` 时已包含这些变量；主题 JS API（`useTheme` 等）从同一包导入。

## 亮 / 暗色

```ts
import { useTheme } from '@wise-kit/ui'

const { isDark, setTheme, toggleTheme } = useTheme()

setTheme('light') // 或 'dark'
toggleTheme()
```

文档站右上角的按钮调用的就是同一套 API。主题偏好会写到 `document.documentElement` 的 `data-theme`。

## 设计令牌

常用变量示例见 [设计令牌](/docs/design-tokens) 完整列表（支持搜索与分类）。

| Token | 用途 |
| --- | --- |
| `--wk-color-primary` | 品牌主色 |
| `--wk-color-surface` | 页面底色 |
| `--wk-color-text` | 正文 |
| `--wk-color-border` | 分割线 / 描边 |
| `--wk-radius-sm/md/lg` | 圆角阶梯 |
| `--wk-space-*` | 间距阶梯 |
| `--wk-font-size-xs/sm/md/lg` | 组件正文字号阶梯 |
| `--wk-opacity-disabled` | 禁用态透明度 |
| `--wk-z-base` / `--wk-z-overlay` / `--wk-z-dropdown` / `--wk-z-toast` | 浮层层叠（Config `zIndex` 会写 `--wk-z-base`） |
| `--wk-menu-min-width` / `--wk-control-affix-*` | 菜单最小宽、输入清除区尺寸 |
| `--wk-motion-fast/normal` | 过渡时长 |

## 内容密度

```ts
import { useDensity } from '@wise-kit/ui'

const { preference, setDensity } = useDensity()
setDensity('compact') // 'compact' | 'comfortable' | 'spacious'
```

也会写到 `document.documentElement` 的 `data-wk-density`，并缩放 `--wk-space-*` 与 `--wk-control-height-*`。  
应用级可用 `createWiseKit({ density: 'compact' })` 或 `<WkConfigProvider density="compact">`。

在组件页侧栏「主题」可临时改主色、圆角与密度，用于本地预览。

## 动效偏好

```ts
import { useMotion } from '@wise-kit/ui'

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
| `small` | `28px`（`--wk-control-height-small`） | `14px` |
| 默认 / `medium` | `34px` | `14px` |
| `large` | `40px` | `15px` |

聚焦样式为 **主色描边 + 2px 淡色光晕**（非外扩 outline ring）：

```css
border-color: var(--wk-color-primary-hover);
box-shadow: var(--wk-focus-shadow); /* 0 0 0 2px primary@20% */
```

相关 token：`--wk-radius-control`、`--wk-control-padding-x-*`、`--wk-button-padding-x-*`、`--wk-focus-shadow` / `--wk-focus-shadow-danger`。

## 与 ConfigProvider

主题切换是「视觉层」；`WkConfigProvider` / `createWiseKit` 负责尺寸、文案、浮层挂载等「行为默认值」。二者可同时使用，详见 [全局配置](/docs/config)。
