/** Type names documented on /docs/types — link Props/Events tables here when no local anchor exists. */
export const GLOBAL_DOC_TYPE_IDS = new Set([
  'PassThroughPart',
  'RootPassThrough',
  'ControlPassThrough',
  'FieldPassThrough',
  'InputPassThrough',
  'MSizeInput',
  'MInputVariant',
  'ButtonSeverity',
  'MAppendTo',
  'AsyncGuard',
  'SelectOption',
  'SelectModelValue',
  'IconName',
  'MSeverity',
  'MenuNodeBase',
])

/** Never auto-link these identifiers in API tables. */
export const SKIP_DOC_TYPE_NAMES = new Set([
  'Record',
  'Promise',
  'HTMLElement',
  'Element',
  'Node',
  'Date',
  'Map',
  'Set',
  'Array',
  'Object',
  'Function',
  'MouseEvent',
  'KeyboardEvent',
  'FocusEvent',
  'InputEvent',
  'Event',
  'Ref',
  'ComputedRef',
  'VNode',
  'Component',
  'RouteLocationRaw',
])

export function resolveDocTypeHref(name: string, localIds: ReadonlySet<string>): string | null {
  if (SKIP_DOC_TYPE_NAMES.has(name)) return null
  if (localIds.has(name)) return `#${name}`
  if (GLOBAL_DOC_TYPE_IDS.has(name)) return `/docs/types#${name}`
  return null
}
