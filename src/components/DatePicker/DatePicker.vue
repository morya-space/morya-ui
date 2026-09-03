<script setup lang="ts">
import type {
  DatePickerDateValue,
  DatePickerEmits,
  DatePickerProps,
  DatePickerShortcut,
  DatePickerValue,
} from './types'
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { formatLocale, useWiLocale } from '../../locale'
import { useConfiguredSize, useWiConfig } from '../../shared/config'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import { computeFloatingOverlayStyle } from '../../shared/overlayPlacement'
import WiIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<DatePickerProps>(), {
  modelValue: null,
  type: 'date',
  id: undefined,
  disabled: false,
  invalid: false,
  fluid: false,
  placeholder: undefined,
  errorMessage: undefined,
  helpText: undefined,
  format: 'YYYY-MM-DD',
  clearable: true,
  shortcuts: () => [],
  teleport: true,
})
const emit = defineEmits<DatePickerEmits>()

const config = useWiConfig()
const locale = useWiLocale()
const sizeClass = useConfiguredSize('DatePicker', () => props.size)
const open = ref(false)
const root = ref<HTMLElement | null>(null)
const triggerEl = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const panelStyle = ref<Record<string, string>>({})
const viewYear = ref(new Date().getFullYear())
const viewMonth = ref(new Date().getMonth())
const activeDate = ref(startOfDay(new Date()))
const rangeDraft = ref<Date | null>(null)
const hoverDate = ref<Date | null>(null)
const fieldId = computed(() => props.id ?? `wi-datepicker-${Math.random().toString(36).slice(2, 8)}`)
const panelId = computed(() => `${fieldId.value}-panel`)
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))
const teleported = computed(() => isOverlayTeleported(props, config.value.appendTo))
const isRange = computed(() => props.type === 'daterange')
const isInvalid = computed(() => props.invalid || Boolean(props.errorMessage))
const feedbackText = computed(() => props.errorMessage || props.helpText)
const feedbackIsError = computed(
  () => Boolean(props.errorMessage) || (props.invalid && Boolean(props.helpText)),
)

