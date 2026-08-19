---
title: FileUpload
category: 10 / FILE
description: 选择、拖拽、列表、预览与上传。
---

# FileUpload

选择本地文件。支持点击选择、拖拽上传、文本 / 图片列表、卡片墙，以及通过 `action` 或 `httpRequest` 实际上传。`select` 仍会返回本次选中的 `File[]`，完整状态用 `v-model:file-list`。默认展示文件列表；提供上传地址或自定义请求后会自动上传。

## 引入

```ts
import { WdFileUpload } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdFileUpload } from '@well-insight/ui'

const names = ref<string[]>([])
function onSelect(files: File[]) {
  names.value = files.map((f) => f.name)
}
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:0.75rem">
    <WdFileUpload mode="advanced" multiple @select="onSelect" />
    <div v-if="names.length">已选：{{ names.join(', ') }}</div>
  </div>
</template>
```

## Drag to upload

设置 `drag` 后出现虚线拖放区：可拖入文件，也可点击区域选择。

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdFileUpload } from '@well-insight/ui'

const names = ref<string[]>([])
function onSelect(files: File[]) {
  names.value = files.map((f) => f.name)
}
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:0.75rem;max-width:28rem">
    <WdFileUpload drag multiple accept="image/*,.pdf" @select="onSelect">
      <template #tip>支持图片或 PDF，可一次拖入多个文件。</template>
    </WdFileUpload>
    <div v-if="names.length">已选：{{ names.join(', ') }}</div>
  </div>
</template>
```

## Picture list

`list-type="picture"` 在列表中显示缩略图，可预览或删除。

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdFileUpload, type FileUploadFile } from '@well-insight/ui'

const preview = ref('')
function onPreview(file: FileUploadFile) {
  preview.value = file.url ?? ''
}
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:0.75rem;max-width:28rem">
    <WdFileUpload multiple accept="image/*" list-type="picture" @preview="onPreview" />
    <img v-if="preview" :src="preview" alt="" style="max-width:12rem;border-radius:0.5rem" />
  </div>
</template>
```

## Picture card

照片墙：加号卡片选择文件，悬停可预览 / 删除。也可直接把图片拖到卡片区域。

```vue preview
<script setup lang="ts">
import { WdFileUpload } from '@well-insight/ui'
</script>

<template>
  <WdFileUpload multiple accept="image/*" list-type="picture-card" :limit="4" />
</template>
```

## Auto upload

提供 `httpRequest`（或 `action`）后默认自动上传。下面用本地模拟请求，不依赖真实接口。

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdFileUpload, type FileUploadRequestOptions } from '@well-insight/ui'

const last = ref('')

async function mockUpload(options: FileUploadRequestOptions) {
  options.onProgress(35)
  await new Promise((resolve) => setTimeout(resolve, 400))
  options.onProgress(100)
  return { name: options.file.name }
}

function onSuccess(_file: unknown, response: unknown) {
  last.value = JSON.stringify(response)
}
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:0.75rem;max-width:28rem">
    <WdFileUpload drag multiple :http-request="mockUpload" @success="onSuccess">
      <template #tip>选择后立即模拟上传，并显示进度。</template>
    </WdFileUpload>
    <div v-if="last">响应：{{ last }}</div>
  </div>
</template>
```

## Manual upload

`auto-upload="false"` 时先加入列表，再点「上传」。`before-upload` 可拦截不合格文件。

```vue preview
<script setup lang="ts">
import { WdFileUpload, type FileUploadFile } from '@well-insight/ui'

async function mockUpload() {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return { ok: true }
}

function beforeUpload(file: File, _item: FileUploadFile) {
  if (file.size > 2 * 1024 * 1024) return false
  return true
}
</script>

<template>
  <WdFileUpload
    mode="advanced"
    multiple
    :auto-upload="false"
    :max-size="2 * 1024 * 1024"
    :before-upload="beforeUpload"
    :http-request="mockUpload"
  >
    <template #tip>单文件不超过 2MB。选好后点击上传。</template>
  </WdFileUpload>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `mode` | `'basic' \| 'advanced'` | `'basic'` | 视觉变体。文件列表由 `showFileList` 控制。 |
| `multiple` | `boolean` | `false` | 多选。关闭时新选择会替换当前列表。 |
| `accept` | `string` | — | 接受的文件类型，拖入时同样过滤。 |
| `drag` | `boolean` | `false` | 启用拖拽上传区域。 |
| `limit` | `number` | — | 最多文件数；本次选择会使总数超出时触发 `exceed`，整批不加入。 |
| `maxSize` | `number` | — | 单文件最大字节数，超出则跳过。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `chooseLabel` | `string` | `'选择文件'` | 按钮 / 拖放区无障碍名称。 |
| `showFileList` | `boolean` | `true` | 是否显示列表。 |
| `listType` | `'text' \| 'picture' \| 'picture-card'` | `'text'` | 列表样式。`picture-card` 用加号卡片作为触发器。 |
| `fileList` | `FileUploadFile[]` | — | 文件列表，配合 `v-model:file-list`。 |
| `action` | `string` | — | 上传地址。设置后默认自动上传。 |
| `method` | `string` | `'post'` | 请求方法。 |
| `name` | `string` | `'file'` | 表单字段名。 |
| `headers` | `Record<string, string>` | — | 额外请求头。 |
| `data` | `object \| (() => object)` | — | 随文件一起提交的字段。 |
| `withCredentials` | `boolean` | `false` | 跨域携带 cookie。 |
| `autoUpload` | `boolean` | `true` | 是否选完即传。需要同时提供 `action` 或 `httpRequest`。 |
| `httpRequest` | `(options) => void \| Promise \| XMLHttpRequest` | — | 自定义上传。返回 Promise 时以 resolve 值为成功响应。 |
| `beforeUpload` | `(file, uploadFile) => boolean \| Promise` | — | 上传前钩子，返回 `false` 则跳过该文件。 |
| `beforeRemove` | `(uploadFile, fileList) => boolean \| Promise` | — | 删除前钩子，返回 `false` 则取消删除。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `select` | `File[]` | 选择或拖入完成（已通过类型 / 大小 / `beforeUpload` 过滤）。 |
| `exceed` | `File[]` | 超过 `limit`。 |
| `update:fileList` | `FileUploadFile[]` | 列表变化。 |
| `change` | `file, fileList` | 单个文件状态变化。 |
| `remove` | `file` | 从列表移除。 |
| `preview` | `file` | 点击预览。 |
| `progress` | `file, percent` | 上传进度。 |
| `success` | `file, response` | 上传成功。 |
| `error` | `file, error` | 上传失败。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 自定义拖放区内容（仅 `drag`）。 |
| `trigger` | 自定义选择按钮内容（非 `picture-card`）。 |
| `tip` | 触发区下方的提示。 |
| `file` | 自定义列表项，作用域 `{ file }`。 |

## Methods

| 方法 | 说明 |
| --- | --- |
| `openPicker()` | 打开系统文件选择框。 |
| `submit()` | 上传列表中 `ready` / `fail` 的文件。 |
| `abort(file?)` | 取消进行中的请求；不传则全部取消。 |
| `clear()` / `clearFiles()` | 清空列表并中止上传。 |
