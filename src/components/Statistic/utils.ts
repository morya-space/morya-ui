export type StatisticValue = number | string

export type StatisticFormatter = (value: StatisticValue) => string

const TIME_UNITS: [string, number][] = [
  ['Y', 1000 * 60 * 60 * 24 * 365],
  ['M', 1000 * 60 * 60 * 24 * 30],
  ['D', 1000 * 60 * 60 * 24],
  ['H', 1000 * 60 * 60],
  ['m', 1000 * 60],
  ['s', 1000],
  ['S', 1],
]

export function formatNumberValue(
  value: StatisticValue,
  precision?: number,
  decimalSeparator = '.',
  groupSeparator = ',',
): string {
  const num = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(num)) return String(value)
  let text = precision != null ? num.toFixed(precision) : String(num)
  const [intPart = '', decPart] = text.split('.')
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator)
  text = decPart != null ? `${grouped}${decimalSeparator}${decPart}` : grouped
  return text
}

export function formatTimeStr(duration: number, format: string): string {
  let left = Math.max(0, duration)
  const escapeRegex = /\[[^\]]*]/g
  const keepList = (format.match(escapeRegex) || []).map((str) => str.slice(1, -1))
  let template = format.replace(escapeRegex, '[]')

  template = TIME_UNITS.reduce((current, [name, unit]) => {
    if (!current.includes(name)) return current
    const unitValue = Math.floor(left / unit)
    left -= unitValue * unit
    return current.replace(new RegExp(`${name}+`, 'g'), (match) =>
      unitValue.toString().padStart(match.length, '0'),
    )
  }, template)

  let index = 0
  return template.replace(/\[\]/g, (): string => {
    const match = keepList[index]
    index += 1
    return match ?? ''
  })
}

export function formatCountdown(value: StatisticValue, format: string): string {
  const target = new Date(value).getTime()
  if (!Number.isFinite(target)) return '-'
  const diff = Math.max(target - Date.now(), 0)
  return formatTimeStr(diff, format)
}
