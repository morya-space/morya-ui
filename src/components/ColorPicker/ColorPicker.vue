<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { SelectModelValue } from '../Select/types'
import type { ColorPickerFormat, ColorPickerProps, GradientStop, GradientValue } from './types'
import { computed, nextTick, onBeforeUnmount, ref, useAttrs, watch } from 'vue'
import { useMLocale } from '../../locale'
import { useConfiguredSize, useMConfig } from '../../shared/config'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import { computeFloatingOverlayStyle } from '../../shared/overlayPlacement'
import { useFieldParts } from '../../shared/useComponentAttrs'
import { useMId } from '../../shared/useMId'
import { useMotionTransition } from '../../theme/useMotionTransition'
import MIcon from '../Icon/Icon.vue'
import MInput from '../Input/Input.vue'
import MInputNumber from '../InputNumber/InputNumber.vue'
import MSegmented from '../Segmented/Segmented.vue'
import MSelect from '../Select/Select.vue'
import {
  clamp,
  hexToRgb,
  hsbToRgb,
  isValidHex,
  normalizeHex,
  rgbToHex,
  rgbToHsb,
} from './colorUtils'
import {
  createDefaultGradient,
  createStopId,
  gradientToString,
  isGradient,
  parseGradient,
  stopsToGradientPreview,
} from './gradientUtils'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ColorPickerProps>(), {
  modelValue: '#1677ff',
  disabled: false,
  disabledAlpha: false,
  clearable: false,
  format: 'hex',
  presets: undefined,
  showText: false,
  size: undefined,
  placement: 'bottom-start',
  teleport: true,
  transition: undefined,
  pt: undefined,
  gradient: false,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'change', value: string): void
  (event: 'clear'): void
  (event: 'show'): void
  (event: 'hide'): void
}>()

const attrs = useAttrs()
const { rootAttrs } = useFieldParts(attrs, () => props.pt)
const locale = useMLocale()
const config = useMConfig()
const sizeClass = useConfiguredSize('ColorPicker', () => props.size)
const autoFieldId = useMId('m-colorpicker')
const fieldId = computed(() => autoFieldId)

const { transitionName, transitionCss } = useMotionTransition({
  role: 'popup',
  local: () => props.transition,
  componentName: 'ColorPicker',
  fallback: 'scale-fade',
})

// --- State ---
const open = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const panelStyle = ref<Record<string, string>>({})
const saturationRef = ref<HTMLElement | null>(null)
const hueRef = ref<HTMLElement | null>(null)
const alphaRef = ref<HTMLElement | null>(null)
const gradientBarRef = ref<HTMLElement | null>(null)

const mode = ref<'single' | 'gradient'>('single')
const hsb = ref({ h: 0, s: 0, b: 0 })
const alpha = ref(1)
const inputValue = ref('')

// Gradient state
const gradientValue = ref<GradientValue>(createDefaultGradient())
const activeStopId = ref<string>('')

const teleportTarget = computed(() =>
  resolveOverlayTeleport(props, config.value.appendTo),
)

// Sync from modelValue — skip when update was emitted internally
let lastEmittedValue: string | undefined

watch(() => props.modelValue, (val) => {
  const value = val ?? '#000000'
  if (value === lastEmittedValue) return
  lastEmittedValue = undefined

  if (props.gradient && isGradient(value)) {
    mode.value = 'gradient'
    const parsed = parseGradient(value)
    if (parsed) {
      // Preserve active stop by matching position (not ID) if possible
      const prevActiveId = activeStopId.value
      const prevActiveStop = prevActiveId
        ? gradientValue.value.stops.find((s) => s.id === prevActiveId)
        : undefined

      gradientValue.value = parsed

      if (parsed.stops.length > 0) {
        let restored = false
        if (prevActiveStop) {
          const match = parsed.stops.find(
            (s) => Math.abs(s.position - prevActiveStop.position) < 0.5
              && s.color.toLowerCase() === prevActiveStop.color.toLowerCase(),
          )
          if (match) {
            activeStopId.value = match.id
            restored = true
          }
        }
        if (!restored) {
          activeStopId.value = parsed.stops[0]!.id
          const rgb = hexToRgb(normalizeHex(parsed.stops[0]!.color))
          if (rgb) hsb.value = rgbToHsb(rgb)
        }
      }
    }
  } else {
    mode.value = 'single'
    const hex = normalizeHex(value)
    const rgb = hexToRgb(hex)
    if (rgb) hsb.value = rgbToHsb(rgb)
  }
  inputValue.value = formatDisplayValue(value)
}, { immediate: true })

