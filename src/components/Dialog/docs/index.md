---
title: Dialog
category: 04 / OVERLAY
description: 模态对话框。支持预设页脚、异步关闭拦截、状态 type。
---

# Dialog

模态对话框。可见性使用 `v-model`（`modelValue`），对应 的 `visible`。

## 引入

```ts
import { WiButton, WiDialog } from '@well-insight/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WiButton, WiDialog } from '@well-insight/ui'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <div>
    <WiButton label="Open Dialog" @click="open = true" />
    <WiDialog v-model="open" header="Confirm" width="28rem">
      <p style="margin:0">
        Use <code>header</code> or <code>title</code> for the dialog title.
      </p>
    </WiDialog>
  </div>
</template>
```

## Positions

支持 `center` / `top` / `bottom` / `left` / `right` 以及四角位置。

```vue preview
<script setup lang="ts">
import { WiButton, WiDialog } from '@well-insight/ui'
import { ref } from 'vue'

const open = ref(false)
const position = ref<'center' | 'top' | 'topright' | 'bottomleft'>('center')

function openAt(next: 'center' | 'top' | 'topright' | 'bottomleft') {
  position.value = next
  open.value = true
}
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem">
    <WiButton label="Center" size="small" @click="openAt('center')" />
    <WiButton label="Top" size="small" severity="secondary" @click="openAt('top')" />
    <WiButton label="Top Right" size="small" @click="openAt('topright')" />
    <WiButton label="Bottom Left" size="small" severity="secondary" @click="openAt('bottomleft')" />
    <WiDialog v-model="open" :header="`Position: ${position}`" :position="position">
      <p style="margin:0">
        Dialog can dock to edges and corners.
      </p>
    </WiDialog>
  </div>
</template>
```

## Footer actions

```vue preview
<script setup lang="ts">
import { WiButton, WiDialog } from '@well-insight/ui'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <div>
    <WiButton label="With Footer" @click="open = true" />
    <WiDialog v-model="open" header="Save changes" width="28rem">
      <p style="margin:0">
        Footer slot is for primary and secondary actions.
      </p>
      <template #footer>
        <div style="display:flex;gap:0.75rem;justify-content:flex-end;width:100%">
          <WiButton label="Cancel" severity="secondary" text @click="open = false" />
          <WiButton label="Confirm" @click="open = false" />
        </div>
      </template>
    </WiDialog>
  </div>
</template>
```

## No dismiss mask

`dismissableMask={false}`（或 `closeOnOutsideClick={false}`）时点击遮罩不关闭。

```vue preview
<script setup lang="ts">
import { WiButton, WiDialog } from '@well-insight/ui'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <div>
    <WiButton label="No Mask Dismiss" severity="secondary" @click="open = true" />
    <WiDialog v-model="open" header="Stay open" :dismissable-mask="false">
      <p style="margin:0">
        Click the mask — the dialog stays open. Use the close button or Esc.
      </p>
    </WiDialog>
  </div>
</template>
```

## Maximizable

`maximizable` 在标题栏提供最大化 / 还原切换。

```vue preview
<script setup lang="ts">
import { WiButton, WiDialog } from '@well-insight/ui'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <div>
    <WiButton label="Maximizable" @click="open = true" />
    <WiDialog v-model="open" header="Workspace" maximizable width="32rem">
      <p style="margin:0">
        Toggle maximize to fill the viewport.
      </p>
    </WiDialog>
  </div>
</template>
```

## 预设页脚与异步关闭

`positiveText` / `negativeText` 生成确认 / 取消按钮（`footer` 插槽优先）。处理函数返回 `false`（含 Promise）则保持打开。确认型流程请用 [ConfirmDialog](/components/ConfirmDialog)；`type` 只负责 Dialog 标题图标。

```vue preview
<script setup lang="ts">
import { WiButton, WiDialog } from '@well-insight/ui'
import { ref } from 'vue'

const open = ref(false)

async function save() {
  await new Promise((resolve) => setTimeout(resolve, 400))
}
</script>

<template>
  <div>
    <WiButton label="Save dialog" @click="open = true" />
    <WiDialog
      v-model="open"
      header="保存更改"
      type="info"
      positive-text="保存"
      negative-text="取消"
      :on-positive-click="save"
      :before-close="() => true"
      width="28rem"
    >
      <p style="margin:0">
        关闭按钮、Esc、遮罩会走 <code>beforeClose</code>；保存走 <code>onPositiveClick</code>。
      </p>
    </WiDialog>
  </div>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | 可见性。配合 `v-model` 使用（对应 `visible`）。 |
| `title` | `string` | — | 标题文案。 |
| `header` | `string` | — | `title` 的 别名。 |
| `closeOnEsc` | `boolean` | `true` | 按 Esc 关闭。 |
| `blockScroll` | `boolean` | `true` | 打开时锁定页面滚动（`modal` 时生效）。 |
| `closeOnOutsideClick` | `boolean` | `true` | 点击遮罩关闭。 |
| `dismissableMask` | `boolean` | — | `closeOnOutsideClick` 的 别名。 |
| `closable` | `boolean` | `true` | 显示关闭按钮。 |
| `maximizable` | `boolean` | `false` | 显示最大化 / 还原按钮。 |
| `modal` | `boolean` | `true` | 遮罩层。 |
| `position` | `'center' \| 'top' \| 'bottom' \| 'left' \| 'right' \| 'topleft' \| 'topright' \| 'bottomleft' \| 'bottomright'` | `'center'` | 对话框位置。 |
| `width` | `string` | — | 对话框宽度（最大化时忽略）。 |
| `teleport` | `boolean` | `true` | 浮层 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self'` | `'body'` | 挂载目标；`'self'` 就地渲染。 |
| `type` | `'info' \| 'success' \| 'warning' \| 'error'` | — | 标题状态图标；`warning` 与 `warn` 同义 |
| `positiveText` / `negativeText` | `string` | — | 预设页脚按钮；有 `footer` 插槽时忽略 |
| `positiveSeverity` | `ButtonSeverity` | — | 确认按钮语义色 |
| `onPositiveClick` / `onNegativeClick` | `(e) => unknown \| Promise<unknown>` | — | 返回 `false` 则不关闭 |
| `beforeClose` | `() => unknown \| Promise<unknown>` | — | X / Esc / 遮罩关闭前；返回 `false` 则保持打开 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `boolean` | 可见性变化。 |
| `close` | — | 关闭时触发。 |
| `show` | — | 打开时触发。 |
| `hide` | — | 关闭后触发。 |
| `maximize` | — | 进入最大化。 |
| `unmaximize` | — | 退出最大化。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 对话框内容。 |
| `header` | 自定义标题区。 |
| `footer` | 底部操作区。 |
