<script setup lang="ts">

defineOptions({ inheritAttrs: false })
import type { InplaceEmits, InplaceProps } from './types'
import { useRootParts } from '../../shared/useComponentAttrs'
import { computed, nextTick, onBeforeUnmount, ref, useAttrs, watch } from 'vue'

const props = withDefaults(defineProps<InplaceProps>(), {
  modelValue: false,
  disabled: false,
  closeOnEsc: true,
  dismissable: false,
})
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)


const emit = defineEmits<InplaceEmits>()

const root = ref<HTMLElement | null>(null)
const display = ref<HTMLElement | null>(null)

const rootClass = computed(() => [
  'm-inplace',
  {
    'm-inplace--active': props.modelValue,
    'm-inplace--disabled': props.disabled,
  },
])

function activate() {
  if (props.disabled || props.modelValue) return
  emit('update:modelValue', true)
}

function deactivate() {
  if (props.disabled || !props.modelValue) return
  emit('update:modelValue', false)
}

function onDocumentKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !props.closeOnEsc) return
  event.preventDefault()
  deactivate()
  void nextTick(() => display.value?.focus({ preventScroll: true }))
}

function onDocumentClick(event: MouseEvent) {
  if (!props.dismissable) return
  if (root.value?.contains(event.target as Node)) return
  deactivate()
}

watch(
  () => props.modelValue,
  (open, previous) => {
    if (open === previous) return
    if (open) emit('open')
    else emit('close')
  },
)

watch(
  () => [props.modelValue, props.closeOnEsc, props.dismissable] as const,
  ([open]) => {
    document.removeEventListener('keydown', onDocumentKeydown)
    document.removeEventListener('click', onDocumentClick)
    if (!open) return
    document.addEventListener('keydown', onDocumentKeydown)
    window.setTimeout(() => document.addEventListener('click', onDocumentClick), 0)
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onDocumentKeydown)
  document.removeEventListener('click', onDocumentClick)
})

defineExpose({ activate, deactivate })
</script>

<template>
  <div v-bind="rootAttrs" ref="root" :class="rootClass">
    <div
      v-if="!modelValue"
      ref="display"
      class="m-inplace__display"
      role="button"
      :tabindex="disabled ? -1 : 0"
      :aria-expanded="modelValue"
      :aria-disabled="disabled || undefined"
      @click="activate"
      @keydown.enter.prevent="activate"
      @keydown.space.prevent="activate"
    >
      <slot name="display" />
    </div>
    <div v-else class="m-inplace__content">
      <slot name="content" :close="deactivate" />
    </div>
  </div>
</template>
