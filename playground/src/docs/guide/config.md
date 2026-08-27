---
title: 全局配置
order: 5
description: ConfigProvider、createWellInsight 与 useWiConfig。
---

# 全局配置

Well Insight 提供应用级 / 页面级默认值，用于统一浮层挂载、尺寸、密度与文案。

## 能力一览

| 字段 | 说明 |
| --- | --- |
| `appendTo` | 浮层默认 Teleport 目标，默认 `body` |
| `size` | 表单 / 按钮等默认尺寸 |
| `density` | `compact` / `comfortable` / `spacious`，缩放间距与控件高度 |
| `inputVariant` | 输入框 `outlined` / `filled` |
| `zIndex` | 浮层基准层级 |
| `locale` | 确认、空态、加载、占位等文案。可传入内置语言包 `zhCN` / `enUS` |

优先级：**组件 Props > `WiConfigProvider` > `createWellInsight` > 内置默认（中文）**。

## 语言包

组件内置文案默认中文。切换英文时传入 `enUS`：

```ts
import { createWellInsight, enUS, zhCN } from '@well-insight/ui'
import { createApp } from 'vue'

createApp(App).use(createWellInsight({ locale: enUS })).mount('#app')
```

也可以只覆盖部分文案：

```ts
createWellInsight({
  locale: {
    ...zhCN,
    accept: '确定',
  },
})
```

文档站右上角的「中 / EN」会把同一套语言包注入 `WiConfigProvider`，因此示例里的空态、确认、日期等文案会跟着切换。指南与组件 Markdown 在英文下会加载对应的 `*.en.md`。

## Size

未传本地 `size` 的控件继承 ConfigProvider。

```vue preview
<script setup lang="ts">
import { WiButton, WiConfigProvider, WiInput, WiSelect } from '@well-insight/ui'
import { ref } from 'vue'

const city = ref<string | undefined>()
const options = [
  { label: '北京', value: 'bj' },
  { label: '上海', value: 'sh' },
]
</script>

<template>
  <div style="display:grid;gap:1rem">
    <div>
      <p style="margin:0 0 0.5rem;color:var(--wi-color-text-muted);font-size:0.75rem">
        默认尺寸
      </p>
      <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
        <WiButton label="按钮" />
        <WiInput placeholder="输入" style="width:10rem" />
        <WiSelect v-model="city" :options="options" style="width:10rem" />
      </div>
    </div>
    <WiConfigProvider size="small">
      <p style="margin:0 0 0.5rem;color:var(--wi-color-text-muted);font-size:0.75rem">
        Config size="small"
      </p>
      <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
        <WiButton label="按钮" />
        <WiInput placeholder="输入" style="width:10rem" />
        <WiSelect v-model="city" :options="options" style="width:10rem" />
      </div>
    </WiConfigProvider>
  </div>
</template>
```

## Density

```vue preview
<script setup lang="ts">
import { WiButton, WiConfigProvider, WiInput } from '@well-insight/ui'
import { ref } from 'vue'

const density = ref<'compact' | 'comfortable' | 'spacious'>('compact')
</script>

<template>
  <div style="display:grid;gap:0.75rem">
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
      <WiButton
        v-for="item in (['compact', 'comfortable', 'spacious'] as const)"
        :key="item"
        :label="item"
        :outlined="density !== item"
        size="small"
        @click="density = item"
      />
    </div>
    <WiConfigProvider :density="density" :global-density="false">
      <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;padding:0.75rem;border:1px solid var(--wi-color-border);border-radius:var(--wi-radius-md)">
        <WiButton label="保存" />
        <WiInput placeholder="昵称" style="width:12rem" />
      </div>
    </WiConfigProvider>
  </div>
</template>
```

## Input variant

```vue preview
<script setup lang="ts">
import { WiConfigProvider, WiInput, WiTextarea } from '@well-insight/ui'
</script>

<template>
  <div style="display:grid;gap:1rem;grid-template-columns:1fr 1fr">
    <WiConfigProvider input-variant="outlined">
      <p style="margin:0 0 0.5rem;font-size:0.75rem;color:var(--wi-color-text-muted)">
        outlined
      </p>
      <div style="display:grid;gap:0.5rem">
        <WiInput placeholder="Outlined input" />
        <WiTextarea placeholder="Outlined textarea" :rows="2" />
      </div>
    </WiConfigProvider>
    <WiConfigProvider input-variant="filled">
      <p style="margin:0 0 0.5rem;font-size:0.75rem;color:var(--wi-color-text-muted)">
        filled
      </p>
      <div style="display:grid;gap:0.5rem">
        <WiInput placeholder="Filled input" />
        <WiTextarea placeholder="Filled textarea" :rows="2" />
      </div>
    </WiConfigProvider>
  </div>
</template>
```

## Locale

```vue preview
<script setup lang="ts">
import { WiButton, WiConfigProvider, WiConfirmDialog, WiSelect } from '@well-insight/ui'
import { ref } from 'vue'

const city = ref<string | undefined>()
const confirmOpen = ref(false)
const options = [
  { label: '北京', value: 'bj' },
  { label: '上海', value: 'sh' },
]
</script>

<template>
  <WiConfigProvider
    :locale="{ selectPlaceholder: '挑一个城市', accept: '好的', reject: '再想想' }"
  >
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
      <WiSelect v-model="city" :options="options" style="width:12rem" />
      <WiButton label="打开确认框" @click="confirmOpen = true" />
      <WiConfirmDialog
        v-model="confirmOpen"
        header="确认操作"
        message="文案来自 locale.accept / reject。"
      />
    </div>
  </WiConfigProvider>
</template>
```

## appendTo + zIndex

```vue preview
<script setup lang="ts">
import { WiButton, WiConfigProvider, WiDialog } from '@well-insight/ui'
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <WiConfigProvider append-to="body" :z-index="2200">
    <WiButton label="打开对话框" @click="visible = true" />
    <WiDialog v-model="visible" header="挂载到 body" width="24rem">
      <p style="margin:0">
        浮层默认 Teleport 到 body，zIndex 基准由 ConfigProvider 提供。
      </p>
    </WiDialog>
  </WiConfigProvider>
</template>
```

## 应用级：`createWellInsight`

```ts
import { createWellInsight } from '@well-insight/ui'
import { createApp } from 'vue'

createApp(App).use(
    createWellInsight({
      appendTo: 'body',
      size: 'small',
      zIndex: 2000,
      locale: { accept: '确认', reject: '取消' },
    }),
  ).mount('#app')
```

## 读取配置

```ts
import { useWiConfig } from '@well-insight/ui'

const config = useWiConfig()
// config.value.appendTo / size / locale …
```

完整 Props 与对照表见组件文档：[ConfigProvider](/components/ConfigProvider)。
