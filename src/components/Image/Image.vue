<script setup lang="ts">
import type { ImageProps } from './types'
import { computed, inject, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'
import { useMLocale } from '../../locale'
import { useRootParts } from '../../shared/useComponentAttrs'
import MIcon from '../Icon/Icon.vue'
import { IMAGE_PREVIEW_GROUP_KEY } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ImageProps>(), {
  preview: true,
  fit: 'cover',
})

const emit = defineEmits<{ 'click-preview': [] }>()
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)
const locale = useMLocale()
const group = inject(IMAGE_PREVIEW_GROUP_KEY, null)

const localOpen = ref(false)
const registrationId = ref<number | null>(null)

const previewSrc = computed(() => props.previewSrc || props.src)
const canPreview = computed(() => props.preview !== false)

const sizeStyle = computed(() => {
  const style: Record<string, string> = {
    objectFit: props.fit,
  }
  if (props.width != null) style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  if (props.height != null) style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  return style
})

const rootClass = computed(() => [
  'm-image',
  {
    'm-image--preview': canPreview.value,
  },
])

onMounted(() => {
  if (group) registrationId.value = group.register(previewSrc.value)
})

watch(previewSrc, (src) => {
  if (!group || registrationId.value == null) return
  group.unregister(registrationId.value)
  registrationId.value = group.register(src)
})

onBeforeUnmount(() => {
  if (group && registrationId.value != null) group.unregister(registrationId.value)
})

function openPreview() {
  if (!canPreview.value) return
  emit('click-preview')
  if (group && registrationId.value != null) {
    group.openAt(registrationId.value)
    return
  }
  localOpen.value = true
}

function closeLocal() {
  localOpen.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') closeLocal()
}

watch(localOpen, (open) => {
  if (open) document.addEventListener('keydown', onKeydown)
  else document.removeEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div
    v-bind="rootAttrs"
    :class="rootClass"
  >
    <button
      v-if="canPreview"
      type="button"
      class="m-image__trigger"
      :aria-label="alt || locale.previewFile"
      @click="openPreview"
    >
      <img
        class="m-image__img"
        :src="src"
        :alt="alt"
        :style="sizeStyle"
      >
    </button>
    <img
      v-else
      class="m-image__img"
      :src="src"
      :alt="alt"
      :style="sizeStyle"
    >

    <Teleport to="body">
      <div
        v-if="localOpen"
        class="m-image-preview"
        role="dialog"
        aria-modal="true"
        :aria-label="locale.previewFile"
        @click.self="closeLocal"
      >
        <button
          type="button"
          class="m-image-preview__close"
          :aria-label="locale.close"
          @click="closeLocal"
        >
          <MIcon
            name="close"
            size="md"
          />
        </button>
        <img
          class="m-image-preview__img"
          :src="previewSrc"
          :alt="alt"
        >
      </div>
    </Teleport>
  </div>
</template>
