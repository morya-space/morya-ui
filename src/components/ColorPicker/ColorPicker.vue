<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { ColorPickerProps, ColorPickerFormat, GradientStop, GradientValue } from './types'
import { computed, nextTick, onBeforeUnmount, ref, useAttrs, watch } from 'vue'
import { useMLocale } from '../../locale'
import { useConfiguredSize, useMConfig } from '../../shared/config'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import { computeFloatingOverlayStyle } from '../../shared/overlayPlacement'
import { useFieldParts } from '../../shared/useComponentAttrs'
import { useMId } from '../../shared/useMId'
import { useMotionTransition } from '../../theme/useMotionTransition'
import MIcon from '../Icon/Icon.vue'
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
  allowClear: false,
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

// Sync from modelValue
watch(() => props.modelValue, (val) => {
  const value = val ?? '#000000'
  if (props.gradient && isGradient(value)) {
    mode.value = 'gradient'
    const parsed = parseGradient(value)
    if (parsed) {
      gradientValue.value = parsed
      if (parsed.stops.length > 0) {
        activeStopId.value = parsed.stops[0]!.id
        const rgb = hexToRgb(normalizeHex(parsed.stops[0]!.color))
        if (rgb) hsb.value = rgbToHsb(rgb)
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
    emit('update:modelValue', hex)
    emit('change', hex)
  }
}

function emitGradient() {
  const str = gradientToString(gradientValue.value)
  inputValue.value = str
  emit('update:modelValue', str)
  emit('change', str)
}

function setMode(newMode: 'single' | 'gradient') {
  if (props.disabled) return
  mode.value = newMode
  if (newMode === 'gradient' && !isGradient(props.modelValue ?? '')) {
    // Convert current color to gradient
    gradientValue.value = createDefaultGradient()
    const firstStop = gradientValue.value.stops[0]
    if (firstStop) {
      firstStop.color = currentHex.value
      activeStopId.value = firstStop.id
    }
    emitGradient()
  } else if (newMode === 'single') {
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
  
  // If close to existing stop, select it; otherwise add new stop
  if (closest && minDist < 5) {
    activeStopId.value = closest.id
    const rgb = hexToRgb(normalizeHex(closest.color))
    if (rgb) hsb.value = rgbToHsb(rgb)
  } else {
    const newStop: GradientStop = {
      id: createStopId(),
      color: currentHex.value,
      position: Math.round(x),
    }
    gradientValue.value.stops.push(newStop)
    gradientValue.value.stops.sort((a, b) => a.position - b.position)
    activeStopId.value = newStop.id
    emitGradient()
  }
  
  // Start dragging
  el.setPointerCapture(event.pointerId)
  const onMove = (e: PointerEvent) => onGradientBarMove(e)
  const onUp = () => {
    el.removeEventListener('pointermove', onMove)
    el.removeEventListener('pointerup', onUp)
  }
  el.addEventListener('pointermove', onMove)
  el.addEventListener('pointerup', onUp)
}

function onGradientBarMove(event: PointerEvent) {
  const el = gradientBarRef.value
  if (!el || !activeStop.value) return
  const rect = el.getBoundingClientRect()
  const x = clamp((event.clientX - rect.left) / rect.width, 0, 1) * 100
  activeStop.value.position = Math.round(x)
  gradientValue.value.stops.sort((a, b) => a.position - b.position)
  emitGradient()
}

function onAngleChange(event: Event) {
  const target = event.target as HTMLInputElement
  gradientValue.value.angle = parseInt(target.value, 10) || 0
  emitGradient()
}

function onGradientTypeChange(event: Event) {
  const target = event.target as HTMLSelectElement
  gradientValue.value.type = target.value as 'linear' | 'radial'
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

function onInputChange(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value.trim()
  
  if (isGradientMode.value) {
    // Try to parse as gradient
    const parsed = parseGradient(value)
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
    if (isValidHex(value)) {
      const rgb = hexToRgb(value)
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
      <MIcon v-if="allowClear && modelValue" name="close" size="sm" class="m-colorpicker__clear" @click.stop="onClear" />
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
              <button
                type="button"
                class="m-colorpicker__mode-btn"
                :class="{ 'm-colorpicker__mode-btn--active': mode === 'single' }"
                :disabled="disabled"
                @click="setMode('single')"
              >
                Single
              </button>
              <button
                type="button"
                class="m-colorpicker__mode-btn"
                :class="{ 'm-colorpicker__mode-btn--active': mode === 'gradient' }"
                :disabled="disabled"
                @click="setMode('gradient')"
              >
                Gradient
              </button>
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
                    @pointerdown.stop="onGradientBarPointerDown"
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
                <select
                  class="m-colorpicker__gradient-type"
                  :value="gradientValue.type"
                  :disabled="disabled"
                  @change="onGradientTypeChange"
                >
                  <option value="linear">Linear</option>
                  <option value="radial">Radial</option>
                </select>
                <input
                  v-if="gradientValue.type === 'linear'"
                  type="number"
                  class="m-colorpicker__gradient-angle"
                  :value="Math.round(gradientValue.angle)"
                  :disabled="disabled"
                  min="0"
                  max="360"
                  @change="onAngleChange"
                >
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
              <input
                :id="fieldId"
                v-model="inputValue"
                type="text"
                class="m-colorpicker__input"
                :disabled="disabled"
                spellcheck="false"
                @change="onInputChange"
                @blur="onInputBlur"
              >
            </div>

            <!-- Presets -->
            <div v-if="presets?.length" class="m-colorpicker__presets">
              <div v-for="(preset, i) in presets" :key="i" class="m-colorpicker__preset-group">
                <div v-if="preset.label" class="m-colorpicker__preset-label">{{ preset.label }}</div>
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