function toDate(value: DatePickerDateValue | null | undefined): Date | null {
  if (value == null || value === '') return null
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
  if (match) {
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  }
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function toIso(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function formatDate(date: Date): string {
  return props.format
    .replaceAll('YYYY', String(date.getFullYear()))
    .replaceAll('MM', String(date.getMonth() + 1).padStart(2, '0'))
    .replaceAll('DD', String(date.getDate()).padStart(2, '0'))
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function unpackValue(value: DatePickerValue | undefined): { start: Date | null; end: Date | null } {
  if (value == null || value === '') return { start: null, end: null }
  if (Array.isArray(value)) return { start: toDate(value[0]), end: toDate(value[1]) }
  const date = toDate(value)
  return { start: date, end: date }
}

const selectedRange = computed(() => unpackValue(props.modelValue))
const min = computed(() => toDate(props.minDate))
const max = computed(() => toDate(props.maxDate))

const displayValue = computed(() => {
  const { start, end } = selectedRange.value
  if (!start) return ''
  if (!isRange.value) return formatDate(start)
  if (!end) return formatDate(start)
  return `${formatDate(start)} – ${formatDate(end)}`
})

const placeholderText = computed(
  () => props.placeholder ?? (isRange.value ? locale.value.dateRangePlaceholder : locale.value.datePickerPlaceholder),
)

const monthLabel = computed(() =>
  formatLocale(locale.value.monthYear, {
    year: viewYear.value,
    month: viewMonth.value + 1,
    monthName: locale.value.monthNames[viewMonth.value] ?? String(viewMonth.value + 1),
  }),
)

function highlightBounds() {
  const start = rangeDraft.value ?? selectedRange.value.start
  const end = rangeDraft.value
    ? (hoverDate.value ?? rangeDraft.value)
    : selectedRange.value.end
  if (!start) return { start: null, end: null }
  if (!end) return { start: startOfDay(start), end: startOfDay(start) }
  const a = startOfDay(start)
  const b = startOfDay(end)
  return a.getTime() <= b.getTime() ? { start: a, end: b } : { start: b, end: a }
}

const calendarDays = computed(() => {
  const first = new Date(viewYear.value, viewMonth.value, 1)
  const startWeekday = first.getDay()
  const daysInMonth = new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
  const cells: {
    date: Date
    inMonth: boolean
    disabled: boolean
    selected: boolean
    inRange: boolean
    rangeStart: boolean
    rangeEnd: boolean
  }[] = []

  for (let i = 0; i < startWeekday; i++) {
    const date = new Date(viewYear.value, viewMonth.value, -startWeekday + i + 1)
    cells.push(buildCell(date, false))
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(buildCell(new Date(viewYear.value, viewMonth.value, day), true))
  }
  while (cells.length % 7 !== 0 || cells.length < 42) {
    const last = cells[cells.length - 1]!.date
    const date = new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1)
    cells.push(buildCell(date, false))
  }
  return cells
})

function buildCell(date: Date, inMonth: boolean) {
  const day = startOfDay(date)
  let disabled = false
  if (min.value && day < startOfDay(min.value)) disabled = true
  if (max.value && day > startOfDay(max.value)) disabled = true
  const bounds = highlightBounds()
  const t = day.getTime()
  const rangeStart = Boolean(bounds.start && t === bounds.start.getTime())
  const rangeEnd = Boolean(bounds.end && t === bounds.end.getTime())
  const inRange = Boolean(
    isRange.value && bounds.start && bounds.end && t > bounds.start.getTime() && t < bounds.end.getTime(),
  )
  return {
    date: day,
    inMonth,
    disabled,
    selected: rangeStart || rangeEnd,
    inRange,
    rangeStart,
    rangeEnd,
  }
}

const rootClass = computed(() => [
  'wi-datepicker',
  `wi-datepicker--${sizeClass.value}`,
  {
    'wi-datepicker--fluid': props.fluid,
    'wi-datepicker--disabled': props.disabled,
    'wi-datepicker--invalid': props.invalid,
    'wi-datepicker--open': open.value,
    'wi-datepicker--range': isRange.value,
  },
])

function syncViewFromValue() {
  const date = selectedRange.value.start ?? new Date()
  viewYear.value = date.getFullYear()
  viewMonth.value = date.getMonth()
}

function updatePanelPosition() {
  if (!teleported.value || !triggerEl.value) return
  const rect = triggerEl.value.getBoundingClientRect()
  panelStyle.value = computeFloatingOverlayStyle(rect, 'bottom-start', {
    minWidth: `${rect.width}px`,
  })
}

function setOpen(next: boolean) {
  if (props.disabled || next === open.value) return
  open.value = next
  if (next) {
    rangeDraft.value = null
    hoverDate.value = null
    syncViewFromValue()
    activeDate.value = startOfDay(selectedRange.value.start ?? new Date())
    void nextTick(() => updatePanelPosition())
  }
}

function toggle() {
  setOpen(!open.value)
}

function prevMonth() {
  if (viewMonth.value === 0) {
    viewMonth.value = 11
    viewYear.value -= 1
  } else {
    viewMonth.value -= 1
  }
}

function nextMonth() {
  if (viewMonth.value === 11) {
    viewMonth.value = 0
    viewYear.value += 1
  } else {
    viewMonth.value += 1
  }
}

function pick(date: Date, disabled: boolean) {
  if (disabled || props.disabled) return
  activeDate.value = startOfDay(date)
  if (!isRange.value) {
    emit('update:modelValue', toIso(date))
    emit('change', toIso(date))
    open.value = false
    inputEl.value?.focus({ preventScroll: true })
    return
  }
  if (!rangeDraft.value) {
    rangeDraft.value = date
    hoverDate.value = date
    return
  }
  const start = rangeDraft.value
  const end = date
  const [from, to] = start.getTime() <= end.getTime() ? [start, end] : [end, start]
  const payload: [string, string] = [toIso(from), toIso(to)]
  emit('update:modelValue', payload)
  emit('change', payload)
  rangeDraft.value = null
  hoverDate.value = null
  open.value = false
  inputEl.value?.focus({ preventScroll: true })
}

function applyShortcut(shortcut: DatePickerShortcut) {
  if (props.disabled) return
  const raw = typeof shortcut.value === 'function' ? shortcut.value() : shortcut.value
  if (Array.isArray(raw)) {
    const start = toDate(raw[0])
    const end = toDate(raw[1])
    if (!start || !end) return
    const [from, to] = start.getTime() <= end.getTime() ? [start, end] : [end, start]
    const payload = isRange.value ? [toIso(from), toIso(to)] as [string, string] : toIso(from)
    emit('update:modelValue', payload)
    emit('change', payload)
  } else {
    const date = toDate(raw)
    if (!date) return
    const payload = isRange.value ? [toIso(date), toIso(date)] as [string, string] : toIso(date)
    emit('update:modelValue', payload)
    emit('change', payload)
  }
  open.value = false
}

function clear() {
  if (props.disabled || !props.clearable) return
  emit('update:modelValue', null)
  emit('clear')
}

function onDocumentClick(event: MouseEvent) {
  const target = event.target as Node
  if (root.value?.contains(target) || panel.value?.contains(target)) return
  open.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    open.value = false
    inputEl.value?.focus({ preventScroll: true })
  }
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}

function isActiveDay(date: Date): boolean {
  return startOfDay(date).getTime() === activeDate.value.getTime()
}

function focusActiveDay() {
  panel.value
    ?.querySelector<HTMLElement>(`[data-wi-date="${toIso(activeDate.value)}"]`)
    ?.focus({ preventScroll: true })
}

function setActiveDate(date: Date) {
  const next = startOfDay(date)
  activeDate.value = next
  if (next.getFullYear() !== viewYear.value || next.getMonth() !== viewMonth.value) {
    viewYear.value = next.getFullYear()
    viewMonth.value = next.getMonth()
  }
  void nextTick(focusActiveDay)
}

function onGridKeydown(event: KeyboardEvent) {
  const key = event.key
  // Space is left to the native button behaviour (click on keyup); Enter is
  // intercepted here so we can suppress the duplicate click activation.
  if (key === 'Enter') {
    event.preventDefault()
    const cell = calendarDays.value.find((item) => item.date.getTime() === activeDate.value.getTime())
    if (cell) pick(cell.date, cell.disabled)
    return
  }
  if (key === 'Home' || key === 'End') {
    event.preventDefault()
    const weekday = activeDate.value.getDay()
    setActiveDate(addDays(activeDate.value, key === 'Home' ? -weekday : 6 - weekday))
    return
  }
  if (key === 'PageUp' || key === 'PageDown') {
    event.preventDefault()
    const next = new Date(activeDate.value)
    next.setMonth(next.getMonth() + (key === 'PageUp' ? -1 : 1))
    setActiveDate(next)
    return
  }
  const delta =
    key === 'ArrowLeft' ? -1 : key === 'ArrowRight' ? 1 : key === 'ArrowUp' ? -7 : key === 'ArrowDown' ? 7 : 0
  if (delta === 0) return
  event.preventDefault()
  setActiveDate(addDays(activeDate.value, delta))
}

function onViewportChange() {
  if (open.value) updatePanelPosition()
}

watch(open, async (isOpen) => {
  if (isOpen) {
    emit('show')
    document.addEventListener('click', onDocumentClick)
    document.addEventListener('keydown', onKeydown)
    if (teleported.value) {
      window.addEventListener('resize', onViewportChange)
      window.addEventListener('scroll', onViewportChange, true)
    }
    await nextTick()
    focusActiveDay()
  } else {
    emit('hide')
    document.removeEventListener('click', onDocumentClick)
    document.removeEventListener('keydown', onKeydown)
    window.removeEventListener('resize', onViewportChange)
    window.removeEventListener('scroll', onViewportChange, true)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', onViewportChange)
  window.removeEventListener('scroll', onViewportChange, true)
})
</script>

<template>
  <div ref="root" :class="rootClass">
    <label v-if="label" class="wi-datepicker__label" :for="fieldId">{{ label }}</label>
    <div ref="triggerEl" class="wi-datepicker__control">
      <slot name="trigger" :value="displayValue" :open="open">
        <input
          :id="fieldId"
          ref="inputEl"
          class="wi-datepicker__input"
          type="text"
          role="combobox"
          readonly
          :value="displayValue"
          :placeholder="placeholderText"
          :disabled="disabled"
          :aria-invalid="isInvalid || undefined"
          :aria-expanded="open"
          :aria-controls="open ? panelId : undefined"
          :aria-describedby="feedbackText ? `${fieldId}-help` : undefined"
          aria-haspopup="dialog"
          @click="toggle"
          @keydown.enter.prevent="toggle"
          @keydown.space.prevent="toggle"
        >
        <button
          v-if="clearable && displayValue"
          type="button"
          class="wi-datepicker__clear"
          :aria-label="locale.clearDate"
          :disabled="disabled"
          @click.stop="clear"
        >
          <WiIcon name="close" size="sm" />
        </button>
      </slot>
    </div>
    <p
      v-if="feedbackText"
      :id="`${fieldId}-help`"
      class="wi-datepicker__help"
      :class="{ 'wi-datepicker__help--invalid': feedbackIsError }"
    >
      {{ feedbackText }}
    </p>
    <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
      <Transition name="wi-scale-fade">
        <div
          v-if="open"
          ref="panel"
          class="wi-datepicker__panel"
          :class="{
            'wi-datepicker__panel--teleported': teleported,
            'wi-datepicker__panel--with-shortcuts': shortcuts.length,
          }"
          :style="teleported ? panelStyle : undefined"
          :id="panelId"
          role="dialog"
          :aria-label="locale.datePicker"
        >
          <div v-if="shortcuts.length" class="wi-datepicker__shortcuts">
            <button
              v-for="shortcut in shortcuts"
              :key="shortcut.label"
              type="button"
              class="wi-datepicker__shortcut"
              @click="applyShortcut(shortcut)"
            >
              {{ shortcut.label }}
            </button>
          </div>
          <div class="wi-datepicker__calendar">
            <div class="wi-datepicker__header">
              <button type="button" class="wi-datepicker__nav" :aria-label="locale.prevMonth" @click="prevMonth">
                <WiIcon name="chevron-left" size="sm" />
              </button>
              <span class="wi-datepicker__month">{{ monthLabel }}</span>
              <button type="button" class="wi-datepicker__nav" :aria-label="locale.nextMonth" @click="nextMonth">
                <WiIcon name="chevron-right" size="sm" />
              </button>
            </div>
            <div class="wi-datepicker__weekdays" aria-hidden="true">
              <span v-for="day in locale.weekdays" :key="day">{{ day }}</span>
            </div>
            <div
              class="wi-datepicker__grid"
              role="grid"
              :aria-label="monthLabel"
              @keydown="onGridKeydown"
            >
              <button
                v-for="cell in calendarDays"
                :key="cell.date.toISOString()"
                type="button"
                class="wi-datepicker__day"
                :class="{
                  'wi-datepicker__day--other': !cell.inMonth,
                  'wi-datepicker__day--selected': cell.selected,
                  'wi-datepicker__day--in-range': cell.inRange,
                  'wi-datepicker__day--range-start': cell.rangeStart,
                  'wi-datepicker__day--range-end': cell.rangeEnd,
                }"
                role="gridcell"
                :aria-selected="cell.selected"
                :data-wi-date="toIso(cell.date)"
                :tabindex="isActiveDay(cell.date) && !cell.disabled ? 0 : -1"
                :disabled="cell.disabled"
                @click="pick(cell.date, cell.disabled)"
                @mouseenter="isRange && rangeDraft && (hoverDate = cell.date)"
              >
                {{ cell.date.getDate() }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
