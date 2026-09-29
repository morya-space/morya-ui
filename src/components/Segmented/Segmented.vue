<script setup lang="ts">
import type { SegmentedOption, SegmentedProps, SegmentedRawOption, SegmentedValue } from './types'
import { computed, ref, useAttrs, watch } from 'vue'
import { useConfiguredSize } from '../../shared/config'
import { useRootParts } from '../../shared/useComponentAttrs'
import { useMId } from '../../shared/useMId'
import { useMenuKeyboard } from '../../shared/useMenuKeyboard'
import MIcon from '../Icon/Icon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SegmentedProps>(), {
  disabled: false,
  block: false,
  shape: 'default',
})
const emit = defineEmits<{ (event: 'update:modelValue', value: SegmentedValue): void }>()
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const sizeClass = useConfiguredSize('Segmented', () => props.size)
const fallbackName = useMId('m-segmented')
const inputName = computed(() => props.name ?? fallbackName)

function normalize(raw: SegmentedRawOption): SegmentedOption {
  if (typeof raw === 'string') return { label: raw, value: raw }
  return {
    label: raw.label ?? String(raw.value),
    value: raw.value,
    icon: raw.icon,
    disabled: raw.disabled,
  }
}

const normalizedOptions = computed(() => props.options.map(normalize))

const rootClass = computed(() => [
  'm-segmented',
  `m-segmented--${sizeClass.value}`,
  {
    'm-segmented--block': props.block,
    'm-segmented--disabled': props.disabled,
    'm-segmented--round': props.shape === 'round',
  },
])

function isChecked(option: SegmentedOption): boolean {
  return props.modelValue === option.value
}

function select(option: SegmentedOption) {
  if (props.disabled || option.disabled) return
  emit('update:modelValue', option.value)
}

const root = ref<HTMLElement | null>(null)

const keyboard = useMenuKeyboard({
  itemCount: () => normalizedOptions.value.length,
  isItemDisabled: (index) => Boolean(normalizedOptions.value[index]?.disabled),
  orientation: 'horizontal',
  enabled: () => !props.disabled,
  onActivate: (index) => {
    const option = normalizedOptions.value[index]
    if (option) select(option)
  },
})

function itemTabindex(index: number): 0 | -1 {
  if (keyboard.activeIndex.value >= 0) return keyboard.tabindexFor(index)
  const selectedIndex = normalizedOptions.value.findIndex((option) => isChecked(option))
  const focusIndex =
    selectedIndex >= 0 && !normalizedOptions.value[selectedIndex]?.disabled
      ? selectedIndex
      : normalizedOptions.value.findIndex((option) => !option.disabled)
  return index === focusIndex ? 0 : -1
}

function onKeydown(event: KeyboardEvent) {
  keyboard.onKeydown(event)
}

watch(keyboard.activeIndex, (index) => {
  if (index < 0) return
  const inputs = root.value?.querySelectorAll<HTMLElement>('.m-segmented__input')
  inputs?.[index]?.focus({ preventScroll: true })
})
</script>

<template>
  <div
    v-bind="rootAttrs"
    ref="root"
    :class="rootClass"
    role="radiogroup"
    :aria-label="label"
    @keydown="onKeydown"
  >
    <label
      v-for="(option, index) in normalizedOptions"
      :key="String(option.value)"
      class="m-segmented__item"
      :class="{
        'm-segmented__item--checked': isChecked(option),
        'm-segmented__item--disabled': disabled || option.disabled,
      }"
    >
      <input
        class="m-segmented__input"
        type="radio"
        :name="inputName"
        :value="String(option.value)"
        :checked="isChecked(option)"
        :disabled="disabled || option.disabled"
        :tabindex="itemTabindex(index)"
        @change="select(option)"
      >
      <span class="m-segmented__label">
        <MIcon v-if="option.icon" :name="option.icon" class="m-segmented__icon" aria-hidden="true" />
        <span class="m-segmented__text">{{ option.label }}</span>
      </span>
    </label>
  </div>
</template>
