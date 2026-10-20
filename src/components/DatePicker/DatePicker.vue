<script setup lang="ts">
import type {
  DatePickerDateValue,
  DatePickerEmits,
  DatePickerProps,
  DatePickerShortcut,
  DatePickerValue,
} from './types'
import { computed, nextTick, onBeforeUnmount, ref, useAttrs, watch } from 'vue'
import { formatLocale, useMLocale } from '../../locale'
import { useConfiguredSize, useMConfig } from '../../shared/config'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import { computeFloatingOverlayStyle } from '../../shared/overlayPlacement'
import { useFieldParts } from '../../shared/useComponentAttrs'
import { useFloatingViewportSync } from '../../shared/useFloatingViewportSync'
import { useMId } from '../../shared/useMId'
import { useMotionTransition } from '../../theme/useMotionTransition'
import MIcon from '../Icon/Icon.vue'
import MScrollbar from '../Scrollbar/Scrollbar.vue'
import {
  applyDisplayFormat,
  decadeStart,
  formatDateTime,
  formatTimeParts,
  parseDateValue,
  startOfDay,
  toIsoDate,
  toIsoMonth,
  toIsoYear,
} from './dateUtils'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<DatePickerProps>(), {
  transition: undefined,
  modelValue: null,
  type: 'date',
  id: undefined,
  disabled: false,
  invalid: false,
  status: 'default',
  fluid: false,
  placeholder: undefined,
  errorMessage: undefined,
  helpText: undefined,
  format: 'YYYY-MM-DD',
  showSeconds: false,
  clearable: true,
  shortcuts: () => [],
  needConfirm: false,
  multiple: false,
  mask: false,
  teleport: true,
})
const emit = defineEmits<DatePickerEmits>()
const attrs = useAttrs()
const { rootAttrs, controlAttrs } = useFieldParts(attrs, () => props.pt)

const config = useMConfig()
const { transitionName, transitionCss } = useMotionTransition({
  role: 'popup',
  local: () => props.transition,
  componentName: 'DatePicker',
  fallback: 'scale-fade',
})
const locale = useMLocale()
const sizeClass = useConfiguredSize('DatePicker', () => props.size)
/** Map DatePicker size to icon size so clear/nav icons scale with the control. */
const iconSize = computed(() => {
  if (sizeClass.value === 'small') return 'sm'
  if (sizeClass.value === 'large') return 'lg'
  return 'md'
})
const open = ref(false)
const root = ref<HTMLElement | null>(null)
const triggerEl = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const panelStyle = ref<Record<string, string>>({})
const viewYear = ref(new Date().getFullYear())
const viewMonth = ref(new Date().getMonth())
/** Day calendar header navigation: days →months →years →back to days. */
const dayPanelMode = ref<'days' | 'months' | 'years'>('days')
const activeDate = ref(startOfDay(new Date()))
const rangeDraft = ref<Date | null>(null)
const hoverDate = ref<Date | null>(null)
const pendingDate = ref<Date | null>(null)
const draftHour = ref(0)
const draftMinute = ref(0)
const draftSecond = ref(0)
const rangeTimeFocus = ref<'start' | 'end'>('end')
const autoFieldId = useMId('m-date-picker')
const fieldId = computed(() => props.id ?? autoFieldId)
const panelId = computed(() => `${fieldId.value}-panel`)
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))
const teleported = computed(() => isOverlayTeleported(props, config.value.appendTo))

const isRange = computed(() => props.type === 'daterange' || props.type === 'datetimerange')
const showsCalendar = computed(
  () => props.type === 'date' || props.type === 'daterange' || props.type === 'datetime' || props.type === 'datetimerange',
)
const showsTime = computed(
  () => props.type === 'time' || props.type === 'datetime' || props.type === 'datetimerange',
)
const showsMonthPanel = computed(() => props.type === 'month')
const showsYearPanel = computed(() => props.type === 'year')
const isInvalid = computed(() => props.invalid || Boolean(props.errorMessage))
const feedbackText = computed(() => props.errorMessage || props.helpText)
const feedbackIsError = computed(
  () => Boolean(props.errorMessage) || (props.invalid && Boolean(props.helpText)),
)

const hours = Array.from({ length: 24 }, (_, i) => i)
const minutes = Array.from({ length: 60 }, (_, i) => i)
const seconds = Array.from({ length: 60 }, (_, i) => i)

function toDate(value: DatePickerDateValue | null | undefined): Date | null {
  return parseDateValue(value)?.date ?? null
}

function formatDate(date: Date): string {
  return applyDisplayFormat(date, props.format, props.showSeconds)
}

