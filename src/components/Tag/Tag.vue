<script setup lang="ts">
import type { TagProps } from './types'
import { computed } from 'vue'
import { useRdLocale } from '../../locale'
import { useConfiguredSize } from '../../shared/config'
import { normalizeSeverity, resolveIconSizeFromClass } from '../../shared/types'
import RdIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<TagProps>(), {
  severity: 'primary',
  rounded: false,
  closable: false,
  bordered: false,
  disabled: false,
})

const emit = defineEmits<{ (event: 'close', value: MouseEvent): void }>()
const locale = useRdLocale()
const sizeClass = useConfiguredSize('Tag', () => props.size)
const iconSize = computed(() => resolveIconSizeFromClass(sizeClass.value))
const severityTone = computed(() => normalizeSeverity(props.severity) ?? 'primary')

const rootClass = computed(() => [
  'rd-tag',
  `rd-tag--${severityTone.value}`,
  `rd-tag--${sizeClass.value}`,
  {
    'rd-tag--rounded': props.rounded,
    'rd-tag--bordered': props.bordered,
    'rd-tag--closable': props.closable,
    'rd-tag--disabled': props.disabled,
    'rd-tag--custom': Boolean(props.color),
  },
])

const rootStyle = computed(() =>
  props.color ? { '--rd-tag-color': props.color } : undefined,
)

function onClose(event: MouseEvent) {
  if (props.disabled) return
  event.stopPropagation()
  emit('close', event)
}
</script>

<template>
  <span :class="rootClass" :style="rootStyle">
    <RdIcon v-if="icon" class="rd-tag__icon" :name="icon" :size="iconSize" />
    <slot>{{ value }}</slot>
    <button
      v-if="closable"
      type="button"
      class="rd-tag__close"
      :disabled="disabled"
      :aria-label="locale.close"
      @click="onClose"
    >
      <RdIcon name="close" :size="iconSize" />
    </button>
  </span>
</template>
