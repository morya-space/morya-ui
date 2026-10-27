<script setup lang="ts">

import type { FileUploadFile, FileUploadProps, FileUploadRequestOptions } from './types'
import { computed, onBeforeUnmount, ref, useAttrs, watch } from 'vue'
import { useMLocale } from '../../locale'
import { useDisabled } from '../../shared/config'
import { useFieldParts } from '../../shared/useComponentAttrs'
import MButton from '../Button/Button.vue'
import MIcon from '../Icon/Icon.vue'
import MProgressBar from '../ProgressBar/ProgressBar.vue'
import { ajaxUpload } from './ajax'
import { formatSize, isImageFile, matchesAccept } from './fileUtils'
defineOptions({ inheritAttrs: false })

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
const attrs = useAttrs()
const { rootAttrs, controlAttrs } = useFieldParts(attrs, () => props.pt, { controlKey: 'input' })
const mergedDisabled = useDisabled(() => props.disabled)


let uidSeed = 0
const inputRef = ref<HTMLInputElement | null>(null)
const items = ref<FileUploadFile[]>([])
const dragOver = ref(false)
const requests = new Map<string, XMLHttpRequest>()
const locale = useMLocale()
const chooseText = computed(() => props.chooseLabel ?? locale.value.chooseFile)
const isPictureCard = computed(() => props.listType === 'picture-card')
const isPicture = computed(() => props.listType === 'picture' || isPictureCard.value)
const canUpload = computed(() => Boolean(props.action || props.httpRequest))
const shouldAutoUpload = computed(() => props.autoUpload && canUpload.value)
const showList = computed(() => props.showFileList && items.value.length > 0 && !isPictureCard.value)
const showTrigger = computed(() => !isPictureCard.value)
const canAdd = computed(() => !mergedDisabled.value && (props.limit == null || items.value.length < props.limit))
const showSubmit = computed(
  () =>
    canUpload.value &&
    !props.autoUpload &&
    items.value.some((file) => file.status === 'ready' || file.status === 'fail'),
)
const showToolbar = computed(() => items.value.length > 0 && props.showFileList)