function unpackValue(value: DatePickerValue | undefined): { start: Date | null; end: Date | null } {
  if (value == null || value === '') return { start: null, end: null }
  if (Array.isArray(value)) return { start: toDate(value[0]), end: toDate(value[1]) }
  const date = toDate(value)
  return { start: date, end: date }
}

const selectedRange = computed(() => unpackValue(props.modelValue))

/** Multiple-selection day timestamps (date type only). */
const selectedDates = computed<Set<number>>(() => {
  if (!props.multiple) return new Set<number>()
  const value = props.modelValue
  if (!Array.isArray(value)) return new Set<number>()
  const set = new Set<number>()
  for (const item of value) {
    const date = toDate(item as DatePickerDateValue)
    if (date) set.add(startOfDay(date).getTime())
  }
  return set
})
const min = computed(() => toDate(props.minDate))
const max = computed(() => toDate(props.maxDate))

function formatSingleDisplay(date: Date): string {
  switch (props.type) {
    case 'time':
      return formatTimeParts(date.getHours(), date.getMinutes(), date.getSeconds(), props.showSeconds)
    case 'month':
      return props.format.includes('MM') && props.format.includes('YYYY')
        ? applyDisplayFormat(date, props.format.replace(/[-/]?DD/g, ''), props.showSeconds)
        : toIsoMonth(date)
    case 'year':
      return toIsoYear(date)
    case 'datetime':
    case 'datetimerange':
      if (/HH|mm|ss/.test(props.format)) return applyDisplayFormat(date, props.format, props.showSeconds)
      return formatDateTime(date, props.showSeconds)
    default:
      return formatDate(date)
  }
}

/** Uncommitted value while needConfirm is on; emitted only on OK. */
const confirmDraft = ref<string | [string, string] | string[] | null>(null)
const confirmDirty = ref(false)

/** Mask state: current editable text and whether it's been edited (to avoid reverting on first focus). */
const maskValue = ref('')
const maskTouched = ref(false)

/** Only date / datetime / time support mask editing (others have no clear single-line format). */
const maskEditable = computed(() => {
  if (!props.mask || props.disabled) return false
  return props.type === 'date' || props.type === 'datetime' || props.type === 'time'
})

/** Display source: pending needConfirm draft wins; otherwise the committed model. */
const displaySource = computed<DatePickerValue>(() => {
  if (props.needConfirm && confirmDirty.value && confirmDraft.value != null) {
    return confirmDraft.value as DatePickerValue
  }
  return props.modelValue ?? null
})
const displayRange = computed(() => unpackValue(displaySource.value))

const displayValue = computed(() => {
  // Multiple selection: join ISO dates with comma (matches antd token-style display).
  if (props.multiple && Array.isArray(displaySource.value)) {
    return (displaySource.value as DatePickerDateValue[])
      .map((item) => {
        const date = toDate(item)
        return date ? formatSingleDisplay(date) : ''
      })
      .filter(Boolean)
      .join(', ')
  }
  const { start, end } = displayRange.value
  if (!start) return ''
  if (!isRange.value) return formatSingleDisplay(start)
  if (!end) return formatSingleDisplay(start)
  return `${formatSingleDisplay(start)} – ${formatSingleDisplay(end)}`
})

const placeholderText = computed(() => {
  if (props.placeholder) return props.placeholder
  switch (props.type) {
    case 'daterange':
    case 'datetimerange':
      return locale.value.dateRangePlaceholder
    case 'time':
      return locale.value.timePickerPlaceholder
    case 'datetime':
      return locale.value.dateTimePlaceholder
    case 'month':
      return locale.value.monthPlaceholder
    case 'year':
      return locale.value.yearPlaceholder
    default:
      return locale.value.datePickerPlaceholder
  }
})

const monthLabel = computed(() =>
  formatLocale(locale.value.monthYear, {
    year: viewYear.value,
    month: viewMonth.value + 1,
    monthName: locale.value.monthNames[viewMonth.value] ?? String(viewMonth.value + 1),
  }),
)

const yearPanelLabel = computed(() => {
  const start = decadeStart(viewYear.value)
  return `${start} – ${start + 11}`
})

const monthCells = computed(() =>
  locale.value.monthNames.map((label, index) => ({
    index,
    label,
    selected:
      selectedRange.value.start != null
      && selectedRange.value.start.getFullYear() === viewYear.value
      && selectedRange.value.start.getMonth() === index,
  })),
)

