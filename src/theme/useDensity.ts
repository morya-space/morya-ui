import { ref, watch } from 'vue'

export type DensityPreference = 'compact' | 'comfortable' | 'spacious'

const storageKey = 'wex-design-density'
const densityPreferences: readonly DensityPreference[] = ['compact', 'comfortable', 'spacious']

export function applyDensity(preference: DensityPreference, target?: HTMLElement) {
  const el = target ?? (typeof document !== 'undefined' ? document.documentElement : undefined)
  if (!el) return
  el.dataset.wdDensity = preference
}

export function useDensity() {
  const preference = ref<DensityPreference>(getInitialDensity())

  function setDensity(next: DensityPreference) {
    preference.value = next
  }

  watch(
    preference,
    (next) => {
      applyDensity(next)
      if (typeof localStorage !== 'undefined') localStorage.setItem(storageKey, next)
    },
    { immediate: true },
  )

  return { preference, densityPreferences, setDensity }
}

function getInitialDensity(): DensityPreference {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem(storageKey)
    if (saved && densityPreferences.includes(saved as DensityPreference)) {
      return saved as DensityPreference
    }
  }
  return 'comfortable'
}
