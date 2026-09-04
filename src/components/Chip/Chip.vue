<script setup lang="ts">
import type { ChipProps } from './types'
import { computed } from 'vue'
import { useWdLocale } from '../../locale'
import { normalizeSeverity, resolveIconSize, resolveSizeClass } from '../../shared/types'
import WdIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<ChipProps>(), {
  removable: false,
  disabled: false,
})

const emit = defineEmits<{ (event: 'remove', value: MouseEvent): void }>()
const locale = useWdLocale()
const severityTone = computed(() => (props.severity ? normalizeSeverity(props.severity) : undefined))
const sizeTone = computed(() => resolveSizeClass(props.size))
const iconSize = computed(() => resolveIconSize(props.size))

const chipClass = computed(() => [
  'wd-chip',
  {
    'wd-chip--disabled': props.disabled,
    'wd-chip--removable': props.removable,
    [`wd-chip--${severityTone.value}`]: Boolean(severityTone.value),
    'wd-chip--small': sizeTone.value === 'small',
    'wd-chip--large': sizeTone.value === 'large',
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
      <img v-if="image" class="wd-chip__image" :src="image" alt="">
      <WdIcon v-else-if="icon" class="wd-chip__icon" :name="icon" :size="iconSize" />
    </slot>
    <slot>
      <span v-if="label" class="wd-chip__label">{{ label }}</span>
    </slot>
    <button
      v-if="removable"
      type="button"
      class="wd-chip__remove"
      :disabled="disabled"
      :aria-label="locale.remove"
      @click="handleRemove"
    >
      <WdIcon name="close" :size="iconSize" />
    </button>
  </span>
</template>
