<script setup lang="ts">
import type { IconFieldProps } from './types'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, useSlots } from 'vue'
import { useRootParts } from '../../shared/useComponentAttrs'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<IconFieldProps>(), {
  iconPosition: 'left',
})
const attrs = useAttrs()
const slots = useSlots()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const bodyRef = ref<HTMLElement | null>(null)
const controlEl = ref<HTMLElement | null>(null)
let observer: MutationObserver | null = null

const CONTROL_SELECTOR = [
  '.m-input-field__control',
  '.m-password',
  '.m-textarea-field__control',
  '.m-inputnumber__input-wrap',
  '.m-autocomplete__control',
  '.m-datepicker__control',
].join(', ')

const rootClass = computed(() => [
  'm-icon-field',
  props.iconPosition === 'right' ? 'm-icon-field--right' : 'm-icon-field--left',
  {
    'm-icon-field--anchored': Boolean(controlEl.value && slots.icon),
  },
])

function syncControl() {
  const root = bodyRef.value
  controlEl.value = root?.querySelector<HTMLElement>(CONTROL_SELECTOR) ?? null
}

onMounted(async () => {
  await nextTick()
  syncControl()
  if (!bodyRef.value || typeof MutationObserver === 'undefined') return
  observer = new MutationObserver(() => {
    syncControl()
  })
  observer.observe(bodyRef.value, { childList: true, subtree: true })
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <div v-bind="rootAttrs" :class="rootClass">
    <span
      v-if="$slots.icon && !controlEl"
      class="m-icon-field__icon"
      aria-hidden="true"
    >
      <slot name="icon" />
    </span>
    <div ref="bodyRef" class="m-icon-field__body">
      <slot />
      <Teleport v-if="$slots.icon && controlEl" :to="controlEl">
        <span class="m-icon-field__icon" aria-hidden="true">
          <slot name="icon" />
        </span>
      </Teleport>
    </div>
  </div>
</template>
