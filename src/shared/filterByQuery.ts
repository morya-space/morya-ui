/** Normalize a user filter string for case-insensitive matching. */
export function normalizeFilterQuery(query: string): string {
  return query.trim().toLowerCase()
}

/** Case-insensitive substring match against an already-normalized query. */
export function textMatchesQuery(text: string, normalizedQuery: string): boolean {
  if (!normalizedQuery) return true
  return text.toLowerCase().includes(normalizedQuery)
}

/** Filter items whose `label` contains the query (trimmed, case-insensitive). */
export function filterItemsByLabel<T extends { label: string }>(
  items: readonly T[],
  query: string,
): T[] {
  const normalized = normalizeFilterQuery(query)
  if (!normalized) return items as T[]
  return items.filter((item) => textMatchesQuery(item.label, normalized))
}

/** Filter items whose `label` or `value` contains the query. */
export function filterItemsByLabelOrValue<T extends { label: string; value: string }>(
  items: readonly T[],
  query: string,
): T[] {
  const normalized = normalizeFilterQuery(query)
  if (!normalized) return items as T[]
  return items.filter(
    (item) =>
      textMatchesQuery(item.label, normalized) || textMatchesQuery(item.value, normalized),
  )
}
