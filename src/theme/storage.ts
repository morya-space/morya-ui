export function readStoredValue(currentKey: string, legacyKeys: string[] = []): string | null {
  if (typeof localStorage === 'undefined') return null
  const keys = [currentKey, ...legacyKeys]
  for (const key of keys) {
    const saved = localStorage.getItem(key)
    if (saved) return saved
  }
  return null
}

export function writeStoredValue(currentKey: string, value: string, legacyKeys: string[] = []) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(currentKey, value)
  for (const key of legacyKeys) {
    if (key !== currentKey) localStorage.removeItem(key)
  }
}
