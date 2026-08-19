<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { formatLocale, useWdLocale } from '../../locale'
import { useWdConfig } from '../../shared/config'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import { resolveSizeClass } from '../../shared/types'
import type { DatePickerProps, DatePickerValue } from './types'

const props = withDefaults(defineProps<DatePickerProps>(), {
  modelValue: null,
  disabled: false,
  invalid: false,
  fluid: false,
  placeholder: undefined,
  teleport: true,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | null): void
}>()

const config = useWdConfig()
const locale = useWdLocale()
const sizeClass = computed(() => resolveSizeClass(props.size ?? config.value.size))
const open = ref(false)
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const panelStyle = ref<Record<string, string>>({})
const viewYear = ref(new Date().getFullYear())
const viewMonth = ref(new Date().getMonth())
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))
const teleported = computed(() => isOverlayTeleported(props, config.value.appendTo))

function toDate(value: DatePickerValue | undefined): Date | null {
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

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

const selected = computed(() => toDate(props.modelValue))
const min = computed(() => toDate(props.minDate))
const max = computed(() => toDate(props.maxDate))

const displayValue = computed(() => {
  if (!selected.value) return ''
  return toIso(selected.value)
})

const monthLabel = computed(() =>
  formatLocale(locale.value.monthYear, {
    year: viewYear.value,
    month: viewMonth.value + 1,
    monthName: locale.value.monthNames[viewMonth.value] ?? String(viewMonth.value + 1),
  }),
)

const calendarDays = computed(() => {
  const first = new Date(viewYear.value, viewMonth.value, 1)
  const startWeekday = first.getDay()
  const daysInMonth = new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
  const cells: { date: Date; inMonth: boolean; disabled: boolean; selected: boolean }[] = []

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
  const selectedDay = selected.value ? startOfDay(selected.value) : null
  return {
    date: day,
    inMonth,
    disabled,
    selected: Boolean(selectedDay && day.getTime() === selectedDay.getTime()),
  }
}

const rootClass = computed(() => [
  'wd-datepicker',
  `wd-datepicker--${sizeClass.value}`,
  {
    'wd-datepicker--fluid': props.fluid,
    'wd-datepicker--disabled': props.disabled,
    'wd-datepicker--invalid': props.invalid,
    'wd-datepicker--open': open.value,
  },
])

function syncViewFromValue() {
  const date = selected.value ?? new Date()
  viewYear.value = date.getFullYear()
  viewMonth.value = date.getMonth()
}

function updatePanelPosition() {
  if (!teleported.value || !trigger.value) return
  const rect = trigger.value.getBoundingClientRect()
  panelStyle.value = {
    left: `${rect.left}px`,
    minWidth: `${rect.width}px`,
    top: `${rect.bottom + 8}px`,
  }
}

function setOpen(next: boolean) {
  if (props.disabled) return
  open.value = next
  if (next) {
    syncViewFromValue()
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
  emit('update:modelValue', toIso(date))
  open.value = false
}

function clear() {
  if (props.disabled) return
  emit('update:modelValue', null)
}

function onDocumentClick(event: MouseEvent) {
  const target = event.target as Node
  if (root.value?.contains(target) || panel.value?.contains(target)) return
  open.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') open.value = false
}

function onViewportChange() {
  if (open.value) updatePanelPosition()
}

watch(open, async (isOpen) => {
  if (isOpen) {
    document.addEventListener('click', onDocumentClick)
    document.addEventListener('keydown', onKeydown)
    if (teleported.value) {
      window.addEventListener('resize', onViewportChange)
      window.addEventListener('scroll', onViewportChange, true)
    }
    await nextTick()
  } else {
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
    <label v-if="label" class="wd-datepicker__label">{{ label }}</label>
    <div ref="trigger" class="wd-datepicker__control">
      <input
        class="wd-datepicker__input"
        type="text"
        readonly
        :value="displayValue"
        :placeholder="placeholder ?? locale.datePickerPlaceholder"
        :disabled="disabled"
        :aria-invalid="invalid || undefined"
        :aria-expanded="open"
        aria-haspopup="dialog"
        @click="toggle"
        @keydown.enter.prevent="toggle"
        @keydown.space.prevent="toggle"
      />
      <button
        v-if="displayValue"
        type="button"
        class="wd-datepicker__clear"
        :aria-label="locale.clearDate"
        :disabled="disabled"
        @click="clear"
      >
        ×
      </button>
    </div>
    <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
      <Transition name="wd-scale-fade">
        <div
          v-if="open"
          ref="panel"
          class="wd-datepicker__panel"
          :class="{ 'wd-datepicker__panel--teleported': teleported }"
          :style="teleported ? panelStyle : undefined"
          role="dialog"
          :aria-label="locale.datePicker"
        >
          <div class="wd-datepicker__header">
            <button type="button" class="wd-datepicker__nav" :aria-label="locale.prevMonth" @click="prevMonth">‹</button>
            <span class="wd-datepicker__month">{{ monthLabel }}</span>
            <button type="button" class="wd-datepicker__nav" :aria-label="locale.nextMonth" @click="nextMonth">›</button>
          </div>
          <div class="wd-datepicker__weekdays">
            <span v-for="day in locale.weekdays" :key="day">{{ day }}</span>
          </div>
          <div class="wd-datepicker__grid">
            <button
              v-for="cell in calendarDays"
              :key="cell.date.toISOString()"
              type="button"
              class="wd-datepicker__day"
              :class="{
                'wd-datepicker__day--other': !cell.inMonth,
                'wd-datepicker__day--selected': cell.selected,
              }"
              :disabled="cell.disabled"
              @click="pick(cell.date, cell.disabled)"
            >
              {{ cell.date.getDate() }}
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
