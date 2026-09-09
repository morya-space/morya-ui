<script setup lang="ts">
import type { CascadeSelectOption, CascadeSelectProps, CascadeSelectValue } from './types'
import { computed, nextTick, onBeforeUnmount, ref, useSlots, watch } from 'vue'
import { useMLocale } from '../../locale'
import { useComponentDefaults, useConfiguredSize, useMConfig } from '../../shared/config'
import { useMId } from '../../shared/useMId'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import { computeFloatingOverlayStyle } from '../../shared/overlayPlacement'
import { useMenuKeyboard } from '../../shared/useMenuKeyboard'
import MIcon from '../Icon/Icon.vue'
import MScrollbar from '../Scrollbar/Scrollbar.vue'

const props = withDefaults(defineProps<CascadeSelectProps>(), {
  modelValue: null,
  placeholder: undefined,
  invalid: false,
  disabled: false,
  required: false,
  teleport: true,
  clearable: undefined,
  fluid: undefined,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: CascadeSelectValue): void
  (event: 'clear'): void
}>()

const slots = useSlots()
const defaults = useComponentDefaults('CascadeSelect')
const config = useMConfig()
const locale = useMLocale()
const sizeClass = useConfiguredSize('CascadeSelect', () => props.size)
const open = ref(false)
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const panelStyle = ref<Record<string, string>>({})
const path = ref<CascadeSelectOption[][]>([])
const autoFieldId = useMId('m-cascadeselect')
const fieldId = computed(() => props.id ?? autoFieldId)
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))
const teleported = computed(() => isOverlayTeleported(props, config.value.appendTo))
const resolvedClearable = computed(
  () => props.clearable ?? (defaults.value.clearable as boolean | undefined) ?? false,
)
const resolvedFluid = computed(() => props.fluid ?? (defaults.value.fluid as boolean | undefined) ?? false)
const isInvalid = computed(() => props.invalid || Boolean(props.errorMessage))
const feedbackText = computed(() => props.errorMessage || props.helpText)
const feedbackIsError = computed(() => Boolean(props.errorMessage) || (isInvalid.value && Boolean(props.helpText)))
const hasValue = computed(() => props.modelValue != null)
const showClearButton = computed(() => resolvedClearable.value && hasValue.value && !props.disabled)

const displayLabel = computed(
  () => findLabel(props.options, props.modelValue) ?? props.placeholder ?? locale.value.selectPlaceholder,
)

function findOption(options: CascadeSelectOption[], value: CascadeSelectValue): CascadeSelectOption | undefined {
  if (value == null) return undefined
  for (const option of options) {
    if (option.value === value) return option
    if (option.children?.length) {
      const nested = findOption(option.children, value)
      if (nested) return nested
    }
  }
  return undefined
}

const selectedOption = computed(() => findOption(props.options, props.modelValue))

const activeColumn = ref(0)
const panelId = computed(() => `${fieldId.value}-panel`)

const keyboard = useMenuKeyboard({
  itemCount: () => path.value[activeColumn.value]?.length ?? 0,
  isItemDisabled: (index) => Boolean(path.value[activeColumn.value]?.[index]?.disabled),
  enabled: open,
  onActivate: (index) => activateOption(index),
  onEscape: () => {
    open.value = false
  },
  returnFocusTo: trigger,
})

function findLabel(options: CascadeSelectOption[], value: CascadeSelectValue): string | null {
  if (value == null) return null
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

function buildPathToValue(
  options: CascadeSelectOption[],
  value: CascadeSelectValue,
): CascadeSelectOption[][] | null {
  for (const option of options) {
    if (option.value === value) return [options]
    if (option.children?.length) {
      const nested = buildPathToValue(option.children, value)
      if (nested) return [options, ...nested]
    }
  }
  return null
}

function focusActiveOption() {
  const index = keyboard.activeIndex.value
  if (index < 0) return
  const columnEl = panel.value?.querySelectorAll<HTMLElement>('.m-cascadeselect__column')[activeColumn.value]
  const optionEl = columnEl?.querySelectorAll<HTMLElement>('.m-cascadeselect__option')[index]
  optionEl?.focus({ preventScroll: true })
}

function openPanel() {
  open.value = true
  const resolved = props.modelValue != null ? buildPathToValue(props.options, props.modelValue) : null
  path.value = resolved ?? [props.options]
  activeColumn.value = path.value.length - 1
  const column = path.value[activeColumn.value] ?? []
  const selectedIndex = column.findIndex((option) => option.value === props.modelValue)
  keyboard.setActive(selectedIndex)
  if (selectedIndex < 0) keyboard.moveFirst()
  void nextTick(() => {
    updatePanelPosition()
    focusActiveOption()
  })
}

function toggle() {
  if (props.disabled) return
  if (open.value) {
    open.value = false
    return
  }
  openPanel()
}

function enterChildren(option: CascadeSelectOption, columnIndex: number) {
  enterLevel(option, columnIndex)
  activeColumn.value = columnIndex + 1
  void nextTick(() => {
    keyboard.moveFirst()
    focusActiveOption()
  })
}

function activateOption(index: number) {
  const option = path.value[activeColumn.value]?.[index]
  if (!option || option.disabled) return
  if (option.children?.length) {
    enterChildren(option, activeColumn.value)
    return
  }
  enterLevel(option, activeColumn.value)
}

function onPanelKeydown(event: KeyboardEvent) {
  if (!open.value) return
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    const option = path.value[activeColumn.value]?.[keyboard.activeIndex.value]
    if (option?.children?.length && !option.disabled) enterChildren(option, activeColumn.value)
    return
  }
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    if (activeColumn.value > 0) {
      const childColumn = path.value[activeColumn.value]
      activeColumn.value -= 1
      const parentIndex = (path.value[activeColumn.value] ?? []).findIndex(
        (option) => option.children === childColumn,
      )
      keyboard.setActive(parentIndex >= 0 ? parentIndex : 0)
      focusActiveOption()
    }
    return
  }
  keyboard.onKeydown(event)
}

