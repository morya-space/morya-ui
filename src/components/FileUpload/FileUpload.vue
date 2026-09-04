<script setup lang="ts">
import type { FileUploadFile, FileUploadProps, FileUploadRequestOptions } from './types'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useWdLocale } from '../../locale'
import WdIcon from '../Icon/Icon.vue'
import { ajaxUpload } from './ajax'

const props = withDefaults(defineProps<FileUploadProps>(), {
  mode: 'basic',
  multiple: false,
  disabled: false,
  drag: false,
  showFileList: true,
  listType: 'text',
  method: 'post',
  name: 'file',
  withCredentials: false,
  autoUpload: true,
  directory: false,
})

const emit = defineEmits<{
  (event: 'select', files: File[]): void
  (event: 'exceed', files: File[]): void
  (event: 'exceed-size', file: File): void
  (event: 'update:fileList', files: FileUploadFile[]): void
  (event: 'change', file: FileUploadFile, fileList: FileUploadFile[]): void
  (event: 'remove', file: FileUploadFile): void
  (event: 'preview', file: FileUploadFile): void
  (event: 'progress', file: FileUploadFile, percent: number): void
  (event: 'success', file: FileUploadFile, response: unknown): void
  (event: 'error', file: FileUploadFile, error: Error): void
  (event: 'abort', file?: FileUploadFile): void
}>()

let uidSeed = 0
const inputRef = ref<HTMLInputElement | null>(null)
const items = ref<FileUploadFile[]>([])
const dragOver = ref(false)
const requests = new Map<string, XMLHttpRequest>()
const locale = useWdLocale()
const chooseText = computed(() => props.chooseLabel ?? locale.value.chooseFile)
const isPictureCard = computed(() => props.listType === 'picture-card')
const isPicture = computed(() => props.listType === 'picture' || isPictureCard.value)
const canUpload = computed(() => Boolean(props.action || props.httpRequest))
const shouldAutoUpload = computed(() => props.autoUpload && canUpload.value)
const showList = computed(() => props.showFileList && items.value.length > 0 && !isPictureCard.value)
const showTrigger = computed(() => !isPictureCard.value)
const canAdd = computed(() => !props.disabled && (props.limit == null || items.value.length < props.limit))
const showSubmit = computed(
  () =>
    canUpload.value &&
    !props.autoUpload &&
    items.value.some((file) => file.status === 'ready' || file.status === 'fail'),
)
const showToolbar = computed(() => items.value.length > 0 && props.showFileList)

const rootClass = computed(() => [
  'wd-fileupload',
  `wd-fileupload--${props.mode}`,
  `wd-fileupload--${props.listType}`,
  {
    'wd-fileupload--disabled': props.disabled,
    'wd-fileupload--drag': props.drag,
  },
])

watch(
  () => props.fileList,
  (list) => {
    if (!list) return
    items.value = list.map((file) => ({
      ...file,
      status: file.status ?? 'success',
      percentage: file.percentage ?? (file.status && file.status !== 'success' ? 0 : 100),
      uid: file.uid || nextUid(),
    }))
  },
  { immediate: true },
)

function nextUid() {
  uidSeed += 1
  return `wd-upload-${Date.now()}-${uidSeed}`
}

function commit(next: FileUploadFile[]) {
  items.value = next
  emit('update:fileList', next)
}

function emitChange(file: FileUploadFile, fileList: FileUploadFile[]) {
  emit('change', file, fileList)
}

function matchesAccept(file: File) {
  const accept = props.accept?.trim()
  if (!accept) return true
  return accept.split(',').some((raw) => {
    const rule = raw.trim().toLowerCase()
    if (!rule) return false
    if (rule.startsWith('.')) return file.name.toLowerCase().endsWith(rule)
    if (rule.endsWith('/*')) return file.type.toLowerCase().startsWith(rule.slice(0, -1))
    return file.type.toLowerCase() === rule
  })
}

