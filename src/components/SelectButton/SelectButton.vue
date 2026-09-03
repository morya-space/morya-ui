<script setup lang="ts">
import type { SelectButtonOption, SelectButtonProps, SelectButtonValue } from './types'
import { computed, ref, watch } from 'vue'
import { useConfiguredSize } from '../../shared/config'
import { useMenuKeyboard } from '../../shared/useMenuKeyboard'

const props = withDefaults(defineProps<SelectButtonProps>(), {
  multiple: false,
  disabled: false,
  invalid: false,
})
const emit = defineEmits<{
  (event: 'update:modelValue', value: SelectButtonValue | SelectButtonValue[] | undefined): void
}>()

const sizeClass = useConfiguredSize('SelectButton', () => props.size)

const rootClass = computed(() => [
  'wi-selectbutton',
  `wi-selectbutton--${sizeClass.value}`,
  {
    'wi-selectbutton--disabled': props.disabled,
    'wi-selectbutton--invalid': props.invalid,
  },
])

function isActive(option: SelectButtonOption): boolean {
  if (props.multiple) {
    const values = Array.isArray(props.modelValue) ? props.modelValue : []
    return values.includes(option.value)
  }
  return props.modelValue === option.value
}

function select(option: SelectButtonOption) {
  if (props.disabled || option.disabled) return
  if (props.multiple) {
    const values = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const index = values.indexOf(option.value)
    if (index >= 0) values.splice(index, 1)
    else values.push(option.value)
    emit('update:modelValue', values)
    return
  }
  emit('update:modelValue', option.value)
}

const root = ref<HTMLElement | null>(null)

const keyboard = useMenuKeyboard({
  itemCount: () => props.options.length,
  isItemDisabled: (index) => Boolean(props.options[index]?.disabled),
  orientation: 'both',
  enabled: () => !props.disabled,
  onActivate: (index) => {
    const option = props.options[index]
    if (option) select(option)
  },
})

function buttonTabindex(index: number): 0 | -1 {
  if (keyboard.activeIndex.value >= 0) return keyboard.tabindexFor(index)
  const firstEnabled = props.options.findIndex((option) => !option.disabled)
  return index === firstEnabled ? 0 : -1
}

function onKeydown(event: KeyboardEvent) {
  keyboard.onKeydown(event)
}

watch(keyboard.activeIndex, (index) => {
  if (index < 0) return
  root.value
    ?.querySelectorAll<HTMLElement>('.wi-selectbutton__button')
    [index]?.focus({ preventScroll: true })
})
</script>

<template>
  <div ref="root" :class="rootClass" role="group" @keydown="onKeydown">
    <button
      v-for="(option, index) in options"
      :key="String(option.value)"
      type="button"
      class="wi-selectbutton__button"
      :class="{ 'wi-selectbutton__button--active': isActive(option) }"
      :disabled="disabled || option.disabled"
      :aria-pressed="isActive(option)"
      :tabindex="buttonTabindex(index)"
      @click="select(option)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
