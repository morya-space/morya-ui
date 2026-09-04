<script setup lang="ts">
import type { AccordionProps } from './types'
import { computed } from 'vue'
import { useControllable } from '../../shared/useControllable'

const props = withDefaults(defineProps<AccordionProps>(), {
  multiple: false,
  modelValue: undefined,
  defaultValue: undefined,
})
const emit = defineEmits<{
  (event: 'update:modelValue', value: string | string[]): void
}>()

function resolveDefaultValue(): string | string[] {
  if (props.defaultValue !== undefined) return props.defaultValue
  return props.multiple ? [] : ''
}

const { value: activeModel, setValue: setActiveModel } = useControllable(
  {
    controlled: () => props.modelValue,
    defaultValue: resolveDefaultValue(),
  },
  (next) => emit('update:modelValue', next),
)

const activeKeys = computed(() => {
  const value = activeModel.value
  if (props.multiple) {
    return Array.isArray(value) ? value : value ? [value] : []
  }
  if (Array.isArray(value)) return value[0] ? [value[0]] : []
  return value ? [value] : []
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
    setActiveModel(next)
    return
  }
  setActiveModel(isActive(value) ? '' : value)
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
        <span class="wd-accordion__header-text">{{ tab.header }}</span>
        <span v-if="$slots.extra" class="wd-accordion__header-extra" @click.stop>
          <slot name="extra" :tab="tab" />
        </span>
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
