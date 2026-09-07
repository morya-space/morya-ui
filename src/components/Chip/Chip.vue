<script setup lang="ts">
import type { ChipProps } from './types'
import { computed } from 'vue'
import { useRdLocale } from '../../locale'
import { normalizeSeverity, resolveIconSize, resolveSizeClass } from '../../shared/types'
import RdIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<ChipProps>(), {
  removable: false,
  disabled: false,
})

const emit = defineEmits<{ (event: 'remove', value: MouseEvent): void }>()
const locale = useRdLocale()
const severityTone = computed(() => (props.severity ? normalizeSeverity(props.severity) : undefined))
const sizeTone = computed(() => resolveSizeClass(props.size))
const iconSize = computed(() => resolveIconSize(props.size))

const chipClass = computed(() => [
  'rd-chip',
  {
    'rd-chip--disabled': props.disabled,
    'rd-chip--removable': props.removable,
    [`rd-chip--${severityTone.value}`]: Boolean(severityTone.value),
    'rd-chip--small': sizeTone.value === 'small',
    'rd-chip--large': sizeTone.value === 'large',
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
      <img v-if="image" class="rd-chip__image" :src="image" alt="">
      <RdIcon v-else-if="icon" class="rd-chip__icon" :name="icon" :size="iconSize" />
    </slot>
    <slot>
      <span v-if="label" class="rd-chip__label">{{ label }}</span>
    </slot>
    <button
      v-if="removable"
      type="button"
      class="rd-chip__remove"
      :disabled="disabled"
      :aria-label="locale.remove"
      @click="handleRemove"
    >
      <RdIcon name="close" :size="iconSize" />
    </button>
  </span>
</template>
