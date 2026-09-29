<script setup lang="ts">
import type {
  CalendarEmits,
  CalendarMode,
  CalendarProps,
  CalendarValue,
} from './types'
import { computed, ref, useAttrs, useSlots, watch } from 'vue'
import { formatLocale, useMLocale } from '../../locale'
import { useRootParts } from '../../shared/useComponentAttrs'
import { parseDateValue, startOfDay, toIsoDate } from '../DatePicker/dateUtils'
import MSegmented from '../Segmented/Segmented.vue'
import MSelect from '../Select/Select.vue'
import {
  clampDateToMonth,
  getIsoWeekNumber,
  isSameCalendarDay,
  isSameCalendarMonth,
} from './calendarUtils'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<CalendarProps>(), {
  modelValue: null,
  fullscreen: true,
  showWeek: false,
})

const emit = defineEmits<CalendarEmits>()
const attrs = useAttrs()
const slots = useSlots()
const locale = useMLocale()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const internalMode = ref<CalendarMode>('month')
const panelDate = ref(startOfDay(new Date()))

const calendarMode = computed(() => props.mode ?? internalMode.value)

const selectedDate = computed(() => {
  const parsed = parseDateValue(props.modelValue)
  return parsed ? startOfDay(parsed.date) : null
})

const today = computed(() => startOfDay(new Date()))

const rangeBounds = computed(() => {
  if (!props.validRange) return { start: null as Date | null, end: null as Date | null }
  const start = parseDateValue(props.validRange[0])?.date ?? null
  const end = parseDateValue(props.validRange[1])?.date ?? null
  return {
    start: start ? startOfDay(start) : null,
    end: end ? startOfDay(end) : null,
  }
})

function syncPanelFromValue() {
  const anchor = selectedDate.value ?? today.value
  panelDate.value = startOfDay(anchor)
}

watch(() => props.modelValue, syncPanelFromValue, { immediate: true })

function isDateDisabled(date: Date): boolean {
  const day = startOfDay(date)
  if (props.disabledDate?.(day)) return true
  const { start, end } = rangeBounds.value
  if (start && day < start) return true
  if (end && day > end) return true
  return false
}

function formatOutbound(date: Date): CalendarValue {
  if (props.modelValue instanceof Date) return startOfDay(date)
  return toIsoDate(startOfDay(date))
}

function emitPanelChange(date: Date, mode: CalendarMode) {
  emit('panelChange', startOfDay(date), mode)
}

function setCalendarMode(mode: CalendarMode | string | number) {
  const next = mode as CalendarMode
  if (props.mode === undefined) internalMode.value = next
  emit('update:mode', next)
  emitPanelChange(panelDate.value, next)
}

function commitValue(date: Date, emitSelect = true) {
  const day = startOfDay(date)
  if (isDateDisabled(day)) return
  const out = formatOutbound(day)
  emit('update:modelValue', out)
  emit('change', out)
  if (emitSelect) emit('select', day)
}

function applyHeaderDate(next: Date) {
  const clamped = clampHeaderDate(next)
  panelDate.value = clamped
  if (props.modelValue != null) commitValue(clamped, false)
  emitPanelChange(clamped, calendarMode.value)
}

function clampHeaderDate(date: Date): Date {
  let next = startOfDay(date)
  const { start, end } = rangeBounds.value
  if (start && next < start) next = start
  if (end && next > end) next = end
  return next
}

const yearOptions = computed(() => {
  const current = panelDate.value.getFullYear()
  let start = current - 10
  let end = current + 10
  const { start: rangeStart, end: rangeEnd } = rangeBounds.value
  if (rangeStart) start = rangeStart.getFullYear()
  if (rangeEnd) end = rangeEnd.getFullYear()
  const options: { label: string; value: number }[] = []
  for (let y = start; y <= end; y++) {
    options.push({ label: String(y), value: y })
  }
  return options
})

