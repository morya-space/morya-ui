<script setup lang="ts">
import type { TagProps } from './types'
import { computed } from 'vue'
import { useWkLocale } from '../../locale'
import { useConfiguredSize } from '../../shared/config'
import { normalizeSeverity, resolveIconSizeFromClass } from '../../shared/types'
import WkIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<TagProps>(), {
  severity: 'primary',
  rounded: false,
  closable: false,
  bordered: false,
  disabled: false,
})

const emit = defineEmits<{ (event: 'close', value: MouseEvent): void }>()
const locale = useWkLocale()
const sizeClass = useConfiguredSize('Tag', () => props.size)
const iconSize = computed(() => resolveIconSizeFromClass(sizeClass.value))
const severityTone = computed(() => normalizeSeverity(props.severity) ?? 'primary')

const rootClass = computed(() => [
  'wk-tag',
  `wk-tag--${severityTone.value}`,
  `wk-tag--${sizeClass.value}`,
  {
    'wk-tag--rounded': props.rounded,
    'wk-tag--bordered': props.bordered,
    'wk-tag--closable': props.closable,
    'wk-tag--disabled': props.disabled,
    'wk-tag--custom': Boolean(props.color),
  },
])

const rootStyle = computed(() =>
  props.color ? { '--wk-tag-color': props.color } : undefined,
)

function onClose(event: MouseEvent) {
  if (props.disabled) return
  event.stopPropagation()
  emit('close', event)
}
</script>

<template>
  <span :class="rootClass" :style="rootStyle">
    <WkIcon v-if="icon" class="wk-tag__icon" :name="icon" :size="iconSize" />
    <slot>{{ value }}</slot>
    <button
      v-if="closable"
      type="button"
      class="wk-tag__close"
      :disabled="disabled"
      :aria-label="locale.close"
      @click="onClose"
    >
      <WkIcon name="close" :size="iconSize" />
    </button>
  </span>
</template>
