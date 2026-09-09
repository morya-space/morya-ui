import type { ThemeName } from './index'
import { computed, ref, watch } from 'vue'
import { applyTheme, getPreferredTheme } from './index'
import { readStoredValue, writeStoredValue } from './storage'

const storageKey = 'morya-ui-theme'
const legacyStorageKeys = ['wex-design-theme']

const theme = ref<ThemeName>(getInitialTheme())
const isDark = computed(() => theme.value === 'dark')

function getInitialTheme(): ThemeName {
  const saved = readStoredValue(storageKey, legacyStorageKeys)
  if (saved === 'light' || saved === 'dark') return saved
  return getPreferredTheme()
}

if (typeof window !== 'undefined') {
  watch(
    theme,
    (next) => {
      applyTheme(next)
      writeStoredValue(storageKey, next, legacyStorageKeys)
    },
    { immediate: true },
  )
}

export function useTheme() {
  function setTheme(next: ThemeName) {
    theme.value = next
  }

  function toggleTheme() {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  return { theme, isDark, setTheme, toggleTheme }
}
