---
title: 全局配置
order: 9
description: ConfigProvider、createMoryaUI 与 useMConfig。
---

# 全局配置

Morya UI 提供应用级 / 页面级默认值，用于统一浮层挂载、尺寸、密度与文案。

## 能力一览

| 字段 | 说明 |
| --- | --- |
| `appendTo` | 浮层默认 Teleport 目标，默认 `body` |
| `size` | 表单 / 按钮等默认尺寸 |
| `density` | `compact` / `comfortable` / `spacious`，缩放间距与控件高度 |
| `inputVariant` | 输入框 `outlined` / `filled` |
| `zIndex` | 浮层基准层级 |
| `locale` | 确认、空态、加载、占位等文案。可传入内置语言包 `zhCN` / `enUS` |

优先级：**组件 Props > `MConfigProvider` > `createMoryaUI` > 内置默认（中文）**。

## 语言包

组件内置文案默认中文。切换英文时传入 `enUS`：

```ts
import { createMoryaUI, enUS, zhCN } from 'morya-ui'
import { createApp } from 'vue'

createApp(App).use(createMoryaUI({ locale: enUS })).mount('#app')
```

也可以只覆盖部分文案：

```ts
createMoryaUI({
  locale: {
    ...zhCN,
    accept: '确定',
  },
})
```

文档站右上角的「中 / EN」会把同一套语言包注入 `MConfigProvider`，因此示例里的空态、确认、日期等文案会跟着切换。指南与组件 Markdown 在英文下会加载对应的 `*.en.md`。

## Size

未传本地 `size` 的控件继承 ConfigProvider。

```vue preview src="./demos/config/Size.zh.vue"
```

## Density

```vue preview src="./demos/config/Density.zh.vue"
```

## Input variant

```vue preview src="./demos/config/InputVariant.vue"
```

## Locale

```vue preview src="./demos/config/Locale.zh.vue"
```

## appendTo + zIndex

```vue preview src="./demos/config/AppendToZIndex.zh.vue"
```

## 应用级：`createMoryaUI`

```ts
import { createMoryaUI } from 'morya-ui'
import { createApp } from 'vue'

createApp(App).use(
    createMoryaUI({
      appendTo: 'body',
      size: 'small',
      zIndex: 2000,
      locale: { accept: '确认', reject: '取消' },
    }),
  ).mount('#app')
```

## 读取配置

```ts
import { useMConfig } from 'morya-ui'

const config = useMConfig()
// config.value.appendTo / size / locale …
```

完整 Props 与对照表见组件文档：[ConfigProvider](/components/ConfigProvider)。
