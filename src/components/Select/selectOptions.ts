import type {
  SelectFieldNames,
  SelectLabeledValue,
  SelectModelValue,
  SelectOption,
  SelectOptionEntry,
  SelectOptionGroup,
  SelectOptions,
  SelectRawOption,
  SelectValue,
} from './types'

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

/** Local-filter configuration derived from the Select props. */
export interface MenuFilterConfig {
  filterOption?: boolean | ((input: string, option: SelectOption) => boolean)
  optionFilterProp?: string
}

export function isOptionGroup(entry: SelectOptionEntry): entry is SelectOptionGroup {
  return Array.isArray((entry as SelectOptionGroup).options)
}

/**
 * Normalize raw option data into the internal `{ label, value, disabled }` shape,
 * honouring `fieldNames` for renamed keys and group children.
 */
export function normalizeOptions(
  input: SelectOptions | undefined,
  fieldNames?: SelectFieldNames,
): SelectOptionEntry[] {
  if (!input?.length) return []

  const labelKey = fieldNames?.label ?? 'label'
  const valueKey = fieldNames?.value ?? 'value'
  const disabledKey = fieldNames?.disabled ?? 'disabled'
  const groupKey = fieldNames?.options ?? 'options'

  return input.flatMap((entry): SelectOptionEntry[] => {
    if (entry == null || typeof entry !== 'object') return []
    const record = entry as SelectRawOption

    const children = record[groupKey]
    if (Array.isArray(children)) {
      const options = normalizeOptions(children as SelectOptions, fieldNames)
        .filter((child): child is SelectOption => !isOptionGroup(child))
      if (!options.length) return []
      return [{ ...record, label: String(record[labelKey] ?? ''), options }]
    }

    const value = record[valueKey]
    if (typeof value !== 'string' && typeof value !== 'number') return []

    // Extra keys are preserved so `optionFilterProp` can target custom fields.
    const option: SelectOption = {
      ...record,
      label: String(record[labelKey] ?? value),
      value,
    }
    if (record[disabledKey]) option.disabled = true
    else delete (option as unknown as Record<string, unknown>)[disabledKey]
    return [option]
  })
}

/** Unwrap a possibly `labelInValue` entry into its raw value. */
export function selectValueOf(
  value: SelectValue | SelectLabeledValue | undefined,
): SelectValue | undefined {
  if (value == null) return undefined
  if (typeof value === 'object') return value.value
  return value
}

/** Flatten groups into a single option list. */
export function flattenOptions(entries: SelectOptionEntry[]): SelectOption[] {
  return entries.flatMap((entry): SelectOption[] => (isOptionGroup(entry) ? entry.options : [entry]))
}

/**
 * Normalize v-model into a selected-value array, unwrapping `labelInValue`
 * entries and collapsing to a single value for single-select.
 */
export function normalizeSelectedValues(
  modelValue: SelectModelValue,
  multiple: boolean,
): SelectValue[] {
  const unwrap = (value: unknown): SelectValue[] => {
    if (value == null) return []
    if (Array.isArray(value)) return value.flatMap(unwrap)
    if (typeof value === 'object') {
      const inner = (value as SelectLabeledValue).value
      return inner == null ? [] : [inner]
    }
    return [value as SelectValue]
  }

  const values = unwrap(modelValue)
  return multiple ? values : values.slice(0, 1)
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

/** Whether Enter should create an option from the current query. */
export function canCreateFromQuery(
  query: string,
  lookupOptions: SelectOption[],
  options: { tags: boolean; showSearch: boolean },
) {
  if (!options.tags || !options.showSearch) return false
  const needle = query.trim()
  if (!needle) return false
  return !lookupOptions.some(
    (option) =>
      option.label.toLowerCase() === needle.toLowerCase() || String(option.value) === needle,
  )
}

/** Local filter predicate: honours `filterOption` and `optionFilterProp`. */
export function matchesMenuFilter(
  option: SelectOption,
  needle: string,
  config: MenuFilterConfig,
): boolean {
  const { filterOption } = config
  if (typeof filterOption === 'function') return filterOption(needle, option)
  if (filterOption === false) return true

  const prop = config.optionFilterProp ?? 'label'
  const raw = (option as unknown as Record<string, unknown>)[prop]
  return String(raw ?? '').toLowerCase().includes(needle)
}

/**
 * Build menu entries with optional local filtering.
 * Remote mode returns `options` unchanged; created/selected extras are only
 * appended in local mode.
 */
export function buildMenuEntries(
  options: SelectOptionEntry[],
  createdOptions: SelectOption[],
  selectedValues: SelectValue[],
  query: string,
  remote: boolean,
  filter: MenuFilterConfig = {},
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
      const options = entry.options.filter((option) => matchesMenuFilter(option, needle, filter))
      return options.length ? [{ ...entry, options }] : []
    }
    return matchesMenuFilter(entry, needle, filter) ? [entry] : []
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
      for (const option of entry.options) {
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
    return { visible: all, omitted: [] as T[], hiddenCount: 0 }
  }
  return {
    visible: all.slice(0, maxTagCount),
    omitted: all.slice(maxTagCount),
    hiddenCount: all.length - maxTagCount,
  }
}