const monthOptions = computed(() => {
  const year = panelDate.value.getFullYear()
  let start = 0
  let end = 11
  const { start: rangeStart, end: rangeEnd } = rangeBounds.value
  if (rangeStart && rangeStart.getFullYear() === year) start = rangeStart.getMonth()
  if (rangeEnd && rangeEnd.getFullYear() === year) end = rangeEnd.getMonth()
  return locale.value.monthNames
    .map((label, index) => ({ label, value: index }))
    .filter((_, index) => index >= start && index <= end)
})

const modeOptions = computed(() => {
  const zh = locale.value.name?.startsWith('zh')
  return [
    { label: zh ? '月' : 'Month', value: 'month' as const },
    { label: zh ? '年' : 'Year', value: 'year' as const },
  ]
})

const selectSize = computed(() => (props.fullscreen ? undefined : 'small'))

const calendarDays = computed(() => {
  const year = panelDate.value.getFullYear()
  const month = panelDate.value.getMonth()
  const first = new Date(year, month, 1)
  const startWeekday = first.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: {
    date: Date
    inMonth: boolean
    disabled: boolean
    selected: boolean
    today: boolean
  }[] = []

  for (let i = 0; i < startWeekday; i++) {
    const date = new Date(year, month, -startWeekday + i + 1)
    cells.push(buildDayCell(date, false))
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(buildDayCell(new Date(year, month, day), true))
  }
  while (cells.length % 7 !== 0 || cells.length < 42) {
    const last = cells[cells.length - 1]!.date
    const date = new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1)
    cells.push(buildDayCell(date, false))
  }
  return cells
})

function buildDayCell(date: Date, inMonth: boolean) {
  const day = startOfDay(date)
  return {
    date: day,
    inMonth,
    disabled: isDateDisabled(day),
    selected: selectedDate.value != null && isSameCalendarDay(day, selectedDate.value),
    today: isSameCalendarDay(day, today.value),
  }
}

const dayRows = computed(() => {
  const rows: typeof calendarDays.value[] = []
  for (let i = 0; i < calendarDays.value.length; i += 7) {
    rows.push(calendarDays.value.slice(i, i + 7))
  }
  return rows
})

const monthCells = computed(() =>
  locale.value.monthNames.map((label, index) => {
    const date = startOfDay(new Date(panelDate.value.getFullYear(), index, 1))
    return {
      date,
      label,
      index,
      disabled: isDateDisabled(date),
      selected: selectedDate.value != null && isSameCalendarMonth(date, selectedDate.value),
      today: isSameCalendarMonth(date, today.value),
    }
  }),
)

const rootClass = computed(() => [
  'm-calendar',
  {
    'm-calendar--fullscreen': props.fullscreen,
    'm-calendar--card': !props.fullscreen,
    'm-calendar--week': props.showWeek,
  },
])

const headerMonthYear = computed(() =>
  formatLocale(locale.value.monthYear, {
    year: panelDate.value.getFullYear(),
    month: panelDate.value.getMonth() + 1,
    monthName: locale.value.monthNames[panelDate.value.getMonth()] ?? '',
  }),
)

function onYearSelect(year: number | string) {
  const y = Number(year)
  const next = clampDateToMonth(panelDate.value, y, panelDate.value.getMonth())
  applyHeaderDate(next)
}

function onMonthSelect(month: number | string) {
  const m = Number(month)
  const next = clampDateToMonth(panelDate.value, panelDate.value.getFullYear(), m)
  applyHeaderDate(next)
}

function onDayClick(date: Date) {
  panelDate.value = startOfDay(date)
  commitValue(date)
  if (
    selectedDate.value
    && !isSameCalendarMonth(date, selectedDate.value)
  ) {
    emitPanelChange(panelDate.value, calendarMode.value)
  }
}

function onMonthCellClick(index: number) {
  const next = startOfDay(new Date(panelDate.value.getFullYear(), index, 1))
  if (isDateDisabled(next)) return
  panelDate.value = next
  setCalendarMode('month')
  if (props.modelValue != null) commitValue(next, true)
  else emit('select', next)
  emitPanelChange(next, 'month')
}