function isImageFile(file: FileUploadFile) {
  if (file.type?.startsWith('image/')) return true
  return /\.(avif|bmp|gif|jpe?g|png|svg|webp)$/i.test(file.name)
}

function formatSize(size = 0) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function createItem(file: File): FileUploadFile {
  return {
    uid: nextUid(),
    name: file.name,
    size: file.size,
    type: file.type,
    status: 'ready',
    percentage: 0,
    raw: file,
    url: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
  }
}

function revokeUrl(file: FileUploadFile) {
  if (file.url?.startsWith('blob:')) URL.revokeObjectURL(file.url)
}

async function applyFiles(incoming: File[]) {
  if (props.disabled) return
  const accepted: File[] = []
  for (const file of incoming) {
    if (!matchesAccept(file)) continue
    if (props.maxSize != null && file.size > props.maxSize) {
      emit('exceed-size', file)
      continue
    }
    accepted.push(file)
  }
  const selected = props.multiple ? accepted : accepted.slice(0, 1)
  if (!selected.length) return

  const current = props.multiple ? items.value : []
  if (props.limit != null && current.length + selected.length > props.limit) {
    emit('exceed', selected)
    return
  }

  if (!props.multiple) items.value.forEach(revokeUrl)

  const created: FileUploadFile[] = []
  for (const file of selected) {
    const item = createItem(file)
    if (props.beforeUpload) {
      const allowed = await props.beforeUpload(file, item)
      if (allowed === false) {
        revokeUrl(item)
        continue
      }
    }
    created.push(item)
  }
  if (!created.length) return

  const next = props.multiple ? [...current, ...created] : created
  commit(next)
  emit('select', created.map((item) => item.raw!).filter(Boolean))
  for (const item of created) {
    emitChange(item, next)
    if (shouldAutoUpload.value) void uploadOne(item)
  }
}

function openPicker() {
  if (!canAdd.value) return
  inputRef.value?.click()
}

function onChange(event: Event) {
  const target = event.target as HTMLInputElement
  void applyFiles(Array.from(target.files ?? []))
  target.value = ''
}

function onDragOver(event: DragEvent) {
  if (props.disabled) return
  event.preventDefault()
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'
  dragOver.value = true
}

function onDragLeave(event: DragEvent) {
  const current = event.currentTarget as Element | null
  const related = event.relatedTarget as Node | null
  if (current && related && current.contains(related)) return
  dragOver.value = false
}

function onDrop(event: DragEvent) {
  if (props.disabled) return
  event.preventDefault()
  dragOver.value = false
  void applyFiles(Array.from(event.dataTransfer?.files ?? []))
}

function onDropzoneKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    openPicker()
  }
}

function patchItem(uid: string, patch: Partial<FileUploadFile>) {
  const previous = items.value.find((item) => item.uid === uid)
  const next = items.value.map((item) => (item.uid === uid ? { ...item, ...patch } : item))
  const changed = next.find((item) => item.uid === uid)
  commit(next)
  if (changed && previous && patch.status != null && patch.status !== previous.status) {
    emitChange(changed, next)
  }
}

function requestOptions(item: FileUploadFile, file: File): FileUploadRequestOptions {
  const extra = typeof props.data === 'function' ? props.data() : (props.data ?? {})
  return {
    action: props.action ?? '',
    method: props.method ?? 'post',
    file,
    filename: props.name ?? 'file',
    data: extra,
    headers: props.headers ?? {},
    withCredentials: props.withCredentials,
    onProgress: (percent) => {
      patchItem(item.uid, { percentage: percent, status: 'uploading' })
      const current = items.value.find((entry) => entry.uid === item.uid)
      if (current) emit('progress', current, percent)
    },
    onSuccess: (response) => {
      requests.delete(item.uid)
      patchItem(item.uid, { status: 'success', percentage: 100, response, error: undefined })
      const current = items.value.find((entry) => entry.uid === item.uid)
      if (current) emit('success', current, response)
    },
    onError: (error) => {
      requests.delete(item.uid)
      if (error.message === 'aborted') {
        patchItem(item.uid, { status: 'ready', percentage: 0 })
        return
      }
      patchItem(item.uid, { status: 'fail', error: error.message })
      const current = items.value.find((entry) => entry.uid === item.uid)
      if (current) emit('error', current, error)
    },
  }
}

