export interface ActiveMention {
  prefix: string
  query: string
  start: number
}

export function resolvePrefixes(prefix?: string | string[]): string[] {
  if (prefix === undefined) return ['@']
  return Array.isArray(prefix) ? prefix : [prefix]
}

export function getActiveMention(
  text: string,
  cursor: number,
  prefixes: string[],
  split: string,
): ActiveMention | null {
  const before = text.slice(0, cursor)
  let best: ActiveMention | null = null

  for (const prefix of prefixes) {
    const idx = before.lastIndexOf(prefix)
    if (idx === -1) continue
    if (idx > 0 && !/\s/.test(before[idx - 1]!)) continue
    const afterPrefix = before.slice(idx + prefix.length)
    if (split && afterPrefix.includes(split)) continue
    if (!/^\S*$/.test(afterPrefix)) continue
    if (!best || idx > best.start) {
      best = { prefix, query: afterPrefix, start: idx }
    }
  }

  return best
}

export interface NormalizedMentionOption {
  value: string
  label: string
}

export function normalizeMentionOption(raw: string | { value: string; label?: string }): NormalizedMentionOption {
  if (typeof raw === 'string') return { value: raw, label: raw }
  return { value: raw.value, label: raw.label ?? raw.value }
}

export function filterMentionOptions(
  options: NormalizedMentionOption[],
  query: string,
): NormalizedMentionOption[] {
  const q = query.toLowerCase()
  if (!q) return options
  return options.filter(
    (option) =>
      option.value.toLowerCase().includes(q) ||
      option.label.toLowerCase().includes(q),
  )
}
