---
title: Icon
category: 01 / BASIC
description: 系统线框图标注册表。业务图标用默认插槽接入 Lucide 等库。
---

# Icon

`WdIcon` 只维护**组件库系统图标**（关闭、箭头、状态、操作等）。完整业务图标请用默认插槽接入 [Lucide](https://lucide.dev) 等库，避免把数百个 SVG 打进 `@wex-design/ui`。

## 引入

```ts
import { iconNames, WdIcon } from '@wex-design/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WdIcon } from '@wex-design/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center">
    <WdIcon name="search" />
    <WdIcon name="check-circle" size="small" />
    <WdIcon name="warning" size="large" />
    <WdIcon name="loader" size="sm" label="Loading" />
  </div>
</template>
```

## 全部系统图标

点击图标即可复制名称（如 `search`），用法：`<WdIcon name="search" />`。

```vue preview
<script setup lang="ts">
import type {ToastMessage} from '@wex-design/ui';
import { iconNames,  WdIcon, WdInput, WdToast } from '@wex-design/ui'
import { computed, ref } from 'vue'

const query = ref('')
const copied = ref<string | null>(null)
const messages = ref<ToastMessage[]>([])
let toastSeq = 0
let copiedTimer: ReturnType<typeof setTimeout> | undefined

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return [...iconNames]
  return iconNames.filter((name) => name.toLowerCase().includes(q))
})

function itemStyle(name: string) {
  const active = copied.value === name
  return [
    'align-items:center',
    'background:var(--wd-color-surface)',
    `border:1px solid ${active ? 'var(--wd-color-primary)' : 'var(--wd-color-border)'}`,
    'border-radius:var(--wd-radius-control, 3px)',
    `color:${active ? 'var(--wd-color-primary)' : 'var(--wd-color-text)'}`,
    'cursor:pointer',
    'display:flex',
    'flex-direction:column',
    'font:inherit',
    'gap:0.65rem',
    'justify-content:center',
    'min-height:6.5rem',
    'padding:0.85rem 0.5rem',
    'width:100%',
  ].join(';')
}

async function copyName(name: string) {
  try {
    await navigator.clipboard.writeText(name)
  } catch {
    const area = document.createElement('textarea')
    area.value = name
    document.body.appendChild(area)
    area.select()
    document.execCommand('copy')
    area.remove()
  }
  copied.value = name
  if (copiedTimer) clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => {
    if (copied.value === name) copied.value = null
  }, 1200)

  const id = `icon-copy-${++toastSeq}`
  messages.value = [
    ...messages.value,
    {
      id,
      severity: 'success',
      summary: '已复制',
      detail: name,
      closable: true,
    },
  ]
  window.setTimeout(() => {
    messages.value = messages.value.filter((item) => item.id !== id)
  }, 1600)
}

function onToastClose(message: ToastMessage) {
  messages.value = messages.value.filter((item) => item.id !== message.id)
}
</script>

<template>
  <div style="width:100%">
    <WdInput
      v-model="query"
      clearable
      fluid
      placeholder="搜索图标名称…"
      style="max-width: 20rem; margin-bottom: 1rem"
    >
      <template #prefix>
        <WdIcon name="search" size="sm" />
      </template>
    </WdInput>

    <p
      v-if="!filtered.length"
      style="color: var(--wd-color-text-muted); font-size: 0.875rem; margin: 0.5rem 0 0"
    >
      没有匹配的图标
    </p>

    <div
      v-else
      style="display:grid;grid-template-columns:repeat(auto-fill,minmax(7.25rem,1fr));gap:0.75rem;width:100%"
    >
      <button
        v-for="name in filtered"
        :key="name"
        type="button"
        :style="itemStyle(name)"
        :title="`点击复制 ${name}`"
        @click="copyName(name)"
      >
        <WdIcon :name="name" size="large" />
        <span
          style="font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:0.72rem;line-height:1.3;max-width:100%;overflow:hidden;text-align:center;text-overflow:ellipsis;white-space:nowrap"
        >
          {{ copied === name ? '已复制' : name }}
        </span>
      </button>
    </div>

    <WdToast :messages="messages" position="top-right" @close="onToastClose" />
  </div>
</template>
```

## 自定义 / Lucide（推荐业务侧）

系统图标不够时，不要往组件库堆 SVG，用默认插槽挂任意图标组件：

```vue
<script setup lang="ts">
import { WdButton, WdIcon, WdIconField, WdInput } from '@wex-design/ui'
import { User } from 'lucide-vue-next'
</script>

<template>
  <WdIcon label="用户" size="md">
    <User :size="16" :stroke-width="1.8" />
  </WdIcon>

  <WdIconField>
    <template #icon>
      <WdIcon size="sm">
        <User :size="14" :stroke-width="1.8" />
      </WdIcon>
    </template>
    <WdInput placeholder="搜索用户" />
  </WdIconField>

  <!-- Button 也可直接传组件，不必包 WdIcon -->
  <WdButton :icon="User" label="资料" />
</template>
```

安装示例：`pnpm add lucide-vue-next`。线宽建议 `1.75`–`2`，与系统图标 `1.8` 接近。

有默认插槽时**优先渲染插槽**，忽略 `name`。

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `name` | `IconName` | — | 系统图标名；插槽存在时可省略。 |
| `label` | `string` | — | 可访问名称；省略时 `aria-hidden`。 |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸；`sm`/`lg` 映射到 small/large。 |

## Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 自定义 SVG / 第三方图标组件。 |

## 工具导出

| 导出 | 说明 |
| --- | --- |
| `iconNames` | 全部系统图标名数组。 |
| `iconRegistry` / `getIconDefinition` / `isIconName` | 注册表与类型守卫。 |

## Events

无自定义事件。
