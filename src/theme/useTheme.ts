import type { ThemeName } from './index'
import { computed, ref, watch } from 'vue'
import { applyTheme, getPreferredTheme } from './index'

const storageKey = 'wex-design-theme'

export function useTheme() {
  const theme = ref<ThemeName>(getInitialTheme())
  const isDark = computed(() => theme.value === 'dark')

  function setTheme(next: ThemeName) {
    theme.value = next
  }

  function toggleTheme() {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  watch(theme, (next) => {
    applyTheme(next)
    if (typeof localStorage !== 'undefined') localStorage.setItem(storageKey, next)
  }, { immediate: true })

  return { theme, isDark, setTheme, toggleTheme }
}

function getInitialTheme(): ThemeName {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem(storageKey)
    if (saved === 'light' || saved === 'dark') return saved
  }
  return getPreferredTheme()
}
