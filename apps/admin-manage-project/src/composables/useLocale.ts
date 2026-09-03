import { computed, ref } from 'vue'
import { enUS, zhCN } from '@well-insight/ui'

export type AppLocale = 'zh-CN' | 'en-US'
export type AppDensity = 'comfortable' | 'compact'

const localeStorageKey = 'edu-admin-locale'
const densityStorageKey = 'edu-admin-density'

function readLocale(): AppLocale {
  if (typeof localStorage === 'undefined') return 'zh-CN'
  const saved = localStorage.getItem(localeStorageKey)
  return saved === 'en-US' ? 'en-US' : 'zh-CN'
}

function readDensity(): AppDensity {
  if (typeof localStorage === 'undefined') return 'comfortable'
  return localStorage.getItem(densityStorageKey) === 'compact' ? 'compact' : 'comfortable'
}

const localeName = ref<AppLocale>(readLocale())
const density = ref<AppDensity>(readDensity())

export function useLocale() {
  const locale = computed(() => (localeName.value === 'en-US' ? enUS : zhCN))
  const isEnglish = computed(() => localeName.value === 'en-US')
  const isCompact = computed(() => density.value === 'compact')

  function toggleLocale() {
    localeName.value = localeName.value === 'zh-CN' ? 'en-US' : 'zh-CN'
    localStorage.setItem(localeStorageKey, localeName.value)
  }

  function toggleDensity() {
    density.value = density.value === 'compact' ? 'comfortable' : 'compact'
    localStorage.setItem(densityStorageKey, density.value)
  }

  function t(zh: string, en: string) {
    return localeName.value === 'en-US' ? en : zh
  }

  return {
    locale,
    localeName,
    isEnglish,
    density,
    isCompact,
    toggleLocale,
    toggleDensity,
    t,
  }
}