// --- Computed ---
const isGradientMode = computed(() => props.gradient && mode.value === 'gradient')

const currentHex = computed(() => {
  const rgb = hsbToRgb(hsb.value)
  return rgbToHex(rgb)
})

const currentRgb = computed(() => hsbToRgb(hsb.value))

const activeStop = computed(() =>
  gradientValue.value.stops.find((s) => s.id === activeStopId.value)
)

const gradientPreview = computed(() =>
  stopsToGradientPreview(gradientValue.value.stops)
)

const displayValue = computed(() => {
  if (isGradientMode.value) {
    return gradientToString(gradientValue.value)
  }
  return formatDisplayValue(currentHex.value)
})

const triggerBackground = computed(() => {
  if (isGradientMode.value) {
    return gradientPreview.value
  }
  return currentHex.value
})

const saturationBackground = computed(() => {
  const rgb = hsbToRgb({ h: hsb.value.h, s: 1, b: 1 })
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
})

const hueHandleStyle = computed<CSSProperties>(() => ({
  left: `${(hsb.value.h / 360) * 100}%`,
  background: `hsl(${hsb.value.h}, 100%, 50%)`,
}))

const saturationHandleStyle = computed<CSSProperties>(() => ({
  left: `${hsb.value.s * 100}%`,
  top: `${(1 - hsb.value.b) * 100}%`,
  background: currentHex.value,
}))

const alphaHandleStyle = computed<CSSProperties>(() => ({
  left: `${alpha.value * 100}%`,
  background: currentHex.value,
}))

const alphaGradient = computed(() => {
  const rgb = currentRgb.value
  return `linear-gradient(to right, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0) 0%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1) 100%)`
})

const rootClass = computed(() => [
  'm-colorpicker',
  `m-colorpicker--${sizeClass.value}`,
  {
    'm-colorpicker--disabled': props.disabled,
    'm-colorpicker--open': open.value,
    'm-colorpicker--gradient': isGradientMode.value,
  },
])

// --- Methods ---
function formatDisplayValue(hex: string): string {
  const rgb = hexToRgb(hex) ?? { r: 0, g: 0, b: 0 }
  const hsbVal = rgbToHsb(rgb)
  switch (props.format) {
    case 'rgb':
      return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
    case 'hsb':
      return `hsb(${Math.round(hsbVal.h)}, ${Math.round(hsbVal.s * 100)}%, ${Math.round(hsbVal.b * 100)}%)`
    default:
      return hex
  }
}

function updateColor(newHsb: typeof hsb.value, newAlpha?: number) {
  hsb.value = { ...newHsb }
  if (newAlpha !== undefined) alpha.value = clamp(newAlpha, 0, 1)
  const rgb = hsbToRgb(hsb.value)
  const hex = rgbToHex(rgb)

  if (isGradientMode.value && activeStop.value) {
    activeStop.value.color = hex
    emitGradient()
  } else {
    inputValue.value = formatDisplayValue(hex)
    lastEmittedValue = hex
    emit('update:modelValue', hex)
    emit('change', hex)
  }
}

function emitGradient() {
  const str = gradientToString(gradientValue.value)
  lastEmittedValue = str
  inputValue.value = str
  emit('update:modelValue', str)
  emit('change', str)
}