const yearCells = computed(() => {
  const start = decadeStart(viewYear.value)
  return Array.from({ length: 12 }, (_, i) => {
    const year = start + i
    return {
      year,
      selected: selectedRange.value.start?.getFullYear() === year,
    }
  })
})

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
    isToday: boolean
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
  const today = startOfDay(new Date()).getTime()
  const pending = pendingDate.value ? startOfDay(pendingDate.value) : null
  const rangeStart = Boolean(bounds.start && t === bounds.start.getTime())
  const rangeEnd = Boolean(bounds.end && t === bounds.end.getTime())
  const pendingSelected = Boolean(pending && t === pending.getTime() && props.type === 'datetime')
  const inRange = Boolean(
    isRange.value && bounds.start && bounds.end && t > bounds.start.getTime() && t < bounds.end.getTime(),
  )
  const multipleSelected = props.multiple && selectedDates.value.has(t)
  return {
    date: day,
    inMonth,
    disabled,
    selected: rangeStart || rangeEnd || pendingSelected || multipleSelected,
    inRange,
    rangeStart,
    rangeEnd,
    isToday: t === today,
  }
}

/** Resolved visual status: explicit `status` prop wins, otherwise derive from `invalid` / `errorMessage`. */
const resolvedStatus = computed<'default' | 'warning' | 'error'>(() => {
  if (props.status && props.status !== 'default') return props.status
  if (props.invalid || props.errorMessage) return 'error'
  return 'default'
})

const rootClass = computed(() => [
  'm-date-picker',
  `m-date-picker--${sizeClass.value}`,
  {
    'm-date-picker--fluid': props.fluid,
    'm-date-picker--disabled': props.disabled,
    'm-date-picker--invalid': props.invalid,
    'm-date-picker--warning': resolvedStatus.value === 'warning',
    'm-date-picker--error': resolvedStatus.value === 'error',
    'm-date-picker--open': open.value,
    'm-date-picker--range': isRange.value,
  },
])

function syncDraftTimeFrom(date: Date | null) {
  draftHour.value = date?.getHours() ?? 0
  draftMinute.value = date?.getMinutes() ?? 0
  draftSecond.value = date?.getSeconds() ?? 0
}

function syncViewFromValue() {
  const date = selectedRange.value.start ?? new Date()
  viewYear.value = date.getFullYear()
  viewMonth.value = date.getMonth()
  if (props.type === 'datetime') {
    pendingDate.value = selectedRange.value.start ? startOfDay(selectedRange.value.start) : null
    syncDraftTimeFrom(selectedRange.value.start)
  } else if (props.type === 'time') {
    syncDraftTimeFrom(selectedRange.value.start)
  } else if (props.type === 'datetimerange') {
    pendingDate.value = null
    syncDraftTimeFrom(selectedRange.value.end ?? selectedRange.value.start)
    rangeTimeFocus.value = 'end'
  } else {
    pendingDate.value = null
  }
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
    confirmDraft.value = null
    confirmDirty.value = false
    dayPanelMode.value = 'days'
    syncViewFromValue()
    activeDate.value = startOfDay(selectedRange.value.start ?? new Date())
    void nextTick(() => updatePanelPosition())
  }
}

function toggle() {
  setOpen(!open.value)
}

function closeAndFocus() {
  // In needConfirm mode, selecting a value should not close the panel;
  // only OK / Cancel / outside click / Esc closes it.
  if (props.needConfirm && confirmDirty.value) return
  open.value = false
  inputEl.value?.focus({ preventScroll: true })
}

/** Close the panel without refocusing the input (used by footer slot buttons). */
function closePanel() {
  open.value = false
}

/** Sync maskValue with the latest displayValue when not editing. */
watch([displayValue, maskEditable], ([nextDisplay, editable]) => {
  if (!editable) {
    maskValue.value = ''
    maskTouched.value = false
    return
  }
  if (!maskTouched.value) maskValue.value = nextDisplay
}, { immediate: true })

/** Build a soft mask: keep digits, auto-insert separators from `format`. */
function buildMaskTemplate(): string {
  if (props.type === 'time') return props.showSeconds ? 'HH:mm:ss' : 'HH:mm'
  if (props.type === 'datetime') return `${props.format} ${props.showSeconds ? 'HH:mm:ss' : 'HH:mm'}`
  return props.format
}

function applyMask(raw: string): string {
  const template = buildMaskTemplate()
  const digits = raw.replace(/\D/g, '').split('')
  let out = ''
  for (const ch of template) {
    if (!digits.length) break
    if (/[A-Za-z]/.test(ch)) out += digits.shift()
    else out += ch
    // Skip separator chars in template when we ran out of digits mid-way
  }
  return out
}

function onMaskInput(event: Event) {
  const target = event.target as HTMLInputElement
  maskValue.value = applyMask(target.value)
  maskTouched.value = true
  // Force cursor to end so Vue's value update doesn't jump
  void nextTick(() => {
    target.setSelectionRange(maskValue.value.length, maskValue.value.length)
  })
}

