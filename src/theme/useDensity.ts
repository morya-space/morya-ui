import { ref, watch } from 'vue'
import { readStoredValue, writeStoredValue } from './storage'

export type DensityPreference = 'compact' | 'comfortable' | 'spacious'

const storageKey = 'morya-ui-density'
const legacyStorageKeys = ['wex-design-density']
const densityPreferences: readonly DensityPreference[] = ['compact', 'comfortable', 'spacious']

const preference = ref<DensityPreference>(getInitialDensity())

export function applyDensity(preference: DensityPreference, target?: HTMLElement) {
  const el = target ?? (typeof document !== 'undefined' ? document.documentElement : undefined)
  if (!el) return
  el.dataset.mDensity = preference
}

function getInitialDensity(): DensityPreference {
  const saved = readStoredValue(storageKey, legacyStorageKeys)
  if (saved && densityPreferences.includes(saved as DensityPreference)) {
    return saved as DensityPreference
  }
  return 'comfortable'
}

if (typeof window !== 'undefined') {
  watch(
    preference,
    (next) => {
      applyDensity(next)
      writeStoredValue(storageKey, next, legacyStorageKeys)
    },
    { immediate: true },
  )
}

export function useDensity() {
  function setDensity(next: DensityPreference) {
    preference.value = next
  }

  return { preference, densityPreferences, setDensity }
}
