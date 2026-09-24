import { computed, ref, watch } from 'vue'
import { readStoredValue, writeStoredValue } from './storage'

export type MotionPreference = 'full' | 'reduced' | 'none'

const storageKey = 'morya-ui-motion'
const legacyStorageKeys = ['wex-design-motion']
const motionPreferences: readonly MotionPreference[] = ['full', 'reduced', 'none']

const preference = ref<MotionPreference>(getInitialMotion())

export function applyMotion(preference: MotionPreference, target?: HTMLElement) {
  const el = target ?? (typeof document !== 'undefined' ? document.documentElement : undefined)
  if (!el) return
  el.dataset.mMotion = preference
}

/**
 * Kept for config compatibility. Component motion no longer reads the OS
 * `prefers-reduced-motion` media query; intensity follows `data-m-motion` only.
 */
export function applyReducedMotionPolicy(respect: boolean | undefined, target?: HTMLElement) {
  const el = target ?? (typeof document !== 'undefined' ? document.documentElement : undefined)
  if (!el) return
  if (respect === false) {
    el.dataset.mIgnoreReducedMotion = 'true'
  } else {
    delete el.dataset.mIgnoreReducedMotion
  }
}

/** Default library motion. Does not follow the OS reduced-motion setting. */
export function getPreferredMotion(): MotionPreference {
  return 'full'
}

function getInitialMotion(): MotionPreference {
  const saved = readStoredValue(storageKey, legacyStorageKeys)
  if (saved && motionPreferences.includes(saved as MotionPreference)) {
    return saved as MotionPreference
  }
  return getPreferredMotion()
}

if (typeof window !== 'undefined') {
  watch(
    preference,
    (next) => {
      applyMotion(next)
      writeStoredValue(storageKey, next, legacyStorageKeys)
    },
    { immediate: true },
  )
}

export function useMotion() {
  const isMotionEnabled = computed(() => preference.value !== 'none')

  function setMotion(next: MotionPreference) {
    preference.value = next
  }

  return { preference, isMotionEnabled, motionPreferences, setMotion }
}
