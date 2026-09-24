---
title: Loading
category: 05 / FEEDBACK
description: 加载指示与遮罩：多种动效、区域加载、v-loading 指令和命令式 service。
---

# Loading

用于区域或全屏的加载反馈。可以只渲染指示器，也可以盖住一块内容，或用指令和服务在任意节点上打开遮罩。

内置圆环、极光环、弹跳球、波浪条、脉冲环和星尘。默认是圆环（`effect="circular"`）。要改全局默认动效，设置 `componentDefaults.Loading.effect`。

全屏遮罩会 Teleport 到 `body`，避免被父级 `overflow` / `transform` 裁切。同一时间只保留一个全屏实例。

## 引入

```ts
import { loading, MLoading, useLoading, vLoading } from 'morya-ui'
```

`app.use(MoryaUI)` 会注册 `v-loading`。按需引入时，在 `<script setup>` 里导入 `vLoading` 即可在模板中使用该指令。

## 动效

```vue preview src="./demos/Effects.vue"
```

## 区域加载

组件包住内容，或在元素上使用 `v-loading`。未传 `text` 时不显示文案，读屏仍使用 locale 的 `loading`。可用 `delay` 避免短请求闪一下。

```vue preview src="./demos/Region.zh.vue"
```

## 服务式调用

不传 `target` 时遮罩铺满视口。`close()` 会先播放离场再卸载，`setText()` 改文案。也可用 `useLoading()`，在组件卸载时自动关闭。

```vue preview src="./demos/Service.zh.vue"
```

```ts
const instance = loading.service({
  text: '正在提交',
  effect: 'wave',
  lock: true,
})
instance.setText('即将完成')
instance.close()
```

覆盖某个节点，或传入自定义指示器：

```ts
loading.service({
  target: '#panel',
  text: '加载中',
})

loading.service({
  spinner: () => h('span', '…'),
  text: '自定义',
})
```

```ts
const { open, close } = useLoading({ effect: 'wave' })
open({ text: '保存中' })
close()
```

## 指令

| 写法 | 说明 |
| --- | --- |
| `v-loading` | 布尔值，或带 `text` / `effect` / `background` / `lock` / `delay` / `spinner` 等字段的对象。 |
| `v-loading.fullscreen` | 全屏遮罩。 |
| `v-loading.lock` | 打开时锁定页面滚动。 |
| `v-loading.body` | 遮罩挂到 `body`，并盖住当前元素（跟随尺寸变化）。 |
| `m-loading-text` | 文案。 |
| `m-loading-effect` | `circular` / `aurora` / `bounce` / `wave` / `pulse` / `stardust`。 |
| `m-loading-background` | 遮罩背景色。 |
| `m-loading-custom-class` | 加在遮罩上的类名。 |
| `m-loading-delay` | 显示前延迟（ms）。 |

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `loading` | `boolean` | `true` | 包裹内容或 `fullscreen` 时是否显示遮罩。单独指示器始终显示。 |
| `effect` | `'circular' \| 'aurora' \| 'bounce' \| 'wave' \| 'pulse' \| 'stardust'` | `'circular'` | 动效。可用 `componentDefaults.Loading.effect` 改默认值。 |
| `text` | `string` | — | 指示器下方文案。不传则不显示。 |
| `ariaLabel` | `string` | locale `loading` | 无文案时的可访问名称。有文案时以文案为准。 |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 指示器缩放。 |
| `background` | `string` | — | 遮罩背景，任意 CSS 颜色。 |
| `customClass` | `string` | — | 加在遮罩上的类名。 |
| `fullscreen` | `boolean` | `false` | 遮罩铺满视口（Teleport 到 `body`）。 |
| `lock` | `boolean` | `false` | 显示时禁止页面滚动。 |
| `delay` | `number` | `0` | 显示前延迟（ms）。 |
| `transition` | `string \| false` | `'loading'` | 进出场动效预设；`false` / `'none'` 关闭。见[动效](/docs/motion)。 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs)。 |

## Events

无自定义事件。

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 被遮罩盖住的内容。 |
| `indicator` | 替换遮罩中的指示器。仅在有默认插槽或 `fullscreen` 时生效。 |

## 服务

`loading.service(options)` 返回 `{ close, setText }`。`useLoading(defaults)` 返回 `{ open, close, setText }`。

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `target` | `string \| HTMLElement` | — | 要盖住的元素或选择器。省略则为全屏。 |
| `fullscreen` | `boolean` | 无 `target` 时为 `true` | 铺满视口。 |
| `body` | `boolean` | `false` | 遮罩挂到 `body`，定位到 `target` 上。 |
| `lock` | `boolean` | `false` | 锁定页面滚动。 |
| `text` | `string` | — | 文案。 |
| `effect` | 同组件 | `'circular'` | 动效。 |
| `spinner` | `MRenderable` | — | 自定义指示器；设置后忽略内置 `effect`。 |
| `background` | `string` | — | 遮罩背景。 |
| `customClass` | `string` | — | 遮罩类名。 |
| `size` | 同组件 | — | 指示器尺寸。 |
| `delay` | `number` | — | 显示前延迟（ms）。 |

## 主题

指示器颜色走语义色：`--m-color-primary`、`--m-color-success`、`--m-color-warning`、`--m-color-danger`、`--m-color-text-muted`。遮罩默认是表面色的半透明混合，可用 `background` 或 `--m-loading-mask-bg` 覆盖。全屏层级是 `--m-loading-z-index`（默认 `--m-z-base + 200`）。

主题动效为 `reduced` 或 `none` 时循环动效关闭。

## 无障碍

- 指示器使用 `role="status"`。
- 遮罩区域设置 `aria-busy`，被盖住的内容设为 `inert`。
- 不要只靠动画表示加载；需要说明时传入 `text`。