function headerSlotChange(date: Date) {
  applyHeaderDate(date)
  if (props.modelValue != null) commitValue(date)
}

const headerSlotProps = computed(() => ({
  value: panelDate.value,
  mode: calendarMode.value,
  onChange: headerSlotChange,
  onModeChange: setCalendarMode,
}))
</script>

<template>
  <div
    v-bind="rootAttrs"
    :class="rootClass"
  >
    <div class="m-calendar__header">
      <slot
        name="header"
        v-bind="headerSlotProps"
      >
        <div class="m-calendar__header-main">
          <MSelect
            class="m-calendar__year-select"
            :model-value="panelDate.getFullYear()"
            :options="yearOptions"
            :size="selectSize"
            @update:model-value="onYearSelect"
          />
          <MSelect
            v-if="calendarMode === 'month'"
            class="m-calendar__month-select"
            :model-value="panelDate.getMonth()"
            :options="monthOptions"
            :size="selectSize"
            @update:model-value="onMonthSelect"
          />
        </div>
        <MSegmented
          class="m-calendar__mode-switch"
          :model-value="calendarMode"
          :options="modeOptions"
          :size="selectSize"
          @update:model-value="setCalendarMode"
        />
      </slot>
    </div>

    <div
      v-if="calendarMode === 'month'"
      class="m-calendar__body"
      role="grid"
      :aria-label="headerMonthYear"
    >
      <div
        class="m-calendar__weekdays"
        role="row"
      >
        <span
          v-if="showWeek"
          class="m-calendar__week-label"
          aria-hidden="true"
        />
        <span
          v-for="(label, index) in locale.weekdays"
          :key="index"
          class="m-calendar__weekday"
          role="columnheader"
        >
          {{ label }}
        </span>
      </div>

      <div
        v-for="(row, rowIndex) in dayRows"
        :key="rowIndex"
        class="m-calendar__row"
        role="row"
      >
        <span
          v-if="showWeek"
          class="m-calendar__week-num"
          role="rowheader"
        >
          {{ getIsoWeekNumber(row[0]!.date) }}
        </span>
        <div
          v-for="cell in row"
          :key="cell.date.getTime()"
          class="m-calendar__cell-wrap"
          role="gridcell"
        >
          <button
            type="button"
            class="m-calendar__cell m-calendar__cell--date"
            :class="{
              'm-calendar__cell--other': !cell.inMonth,
              'm-calendar__cell--selected': cell.selected,
              'm-calendar__cell--today': cell.today,
              'm-calendar__cell--disabled': cell.disabled,
            }"
            :disabled="cell.disabled"
            :aria-label="toIsoDate(cell.date)"
            :aria-selected="cell.selected"
            @click="onDayClick(cell.date)"
          >
            <span class="m-calendar__cell-value">{{ cell.date.getDate() }}</span>
            <span
              v-if="slots.dateCell"
              class="m-calendar__cell-content"
            >
              <slot
                name="dateCell"
                :date="cell.date"
              />
            </span>
          </button>
        </div>
      </div>
    </div>

    <div
      v-else
      class="m-calendar__body m-calendar__body--months"
      role="grid"
      :aria-label="String(panelDate.getFullYear())"
    >
      <div class="m-calendar__months">
        <button
          v-for="cell in monthCells"
          :key="cell.index"
          type="button"
          class="m-calendar__cell m-calendar__cell--month"
          :class="{
            'm-calendar__cell--selected': cell.selected,
            'm-calendar__cell--today': cell.today,
            'm-calendar__cell--disabled': cell.disabled,
          }"
          :disabled="cell.disabled"
          :aria-label="cell.label"
          :aria-selected="cell.selected"
          @click="onMonthCellClick(cell.index)"
        >
          <span class="m-calendar__cell-value">{{ cell.label }}</span>
          <span
            v-if="slots.monthCell"
            class="m-calendar__cell-content"
          >
            <slot
              name="monthCell"
              :date="cell.date"
            />
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
