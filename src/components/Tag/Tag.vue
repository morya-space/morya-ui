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
})

const emit = defineEmits<{ (event: 'close', value: MouseEvent): void }>()
const locale = useMLocale()
const sizeClass = useConfiguredSize('Tag', () => props.size)
const iconSize = computed(() => resolveIconSizeFromClass(sizeClass.value))
const severityTone = computed(() => normalizeSeverity(props.severity) ?? 'primary')

const rootClass = computed(() => [
  'm-tag',
  `m-tag--${severityTone.value}`,
  `m-tag--${sizeClass.value}`,
  {
    'm-tag--rounded': props.rounded,
    'm-tag--bordered': props.bordered,
    'm-tag--closable': props.closable,
    'm-tag--disabled': props.disabled,
    'm-tag--custom': Boolean(props.color),
  },
])

const rootStyle = computed(() =>
  props.color ? { '--m-tag-color': props.color } : undefined,
)

function onClose(event: MouseEvent) {
  if (props.disabled) return
  event.stopPropagation()
  emit('close', event)
}
</script>

<template>
  <span :class="rootClass" :style="rootStyle">
    <MIcon v-if="icon" class="m-tag__icon" :name="icon" :size="iconSize" />
    <slot>{{ value }}</slot>
    <button
      v-if="closable"
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
