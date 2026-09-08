<script setup lang="ts">
import type { ChipProps } from './types'
import { computed } from 'vue'
import { useWkLocale } from '../../locale'
import { normalizeSeverity, resolveIconSize, resolveSizeClass } from '../../shared/types'
import WkIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<ChipProps>(), {
  removable: false,
  disabled: false,
})

const emit = defineEmits<{ (event: 'remove', value: MouseEvent): void }>()
const locale = useWkLocale()
const severityTone = computed(() => (props.severity ? normalizeSeverity(props.severity) : undefined))
const sizeTone = computed(() => resolveSizeClass(props.size))
const iconSize = computed(() => resolveIconSize(props.size))

const chipClass = computed(() => [
  'wk-chip',
  {
    'wk-chip--disabled': props.disabled,
    'wk-chip--removable': props.removable,
    [`wk-chip--${severityTone.value}`]: Boolean(severityTone.value),
    'wk-chip--small': sizeTone.value === 'small',
    'wk-chip--large': sizeTone.value === 'large',
  },
])

function handleRemove(event: MouseEvent) {
  if (props.disabled) return
  emit('remove', event)
}
</script>

<template>
  <span :class="chipClass" :aria-disabled="disabled || undefined">
    <slot name="icon">
      <img v-if="image" class="wk-chip__image" :src="image" alt="">
      <WkIcon v-else-if="icon" class="wk-chip__icon" :name="icon" :size="iconSize" />
    </slot>
    <slot>
      <span v-if="label" class="wk-chip__label">{{ label }}</span>
    </slot>
    <button
      v-if="removable"
      type="button"
      class="wk-chip__remove"
      :disabled="disabled"
      :aria-label="locale.remove"
      @click="handleRemove"
    >
      <WkIcon name="close" :size="iconSize" />
    </button>
  </span>
</template>
