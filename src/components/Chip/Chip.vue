<script setup lang="ts">
import { computed } from 'vue'
import { useWiLocale } from '../../locale'
import { normalizeSeverity, resolveSizeClass } from '../../shared/types'
import WiIcon from '../Icon/Icon.vue'
import type { ChipProps } from './types'

const props = withDefaults(defineProps<ChipProps>(), {
  removable: false,
  disabled: false,
})

const emit = defineEmits<{ (event: 'remove', value: MouseEvent): void }>()
const locale = useWiLocale()
const severityTone = computed(() => (props.severity ? normalizeSeverity(props.severity) : undefined))
const sizeTone = computed(() => resolveSizeClass(props.size))

const chipClass = computed(() => [
  'wi-chip',
  {
    'wi-chip--disabled': props.disabled,
    'wi-chip--removable': props.removable,
    [`wi-chip--${severityTone.value}`]: Boolean(severityTone.value),
    'wi-chip--small': sizeTone.value === 'small',
    'wi-chip--large': sizeTone.value === 'large',
  },
])

function handleRemove(event: MouseEvent) {
  if (props.disabled) return
  emit('remove', event)
}
</script>

<template>
  <span :class="chipClass" :aria-disabled="disabled || undefined">
    <img v-if="image" class="wi-chip__image" :src="image" alt="" />
    <WiIcon v-else-if="icon" class="wi-chip__icon" :name="icon" size="sm" />
    <span v-if="label" class="wi-chip__label">{{ label }}</span>
    <button
      v-if="removable"
      type="button"
      class="wi-chip__remove"
      :disabled="disabled"
      :aria-label="locale.remove"
      @click="handleRemove"
    >
      ×
    </button>
  </span>
</template>