function setMode(newMode: string | number | boolean | null) {
  if (props.disabled || newMode == null) return
  const modeValue = newMode as 'single' | 'gradient'
  mode.value = modeValue
  if (modeValue === 'gradient' && !isGradient(props.modelValue ?? '')) {
    // Convert current color to gradient
    gradientValue.value = createDefaultGradient()
    const firstStop = gradientValue.value.stops[0]
    if (firstStop) {
      firstStop.color = currentHex.value
      activeStopId.value = firstStop.id
    }
    emitGradient()
  } else if (modeValue === 'single') {
    // Use first stop color as single color
    const firstStop = gradientValue.value.stops[0]
    if (firstStop) {
      const rgb = hexToRgb(normalizeHex(firstStop.color))
      if (rgb) {
        hsb.value = rgbToHsb(rgb)
        const hex = rgbToHex(rgb)
        inputValue.value = formatDisplayValue(hex)
        emit('update:modelValue', hex)
        emit('change', hex)
      }
    }
  }
}

function onGradientBarPointerDown(event: PointerEvent) {
  if (props.disabled) return
  const el = gradientBarRef.value
  if (!el) return
  
  // Check if clicking on existing stop
  const rect = el.getBoundingClientRect()
  const x = clamp((event.clientX - rect.left) / rect.width, 0, 1) * 100
  
  // Find closest stop
  let closest: GradientStop | null = null
  let minDist = Infinity
  for (const stop of gradientValue.value.stops) {
    const dist = Math.abs(stop.position - x)
    if (dist < minDist) {
      minDist = dist
      closest = stop
    }
  }
  
  // If close to existing stop, select it only (no drag)
  if (closest && minDist < 5) {
    activeStopId.value = closest.id
    const rgb = hexToRgb(normalizeHex(closest.color))
    if (rgb) hsb.value = rgbToHsb(rgb)
    return // Early return — don't start dragging existing stops
  }
  
  // Add new stop and start dragging it
  const newStop: GradientStop = {
    id: createStopId(),
    color: currentHex.value,
    position: Math.round(x),
  }
  gradientValue.value.stops.push(newStop)
  gradientValue.value.stops.sort((a, b) => a.position - b.position)
  activeStopId.value = newStop.id
  emitGradient()
  
  // Start dragging the new stop — capture on the bar element since the new stop doesn't exist yet
  startStopDrag(el, el, event.pointerId, newStop)
}

function onStopPointerDown(event: PointerEvent, stop: GradientStop) {
  if (props.disabled) return
  event.stopPropagation()
  
  // Select the stop
  activeStopId.value = stop.id
  const rgb = hexToRgb(normalizeHex(stop.color))
  if (rgb) hsb.value = rgbToHsb(rgb)
  
  // Start dragging this stop — capture on the stop element itself
  const stopEl = event.currentTarget as HTMLElement
  const barEl = gradientBarRef.value
  if (!stopEl || !barEl) return
  startStopDrag(stopEl, barEl, event.pointerId, stop)
}

function startStopDrag(captureEl: HTMLElement, barEl: HTMLElement, pointerId: number, stop: GradientStop) {
  captureEl.setPointerCapture(pointerId)
  const stopId = stop.id // Capture by ID, not by reference
  const onMove = (e: PointerEvent) => {
    const rect = barEl.getBoundingClientRect()
    const x = clamp((e.clientX - rect.left) / rect.width, 0, 1) * 100
    // Find the stop by ID in the current array (it may have been re-sorted)
    const currentStop = gradientValue.value.stops.find((s) => s.id === stopId)
    if (currentStop) {
      currentStop.position = x // Use float for smooth dragging, round only on emit
      gradientValue.value.stops.sort((a, b) => a.position - b.position)
      emitGradient()
    }
  }
  const onUp = () => {
    // Round to integer on release for cleaner values
    const currentStop = gradientValue.value.stops.find((s) => s.id === stopId)
    if (currentStop) {
      currentStop.position = Math.round(currentStop.position)
      gradientValue.value.stops.sort((a, b) => a.position - b.position)
      emitGradient()
    }
    captureEl.removeEventListener('pointermove', onMove)
    captureEl.removeEventListener('pointerup', onUp)
  }
  captureEl.addEventListener('pointermove', onMove)
  captureEl.addEventListener('pointerup', onUp)
}

