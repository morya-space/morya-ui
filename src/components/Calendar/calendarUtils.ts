import { startOfDay } from '../DatePicker/dateUtils'

export function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate()
  )
}

export function isSameCalendarMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

/** ISO week number (Monday-based week year). */
export function getIsoWeekNumber(date: Date): number {
  const d = startOfDay(date)
  d.setDate(d.getDate() + 4 - (d.getDay() || 7))
  const yearStart = new Date(d.getFullYear(), 0, 1)
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7)
}

export function clampDateToMonth(date: Date, year: number, month: number): Date {
  const lastDay = new Date(year, month + 1, 0).getDate()
  const day = Math.min(date.getDate(), lastDay)
  return startOfDay(new Date(year, month, day))
}