async function uploadOne(item: FileUploadFile) {
  const file = item.raw
  if (!file || props.disabled || !canUpload.value) return
  patchItem(item.uid, { status: 'uploading', percentage: item.percentage ?? 0, error: undefined })
  const options = requestOptions(item, file)

  if (props.httpRequest) {
    try {
      const result = props.httpRequest(options)
      if (result instanceof XMLHttpRequest) requests.set(item.uid, result)
      else if (result && typeof (result as Promise<unknown>).then === 'function') {
        const response = await result
        options.onSuccess(response)
      }
    } catch (error) {
      options.onError(error instanceof Error ? error : new Error(String(error)))
    }
    return
  }

  requests.set(item.uid, ajaxUpload(options))
}

function submit() {
  for (const item of items.value) {
    if (item.status === 'ready' || item.status === 'fail') void uploadOne(item)
  }
}

function abort(file?: FileUploadFile) {
  const targets = file ? [file.uid] : [...requests.keys()]
  for (const uid of targets) {
    requests.get(uid)?.abort()
    requests.delete(uid)
  }
  emit('abort', file)
}

async function removeFile(file: FileUploadFile) {
  if (props.disabled) return
  if (props.beforeRemove) {
    const allowed = await props.beforeRemove(file, items.value)
    if (allowed === false) return
  }
  abort(file)
  revokeUrl(file)
  const next = items.value.filter((item) => item.uid !== file.uid)
  commit(next)
  emit('remove', file)
}

function previewFile(file: FileUploadFile) {
  emit('preview', file)
}

function clearFiles() {
  abort()
  items.value.forEach(revokeUrl)
  commit([])
}

onBeforeUnmount(() => {
  abort()
  items.value.forEach(revokeUrl)
})

defineExpose({
  openPicker,
  submit,
  abort,
  clear: clearFiles,
  clearFiles,
})
</script>

