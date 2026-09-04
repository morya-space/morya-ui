<script setup lang="ts">
import type { KnobProps } from './types'
import { computed, onBeforeUnmount, ref } from 'vue'

const props = withDefaults(defineProps<KnobProps>(), {
  modelValue: 0,
  min: 0,
  max: 100,
  step: 1,
  diameter: undefined,
  size: 100,
  disabled: false,
  valueTemplate: '{value}',
  ariaLabel: undefined,
  ariaLabelledby: undefined,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: number): void
}>()

const svgRef = ref<SVGSVGElement | null>(null)
const dragging = ref(false)

const clamped = computed(() => {
  const value = props.modelValue ?? props.min
  return Math.min(props.max, Math.max(props.min, value))
})

const ratio = computed(() => {
  const span = props.max - props.min
  if (span <= 0) return 0
  return (clamped.value - props.min) / span
})

const diameter = computed(() => props.diameter ?? props.size)
const radius = computed(() => diameter.value / 2 - 8)
const circumference = computed(() => 2 * Math.PI * radius.value)
const dashOffset = computed(() => circumference.value * (1 - ratio.value))

const displayValue = computed(() =>
  props.valueTemplate.replace(/\{value\}/g, String(clamped.value)),
)

const rootClass = computed(() => [
  'wd-knob',
  { 'wd-knob--disabled': props.disabled },
])

function snap(value: number): number {
  const stepped = Math.round((value - props.min) / props.step) * props.step + props.min
  return Math.min(props.max, Math.max(props.min, Number(stepped.toFixed(6))))
}

function valueFromPointer(clientX: number, clientY: number) {
  const el = svgRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const angle = Math.atan2(clientY - cy, clientX - cx)
  // Map from -π..π with 0 at right → 0 at top, clockwise-ish for dial feel
  const normalized = (angle + Math.PI / 2 + Math.PI * 2) % (Math.PI * 2)
  const next = props.min + (normalized / (Math.PI * 2)) * (props.max - props.min)
  emit('update:modelValue', snap(next))
}

function onPointerDown(event: PointerEvent) {
  if (props.disabled) return
  dragging.value = true
  ;(event.currentTarget as Element).setPointerCapture?.(event.pointerId)
  valueFromPointer(event.clientX, event.clientY)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
}

function onPointerMove(event: PointerEvent) {
  if (!dragging.value) return
  valueFromPointer(event.clientX, event.clientY)
}

function onPointerUp() {
  dragging.value = false
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
}

function onKeydown(event: KeyboardEvent) {
  if (props.disabled) return
  if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
    event.preventDefault()
    emit('update:modelValue', snap(clamped.value + props.step))
  }
  if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
    event.preventDefault()
    emit('update:modelValue', snap(clamped.value - props.step))
  }
  if (event.key === 'Home') {
    event.preventDefault()
    emit('update:modelValue', props.min)
  }
  if (event.key === 'End') {
    event.preventDefault()
    emit('update:modelValue', props.max)
  }
}

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
})
</script>

<template>
  <div
    :class="rootClass"
    role="slider"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-valuenow="clamped"
    :aria-valuetext="displayValue"
    :aria-label="ariaLabel"
    :aria-labelledby="ariaLabelledby"
    :aria-disabled="disabled || undefined"
    :tabindex="disabled ? -1 : 0"
    @keydown="onKeydown"
  >
    <svg
      ref="svgRef"
      class="wd-knob__svg"
      :width="diameter"
      :height="diameter"
      :viewBox="`0 0 ${diameter} ${diameter}`"
      @pointerdown="onPointerDown"
    >
      <circle
        class="wd-knob__track"
        :cx="diameter / 2"
        :cy="diameter / 2"
        :r="radius"
        fill="none"
        stroke-width="8"
      />
      <circle
        class="wd-knob__value"
        :cx="diameter / 2"
        :cy="diameter / 2"
        :r="radius"
        fill="none"
        stroke-width="8"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        :transform="`rotate(-90 ${diameter / 2} ${diameter / 2})`"
      />
    </svg>
    <span class="wd-knob__label">{{ displayValue }}</span>
  </div>
</template>
