/** Built-in system icons: 16×16, stroke currentColor. App icons → Lucide etc. via slot. */

export type IconPrimitive =
  | { tag: 'path'; d: string }
  | { tag: 'circle'; cx: number; cy: number; r: number; fill?: 'currentColor' | 'none' }
  | { tag: 'line'; x1: number; y1: number; x2: number; y2: number }
  | { tag: 'polyline'; points: string }
  | { tag: 'rect'; x: number; y: number; width: number; height: number; rx?: number }

export interface IconDefinition {
  primitives: readonly IconPrimitive[]
  /** Optional CSS modifier on the host (e.g. spin for loader). */
  spin?: boolean
}

export const iconRegistry = {
  check: {
    primitives: [{ tag: 'path', d: 'm3 8 3 3 7-7' }],
  },
  'check-circle': {
    primitives: [
      { tag: 'circle', cx: 8, cy: 8, r: 5.5 },
      { tag: 'path', d: 'm5.5 8.25 1.75 1.75 3.5-3.75' },
    ],
  },
  close: {
    primitives: [{ tag: 'path', d: 'm4 4 8 8M12 4l-8 8' }],
  },
  'x-circle': {
    primitives: [
      { tag: 'circle', cx: 8, cy: 8, r: 5.5 },
      { tag: 'path', d: 'm6 6 4 4M10 6l-4 4' },
    ],
  },
  info: {
    primitives: [
      { tag: 'circle', cx: 8, cy: 8, r: 5.5 },
      { tag: 'path', d: 'M8 7v4M8 5.25h.01' },
    ],
  },
  warning: {
    primitives: [
      { tag: 'path', d: 'M8 2.75 14.25 13.5H1.75L8 2.75Z' },
      { tag: 'path', d: 'M8 6.5v3.25M8 11.5h.01' },
    ],
  },
  'alert-circle': {
    primitives: [
      { tag: 'circle', cx: 8, cy: 8, r: 5.5 },
      { tag: 'path', d: 'M8 5.25v4M8 11.25h.01' },
    ],
  },
  'chevron-up': {
    primitives: [{ tag: 'path', d: 'm4 10 4-4 4 4' }],
  },
  'chevron-down': {
    primitives: [{ tag: 'path', d: 'm4 6 4 4 4-4' }],
  },
  'chevron-left': {
    primitives: [{ tag: 'path', d: 'm10 4-4 4 4 4' }],
  },
  'chevron-right': {
    primitives: [{ tag: 'path', d: 'm6 4 4 4-4 4' }],
  },
  'arrow-up': {
    primitives: [{ tag: 'path', d: 'M8 12.5V3.5M4.5 7 8 3.5 11.5 7' }],
  },
  'arrow-down': {
    primitives: [{ tag: 'path', d: 'M8 3.5v9M4.5 9 8 12.5 11.5 9' }],
  },
  'arrow-left': {
    primitives: [{ tag: 'path', d: 'M12.5 8H3.5M7 4.5 3.5 8 7 11.5' }],
  },
  'arrow-right': {
    primitives: [{ tag: 'path', d: 'M3.5 8h9M9 4.5 12.5 8 9 11.5' }],
  },
  plus: {
    primitives: [{ tag: 'path', d: 'M8 3v10M3 8h10' }],
  },
  minus: {
    primitives: [{ tag: 'path', d: 'M3 8h10' }],
  },
  search: {
    primitives: [
      { tag: 'circle', cx: 7, cy: 7, r: 3.75 },
      { tag: 'path', d: 'm10 10 3 3' },
    ],
  },
  menu: {
    primitives: [{ tag: 'path', d: 'M3 5h10M3 8h10M3 11h10' }],
  },
  more: {
    primitives: [
      { tag: 'circle', cx: 4, cy: 8, r: 1, fill: 'currentColor' },
      { tag: 'circle', cx: 8, cy: 8, r: 1, fill: 'currentColor' },
      { tag: 'circle', cx: 12, cy: 8, r: 1, fill: 'currentColor' },
    ],
  },
  'more-vertical': {
    primitives: [
      { tag: 'circle', cx: 8, cy: 4, r: 1, fill: 'currentColor' },
      { tag: 'circle', cx: 8, cy: 8, r: 1, fill: 'currentColor' },
      { tag: 'circle', cx: 8, cy: 12, r: 1, fill: 'currentColor' },
    ],
  },
  edit: {
    primitives: [
      { tag: 'path', d: 'm3 11.75-.5 2.75 2.75-.5L13 6.25 9.75 3 3 9.75v2Z' },
      { tag: 'path', d: 'm8.75 4 3.25 3.25' },
    ],
  },
  trash: {
    primitives: [
      {
        tag: 'path',
        d: 'M3.5 5h9M6 5V3.5h4V5M5 5l.5 8h5l.5-8M6.75 7v4M9.25 7v4',
      },
    ],
  },
  copy: {
    primitives: [
      { tag: 'rect', x: 5.5, y: 5.5, width: 7, height: 7, rx: 1 },
      { tag: 'path', d: 'M10.5 5.5V4.5a1 1 0 0 0-1-1h-5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1' },
    ],
  },
  'external-link': {
    primitives: [
      { tag: 'path', d: 'M9 3.5h3.5V7M12.5 3.5 8 8' },
      { tag: 'path', d: 'M7 4.5H4.5a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9' },
    ],
  },
  download: {
    primitives: [
      { tag: 'path', d: 'M8 3v7.5M5 8l3 3 3-3' },
      { tag: 'path', d: 'M3.5 12.5h9' },
    ],
  },
  upload: {
    primitives: [
      { tag: 'path', d: 'M8 13V5.5M5 8l3-3 3 3' },
      { tag: 'path', d: 'M3.5 12.5h9' },
    ],
  },
  filter: {
    primitives: [{ tag: 'path', d: 'M2.5 3.5h11l-4 5v4l-3 1.5v-5.5l-4-5Z' }],
  },
  settings: {
    primitives: [
      { tag: 'circle', cx: 8, cy: 8, r: 2 },
      {
        tag: 'path',
        d: 'M8 2.5v1.2M8 12.3v1.2M2.5 8h1.2M12.3 8h1.2M4.1 4.1l.85.85M11.05 11.05l.85.85M4.1 11.9l.85-.85M11.05 4.95l.85-.85',
      },
    ],
  },
  home: {
    primitives: [{ tag: 'path', d: 'M2.5 7.5 8 3l5.5 4.5V13a.75.75 0 0 1-.75.75H3.25A.75.75 0 0 1 2.5 13V7.5Z' }],
  },
  user: {
    primitives: [
      { tag: 'circle', cx: 8, cy: 5.5, r: 2.25 },
      { tag: 'path', d: 'M3.5 13.25c0-2.35 2-4.25 4.5-4.25s4.5 1.9 4.5 4.25' },
    ],
  },
  calendar: {
    primitives: [
      { tag: 'rect', x: 2.5, y: 3.5, width: 11, height: 10, rx: 1 },
      { tag: 'path', d: 'M5 2.5v2M11 2.5v2M2.5 6.5h11' },
    ],
  },
  clock: {
    primitives: [
      { tag: 'circle', cx: 8, cy: 8, r: 5.5 },
      { tag: 'path', d: 'M8 5.25V8l2 1.5' },
    ],
  },
  eye: {
    primitives: [
      { tag: 'path', d: 'M1.75 8S3.75 3.75 8 3.75 14.25 8 14.25 8 12.25 12.25 8 12.25 1.75 8 1.75 8Z' },
      { tag: 'circle', cx: 8, cy: 8, r: 1.75 },
    ],
  },
  'eye-off': {
    primitives: [
      { tag: 'path', d: 'm2.5 2.5 11 11M6.2 6.35A2.25 2.25 0 0 0 9.65 9.8' },
      { tag: 'path', d: 'M4.1 4.45C2.7 5.5 1.75 8 1.75 8S3.75 12.25 8 12.25c1.15 0 2.15-.3 3-.75' },
      { tag: 'path', d: 'M11.35 9.4C12.95 8.35 14.25 8 14.25 8S12.25 3.75 8 3.75c-.55 0-1.05.05-1.5.15' },
    ],
  },
  lock: {
    primitives: [
      { tag: 'rect', x: 3.5, y: 7, width: 9, height: 6.5, rx: 1 },
      { tag: 'path', d: 'M5.5 7V5.25a2.5 2.5 0 0 1 5 0V7' },
    ],
  },
  unlock: {
    primitives: [
      { tag: 'rect', x: 3.5, y: 7, width: 9, height: 6.5, rx: 1 },
      { tag: 'path', d: 'M5.5 7V5.25a2.5 2.5 0 0 1 4.85-.75' },
    ],
  },
  link: {
    primitives: [
      { tag: 'path', d: 'M6.5 9.5 5.25 10.75a2.25 2.25 0 0 1-3.18-3.18L3.75 6' },
      { tag: 'path', d: 'M9.5 6.5 10.75 5.25a2.25 2.25 0 1 1 3.18 3.18L12.25 10' },
      { tag: 'path', d: 'm6.5 9.5 3-3' },
    ],
  },
  refresh: {
    primitives: [
      { tag: 'path', d: 'M13 8a5 5 0 1 1-1.4-3.4' },
      { tag: 'path', d: 'M13 3.5V6.5H10' },
    ],
  },
  loader: {
    spin: true,
    primitives: [{ tag: 'path', d: 'M8 2.75a5.25 5.25 0 1 1-4.55 2.63' }],
  },
  star: {
    primitives: [
      {
        tag: 'path',
        d: 'm8 2.5 1.55 3.15 3.45.5-2.5 2.45.6 3.45L8 10.4l-3.1 1.65.6-3.45-2.5-2.45 3.45-.5L8 2.5Z',
      },
    ],
  },
  heart: {
    primitives: [
      {
        tag: 'path',
        d: 'M8 13.25S2.75 9.75 2.75 6.4A2.65 2.65 0 0 1 8 5.1a2.65 2.65 0 0 1 5.25 1.3c0 3.35-5.25 6.85-5.25 6.85Z',
      },
    ],
  },
  grip: {
    primitives: [
      { tag: 'circle', cx: 5.5, cy: 4.5, r: 1, fill: 'currentColor' },
      { tag: 'circle', cx: 10.5, cy: 4.5, r: 1, fill: 'currentColor' },
      { tag: 'circle', cx: 5.5, cy: 8, r: 1, fill: 'currentColor' },
      { tag: 'circle', cx: 10.5, cy: 8, r: 1, fill: 'currentColor' },
      { tag: 'circle', cx: 5.5, cy: 11.5, r: 1, fill: 'currentColor' },
      { tag: 'circle', cx: 10.5, cy: 11.5, r: 1, fill: 'currentColor' },
    ],
  },
} as const satisfies Record<string, IconDefinition>

export type IconName = keyof typeof iconRegistry

export const iconNames = Object.keys(iconRegistry) as IconName[]

export function isIconName(value: string): value is IconName {
  return value in iconRegistry
}

export function getIconDefinition(name: IconName): IconDefinition {
  return iconRegistry[name]
}
