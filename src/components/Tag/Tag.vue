<script setup lang="ts">
import type { TagProps } from './types'
import { computed } from 'vue'
import { useWdLocale } from '../../locale'
import { useConfiguredSize } from '../../shared/config'
import { normalizeSeverity, resolveIconSizeFromClass } from '../../shared/types'
import WdIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<TagProps>(), {
  severity: 'primary',
  rounded: false,
  closable: false,
  bordered: false,
  disabled: false,
})

const emit = defineEmits<{ (event: 'close', value: MouseEvent): void }>()
const locale = useWdLocale()
const sizeClass = useConfiguredSize('Tag', () => props.size)
const iconSize = computed(() => resolveIconSizeFromClass(sizeClass.value))
const severityTone = computed(() => normalizeSeverity(props.severity) ?? 'primary')

const rootClass = computed(() => [
  'wd-tag',
  `wd-tag--${severityTone.value}`,
  `wd-tag--${sizeClass.value}`,
  {
    'wd-tag--rounded': props.rounded,
    'wd-tag--bordered': props.bordered,
    'wd-tag--closable': props.closable,
    'wd-tag--disabled': props.disabled,
    'wd-tag--custom': Boolean(props.color),
  },
])

const rootStyle = computed(() =>
  props.color ? { '--wd-tag-color': props.color } : undefined,
)

function onClose(event: MouseEvent) {
  if (props.disabled) return
  event.stopPropagation()
  emit('close', event)
}
</script>

<template>
  <span :class="rootClass" :style="rootStyle">
    <WdIcon v-if="icon" class="wd-tag__icon" :name="icon" :size="iconSize" />
    <slot>{{ value }}</slot>
    <button
      v-if="closable"
      type="button"
      class="wd-tag__close"
      :disabled="disabled"
      :aria-label="locale.close"
      @click="onClose"
    >
      <WdIcon name="close" :size="iconSize" />
    </button>
  </span>
</template>
