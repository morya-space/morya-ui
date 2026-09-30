---
title: FileUpload
category: 02 / FORM
description: Select, drag, list, preview, and upload.
---

# FileUpload

Pick local files. Supports click-to-choose, drag-and-drop, text / picture lists, a picture-card wall, and real uploads via `action` or `httpRequest`. `select` still emits the chosen `File[]`; the full list is `v-model:file-list`. The file list is shown by default; files upload automatically when `action` or `httpRequest` is set.

Common options: `action` / `httpRequest` for real uploads, `v-model:file-list` for the queue, `listType` for list chrome, and `directory` for folder pick when the browser supports it.

Queue UI extras are out of scope this batch.

## Import

```ts
import { MFileUpload } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.en.vue"
```

## Drag to upload

Set `drag` to show a dashed drop zone. Drop files or click the area to choose.

```vue preview src="./demos/DragToUpload.en.vue"
```

## Picture list

`list-type="picture"` shows thumbnails in the list, with preview and remove.

```vue preview src="./demos/PictureList.vue"
```

## Picture card

A photo wall: the plus tile opens the picker; hover to preview or remove. Images can also be dropped onto the card area.

```vue preview src="./demos/PictureCard.vue"
```

## Auto upload

With `httpRequest` (or `action`), files upload automatically. The demo mocks the request locally.

```vue preview src="./demos/AutoUpload.en.vue"
```

## Manual upload

With `auto-upload="false"`, files join the list first; click Upload to send them. `before-upload` can reject a file.

```vue preview src="./demos/ManualUpload.en.vue"
```

## Instance methods

Use a template ref to control the picker, upload queue, cancellation, and clearing.

```vue preview src="./demos/InstanceMethods.en.vue"
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
| `pt` | [FieldPassThrough](/docs/types#FieldPassThrough) `{ root?, label?, control?, input? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


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

## Types

<h4 id="FileUploadFile">FileUploadFile</h4>

See source `types.ts` for the full definition.

```ts
interface FileUploadFile {
  uid: string
  name: string
  size?: number
  type?: string
  status: FileUploadStatus
  percentage?: number
  url?: string
  raw?: File
  response?: unknown
  error?: string
}
```