function onAngleChange(value: number | null) {
  if (value == null) return
  gradientValue.value.angle = value
  emitGradient()
}

function onGradientTypeChange(value: SelectModelValue) {
  if (value == null || typeof value === 'object') return
  gradientValue.value.type = value as 'linear' | 'radial'
  emitGradient()
}

function onStopDelete(stopId: string) {
  if (gradientValue.value.stops.length <= 2) return
  const index = gradientValue.value.stops.findIndex((s) => s.id === stopId)
  if (index > -1) {
    gradientValue.value.stops.splice(index, 1)
    if (activeStopId.value === stopId) {
      activeStopId.value = gradientValue.value.stops[0]?.id ?? ''
    }
    emitGradient()
  }
}

function onStopSelect(stop: GradientStop) {
  activeStopId.value = stop.id
  const rgb = hexToRgb(normalizeHex(stop.color))
  if (rgb) hsb.value = rgbToHsb(rgb)
}

function onSaturationPointerDown(event: PointerEvent) {
  if (props.disabled) return
  const el = saturationRef.value
  if (!el) return
  el.setPointerCapture(event.pointerId)
  onSaturationMove(event)
  const onMove = (e: PointerEvent) => onSaturationMove(e)
  const onUp = () => {
    el.removeEventListener('pointermove', onMove)
    el.removeEventListener('pointerup', onUp)
  }
  el.addEventListener('pointermove', onMove)
  el.addEventListener('pointerup', onUp)
}

function onSaturationMove(event: PointerEvent) {
  const el = saturationRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const x = clamp((event.clientX - rect.left) / rect.width, 0, 1)
  const y = clamp((event.clientY - rect.top) / rect.height, 0, 1)
  updateColor({ ...hsb.value, s: x, b: 1 - y })
}

function onHuePointerDown(event: PointerEvent) {
  if (props.disabled) return
  const el = hueRef.value
  if (!el) return
  el.setPointerCapture(event.pointerId)
  onHueMove(event)
  const onMove = (e: PointerEvent) => onHueMove(e)
  const onUp = () => {
    el.removeEventListener('pointermove', onMove)
    el.removeEventListener('pointerup', onUp)
  }
  el.addEventListener('pointermove', onMove)
  el.addEventListener('pointerup', onUp)
}

function onHueMove(event: PointerEvent) {
  const el = hueRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const x = clamp((event.clientX - rect.left) / rect.width, 0, 1)
  updateColor({ ...hsb.value, h: x * 360 })
}

function onAlphaPointerDown(event: PointerEvent) {
  if (props.disabled || props.disabledAlpha) return
  const el = alphaRef.value
  if (!el) return
  el.setPointerCapture(event.pointerId)
  onAlphaMove(event)
  const onMove = (e: PointerEvent) => onAlphaMove(e)
  const onUp = () => {
    el.removeEventListener('pointermove', onMove)
    el.removeEventListener('pointerup', onUp)
  }
  el.addEventListener('pointermove', onMove)
  el.addEventListener('pointerup', onUp)
}

function onAlphaMove(event: PointerEvent) {
  const el = alphaRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const x = clamp((event.clientX - rect.left) / rect.width, 0, 1)
  updateColor(hsb.value, x)
}

function onInputChange(value: string) {
  const trimmed = value.trim()
  
  if (isGradientMode.value) {
    // Try to parse as gradient
    const parsed = parseGradient(trimmed)
    if (parsed) {
      gradientValue.value = parsed
      if (parsed.stops.length > 0) {
        activeStopId.value = parsed.stops[0]!.id
        const rgb = hexToRgb(normalizeHex(parsed.stops[0]!.color))
        if (rgb) hsb.value = rgbToHsb(rgb)
      }
      emitGradient()
    }
  } else {
    if (isValidHex(trimmed)) {
      const rgb = hexToRgb(trimmed)
      if (rgb) {
        updateColor(rgbToHsb(rgb))
      }
    }
  }
}

