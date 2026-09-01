export function parseYamlFrontmatter(raw: string): Record<string, string> {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match?.[1]) return {}

  const result: Record<string, string> = {}
  for (const line of match[1].split(/\r?\n/)) {
    const sep = line.indexOf(':')
    if (sep <= 0) continue
    const key = line.slice(0, sep).trim()
    const value = line.slice(sep + 1).trim()
    if (key) result[key] = value
  }
  return result
}
