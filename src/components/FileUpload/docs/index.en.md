---
title: FileUpload
category: 10 / FILE
description: Select, drag, list, preview, and upload.
---

# FileUpload

Pick local files. Supports click-to-choose, drag-and-drop, text / picture lists, a picture-card wall, and real uploads via `action` or `httpRequest`. `select` still emits the chosen `File[]`; the full list is `v-model:file-list`. The file list is shown by default; files upload automatically when `action` or `httpRequest` is set.

**Naive `n-upload` name map:**

| Naive | Wi |
| --- | --- |
| `action` | `action` |
| `file-list` | `fileList` (`v-model:file-list`) |
| `list-type` | `listType` |
| `directory` | `directory` (`webkitdirectory`; folder pick where the browser supports it) |
| `custom-request` | `httpRequest` |
| `name` | `name` |

Queue UI extras are out of scope this batch.

## Import

```ts
import { WiFileUpload } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiFileUpload } from '@well-insight/ui'
import { ref } from 'vue'

const names = ref<string[]>([])
function onSelect(files: File[]) {
  names.value = files.map((f) => f.name)
}
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:0.75rem">
    <WiFileUpload mode="advanced" multiple @select="onSelect" />
    <div v-if="names.length">
      Selected: {{ names.join(', ') }}
    </div>
  </div>
</template>
```

## Drag to upload

Set `drag` to show a dashed drop zone. Drop files or click the area to choose.

```vue preview
<script setup lang="ts">
import { WiFileUpload } from '@well-insight/ui'
import { ref } from 'vue'

const names = ref<string[]>([])
function onSelect(files: File[]) {
  names.value = files.map((f) => f.name)
}
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:0.75rem;max-width:28rem">
    <WiFileUpload drag multiple accept="image/*,.pdf" @select="onSelect">
      <template #tip>
        Images or PDF. Multiple files can be dropped at once.
      </template>
    </WiFileUpload>
    <div v-if="names.length">
      Selected: {{ names.join(', ') }}
    </div>
  </div>
</template>
```

## Picture list

`list-type="picture"` shows thumbnails in the list, with preview and remove.

```vue preview
<script setup lang="ts">
import type {FileUploadFile} from '@well-insight/ui';
import {  WiFileUpload } from '@well-insight/ui'
import { ref } from 'vue'

const preview = ref('')
function onPreview(file: FileUploadFile) {
  preview.value = file.url ?? ''
}
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:0.75rem;max-width:28rem">
    <WiFileUpload multiple accept="image/*" list-type="picture" @preview="onPreview" />
    <img v-if="preview" :src="preview" alt="" style="max-width:12rem;border-radius:0.5rem">
  </div>
</template>
```

## Picture card

A photo wall: the plus tile opens the picker; hover to preview or remove. Images can also be dropped onto the card area.

```vue preview
<script setup lang="ts">
import { WiFileUpload } from '@well-insight/ui'
</script>

<template>
  <WiFileUpload multiple accept="image/*" list-type="picture-card" :limit="4" />
</template>
```

## Auto upload

With `httpRequest` (or `action`), files upload automatically. The demo mocks the request locally.

```vue preview
<script setup lang="ts">
import type {FileUploadRequestOptions} from '@well-insight/ui';
import {  WiFileUpload } from '@well-insight/ui'
import { ref } from 'vue'

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
    <WiFileUpload drag multiple :http-request="mockUpload" @success="onSuccess">
      <template #tip>
        Files upload immediately after selection, with progress.
      </template>
    </WiFileUpload>
    <div v-if="last">
      Response: {{ last }}
    </div>
  </div>
</template>
```

## Manual upload

With `auto-upload="false"`, files join the list first; click Upload to send them. `before-upload` can reject a file.

```vue preview
<script setup lang="ts">
import type {FileUploadFile} from '@well-insight/ui';
import {  WiFileUpload } from '@well-insight/ui'

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
  <WiFileUpload
    mode="advanced"
    multiple
    :auto-upload="false"
    :max-size="2 * 1024 * 1024"
    :before-upload="beforeUpload"
    :http-request="mockUpload"
  >
    <template #tip>
      Each file must be under 2MB. Choose files, then click Upload.
    </template>
  </WiFileUpload>
</template>
```

