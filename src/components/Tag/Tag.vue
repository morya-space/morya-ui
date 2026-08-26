<script setup lang="ts">
import { computed } from 'vue'
import { useWiLocale } from '../../locale'
import { useConfiguredSize } from '../../shared/config'
import { normalizeSeverity } from '../../shared/types'
import WiIcon from '../Icon/Icon.vue'
import type { TagProps } from './types'

const props = withDefaults(defineProps<TagProps>(), {
  severity: 'primary',
  rounded: false,
  closable: false,
  bordered: false,
  disabled: false,
})

const emit = defineEmits<{ (event: 'close', value: MouseEvent): void }>()
const locale = useWiLocale()
const sizeClass = useConfiguredSize('Tag', () => props.size)
const severityTone = computed(() => normalizeSeverity(props.severity) ?? 'primary')

const rootClass = computed(() => [
  'wi-tag',
  `wi-tag--${severityTone.value}`,
  `wi-tag--${sizeClass.value}`,
  {
    'wi-tag--rounded': props.rounded,
    'wi-tag--bordered': props.bordered,
    'wi-tag--closable': props.closable,
    'wi-tag--disabled': props.disabled,
    'wi-tag--custom': Boolean(props.color),
  },
])

const rootStyle = computed(() =>
  props.color ? { '--wi-tag-color': props.color } : undefined,
)

function onClose(event: MouseEvent) {
  if (props.disabled) return
  event.stopPropagation()
  emit('close', event)
}
</script>

<template>
  <span :class="rootClass" :style="rootStyle">
    <WiIcon v-if="icon" class="wi-tag__icon" :name="icon" size="sm" />
    <slot>{{ value }}</slot>
    <button
      v-if="closable"
      type="button"
      class="wi-tag__close"
      :disabled="disabled"
      :aria-label="locale.close"
      @click="onClose"
    >
      ×
    </button>
  </span>
</template>