function onTriggerKeydown(event: KeyboardEvent) {
  if (props.disabled) return
  if (!open.value) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      openPanel()
    }
    return
  }
  onPanelKeydown(event)
}

watch([keyboard.activeIndex, activeColumn], () => {
  if (open.value) focusActiveOption()
})

function clear(event: MouseEvent) {
  event.stopPropagation()
  event.preventDefault()
  if (props.disabled || !hasValue.value) return
  emit('update:modelValue', null)
  emit('clear')
  trigger.value?.focus({ preventScroll: true })
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
  trigger.value?.focus({ preventScroll: true })
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
    class="m-select-field wk-cascadeselect"
    :class="[
      `m-cascadeselect--${sizeClass}`,
      {
        'm-select-field--fluid': resolvedFluid,
        'm-cascadeselect--disabled': disabled,
        'm-cascadeselect--open': open,
      },
    ]"
  >
    <label v-if="label" class="m-select-field__label" :for="fieldId">{{ label }}</label>
    <div
      class="m-cascadeselect__control wk-select__control"
      :class="{
        'm-select__control--clearable': showClearButton,
        'm-select__control--open': open,
      }"
    >
      <button
        :id="fieldId"
        ref="trigger"
        type="button"
        class="m-cascadeselect__trigger"
        role="combobox"
        :class="{ 'm-cascadeselect__trigger--invalid': isInvalid, 'm-cascadeselect__trigger--placeholder': !hasValue }"
        :disabled="disabled"
        :aria-expanded="open"
        :aria-controls="open ? panelId : undefined"
        :aria-invalid="isInvalid || undefined"
        :aria-describedby="feedbackText ? `${fieldId}-help` : undefined"
        aria-haspopup="listbox"
        @click="toggle"
        @keydown="onTriggerKeydown"
      >
        <slot v-if="slots.value && hasValue && selectedOption" name="value" :option="selectedOption" />
        <span v-else class="m-cascadeselect__label">{{ displayLabel }}</span>
      </button>
      <div class="m-select__suffix">
        <button
          v-if="showClearButton"
          class="m-select__clear"
          type="button"
          :aria-label="locale.clear"
          @click="clear"
        >
          <MIcon name="close" class="m-control-affix-icon" />
        </button>
        <span
          class="m-select__indicator"
          :class="{ 'm-select__indicator--open': open }"
          aria-hidden="true"
        >
          <MIcon name="chevron-down" class="m-control-affix-icon" />
        </span>
      </div>
    </div>
    <p
      v-if="feedbackText"
      :id="`${fieldId}-help`"
      class="m-select-field__help"
      :class="{ 'm-select-field__help--invalid': feedbackIsError }"
    >
      {{ feedbackText }}
    </p>
    <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
      <Transition name="m-scale-fade">
        <div
          v-if="open"
          :id="panelId"
          ref="panel"
          class="m-cascadeselect__panel"
          :class="{ 'm-cascadeselect__panel--teleported': teleported }"
          :style="panelStyle"
          role="listbox"
          @keydown="onPanelKeydown"
        >
          <MScrollbar
            v-for="(column, columnIndex) in path"
            :key="columnIndex"
            tag="ul"
            class="m-cascadeselect__column"
            fit-content
            view-class="m-cascadeselect__column-list"
          >
            <li v-for="option in column" :key="String(option.value)">
              <button
                type="button"
                class="m-cascadeselect__option"
                :class="{
                  'm-cascadeselect__option--selected': option.value === modelValue,
                  'm-cascadeselect__option--parent': Boolean(option.children?.length),
                }"
                :disabled="option.disabled"
                role="option"
                :aria-selected="option.value === modelValue"
                @click="enterLevel(option, columnIndex)"
              >
                <slot name="option" :option="option">
                  <span>{{ option.label }}</span>
                </slot>
                <MIcon
                  v-if="option.children?.length"
                  name="chevron-right"
                  size="sm"
                  aria-hidden="true"
                />
              </button>
            </li>
          </MScrollbar>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
