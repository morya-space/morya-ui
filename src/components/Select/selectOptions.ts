import type { SelectModelValue, SelectOption, SelectOptionEntry, SelectOptionGroup, SelectValue } from './types'

export interface MenuOption extends SelectOption {
  created?: boolean
}

export interface MenuGroupRow {
  type: 'group'
  label: string
  key: string
}

export interface MenuOptionRow {
  type: 'option'
  option: MenuOption
  key: string
}

export type MenuRow = MenuGroupRow | MenuOptionRow

export function isOptionGroup(entry: SelectOptionEntry): entry is SelectOptionGroup {
  return Array.isArray((entry as SelectOptionGroup).items)
}

/** Flatten groups into a single option list. */
export function flattenOptions(entries: SelectOptionEntry[]): SelectOption[] {
  return entries.flatMap((entry): SelectOption[] => (isOptionGroup(entry) ? entry.items : [entry]))
}

/** Normalize v-model into a selected-value array for both single and multiple modes. */
export function normalizeSelectedValues(
  modelValue: SelectModelValue,
  multiple: boolean,
): SelectValue[] {
  if (multiple) {
    if (Array.isArray(modelValue)) return modelValue
    if (modelValue == null) return []
    return [modelValue]
  }
  if (modelValue == null || Array.isArray(modelValue)) return []
  return [modelValue]
}

/**
 * Options used for label lookup: prop options + created tags + selected values
 * that are not yet present in `options`.
 */
export function buildLookupOptions(
  options: SelectOptionEntry[],
  createdOptions: SelectOption[],
  selectedValues: SelectValue[],
): SelectOption[] {
  const flat = flattenOptions(options)
  const seen = new Set(flat.map((option) => String(option.value)))
  const extras: SelectOption[] = []
  for (const option of createdOptions) {
    if (seen.has(String(option.value))) continue
    extras.push(option)
    seen.add(String(option.value))
  }
  for (const value of selectedValues) {
    if (seen.has(String(value))) continue
    extras.push({ label: String(value), value })
    seen.add(String(value))
  }
  return [...flat, ...extras]
}

/** Whether Enter should create a tag from the current query. */
export function canCreateFromQuery(
  query: string,
  lookupOptions: SelectOption[],
  options: { tag: boolean; filter: boolean },
) {
  if (!options.tag || !options.filter) return false
  const needle = query.trim()
  if (!needle) return false
  return !lookupOptions.some(
    (option) =>
      option.label.toLowerCase() === needle.toLowerCase() || String(option.value) === needle,
  )
}

/**
 * Build menu entries with optional local label filtering.
 * Remote mode returns `options` unchanged; created/selected extras are still
 * appended only in local mode.
 */
export function buildMenuEntries(
  options: SelectOptionEntry[],
  createdOptions: SelectOption[],
  selectedValues: SelectValue[],
  query: string,
  remote: boolean,
): SelectOptionEntry[] {
  if (remote) return options
  const flat = flattenOptions(options)
  const seen = new Set(flat.map((option) => String(option.value)))
  const extras: SelectOption[] = []
  for (const option of createdOptions) {
    if (seen.has(String(option.value))) continue
    extras.push(option)
    seen.add(String(option.value))
  }
  for (const value of selectedValues) {
    if (seen.has(String(value))) continue
    extras.push({ label: String(value), value })
    seen.add(String(value))
  }
  const entries: SelectOptionEntry[] = [...options, ...extras]
  const needle = query.trim().toLowerCase()
  if (!needle) return entries
  return entries.flatMap((entry): SelectOptionEntry[] => {
    if (isOptionGroup(entry)) {
      const items = entry.items.filter((option) => option.label.toLowerCase().includes(needle))
      return items.length ? [{ ...entry, items }] : []
    }
    return entry.label.toLowerCase().includes(needle) ? [entry] : []
  })
}

/** Flatten entries into render rows, optionally prepending a create-tag row. */
export function buildMenuRows(
  entries: SelectOptionEntry[],
  createQuery?: string,
): MenuRow[] {
  const rows: MenuRow[] = []
  const createLabel = createQuery?.trim()
  if (createLabel) {
    rows.push({
      type: 'option',
      option: { label: createLabel, value: createLabel, created: true },
      key: `__create:${createLabel}`,
    })
  }
  entries.forEach((entry, index) => {
    if (isOptionGroup(entry)) {
      rows.push({ type: 'group', label: entry.label, key: `__group:${index}:${entry.label}` })
      for (const option of entry.items) {
        rows.push({ type: 'option', option, key: String(option.value) })
      }
    } else {
      rows.push({ type: 'option', option: entry, key: String(entry.value) })
    }
  })
  return rows
}

/** Toggle a value in a multiple-select selection. */
export function toggleSelectedValue(selected: SelectValue[], value: SelectValue): SelectValue[] {
  return selected.includes(value)
    ? selected.filter((item) => item !== value)
    : [...selected, value]
}

/** Collapse selected options for maxTagCount display. */
export function sliceVisibleTags<T>(all: T[], maxTagCount?: number) {
  if (maxTagCount == null || all.length <= maxTagCount) {
    return { visible: all, hiddenCount: 0 }
  }
  return {
    visible: all.slice(0, maxTagCount),
    hiddenCount: all.length - maxTagCount,
  }
}
