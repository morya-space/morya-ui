import { computed, ref, watch } from 'vue'

export type MotionPreference = 'full' | 'reduced' | 'none'

const storageKey = 'well-insight-motion'
const motionPreferences: readonly MotionPreference[] = ['full', 'reduced', 'none']

export function applyMotion(preference: MotionPreference, target: HTMLElement = document.documentElement) {
  target.dataset.wiMotion = preference
}

export function getPreferredMotion(): MotionPreference {
  return 'full'
}

export function useMotion() {
  const preference = ref<MotionPreference>(getInitialMotion())
  const isMotionEnabled = computed(() => preference.value !== 'none')

  function setMotion(next: MotionPreference) {
    preference.value = next
  }

  watch(preference, (next) => {
    applyMotion(next)
    if (typeof localStorage !== 'undefined') localStorage.setItem(storageKey, next)
  }, { immediate: true })

  return { preference, isMotionEnabled, motionPreferences, setMotion }
}

function getInitialMotion(): MotionPreference {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem(storageKey)
    if (saved && motionPreferences.includes(saved as MotionPreference)) return saved as MotionPreference
  }
  return getPreferredMotion()
}
