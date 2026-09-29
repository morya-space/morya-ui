<script setup lang="ts">
import type { FormListProps } from './FormList.types'
import type { NamePathKey } from './paths'
import type { FormItemRule, FormValidateTrigger } from './types'
import { computed, inject, onBeforeUnmount, ref, useAttrs, watch } from 'vue'
import { useMLocale } from '../../locale'
import { useRootParts } from '../../shared/useComponentAttrs'
import { M_FORM_KEY } from './context'
import { getPathValue, pathKey, setPathValue, toPath } from './paths'
import { evaluateFormRule, normalizeFormRules, ruleMatchesTrigger } from './rules'

defineOptions({ inheritAttrs: false, name: 'MFormList' })

const props = withDefaults(defineProps<FormListProps>(), {
  rules: undefined,
  initialValue: undefined,
  pt: undefined,
})

const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)
const form = inject(M_FORM_KEY, null)
const locale = useMLocale()

const fieldPath = computed<NamePathKey[]>(() => toPath(props.name))
const fieldKey = computed(() => pathKey(fieldPath.value))

const listValue = computed<unknown>(() => getPathValue(form?.value.model, fieldPath.value))

/** Stable keys so reordering does not remount row components. */
const keys = ref<string[]>([])
let keySeed = 0

function ensureKeys() {
  const value = listValue.value
  const length = Array.isArray(value) ? value.length : 0

  if (keys.value.length === length) return
  if (keys.value.length < length) {
    const next = [...keys.value]
    while (next.length < length) next.push(`m-form-list-${keySeed++}`)
    keys.value = next
    return
  }
  keys.value = keys.value.slice(0, length)
}

watch(listValue, ensureKeys, { immediate: true, deep: true })

const fields = computed(() => {
  const value = listValue.value
  const length = Array.isArray(value) ? value.length : 0
  return Array.from({ length }, (_item, index) => ({
    key: keys.value[index] ?? `m-form-list-${index}`,
    name: index,
  }))
})

/** Get (or create) the array stored at `name`. */
function ensureArray(): unknown[] {
  const model = form?.value.model
  if (!model) return []

  const existing = getPathValue(model, fieldPath.value)
  if (Array.isArray(existing)) return existing

  setPathValue(model, fieldPath.value, [])
  const created = getPathValue(model, fieldPath.value)
  return Array.isArray(created) ? created : []
}

function resolveInitialValue(): unknown {
  const value = props.initialValue
  if (typeof value === 'function') return (value as () => unknown)()
  if (value != null && typeof value === 'object') return JSON.parse(JSON.stringify(value))
  return value ?? ''
}

/** Append a row. */
function add(value?: unknown) {
  ensureArray().push(value === undefined ? resolveInitialValue() : value)
}

/** Remove the row at `index`. */
function remove(index: number) {
  const list = ensureArray()
  if (index < 0 || index >= list.length) return
  list.splice(index, 1)
  keys.value.splice(index, 1)
}

/** Move a row from one position to another. */
function move(from: number, to: number) {
  const list = ensureArray()
  if (from === to) return
  if (from < 0 || to < 0 || from >= list.length || to >= list.length) return

  const [item] = list.splice(from, 1)
  list.splice(to, 0, item)

  const [key] = keys.value.splice(from, 1)
  if (key !== undefined) keys.value.splice(to, 0, key)
}

const mergedRules = computed<FormItemRule[]>(() => normalizeFormRules(props.rules))
const ruleMessages = computed(() => ({
  required: locale.value.required,
  invalidValue: locale.value.invalidValue,
  invalidEmail: locale.value.invalidEmail,
  invalidUrl: locale.value.invalidUrl,
  invalidDate: locale.value.invalidDate,
}))

// The list itself participates in validation (e.g. "at least one row").
watch(
  () => [fieldKey.value, mergedRules.value] as const,
  () => {
    if (!form?.value || !fieldKey.value || mergedRules.value.length === 0) return
    form.value.registerField({
      key: fieldKey.value,
      name: fieldPath.value,
      validate: async (trigger: FormValidateTrigger | 'all' = 'all') => {
        const triggers = form?.value.validateOn ?? ['submit']
        for (const rule of mergedRules.value) {
          if (!ruleMatchesTrigger(rule, trigger, triggers)) continue
          const message = await evaluateFormRule(rule, listValue.value, ruleMessages.value)
          if (!message || rule.warningOnly) continue
          return { message }
        }
        return {}
      },
    })
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (fieldKey.value) form?.value.unregisterField(fieldKey.value)
})
</script>

<template>
  <div v-bind="rootAttrs" class="m-form-list">
    <slot
      :fields="fields"
      :add="add"
      :remove="remove"
      :move="move"
      :path="fieldPath"
    />
  </div>
</template>