function onInputBlur() {
  inputValue.value = displayValue.value
}

function onClear() {
  lastEmittedValue = ''
  emit('update:modelValue', '')
  emit('clear')
  closePanel()
}

function onPresetClick(color: string) {
  if (props.disabled) return
  const rgb = hexToRgb(normalizeHex(color))
  if (rgb) {
    updateColor(rgbToHsb(rgb))
  }
}

async function updatePanelPosition() {
  if (!open.value || !triggerRef.value) return
  await nextTick()
  if (!panelRef.value || !triggerRef.value) return
  const style = computeFloatingOverlayStyle(
    triggerRef.value.getBoundingClientRect(),
    props.placement,
    { gap: 4 },
  )
  panelStyle.value = style
}

function openPanel() {
  if (props.disabled || open.value) return
  open.value = true
  emit('show')
  updatePanelPosition()
  document.addEventListener('click', onDocumentClick, true)
  window.addEventListener('resize', updatePanelPosition)
  window.addEventListener('scroll', updatePanelPosition, true)
}

function closePanel() {
  if (!open.value) return
  open.value = false
  emit('hide')
  document.removeEventListener('click', onDocumentClick, true)
  window.removeEventListener('resize', updatePanelPosition)
  window.removeEventListener('scroll', updatePanelPosition, true)
}

function togglePanel() {
  if (open.value) closePanel()
  else openPanel()
}

function onDocumentClick(event: MouseEvent) {
  const target = event.target as Node
  if (
    triggerRef.value?.contains(target) ||
    panelRef.value?.contains(target)
  ) return
  closePanel()
}

onBeforeUnmount(() => {
  closePanel()
})

defineExpose({ open: openPanel, close: closePanel, toggle: togglePanel })
</script>