<template>
  <div :class="rootClass">
    <input
      ref="inputRef"
      class="wd-fileupload__input"
      type="file"
      :multiple="multiple || directory"
      :accept="accept"
      :disabled="disabled"
      :webkitdirectory="directory || undefined"
      @change="onChange"
    >

    <div
      v-if="drag && showTrigger"
      class="wd-fileupload__dragger"
      :class="{ 'wd-fileupload__dragger--over': dragOver }"
      role="button"
      tabindex="0"
      :aria-disabled="disabled || undefined"
      :aria-label="chooseText"
      @click="openPicker"
      @keydown="onDropzoneKeydown"
      @dragenter="onDragOver"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <slot>
        <WdIcon class="wd-fileupload__icon" name="upload" />
        <p class="wd-fileupload__text">
          {{ locale.dropFileHere }}
          <em>{{ locale.clickToUpload }}</em>
        </p>
      </slot>
    </div>

    <button
      v-else-if="showTrigger && $slots.trigger"
      type="button"
      class="wd-fileupload__choose wd-fileupload__choose--slot"
      :disabled="disabled || !canAdd"
      @click="openPicker"
    >
      <slot name="trigger" />
    </button>
    <button
      v-else-if="showTrigger"
      type="button"
      class="wd-fileupload__choose"
      :disabled="disabled || !canAdd"
      @click="openPicker"
    >
      {{ chooseText }}
    </button>

    <div v-if="$slots.tip" class="wd-fileupload__tip">
      <slot name="tip" />
    </div>

    <ul v-if="showList && !isPictureCard" class="wd-fileupload__list">
      <li
        v-for="file in items"
        :key="file.uid"
        class="wd-fileupload__file"
        :class="[`wd-fileupload__file--${file.status}`, { 'wd-fileupload__file--picture': isPicture }]"
      >
        <slot name="file" :file="file">
          <div class="wd-fileupload__file-body">
            <img
              v-if="isPicture && file.url && isImageFile(file)"
              class="wd-fileupload__thumb"
              :src="file.url"
              :alt="file.name"
              @click="previewFile(file)"
            >
            <span class="wd-fileupload__name">{{ file.name }}</span>
            <span v-if="file.size != null" class="wd-fileupload__size">{{ formatSize(file.size) }}</span>
            <span v-if="file.status === 'fail'" class="wd-fileupload__status">{{ file.error || locale.uploadFailed }}</span>
            <span class="wd-fileupload__actions">
              <button
                v-if="file.url && isImageFile(file)"
                type="button"
                class="wd-fileupload__action"
                :aria-label="locale.previewFile"
                @click="previewFile(file)"
              >
                <WdIcon name="eye" size="sm" />
              </button>
              <button
                v-if="file.status === 'fail'"
                type="button"
                class="wd-fileupload__action"
                :aria-label="locale.retryUpload"
                @click="uploadOne(file)"
              >
                <WdIcon name="refresh" size="sm" />
              </button>
              <button
                type="button"
                class="wd-fileupload__action"
                :aria-label="locale.removeFile"
                :disabled="disabled"
                @click="removeFile(file)"
              >
                <WdIcon name="trash" size="sm" />
              </button>
            </span>
          </div>
          <div
            v-if="file.status === 'uploading'"
            class="wd-fileupload__progress"
            role="progressbar"
            :aria-valuemin="0"
            :aria-valuemax="100"
            :aria-valuenow="Math.round(file.percentage ?? 0)"
            :style="{ width: `${file.percentage ?? 0}%` }"
          />
        </slot>
      </li>
    </ul>

    <div
      v-if="isPictureCard"
      class="wd-fileupload__cards"
      :class="{ 'wd-fileupload__cards--over': dragOver }"
      @dragenter="onDragOver"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <div
        v-for="file in showFileList ? items : []"
        :key="file.uid"
        class="wd-fileupload__card"
        :class="`wd-fileupload__card--${file.status}`"
      >
        <slot name="file" :file="file">
          <img
            v-if="file.url && isImageFile(file)"
            class="wd-fileupload__card-image"
            :src="file.url"
            :alt="file.name"
            @click="previewFile(file)"
          >
          <span v-else class="wd-fileupload__card-name">{{ file.name }}</span>
          <div v-if="file.status === 'uploading'" class="wd-fileupload__card-progress">
            {{ Math.round(file.percentage ?? 0) }}%
          </div>
          <div v-else class="wd-fileupload__card-mask">
            <button
              v-if="file.url && isImageFile(file)"
              type="button"
              class="wd-fileupload__action"
              :aria-label="locale.previewFile"
              @click="previewFile(file)"
            >
              <WdIcon name="eye" size="sm" />
            </button>
            <button
              v-if="file.status === 'fail'"
              type="button"
              class="wd-fileupload__action"
              :aria-label="locale.retryUpload"
              @click="uploadOne(file)"
            >
              <WdIcon name="refresh" size="sm" />
            </button>
            <button
              type="button"
              class="wd-fileupload__action"
              :aria-label="locale.removeFile"
              :disabled="disabled"
              @click="removeFile(file)"
            >
              <WdIcon name="trash" size="sm" />
            </button>
          </div>
        </slot>
      </div>
      <button
        v-if="canAdd"
        type="button"
        class="wd-fileupload__card wd-fileupload__card--add"
        :aria-label="locale.addFile"
        @click="openPicker"
      >
        <WdIcon name="plus" />
      </button>
    </div>

    <div v-if="showToolbar" class="wd-fileupload__toolbar">
      <button v-if="showSubmit" type="button" class="wd-fileupload__choose" @click="submit">
        {{ locale.uploadFile }}
      </button>
      <button type="button" class="wd-fileupload__clear" @click="clearFiles">
        {{ locale.clear }}
      </button>
    </div>
  </div>
</template>
