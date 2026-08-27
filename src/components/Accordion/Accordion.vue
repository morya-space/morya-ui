<script setup lang="ts">
import type { AccordionProps } from './types'
import { computed } from 'vue'

const props = withDefaults(defineProps<AccordionProps>(), {
  multiple: false,
})
const emit = defineEmits<{
  (event: 'update:modelValue', value: string | string[]): void
}>()

const activeKeys = computed(() => {
  if (props.multiple) {
    return Array.isArray(props.modelValue) ? props.modelValue : props.modelValue ? [props.modelValue] : []
  }
  if (Array.isArray(props.modelValue)) return props.modelValue[0] ? [props.modelValue[0]] : []
  return props.modelValue ? [props.modelValue] : []
})

function isActive(value: string) {
  return activeKeys.value.includes(value)
}

function panelId(value: string) {
  return `wi-accordion-panel-${value}`
}

function headerId(value: string) {
  return `wi-accordion-header-${value}`
}

function toggle(value: string, disabled?: boolean) {
  if (disabled) return
  if (props.multiple) {
    const next = [...activeKeys.value]
    const index = next.indexOf(value)
    if (index >= 0) next.splice(index, 1)
    else next.push(value)
    emit('update:modelValue', next)
    return
  }
  emit('update:modelValue', isActive(value) ? '' : value)
}
</script>

<template>
  <div class="wi-accordion">
    <div v-for="tab in tabs" :key="tab.value" class="wi-accordion__tab">
      <button
        :id="headerId(tab.value)"
        type="button"
        class="wi-accordion__header"
        :class="{ 'wi-accordion__header--active': isActive(tab.value) }"
        :aria-expanded="isActive(tab.value)"
        :aria-controls="panelId(tab.value)"
        :disabled="tab.disabled"
        @click="toggle(tab.value, tab.disabled)"
      >
        <span class="wi-accordion__header-text">{{ tab.header }}</span>
        <span v-if="$slots.extra" class="wi-accordion__header-extra" @click.stop>
          <slot name="extra" :tab="tab" />
        </span>
      </button>
      <div
        v-show="isActive(tab.value)"
        :id="panelId(tab.value)"
        class="wi-accordion__content"
        role="region"
        :aria-labelledby="headerId(tab.value)"
      >
        <slot :name="tab.value" />
      </div>
    </div>
  </div>
</template>