function revertMask() {
  if (!maskTouched.value) return
  maskValue.value = displayValue.value
  maskTouched.value = false
}

function commitMask() {
  if (!maskTouched.value) {
    toggle()
    return
  }
  const parsed = parseDateValue(maskValue.value)
  if (!parsed) {
    revertMask()
    return
  }
  let payload: string
  if (props.type === 'time') {
    payload = formatTimeParts(parsed.date.getHours(), parsed.date.getMinutes(), parsed.date.getSeconds(), props.showSeconds)
  } else if (props.type === 'datetime') {
    payload = formatDateTime(parsed.date, props.showSeconds)
  } else {
    payload = toIsoDate(parsed.date)
  }
  maskTouched.value = false
  emit('update:modelValue', payload)
  emit('change', payload)
}

function commitValue(value: string | [string, string] | string[]) {
  if (props.needConfirm) {
    confirmDraft.value = value
    confirmDirty.value = true
    return
  }
  emit('update:modelValue', value)
  emit('change', value)
}

/** OK button: emit pending draft and close. */
function confirmOk() {
  if (confirmDirty.value && confirmDraft.value != null) {
    emit('update:modelValue', confirmDraft.value)
    emit('change', confirmDraft.value)
  }
  confirmDraft.value = null
  confirmDirty.value = false
  closeAndFocus()
}

/** Cancel button: drop pending draft and close. */
function confirmCancel() {
  confirmDraft.value = null
  confirmDirty.value = false
  closePanel()
}

/** Header label: month name in days mode, year in months mode, decade range in years mode. */
const headerLabel = computed(() => {
  if (dayPanelMode.value === 'days') return monthLabel.value
  if (dayPanelMode.value === 'months') return String(viewYear.value)
  const start = decadeStart(viewYear.value)
  return `${start} – ${start + 9}`
})

/** Decade cells (12 years: 10 in decade + 2 padding) for the years sub-panel. */
const decadeYears = computed(() => {
  const start = decadeStart(viewYear.value)
  return Array.from({ length: 12 }, (_, i) => {
    const year = start - 1 + i
    return { year, other: i === 0 || i === 11 }
  })
})

/** Cycle days →months →years →days when clicking the header label. */
function cyclePanelMode() {
  if (dayPanelMode.value === 'days') dayPanelMode.value = 'months'
  else if (dayPanelMode.value === 'months') dayPanelMode.value = 'years'
  else dayPanelMode.value = 'days'
}

/** Prev/next button dispatch by current panel mode. */
function onHeaderNav(direction: 1 | -1) {
  if (dayPanelMode.value === 'days') {
    if (direction < 0) prevMonth()
    else nextMonth()
  } else if (dayPanelMode.value === 'months') {
    viewYear.value += direction
  } else {
    viewYear.value += direction * 10
  }
}

/** Pick a month from the months sub-panel: switch view month and return to days. */
function pickPanelMonth(month: number) {
  viewMonth.value = month
  dayPanelMode.value = 'days'
}

/** Pick a year from the years sub-panel: switch to months so user can pick a month next. */
function pickPanelYear(year: number) {
  viewYear.value = year
  dayPanelMode.value = 'months'
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

function prevYear() {
  viewYear.value -= 1
}

function nextYear() {
  viewYear.value += 1
}

function prevDecade() {
  viewYear.value -= 10
}

function nextDecade() {
  viewYear.value += 10
}

function withDraftTime(day: Date): Date {
  return new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    draftHour.value,
    draftMinute.value,
    props.showSeconds ? draftSecond.value : 0,
  )
}

function emitDateTime(day: Date) {
  commitValue(formatDateTime(withDraftTime(day), props.showSeconds))
  closeAndFocus()
}

