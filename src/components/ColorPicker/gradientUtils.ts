import type { GradientStop, GradientValue } from './types'

let nextId = 0

export function createStopId(): string {
  return `stop-${++nextId}-${Date.now()}`
}

export function isGradient(value: string): boolean {
  return /^(linear|radial|conic)-gradient\(/.test(value.trim())
}

export function parseGradient(value: string): GradientValue | null {
  const trimmed = value.trim()
  if (!isGradient(trimmed)) return null

  const match = trimmed.match(/^(linear|radial)-gradient\((.+)\)$/i)
  if (!match) return null

  const type = match[1]!.toLowerCase() as 'linear' | 'radial'
  const inner = match[2]!

  // Split by comma, but be careful about nested parens
  const parts: string[] = []
  let depth = 0
  let current = ''
  for (const char of inner) {
    if (char === '(') depth++
    if (char === ')') depth--
    if (char === ',' && depth === 0) {
      parts.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  if (current) parts.push(current.trim())

  let angle = 90
  let startIndex = 0

  // Check for angle in linear gradient
  if (type === 'linear' && parts.length > 0) {
    const first = parts[0]!
    const angleMatch = first.match(/^(\d+(?:\.\d+)?)(deg|turn|grad|rad)$/i)
    if (angleMatch) {
      angle = parseFloat(angleMatch[1]!)
      const unit = angleMatch[2]!.toLowerCase()
      if (unit === 'turn') angle *= 360
      else if (unit === 'grad') angle *= 0.9
      else if (unit === 'rad') angle *= (180 / Math.PI)
      startIndex = 1
    } else if (first === 'to right') { angle = 90; startIndex = 1 }
    else if (first === 'to left') { angle = 270; startIndex = 1 }
    else if (first === 'to bottom') { angle = 180; startIndex = 1 }
    else if (first === 'to top') { angle = 0; startIndex = 1 }
    else if (first === 'to bottom right') { angle = 135; startIndex = 1 }
    else if (first === 'to bottom left') { angle = 225; startIndex = 1 }
    else if (first === 'to top right') { angle = 45; startIndex = 1 }
    else if (first === 'to top left') { angle = 315; startIndex = 1 }
  }

  const stops: GradientStop[] = []
  for (let i = startIndex; i < parts.length; i++) {
    const part = parts[i]!
    const stopMatch = part.match(/^(#[0-9a-f]{3,8}|rgba?\([^)]+\)|[a-z]+)\s*(\d+(?:\.\d+)?%?)?$/i)
    if (stopMatch) {
      const color = stopMatch[1]!
      const posStr = stopMatch[2]
      let position = 0
      if (posStr) {
        position = parseFloat(posStr)
        if (!posStr.endsWith('%')) {
          position = stops.length > 0
            ? stops[stops.length - 1]!.position + (100 / (parts.length - startIndex - 1))
            : 0
        }
      } else {
        position = stops.length > 0
          ? stops[stops.length - 1]!.position + (100 / (parts.length - startIndex - 1))
          : 0
      }
      stops.push({
        id: createStopId(),
        color: normalizeColor(color),
        position: Math.min(100, Math.max(0, position)),
      })
    }
  }

  // Ensure at least 2 stops
  while (stops.length < 2) {
    stops.push({
      id: createStopId(),
      color: stops.length === 0 ? '#000000' : '#ffffff',
      position: stops.length * 100,
    })
  }

  // Sort by position
  stops.sort((a, b) => a.position - b.position)

  return { type, angle, stops }
}

export function gradientToString(gradient: GradientValue): string {
  const stops = gradient.stops
    .map((s) => `${s.color} ${Math.round(s.position * 100) / 100}%`)
    .join(', ')

  if (gradient.type === 'linear') {
    return `linear-gradient(${Math.round(gradient.angle)}deg, ${stops})`
  }
  return `radial-gradient(${stops})`
}

export function normalizeColor(color: string): string {
  const named: Record<string, string> = {
    red: '#ff0000',
    green: '#008000',
    blue: '#0000ff',
    white: '#ffffff',
    black: '#000000',
    yellow: '#ffff00',
    cyan: '#00ffff',
    magenta: '#ff00ff',
  }
  const lower = color.toLowerCase()
  if (named[lower]) return named[lower]
  if (/^#[0-9a-f]{3}$/i.test(color)) {
    return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`
  }
  if (/^#[0-9a-f]{6}$/i.test(color)) return color
  if (/^#[0-9a-f]{8}$/i.test(color)) return color.slice(0, 7)
  return '#000000'
}

export function createDefaultGradient(): GradientValue {
  return {
    type: 'linear',
    angle: 90,
    stops: [
      { id: createStopId(), color: '#1677ff', position: 0 },
      { id: createStopId(), color: '#ff4d4f', position: 100 },
    ],
  }
}

export function stopsToGradientPreview(stops: GradientStop[]): string {
  const sorted = [...stops].sort((a, b) => a.position - b.position)
  return `linear-gradient(to right, ${sorted.map((s) => `${s.color} ${Math.round(s.position * 100) / 100}%`).join(', ')})`
}
