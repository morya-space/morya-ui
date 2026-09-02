import { computed, ref } from 'vue'
import { enUS, zhCN } from '@well-insight/ui'

export type AppLocale = 'zh-CN' | 'en-US'

const storageKey = 'edu-admin-locale'

function readLocale(): AppLocale {
  if (typeof localStorage === 'undefined') return 'zh-CN'
  const saved = localStorage.getItem(storageKey)
  return saved === 'en-US' ? 'en-US' : 'zh-CN'
}

const localeName = ref<AppLocale>(readLocale())

export function useLocale() {
  const locale = computed(() => (localeName.value === 'en-US' ? enUS : zhCN))
  const isEnglish = computed(() => localeName.value === 'en-US')
  const density = ref<'default' | 'compact'>('default')

  function toggleLocale() {
    localeName.value = localeName.value === 'zh-CN' ? 'en-US' : 'zh-CN'
    localStorage.setItem(storageKey, localeName.value)
  }

  function t(zh: string, en: string) {
    return localeName.value === 'en-US' ? en : zh
  }

  return { locale, localeName, isEnglish, density, toggleLocale, t }
}