<template>
  <div v-bind="rootAttrs" :class="rootClass">
    <!-- Trigger -->
    <button
      ref="triggerRef"
      type="button"
      class="m-colorpicker__trigger"
      :disabled="disabled"
      :aria-expanded="open"
      :aria-haspopup="true"
      :aria-label="locale.selectColor"
      @click="togglePanel"
    >
      <span class="m-colorpicker__trigger-swatch" :style="{ background: triggerBackground }" />
      <span v-if="showText" class="m-colorpicker__trigger-text">{{ displayValue }}</span>
      <MIcon v-if="clearable && modelValue" name="close" size="sm" class="m-colorpicker__clear" @click.stop="onClear" />
      <MIcon v-else name="chevron-down" size="sm" class="m-colorpicker__arrow" />
    </button>

    <!-- Panel -->
    <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
      <Transition :name="transitionName" :css="transitionCss">
        <div
          v-if="open"
          ref="panelRef"
          class="m-colorpicker__panel"
          :style="panelStyle"
          role="dialog"
          :aria-label="locale.selectColor"
        >
          <div class="m-colorpicker__panel-inner">
            <!-- Mode Switch -->
            <div v-if="gradient" class="m-colorpicker__mode-switch">
              <MSegmented
                :model-value="mode"
                block
                :options="[
                  { label: 'Single', value: 'single' },
                  { label: 'Gradient', value: 'gradient' },
                ]"
                size="small"
                :disabled="disabled"
                @update:model-value="setMode"
              />
            </div>

            <!-- Gradient Controls -->
            <template v-if="isGradientMode">
              <!-- Gradient Bar -->
              <div class="m-colorpicker__gradient-section">
                <div
                  ref="gradientBarRef"
                  class="m-colorpicker__gradient-bar"
                  :style="{ background: gradientPreview }"
                  @pointerdown="onGradientBarPointerDown"
                >
                  <div
                    v-for="stop in gradientValue.stops"
                    :key="stop.id"
                    class="m-colorpicker__gradient-stop"
                    :class="{ 'm-colorpicker__gradient-stop--active': stop.id === activeStopId }"
                    :style="{ left: `${stop.position}%`, background: stop.color }"
                    @click.stop="onStopSelect(stop)"
                    @pointerdown.stop="onStopPointerDown($event, stop)"
                  />
                </div>
                <div class="m-colorpicker__gradient-stops-list">
                  <div
                    v-for="stop in gradientValue.stops"
                    :key="stop.id"
                    class="m-colorpicker__gradient-stop-item"
                    :class="{ 'm-colorpicker__gradient-stop-item--active': stop.id === activeStopId }"
                    @click="onStopSelect(stop)"
                  >
                    <span class="m-colorpicker__gradient-stop-color" :style="{ background: stop.color }" />
                    <span class="m-colorpicker__gradient-stop-pos">{{ Math.round(stop.position) }}%</span>
                    <button
                      v-if="gradientValue.stops.length > 2"
                      type="button"
                      class="m-colorpicker__gradient-stop-delete"
                      :disabled="disabled"
                      @click.stop="onStopDelete(stop.id)"
                    >
                      <MIcon name="close" size="sm" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Gradient Type & Angle -->
              <div class="m-colorpicker__gradient-options">
                <MSelect
                  :model-value="gradientValue.type"
                  :options="[
                    { label: 'Linear', value: 'linear' },
                    { label: 'Radial', value: 'radial' },
                  ]"
                  size="small"
                  :disabled="disabled"
                  @update:model-value="onGradientTypeChange"
                />
                <MInputNumber
                  v-if="gradientValue.type === 'linear'"
                  :model-value="Math.round(gradientValue.angle)"
                  size="small"
                  :min="0"
                  :max="360"
                  :disabled="disabled"
                  @update:model-value="onAngleChange"
                />
                <span v-if="gradientValue.type === 'linear'" class="m-colorpicker__gradient-angle-unit">deg</span>
              </div>
            </template>

            <!-- Saturation / Brightness -->
            <div
              ref="saturationRef"
              class="m-colorpicker__saturation"
              :style="{ background: saturationBackground }"
              @pointerdown="onSaturationPointerDown"
            >
              <div class="m-colorpicker__saturation-white" />
              <div class="m-colorpicker__saturation-black" />
              <div class="m-colorpicker__saturation-handle" :style="saturationHandleStyle" />
            </div>

            <!-- Sliders -->
            <div class="m-colorpicker__sliders">
              <div
                ref="hueRef"
                class="m-colorpicker__hue"
                @pointerdown="onHuePointerDown"
              >
                <div class="m-colorpicker__hue-track" />
                <div class="m-colorpicker__hue-handle" :style="hueHandleStyle" />
              </div>
              <div
                v-if="!disabledAlpha"
                ref="alphaRef"
                class="m-colorpicker__alpha"
                @pointerdown="onAlphaPointerDown"
              >
                <div class="m-colorpicker__alpha-track" :style="{ background: alphaGradient }" />
                <div class="m-colorpicker__alpha-handle" :style="alphaHandleStyle" />
              </div>
            </div>

            <!-- Input -->
            <div class="m-colorpicker__input-row">
              <MInput
                :id="fieldId"
                v-model="inputValue"
                size="small"
                :disabled="disabled"
                spellcheck="false"
                @change="onInputChange"
                @blur="onInputBlur"
              />
            </div>

            <!-- Presets -->
            <div v-if="presets?.length" class="m-colorpicker__presets">
              <div v-for="(preset, i) in presets" :key="i" class="m-colorpicker__preset-group">
                <div v-if="preset.label" class="m-colorpicker__preset-label">
                  {{ preset.label }}
                </div>
                <div class="m-colorpicker__preset-colors">
                  <button
                    v-for="color in preset.colors"
                    :key="color"
                    type="button"
                    class="m-colorpicker__preset-swatch"
                    :class="{ 'm-colorpicker__preset-swatch--active': normalizeHex(color) === currentHex }"
                    :style="{ background: color }"
                    :disabled="disabled"
                    :aria-label="color"
                    @click="onPresetClick(color)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
