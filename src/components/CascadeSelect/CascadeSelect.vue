<script setup lang="ts">
import type { CascadeSelectOption, CascadeSelectProps, CascadeSelectValue } from './types'
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useWiLocale } from '../../locale'
import { useConfiguredSize, useWiConfig } from '../../shared/config'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import { computeFloatingOverlayStyle } from '../../shared/overlayPlacement'
import WiIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<CascadeSelectProps>(), {
  modelValue: null,
  placeholder: undefined,
  disabled: false,
  teleport: true,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: CascadeSelectValue): void
}>()

const config = useWiConfig()
const locale = useWiLocale()
const sizeClass = useConfiguredSize('CascadeSelect', () => props.size)
const open = ref(false)
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const panelStyle = ref<Record<string, string>>({})
const path = ref<CascadeSelectOption[][]>([])
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))
const teleported = computed(() => isOverlayTeleported(props, config.value.appendTo))

const displayLabel = computed(() => findLabel(props.options, props.modelValue) ?? props.placeholder ?? locale.value.selectPlaceholder)

function findLabel(options: CascadeSelectOption[], value: CascadeSelectValue): string | null {
  for (const option of options) {
    if (option.value === value) return option.label
    if (option.children?.length) {
      const nested = findLabel(option.children, value)
      if (nested) return nested
    }
  }
  return null
}

function updatePanelPosition() {
  if (!trigger.value) return
  const rect = trigger.value.getBoundingClientRect()
  const width = `${rect.width}px`
  panelStyle.value = teleported.value
    ? computeFloatingOverlayStyle(rect, 'bottom-start', { minWidth: width, width })
    : { minWidth: width, width }
}

function toggle() {
  if (props.disabled) return
  open.value = !open.value
  if (open.value) {
    path.value = [props.options]
    void nextTick(() => updatePanelPosition())
  }
}

function enterLevel(option: CascadeSelectOption, columnIndex: number) {
  if (option.disabled) return
  if (option.children?.length) {
    path.value = [...path.value.slice(0, columnIndex + 1), option.children]
    void nextTick(() => updatePanelPosition())
    return
  }
  emit('update:modelValue', option.value)
  open.value = false
}

function onDocumentClick(event: MouseEvent) {
  const target = event.target as Node
  if (root.value?.contains(target) || panel.value?.contains(target)) return
  open.value = false
}

function onViewportChange() {
  if (open.value) updatePanelPosition()
}

watch(open, (isOpen) => {
  if (isOpen) {
    document.addEventListener('click', onDocumentClick)
    if (teleported.value) {
      window.addEventListener('resize', onViewportChange)
      window.addEventListener('scroll', onViewportChange, true)
    }
  } else {
    document.removeEventListener('click', onDocumentClick)
    window.removeEventListener('resize', onViewportChange)
    window.removeEventListener('scroll', onViewportChange, true)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  window.removeEventListener('resize', onViewportChange)
  window.removeEventListener('scroll', onViewportChange, true)
})
</script>

<template>
  <div
    ref="root"
    class="wi-cascadeselect"
    :class="[
      `wi-cascadeselect--${sizeClass}`,
      { 'wi-cascadeselect--disabled': disabled, 'wi-cascadeselect--open': open },
    ]"
  >
    <button
      ref="trigger"
      type="button"
      class="wi-cascadeselect__trigger"
      :disabled="disabled"
      :aria-expanded="open"
      aria-haspopup="listbox"
      @click="toggle"
    >
      <span class="wi-cascadeselect__label">{{ displayLabel }}</span>
      <span class="wi-cascadeselect__caret" aria-hidden="true">
        <WiIcon name="chevron-down" size="sm" />
      </span>
    </button>
    <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
      <Transition name="wi-scale-fade">
        <div
          v-if="open"
          ref="panel"
          class="wi-cascadeselect__panel"
          :class="{ 'wi-cascadeselect__panel--teleported': teleported }"
          :style="panelStyle"
          role="listbox"
        >
          <ul
            v-for="(column, columnIndex) in path"
            :key="columnIndex"
            class="wi-cascadeselect__column"
          >
            <li v-for="option in column" :key="String(option.value)">
              <button
                type="button"
                class="wi-cascadeselect__option"
                :class="{
                  'wi-cascadeselect__option--selected': option.value === modelValue,
                  'wi-cascadeselect__option--parent': Boolean(option.children?.length),
                }"
                :disabled="option.disabled"
                role="option"
                :aria-selected="option.value === modelValue"
                @click="enterLevel(option, columnIndex)"
              >
                <span>{{ option.label }}</span>
                <WiIcon
                  v-if="option.children?.length"
                  name="chevron-right"
                  size="sm"
                  aria-hidden="true"
                />
              </button>
            </li>
          </ul>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
