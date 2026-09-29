/** Parse / format helpers for MDatePicker string values. */

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

export function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

export function toIsoMonth(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`
}

export function toIsoYear(date: Date): string {
  return String(date.getFullYear())
}

export function formatTimeParts(hours: number, minutes: number, seconds: number, showSeconds: boolean): string {
  const base = `${pad2(hours)}:${pad2(minutes)}`
  return showSeconds ? `${base}:${pad2(seconds)}` : base
}

export function formatDateTime(date: Date, showSeconds: boolean): string {
  return `${toIsoDate(date)} ${formatTimeParts(date.getHours(), date.getMinutes(), date.getSeconds(), showSeconds)}`
}

export interface ParsedDateTime {
  date: Date
  hasTime: boolean
}

/**
 * Accepts:
 * - YYYY-MM-DD
 * - YYYY-MM-DD HH:mm[:ss]
 * - YYYY-MM
 * - YYYY
 * - HH:mm[:ss] (uses today's date for the Date object)
 * - Date instance
 */
export function parseDateValue(value: string | Date | null | undefined): ParsedDateTime | null {
  if (value == null || value === '') return null
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : { date: new Date(value.getTime()), hasTime: true }
  }

  const dateTime = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/.exec(value)
  if (dateTime) {
    const y = Number(dateTime[1])
    const m = Number(dateTime[2]) - 1
    const d = Number(dateTime[3])
    const hasTime = dateTime[4] != null
    const hh = hasTime ? Number(dateTime[4]) : 0
    const mm = hasTime ? Number(dateTime[5]) : 0
    const ss = dateTime[6] != null ? Number(dateTime[6]) : 0
    const date = new Date(y, m, d, hh, mm, ss)
    return Number.isNaN(date.getTime()) ? null : { date, hasTime }
  }

  const monthOnly = /^(\d{4})-(\d{2})$/.exec(value)
  if (monthOnly) {
    const date = new Date(Number(monthOnly[1]), Number(monthOnly[2]) - 1, 1)
    return Number.isNaN(date.getTime()) ? null : { date, hasTime: false }
  }

  const yearOnly = /^(\d{4})$/.exec(value)
  if (yearOnly) {
    const date = new Date(Number(yearOnly[1]), 0, 1)
    return Number.isNaN(date.getTime()) ? null : { date, hasTime: false }
  }

  const timeOnly = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value)
  if (timeOnly) {
    const now = new Date()
    const date = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      Number(timeOnly[1]),
      Number(timeOnly[2]),
      timeOnly[3] != null ? Number(timeOnly[3]) : 0,
    )
    return { date, hasTime: true }
  }

  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : { date: parsed, hasTime: true }
}

export function applyDisplayFormat(date: Date, pattern: string, showSeconds = false): string {
  return pattern
    .replaceAll('YYYY', String(date.getFullYear()))
    .replaceAll('MM', pad2(date.getMonth() + 1))
    .replaceAll('DD', pad2(date.getDate()))
    .replaceAll('HH', pad2(date.getHours()))
    .replaceAll('mm', pad2(date.getMinutes()))
    .replaceAll('ss', pad2(showSeconds ? date.getSeconds() : date.getSeconds()))
}

export function decadeStart(year: number): number {
  return Math.floor(year / 10) * 10
}
