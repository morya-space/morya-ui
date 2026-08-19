<script setup lang="ts">
import { computed } from 'vue'
import type { AccordionProps } from './types'

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
  return `wd-accordion-panel-${value}`
}

function headerId(value: string) {
  return `wd-accordion-header-${value}`
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
  <div class="wd-accordion">
    <div v-for="tab in tabs" :key="tab.value" class="wd-accordion__tab">
      <button
        :id="headerId(tab.value)"
        type="button"
        class="wd-accordion__header"
        :class="{ 'wd-accordion__header--active': isActive(tab.value) }"
        :aria-expanded="isActive(tab.value)"
        :aria-controls="panelId(tab.value)"
        :disabled="tab.disabled"
        @click="toggle(tab.value, tab.disabled)"
      >
        {{ tab.header }}
      </button>
      <div
        v-show="isActive(tab.value)"
        :id="panelId(tab.value)"
        class="wd-accordion__content"
        role="region"
        :aria-labelledby="headerId(tab.value)"
      >
        <slot :name="tab.value" />
      </div>
    </div>
  </div>
</template>