function pick(date: Date, disabled: boolean) {
  if (disabled || props.disabled) return
  activeDate.value = startOfDay(date)

  // Multiple date selection: toggle the day in the model array, keep the panel open.
  if (props.multiple && props.type === 'date') {
    const day = startOfDay(date)
    const iso = toIsoDate(day)
    const existing = Array.isArray(props.modelValue) ? (props.modelValue as DatePickerDateValue[]) : []
    const next = existing.includes(iso)
      ? existing.filter((item) => item !== iso)
      : [...existing, iso]
    commitValue(next as string[])
    return
  }

  if (props.type === 'datetime') {
    pendingDate.value = startOfDay(date)
    return
  }

  if (props.type === 'datetimerange') {
    if (!rangeDraft.value) {
      rangeDraft.value = date
      hoverDate.value = date
      return
    }
    const start = rangeDraft.value
    const end = date
    const [from, to] = start.getTime() <= end.getTime() ? [start, end] : [end, start]
    // MVP: emit range with 00:00 defaults, then keep panel open so time columns can tweak the end.
    draftHour.value = 0
    draftMinute.value = 0
    draftSecond.value = 0
    const payload: [string, string] = [
      formatDateTime(withDraftTime(from), props.showSeconds),
      formatDateTime(withDraftTime(to), props.showSeconds),
    ]
    commitValue(payload)
    rangeDraft.value = null
    hoverDate.value = null
    rangeTimeFocus.value = 'end'
    pendingDate.value = startOfDay(to)
    return
  }

  if (!isRange.value) {
    commitValue(toIsoDate(date))
    closeAndFocus()
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
  const payload: [string, string] = [toIsoDate(from), toIsoDate(to)]
  commitValue(payload)
  rangeDraft.value = null
  hoverDate.value = null
  closeAndFocus()
}

function pickMonth(monthIndex: number) {
  if (props.disabled) return
  const date = new Date(viewYear.value, monthIndex, 1)
  commitValue(toIsoMonth(date))
  closeAndFocus()
}

function pickYear(year: number) {
  if (props.disabled) return
  commitValue(toIsoYear(new Date(year, 0, 1)))
  closeAndFocus()
}

function pickTimeUnit(unit: 'hour' | 'minute' | 'second', value: number) {
  if (props.disabled) return
  if (unit === 'hour') draftHour.value = value
  if (unit === 'minute') draftMinute.value = value
  if (unit === 'second') draftSecond.value = value

  const finest = props.showSeconds ? 'second' : 'minute'
  const isFinest = unit === finest

  if (props.type === 'time') {
    if (!isFinest) return
    commitValue(formatTimeParts(draftHour.value, draftMinute.value, draftSecond.value, props.showSeconds))
    closeAndFocus()
    return
  }

  if (props.type === 'datetime') {
    if (!isFinest) return
    const day = pendingDate.value ?? startOfDay(selectedRange.value.start ?? new Date())
    pendingDate.value = day
    emitDateTime(day)
    return
  }

  if (props.type === 'datetimerange') {
    const { start, end } = selectedRange.value
    if (!start || !end) return
    const focus = rangeTimeFocus.value === 'start' ? start : end
    const next = withDraftTime(startOfDay(focus))
    const payload: [string, string] =
      rangeTimeFocus.value === 'start'
        ? [formatDateTime(next, props.showSeconds), formatDateTime(end, props.showSeconds)]
        : [formatDateTime(start, props.showSeconds), formatDateTime(next, props.showSeconds)]
    commitValue(payload)
    if (isFinest) closeAndFocus()
  }
}

/** Serialize a shortcut's value the same way applyShortcut commits, for active-state comparison. */
function serializeShortcutValue(shortcut: DatePickerShortcut): string | [string, string] | null {
  const raw = typeof shortcut.value === 'function' ? shortcut.value() : shortcut.value
  if (Array.isArray(raw)) {
    const start = toDate(raw[0])
    const end = toDate(raw[1])
    if (!start || !end) return null
    const [from, to] = start.getTime() <= end.getTime() ? [start, end] : [end, start]
    if (props.type === 'datetimerange') {
      return [formatDateTime(from, props.showSeconds), formatDateTime(to, props.showSeconds)]
    }
    if (isRange.value) return [toIsoDate(from), toIsoDate(to)]
    return toIsoDate(from)
  }
  const date = toDate(raw)
  if (!date) return null
  if (props.type === 'time') {
    return formatTimeParts(date.getHours(), date.getMinutes(), date.getSeconds(), props.showSeconds)
  }
  if (props.type === 'month') return toIsoMonth(date)
  if (props.type === 'year') return toIsoYear(date)
  if (props.type === 'datetime') return formatDateTime(date, props.showSeconds)
  return toIsoDate(date)
}

function isShortcutActive(shortcut: DatePickerShortcut): boolean {
  const serialized = serializeShortcutValue(shortcut)
  if (serialized == null) return false
  const current = props.modelValue
  if (current == null) return false
  if (Array.isArray(serialized) && Array.isArray(current)) {
    return serialized[0] === current[0] && serialized[1] === current[1]
  }
  return serialized === current
}

function applyShortcut(shortcut: DatePickerShortcut) {
  if (props.disabled) return
  const raw = typeof shortcut.value === 'function' ? shortcut.value() : shortcut.value
  if (Array.isArray(raw)) {
    const start = toDate(raw[0])
    const end = toDate(raw[1])
    if (!start || !end) return
    const [from, to] = start.getTime() <= end.getTime() ? [start, end] : [end, start]
    let payload: string | [string, string]
    if (props.type === 'datetimerange') {
      payload = [formatDateTime(from, props.showSeconds), formatDateTime(to, props.showSeconds)]
    } else if (isRange.value) {
      payload = [toIsoDate(from), toIsoDate(to)]
    } else {
      payload = toIsoDate(from)
    }
    commitValue(payload)
  } else {
    const date = toDate(raw)
    if (!date) return
    let payload: string | [string, string]
    if (props.type === 'time') {
      payload = formatTimeParts(date.getHours(), date.getMinutes(), date.getSeconds(), props.showSeconds)
    } else if (props.type === 'month') {
      payload = toIsoMonth(date)
    } else if (props.type === 'year') {
      payload = toIsoYear(date)
    } else if (props.type === 'datetime') {
      payload = formatDateTime(date, props.showSeconds)
    } else if (props.type === 'datetimerange') {
      payload = [formatDateTime(date, props.showSeconds), formatDateTime(date, props.showSeconds)]
    } else if (isRange.value) {
      payload = [toIsoDate(date), toIsoDate(date)]
    } else {
      payload = toIsoDate(date)
    }
    commitValue(payload)
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
  if (!showsCalendar.value) return
  panel.value
    ?.querySelector<HTMLElement>(`[data-m-date="${toIsoDate(activeDate.value)}"]`)
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

useFloatingViewportSync(
  () => open.value && teleported.value,
  onViewportChange,
)

watch(open, async (isOpen) => {
  if (isOpen) {
    emit('show')
    document.addEventListener('click', onDocumentClick)
    document.addEventListener('keydown', onKeydown)
    await nextTick()
    focusActiveDay()
  } else {
    emit('hide')
    document.removeEventListener('click', onDocumentClick)
    document.removeEventListener('keydown', onKeydown)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div ref="root" v-bind="rootAttrs" :class="rootClass">
    <label v-if="label" class="m-date-picker__label" :for="fieldId">{{ label }}</label>
    <div ref="triggerEl" class="m-date-picker__control">
      <slot name="trigger" :value="displayValue" :open="open">
        <input
          v-bind="controlAttrs"
          :id="fieldId"
          ref="inputEl"
          class="m-date-picker__input"
          type="text"
          role="combobox"
          :readonly="!maskEditable"
          :value="maskEditable ? maskValue : displayValue"
          :placeholder="placeholderText"
          :name="name"
          :autocomplete="autocomplete"
          :autofocus="autofocus || undefined"
          :disabled="disabled"
          :aria-invalid="isInvalid || undefined"
          :aria-expanded="open"
          :aria-controls="open ? panelId : undefined"
          :aria-describedby="feedbackText ? `${fieldId}-help` : undefined"
          aria-haspopup="dialog"
          @click="toggle"
          @keydown.enter.prevent="maskEditable ? commitMask() : toggle()"
          @keydown.space.prevent="maskEditable ? undefined : toggle()"
          @keydown.esc="maskEditable ? revertMask() : undefined"
          @input="maskEditable ? onMaskInput($event) : undefined"
          @blur="maskEditable ? revertMask() : undefined"
        >
        <button
          v-if="clearable && displayValue"
          type="button"
          class="m-date-picker__clear"
          :aria-label="locale.clearDate"
          :disabled="disabled"
          @click.stop="clear"
        >
          <MIcon name="close" :size="iconSize" />
        </button>
      </slot>
    </div>
    <p
      v-if="feedbackText"
      :id="`${fieldId}-help`"
      class="m-date-picker__help"
      :class="{ 'm-date-picker__help--invalid': feedbackIsError }"
    >
      {{ feedbackText }}
    </p>
    <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
      <Transition :name="transitionName" :css="transitionCss">
        <div
          v-if="open"
          :id="panelId"
          ref="panel"
          class="m-date-picker__panel"
          :class="[
            `m-date-picker__panel--${sizeClass}`,
            {
              'm-date-picker__panel--teleported': teleported,
              'm-date-picker__panel--with-shortcuts': shortcuts.length,
              'm-date-picker__panel--with-time': showsTime,
              'm-date-picker__panel--time-only': type === 'time',
            },
          ]"
          :style="teleported ? panelStyle : undefined"
          role="dialog"
          :aria-label="locale.datePicker"
        >
          <div v-if="shortcuts.length" class="m-date-picker__shortcuts">
            <button
              v-for="shortcut in shortcuts"
              :key="shortcut.label"
              type="button"
              class="m-date-picker__shortcut"
              :class="{ 'm-date-picker__shortcut--active': isShortcutActive(shortcut) }"
              @click="applyShortcut(shortcut)"
            >
              {{ shortcut.label }}
            </button>
          </div>
          <div class="m-date-picker__body">
            <!-- Day calendar (date / daterange / datetime / datetimerange) -->
            <div v-if="showsCalendar" class="m-date-picker__calendar">
              <div class="m-date-picker__header">
                <button type="button" class="m-date-picker__nav" :aria-label="dayPanelMode === 'days' ? locale.prevMonth : dayPanelMode === 'months' ? locale.prevYear : locale.prevYear" @click="onHeaderNav(-1)">
                  <MIcon name="chevron-left" :size="iconSize" />
                </button>
                <button
                  type="button"
                  class="m-date-picker__month m-date-picker__month--switch"
                  :aria-label="dayPanelMode === 'days' ? 'Switch to month picker' : dayPanelMode === 'months' ? 'Switch to year picker' : 'Switch back to day picker'"
                  @click="cyclePanelMode"
                >
                  {{ headerLabel }}
                </button>
                <button type="button" class="m-date-picker__nav" :aria-label="dayPanelMode === 'days' ? locale.nextMonth : dayPanelMode === 'months' ? locale.nextYear : locale.nextYear" @click="onHeaderNav(1)">
                  <MIcon name="chevron-right" :size="iconSize" />
                </button>
              </div>
              <div v-if="dayPanelMode === 'days'" class="m-date-picker__weekdays" aria-hidden="true">
                <span v-for="day in locale.weekdays" :key="day">{{ day }}</span>
              </div>
              <div
                v-if="dayPanelMode === 'days'"
                class="m-date-picker__grid"
                role="grid"
                :aria-label="monthLabel"
                @keydown="onGridKeydown"
              >
                <button
                  v-for="cell in calendarDays"
                  :key="cell.date.toISOString()"
                  type="button"
                  class="m-date-picker__day"
                  :class="{
                    'm-date-picker__day--other': !cell.inMonth,
                    'm-date-picker__day--selected': cell.selected,
                    'm-date-picker__day--in-range': cell.inRange,
                    'm-date-picker__day--range-start': cell.rangeStart,
                    'm-date-picker__day--range-end': cell.rangeEnd,
                    'm-date-picker__day--today': cell.isToday,
                  }"
                  role="gridcell"
                  :aria-selected="cell.selected"
                  :data-m-date="toIsoDate(cell.date)"
                  :tabindex="isActiveDay(cell.date) && !cell.disabled ? 0 : -1"
                  :disabled="cell.disabled"
                  @click="pick(cell.date, cell.disabled)"
                  @mouseenter="isRange && rangeDraft && (hoverDate = cell.date)"
                >
                  <slot
                    name="cell"
                    :date="cell.date"
                    :in-month="cell.inMonth"
                    :selected="cell.selected"
                    :in-range="cell.inRange"
                    :range-start="cell.rangeStart"
                    :range-end="cell.rangeEnd"
                    :is-today="cell.isToday"
                    :disabled="cell.disabled"
                  >
                    {{ cell.date.getDate() }}
                  </slot>
                </button>
              </div>

              <!-- Month-of-year picker (within day calendar) -->
              <div
                v-else-if="dayPanelMode === 'months'"
                class="m-date-picker__month-grid"
                role="grid"
                :aria-label="String(viewYear)"
              >
                <button
                  v-for="monthLabelItem in locale.monthNames"
                  :key="monthLabelItem"
                  type="button"
                  class="m-date-picker__cell"
                  :class="{ 'm-date-picker__cell--selected': viewMonth === locale.monthNames.indexOf(monthLabelItem) }"
                  role="gridcell"
                  @click="pickPanelMonth(locale.monthNames.indexOf(monthLabelItem))"
                >
                  {{ monthLabelItem }}
                </button>
              </div>

              <!-- Year-of-decade picker (within day calendar) -->
              <div
                v-else-if="dayPanelMode === 'years'"
                class="m-date-picker__year-grid"
                role="grid"
                :aria-label="`${decadeStart(viewYear)} – ${decadeStart(viewYear) + 9}`"
              >
                <button
                  v-for="yearCell in decadeYears"
                  :key="yearCell.year"
                  type="button"
                  class="m-date-picker__cell"
                  :class="{
                    'm-date-picker__cell--other': yearCell.other,
                    'm-date-picker__cell--selected': yearCell.year === viewYear,
                  }"
                  role="gridcell"
                  @click="pickPanelYear(yearCell.year)"
                >
                  {{ yearCell.year }}
                </button>
              </div>
            </div>

            <!-- Month panel -->
            <div v-else-if="showsMonthPanel" class="m-date-picker__calendar">
              <div class="m-date-picker__header">
                <button type="button" class="m-date-picker__nav" :aria-label="locale.prevYear" @click="prevYear">
                  <MIcon name="chevron-left" :size="iconSize" />
                </button>
                <span class="m-date-picker__month">{{ viewYear }}</span>
                <button type="button" class="m-date-picker__nav" :aria-label="locale.nextYear" @click="nextYear">
                  <MIcon name="chevron-right" :size="iconSize" />
                </button>
              </div>
              <div class="m-date-picker__month-grid" role="grid" :aria-label="String(viewYear)">
                <button
                  v-for="cell in monthCells"
                  :key="cell.index"
                  type="button"
                  class="m-date-picker__cell"
                  :class="{ 'm-date-picker__cell--selected': cell.selected }"
                  role="gridcell"
                  :aria-selected="cell.selected"
                  @click="pickMonth(cell.index)"
                >
                  {{ cell.label }}
                </button>
              </div>
            </div>

            <!-- Year panel -->
            <div v-else-if="showsYearPanel" class="m-date-picker__calendar">
              <div class="m-date-picker__header">
                <button type="button" class="m-date-picker__nav" :aria-label="locale.prevYear" @click="prevDecade">
                  <MIcon name="chevron-left" :size="iconSize" />
                </button>
                <span class="m-date-picker__month">{{ yearPanelLabel }}</span>
                <button type="button" class="m-date-picker__nav" :aria-label="locale.nextYear" @click="nextDecade">
                  <MIcon name="chevron-right" :size="iconSize" />
                </button>
              </div>
              <div class="m-date-picker__year-grid" role="grid" :aria-label="yearPanelLabel">
                <button
                  v-for="cell in yearCells"
                  :key="cell.year"
                  type="button"
                  class="m-date-picker__cell"
                  :class="{ 'm-date-picker__cell--selected': cell.selected }"
                  role="gridcell"
                  :aria-selected="cell.selected"
                  @click="pickYear(cell.year)"
                >
                  {{ cell.year }}
                </button>
              </div>
            </div>

            <!-- Time columns -->
            <div v-if="showsTime" class="m-date-picker__time" role="group" :aria-label="locale.timePickerPlaceholder">
              <div class="m-date-picker__time-col">
                <div class="m-date-picker__time-header">{{ locale.hour }}</div>
                <MScrollbar class="m-date-picker__time-scroll" wrap-class="m-date-picker__time-col-wrap" view-class="m-date-picker__time-col-view">
                  <button
                    v-for="h in hours"
                    :key="`h-${h}`"
                    type="button"
                    class="m-date-picker__time-item"
                    :class="{ 'm-date-picker__time-item--selected': draftHour === h }"
                    @click="pickTimeUnit('hour', h)"
                  >
                    {{ String(h).padStart(2, '0') }}
                  </button>
                </MScrollbar>
              </div>
              <div class="m-date-picker__time-col">
                <div class="m-date-picker__time-header">{{ locale.minute }}</div>
                <MScrollbar class="m-date-picker__time-scroll" wrap-class="m-date-picker__time-col-wrap" view-class="m-date-picker__time-col-view">
                  <button
                    v-for="m in minutes"
                    :key="`m-${m}`"
                    type="button"
                    class="m-date-picker__time-item"
                    :class="{ 'm-date-picker__time-item--selected': draftMinute === m }"
                    @click="pickTimeUnit('minute', m)"
                  >
                    {{ String(m).padStart(2, '0') }}
                  </button>
                </MScrollbar>
              </div>
              <div v-if="showSeconds" class="m-date-picker__time-col">
                <div class="m-date-picker__time-header">{{ locale.second }}</div>
                <MScrollbar class="m-date-picker__time-scroll" wrap-class="m-date-picker__time-col-wrap" view-class="m-date-picker__time-col-view">
                  <button
                    v-for="s in seconds"
                    :key="`s-${s}`"
                    type="button"
                    class="m-date-picker__time-item"
                    :class="{ 'm-date-picker__time-item--selected': draftSecond === s }"
                    @click="pickTimeUnit('second', s)"
                  >
                    {{ String(s).padStart(2, '0') }}
                  </button>
                </MScrollbar>
              </div>
            </div>
          </div>
          <div v-if="$slots.footer" class="m-date-picker__footer">
            <slot name="footer" :close="closePanel" />
          </div>
          <div v-else-if="needConfirm" class="m-date-picker__footer m-date-picker__footer--confirm">
            <button
              type="button"
              class="m-date-picker__footer-btn"
              @click="confirmCancel"
            >
              {{ locale.cancel }}
            </button>
            <button
              type="button"
              class="m-date-picker__footer-btn m-date-picker__footer-btn--primary"
              :disabled="!confirmDirty"
              @click="confirmOk"
            >
              {{ locale.confirm }}
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
