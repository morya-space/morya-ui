import type { MLocaleConfig, MLocaleMessages } from './types'
import { computed } from 'vue'
import { useMConfig } from '../shared/config'
import { zhCN } from './zh-CN'

export { enUS } from './en-US'
export type { MLocaleConfig, MLocaleMessages, MLocaleName } from './types'
export { zhCN } from './zh-CN'

export function formatLocale(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ''))
}

export function mergeLocale(locale?: MLocaleConfig): MLocaleMessages {
  return {
    ...zhCN,
    ...locale,
    name: locale?.name ?? zhCN.name,
    weekdays: locale?.weekdays?.length === 7 ? locale.weekdays : zhCN.weekdays,
    monthNames: locale?.monthNames?.length === 12 ? locale.monthNames : zhCN.monthNames,
  }
}

export function useMLocale() {
  const config = useMConfig()
  return computed(() => mergeLocale(config.value.locale))
}