const rootClass = computed(() => [
  'm-file-upload',
  `m-file-upload--${props.mode}`,
  `m-file-upload--${props.listType}`,
  {
    'm-file-upload--disabled': mergedDisabled.value,
    'm-file-upload--drag': props.drag,
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
  return `m-upload-${Date.now()}-${uidSeed}`
}

function commit(next: FileUploadFile[]) {
  items.value = next
  emit('update:fileList', next)
}

function emitChange(file: FileUploadFile, fileList: FileUploadFile[]) {
  emit('change', file, fileList)
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
  if (mergedDisabled.value) return
  const accepted: File[] = []
  for (const file of incoming) {
    if (!matchesAccept(file, props.accept)) continue
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
  if (mergedDisabled.value) return
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
  if (mergedDisabled.value) return
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
  if (!file || mergedDisabled.value || !canUpload.value) return
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
  if (mergedDisabled.value) return
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
  <div v-bind="rootAttrs" :class="rootClass">
    <input
      ref="inputRef"
      class="m-file-upload__input"
      type="file"
      :multiple="multiple || directory"
      :accept="accept"
      :disabled="mergedDisabled"
      :webkitdirectory="directory || undefined"
      v-bind="controlAttrs"
      @change="onChange"
    >

    <div
      v-if="drag && showTrigger"
      class="m-file-upload__dragger"
      :class="{ 'm-file-upload__dragger--over': dragOver }"
      role="button"
      tabindex="0"
      :aria-disabled="mergedDisabled || undefined"
      :aria-label="chooseText"
      @click="openPicker"
      @keydown="onDropzoneKeydown"
      @dragenter="onDragOver"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <slot>
        <MIcon class="m-file-upload__icon" name="upload" />
        <p class="m-file-upload__text">
          {{ locale.dropFileHere }}
          <em>{{ locale.clickToUpload }}</em>
        </p>
      </slot>
    </div>

    <MButton
      v-else-if="showTrigger && $slots.trigger"
      type="primary"
      class="m-file-upload__choose m-file-upload__choose--slot"
      :auto-insert-space="false"
      :disabled="mergedDisabled || !canAdd"
      @click="openPicker"
    >
      <slot name="trigger" />
    </MButton>
    <MButton
      v-else-if="showTrigger"
      type="primary"
      class="m-file-upload__choose"
      :label="chooseText"
      :auto-insert-space="false"
      :disabled="mergedDisabled || !canAdd"
      @click="openPicker"
    />

    <div v-if="$slots.tip" class="m-file-upload__tip">
      <slot name="tip" />
    </div>

    <ul v-if="showList && !isPictureCard" class="m-file-upload__list">
      <li
        v-for="file in items"
        :key="file.uid"
        class="m-file-upload__file"
        :class="[`m-file-upload__file--${file.status}`, { 'm-file-upload__file--picture': isPicture }]"
      >
        <slot name="file" :file="file">
          <div class="m-file-upload__file-body">
            <img
              v-if="isPicture && file.url && isImageFile(file)"
              class="m-file-upload__thumb"
              :src="file.url"
              :alt="file.name"
              @click="previewFile(file)"
            >
            <span class="m-file-upload__name">{{ file.name }}</span>
            <span v-if="file.size != null" class="m-file-upload__size">{{ formatSize(file.size) }}</span>
            <span v-if="file.status === 'fail'" class="m-file-upload__status">{{ file.error || locale.uploadFailed }}</span>
            <span class="m-file-upload__actions">
              <MButton
                v-if="file.url && isImageFile(file)"
                variant="text"
                icon="eye"
                icon-only
                size="small"
                class="m-file-upload__action"
                :aria-label="locale.previewFile"
                @click="previewFile(file)"
              />
              <MButton
                v-if="file.status === 'fail'"
                variant="text"
                icon="refresh"
                icon-only
                size="small"
                class="m-file-upload__action"
                :aria-label="locale.retryUpload"
                @click="uploadOne(file)"
              />
              <MButton
                variant="text"
                icon="trash"
                icon-only
                size="small"
                class="m-file-upload__action"
                :aria-label="locale.removeFile"
                :disabled="mergedDisabled"
                @click="removeFile(file)"
              />
            </span>
          </div>
          <MProgressBar
            v-if="file.status === 'uploading'"
            class="m-file-upload__progress"
            :value="file.percentage ?? 0"
            :show-value="false"
          />
        </slot>
      </li>
    </ul>

    <div
      v-if="isPictureCard"
      class="m-file-upload__cards"
      :class="{ 'm-file-upload__cards--over': dragOver }"
      @dragenter="onDragOver"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <div
        v-for="file in showFileList ? items : []"
        :key="file.uid"
        class="m-file-upload__card"
        :class="`m-file-upload__card--${file.status}`"
      >
        <slot name="file" :file="file">
          <img
            v-if="file.url && isImageFile(file)"
            class="m-file-upload__card-image"
            :src="file.url"
            :alt="file.name"
            @click="previewFile(file)"
          >
          <span v-else class="m-file-upload__card-name">{{ file.name }}</span>
          <div v-if="file.status === 'uploading'" class="m-file-upload__card-progress">
            {{ Math.round(file.percentage ?? 0) }}%
          </div>
          <div v-else class="m-file-upload__card-mask">
            <MButton
              v-if="file.url && isImageFile(file)"
              variant="text"
              icon="eye"
              icon-only
              size="small"
              class="m-file-upload__action"
              :aria-label="locale.previewFile"
              @click="previewFile(file)"
            />
            <MButton
              v-if="file.status === 'fail'"
              variant="text"
              icon="refresh"
              icon-only
              size="small"
              class="m-file-upload__action"
              :aria-label="locale.retryUpload"
              @click="uploadOne(file)"
            />
            <MButton
              variant="text"
              icon="trash"
              icon-only
              size="small"
              class="m-file-upload__action"
              :aria-label="locale.removeFile"
              :disabled="mergedDisabled"
              @click="removeFile(file)"
            />
          </div>
        </slot>
      </div>
      <button
        v-if="canAdd"
        type="button"
        class="m-file-upload__card m-file-upload__card--add"
        :aria-label="locale.addFile"
        @click="openPicker"
      >
        <MIcon name="plus" />
      </button>
    </div>

    <div v-if="showToolbar" class="m-file-upload__toolbar">
      <MButton
        v-if="showSubmit"
        type="primary"
        class="m-file-upload__choose"
        :label="locale.uploadFile"
        :auto-insert-space="false"
        :disabled="mergedDisabled"
        @click="submit"
      />
      <MButton
        class="m-file-upload__clear"
        :label="locale.clear"
        :auto-insert-space="false"
        :disabled="mergedDisabled"
        @click="clearFiles"
      />
    </div>
  </div>
</template>
