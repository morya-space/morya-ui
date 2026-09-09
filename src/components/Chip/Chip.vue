<script setup lang="ts">
import type { ChipProps } from './types'
import { computed } from 'vue'
import { useMLocale } from '../../locale'
import { normalizeSeverity, resolveIconSize, resolveSizeClass } from '../../shared/types'
import MIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<ChipProps>(), {
  removable: false,
  disabled: false,
})

const emit = defineEmits<{ (event: 'remove', value: MouseEvent): void }>()
const locale = useMLocale()
const severityTone = computed(() => (props.severity ? normalizeSeverity(props.severity) : undefined))
const sizeTone = computed(() => resolveSizeClass(props.size))
const iconSize = computed(() => resolveIconSize(props.size))

const chipClass = computed(() => [
  'm-chip',
  {
    'm-chip--disabled': props.disabled,
    'm-chip--removable': props.removable,
    [`m-chip--${severityTone.value}`]: Boolean(severityTone.value),
    'm-chip--small': sizeTone.value === 'small',
    'm-chip--large': sizeTone.value === 'large',
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
      <img v-if="image" class="m-chip__image" :src="image" alt="">
      <MIcon v-else-if="icon" class="m-chip__icon" :name="icon" :size="iconSize" />
    </slot>
    <slot>
      <span v-if="label" class="m-chip__label">{{ label }}</span>
    </slot>
    <button
      v-if="removable"
      type="button"
      class="m-chip__remove"
      :disabled="disabled"
      :aria-label="locale.remove"
      @click="handleRemove"
    >
      <MIcon name="close" :size="iconSize" />
    </button>
  </span>
</template>
