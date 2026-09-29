<script setup lang="ts">
import type { TagProps } from './types'
import { computed } from 'vue'
import { useMLocale } from '../../locale'
import { useConfiguredSize } from '../../shared/config'
import { normalizeSeverity, resolveIconSizeFromClass } from '../../shared/types'
import MIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<TagProps>(), {
  severity: 'primary',
  rounded: false,
  closable: false,
  bordered: false,
  disabled: false,
  checkable: false,
  checked: false,
})

const emit = defineEmits<{
  (event: 'close', value: MouseEvent): void
  (event: 'update:checked', value: boolean): void
  (event: 'change', value: boolean): void
}>()

const locale = useMLocale()
const sizeClass = useConfiguredSize('Tag', () => props.size)
const iconSize = computed(() => resolveIconSizeFromClass(sizeClass.value))
const severityTone = computed(() => normalizeSeverity(props.severity) ?? 'primary')
const showClose = computed(() => props.closable && !props.checkable)

const rootClass = computed(() => [
  'm-tag',
  `m-tag--${severityTone.value}`,
  `m-tag--${sizeClass.value}`,
  {
    'm-tag--rounded': props.rounded,
    'm-tag--bordered': props.bordered && !props.checkable,
    'm-tag--closable': showClose.value,
    'm-tag--disabled': props.disabled,
    'm-tag--custom': Boolean(props.color) && !props.checkable,
    'm-tag--checkable': props.checkable,
    'm-tag--checked': props.checkable && props.checked,
  },
])

const rootStyle = computed(() =>
  props.color && !props.checkable ? { '--m-tag-color': props.color } : undefined,
)

function onClose(event: MouseEvent) {
  if (props.disabled) return
  event.stopPropagation()
  emit('close', event)
}

function onRootClick(event: MouseEvent) {
  if (!props.checkable || props.disabled) return
  if ((event.target as HTMLElement | null)?.closest?.('.m-tag__close')) return
  const next = !props.checked
  emit('update:checked', next)
  emit('change', next)
}

function onRootKeydown(event: KeyboardEvent) {
  if (!props.checkable || props.disabled) return
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  const next = !props.checked
  emit('update:checked', next)
  emit('change', next)
}
</script>

<template>
  <span
    :class="rootClass"
    :style="rootStyle"
    :role="checkable ? 'button' : undefined"
    :tabindex="checkable && !disabled ? 0 : undefined"
    :aria-pressed="checkable ? checked : undefined"
    :aria-disabled="checkable && disabled ? true : undefined"
    @click="onRootClick"
    @keydown="onRootKeydown"
  >
    <MIcon v-if="icon" class="m-tag__icon" :name="icon" :size="iconSize" />
    <slot>{{ value }}</slot>
    <button
      v-if="showClose"
      type="button"
      class="m-tag__close"
      :disabled="disabled"
      :aria-label="locale.close"
      @click="onClose"
    >
      <MIcon name="close" :size="iconSize" />
    </button>
  </span>
</template>
