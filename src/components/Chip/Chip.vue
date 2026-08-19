<script setup lang="ts">
import { computed } from 'vue'
import { useWdLocale } from '../../locale'
import WdIcon from '../Icon/Icon.vue'
import type { ChipProps } from './types'

const props = withDefaults(defineProps<ChipProps>(), {
  removable: false,
  disabled: false,
})

const emit = defineEmits<{ (event: 'remove', value: MouseEvent): void }>()
const locale = useWdLocale()

const chipClass = computed(() => [
  'wd-chip',
  {
    'wd-chip--disabled': props.disabled,
    'wd-chip--removable': props.removable,
  },
])

function handleRemove(event: MouseEvent) {
  if (props.disabled) return
  emit('remove', event)
}
</script>

<template>
  <span :class="chipClass" :aria-disabled="disabled || undefined">
    <img v-if="image" class="wd-chip__image" :src="image" alt="" />
    <WdIcon v-else-if="icon" class="wd-chip__icon" :name="icon" size="sm" />
    <span v-if="label" class="wd-chip__label">{{ label }}</span>
    <button
      v-if="removable"
      type="button"
      class="wd-chip__remove"
      :disabled="disabled"
      :aria-label="locale.remove"
      @click="handleRemove"
    >
      ×
    </button>
  </span>
</template>