## Instance methods

Use a template ref to control the picker, upload queue, cancellation, and clearing.

```vue preview
<script setup lang="ts">
import { WiFileUpload } from '@well-insight/ui'
import { ref } from 'vue'

const uploader = ref<{
  openPicker: () => void
  submit: () => void
  abort: () => void
  clear: () => void
  clearFiles: () => void
} | null>(null)
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:0.75rem;max-width:28rem">
    <WiFileUpload ref="uploader" mode="advanced" :auto-upload="false" />
    <div style="display:flex;flex-wrap:wrap;gap:0.5rem">
      <button type="button" @click="uploader?.openPicker()">Choose</button>
      <button type="button" @click="uploader?.submit()">Submit queue</button>
      <button type="button" @click="uploader?.abort()">Abort</button>
      <button type="button" @click="uploader?.clear()">Clear</button>
      <button type="button" @click="uploader?.clearFiles()">Clear alias</button>
    </div>
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | `'basic' \| 'advanced'` | `'basic'` | Visual variant. Use `showFileList` to toggle the list. |
| `multiple` | `boolean` | `false` | Multiple selection. When off, a new pick replaces the list. |
| `directory` | `boolean` | `false` | Pick a folder (`webkitdirectory`); implies multiple. |
| `accept` | `string` | — | Accepted types; also applied to dropped files. |
| `drag` | `boolean` | `false` | Enable the drag-and-drop zone. |
| `limit` | `number` | — | Max files. If this pick would exceed it, `exceed` fires and nothing is added. |
| `maxSize` | `number` | — | Max bytes per file; larger files are skipped. |
| `disabled` | `boolean` | `false` | Disabled. |
| `chooseLabel` | `string` | `'Choose file'` | Accessible name for the button / drop zone. |
| `showFileList` | `boolean` | `true` | Show the list. |
| `listType` | `'text' \| 'picture' \| 'picture-card'` | `'text'` | List layout. `picture-card` uses a plus tile as the trigger. |
| `fileList` | `FileUploadFile[]` | — | Bound list (`v-model:file-list`). |
| `action` | `string` | — | Upload URL. When set, files upload automatically by default. |
| `method` | `string` | `'post'` | Request method. |
| `name` | `string` | `'file'` | Form field name. |
| `headers` | `Record<string, string>` | — | Extra headers. |
| `data` | `object \| (() => object)` | — | Extra fields sent with the file. |
| `withCredentials` | `boolean` | `false` | Send cookies on cross-origin requests. |
| `autoUpload` | `boolean` | `true` | Upload on select. Requires `action` or `httpRequest`. |
| `httpRequest` | `(options) => void \| Promise \| XMLHttpRequest` | — | Custom uploader. A returned Promise is treated as the success response. |
| `beforeUpload` | `(file, uploadFile) => boolean \| Promise` | — | Return `false` to skip the file. |
| `beforeRemove` | `(uploadFile, fileList) => boolean \| Promise` | — | Return `false` to cancel removal. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `select` | `File[]` | Selection or drop complete (after type / size / `beforeUpload` filters). |
| `exceed` | `File[]` | More files than `limit`. |
| `update:fileList` | `FileUploadFile[]` | List changed. |
| `change` | `file, fileList` | A file's status changed. |
| `remove` | `file` | Removed from the list. |
| `preview` | `file` | Preview clicked. |
| `progress` | `file, percent` | Upload progress. |
| `success` | `file, response` | Upload succeeded. |
| `error` | `file, error` | Upload failed. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Custom drop-zone content (`drag` only). |
| `trigger` | Custom choose-button content (not `picture-card`). |
| `tip` | Hint below the trigger. |
| `file` | Custom list item; scope `{ file }`. |

## Methods

| Method | Description |
| --- | --- |
| `openPicker()` | Open the system file picker. |
| `submit()` | Upload `ready` / `fail` files in the list. |
| `abort(file?)` | Abort in-flight request(s); omit `file` to abort all. |
| `clear()` / `clearFiles()` | Clear the list and abort uploads. |
