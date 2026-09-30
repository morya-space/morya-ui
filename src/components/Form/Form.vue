<script setup lang="ts">
import type { MFormFieldRegistration } from './context'
import type { NamePath } from './paths'
import type { FormProps, FormScrollToFieldOptions, FormValidateTrigger } from './types'
import type { FormInstance, FormInstanceApi } from './useForm'
import { computed, onBeforeUnmount, provide, reactive, ref, toRaw, useAttrs, watch } from 'vue'
import { resolveSizeClass } from '../../shared/types'
import { useRootParts } from '../../shared/useComponentAttrs'
import {
  M_FORM_ERRORS_KEY,
  M_FORM_KEY,
  M_FORM_WARNINGS_KEY,
} from './context'
import { getPathValue, pathContains, setPathValue, toKey, toPath } from './paths'
import { bindFormInstance } from './useForm'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<FormProps>(), {
  labelPosition: undefined,
  labelPlacement: undefined,
  labelAlign: 'left',
  inline: false,
  requireMark: undefined,
  requiredMark: undefined,
  disabled: false,
  scrollToFirstError: false,
  validateOn: () => ['submit'] as FormValidateTrigger[],
})

const emit = defineEmits<{
  (event: 'submit', payload: { valid: boolean }): void
  (event: 'validate', payload: { valid: boolean; errors: Record<string, string>; warnings: Record<string, string> }): void
}>()
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const formRoot = ref<HTMLFormElement | null>(null)
const fields = new Map<string, MFormFieldRegistration>()
const internalErrors = reactive<Record<string, string>>({})
const internalWarnings = reactive<Record<string, string>>({})
const initialSnapshot = ref<Record<string, unknown> | undefined>(undefined)

/** Fallback store used when no `model` prop is provided. */
const internalModel = reactive<Record<string, unknown>>({})

const activeModel = computed<Record<string, unknown>>(
  () => (props.model as Record<string, unknown> | undefined) ?? internalModel,
)

function cloneModel(model: Record<string, unknown>) {
  return JSON.parse(JSON.stringify(toRaw(model))) as Record<string, unknown>
}

// `initialValues` seeds the model once, before the first snapshot is taken.
if (props.initialValues) {
  for (const [key, value] of Object.entries(props.initialValues)) {
    setPathValue(activeModel.value, toPath(key), value)
  }
}

watch(
  activeModel,
  (model) => {
    if (model && initialSnapshot.value == null) {
      initialSnapshot.value = cloneModel(model)
    }
  },
  { immediate: true, deep: true },
)

const validateOn = computed<FormValidateTrigger[]>(() => {
  const value = props.validateOn
  return Array.isArray(value) ? value : [value]
})
const resolvedLabelPosition = computed(() => props.labelPosition ?? props.labelPlacement ?? 'top')
const resolvedRequireMark = computed(() => {
  if (props.requireMark !== undefined) return props.requireMark
  if (props.requiredMark !== undefined) return props.requiredMark
  return true
})
const sizeClass = computed(() => (props.size ? resolveSizeClass(props.size) : undefined))

/** Clear (or set) a field's error message. Passing nothing clears both stores. */
function setError(key: string, message?: string) {
  if (message) internalErrors[key] = message
  else {
    delete internalErrors[key]
    delete internalWarnings[key]
  }
}

/** Apply a validation outcome for one field. */
function applyOutcome(key: string, message: string | undefined, warning = false) {
  if (!message) {
    setError(key)
    return
  }
  if (warning) {
    internalWarnings[key] = message
    delete internalErrors[key]
    return
  }
  internalErrors[key] = message
  delete internalWarnings[key]
}

/**
 * Accept a single name or a list of names. An array is treated as a list of
 * names, so a nested path used on its own must be wrapped: `validate([['items', 0]])`.
 */
function normalizeNameList(input?: NamePath | NamePath[]): NamePath[] | undefined {
  if (input == null) return undefined
  if (typeof input === 'string' || typeof input === 'number') return [input]
  return input as NamePath[]
}

/** Field keys matching a name list (a path matches itself and everything nested under it). */
function resolveFieldKeys(nameList?: NamePath[]): string[] {
  if (!nameList || nameList.length === 0) return [...fields.keys()]

  const requested = nameList.map((name) => toPath(name))
  return [...fields.keys()].filter((key) => {
    const field = fields.get(key)
    if (!field) return false
    const fieldPath = toPath(field.name)
    return requested.some(
      (path) => pathContains(fieldPath, path) || pathContains(path, fieldPath),
    )
  })
}

function resolveScrollOptions(
  options?: boolean | FormScrollToFieldOptions,
): FormScrollToFieldOptions | undefined {
  if (options === false || options == null) return undefined
  if (options === true) return { behavior: 'smooth', block: 'center' }
  return { behavior: 'smooth', block: 'center', ...options }
}

function scrollToField(name: string, options?: FormScrollToFieldOptions) {
  const root = formRoot.value
  if (!root || !name) return
  const selector = `[data-m-field="${CSS.escape(name)}"]`
  const el = root.querySelector<HTMLElement>(selector)
  if (!el) return
  const scrollOptions = resolveScrollOptions(options ?? true)
  if (scrollOptions) {
    const { focus: _focus, ...intoView } = scrollOptions
    el.scrollIntoView(intoView)
  }
  if (options?.focus) {
    const focusable = el.querySelector<HTMLElement>(
      'input:not([type="hidden"]), textarea, select, button, [tabindex]:not([tabindex="-1"])',
    )
    focusable?.focus({ preventScroll: true })
  }
}

function scrollToFirstError(options?: FormScrollToFieldOptions) {
  const order = [...fields.keys()]
  const first = order.find((name) => Boolean(internalErrors[name]))
    ?? Object.keys(internalErrors)[0]
  if (first) scrollToField(first, options)
}

function maybeScrollAfterValidate(valid: boolean) {
  if (valid || !props.scrollToFirstError) return
  scrollToFirstError(resolveScrollOptions(props.scrollToFirstError))
}

async function runField(key: string, trigger: FormValidateTrigger | 'all' = 'all'): Promise<boolean> {
  const field = fields.get(key)
  if (!field) return true
  const outcome = await field.validate(trigger)
  const message = outcome.message?.trim() || undefined
  applyOutcome(key, message, outcome.warning)
  // Warning-only failures do not make the form invalid.
  return !message || Boolean(outcome.warning)
}

async function validate(input?: NamePath | NamePath[]) {
  const keys = resolveFieldKeys(normalizeNameList(input))
  const results = await Promise.all(keys.map((key) => runField(key, 'all')))
  const valid = results.every(Boolean)
  const errors = { ...internalErrors }
  const warnings = { ...internalWarnings }
  emit('validate', { valid, errors, warnings })
  maybeScrollAfterValidate(valid)
  return { valid, errors, warnings }
}

function clearValidate(input?: NamePath | NamePath[]) {
  for (const key of resolveFieldKeys(normalizeNameList(input))) setError(key)
}

function resetModel(snapshot?: Record<string, unknown>) {
  if (!snapshot) return
  const model = activeModel.value

  for (const key of Object.keys(model)) {
    if (!(key in snapshot)) delete model[key]
  }
  for (const key of Object.keys(snapshot)) {
    model[key] = cloneModel({ [key]: snapshot[key] })[key]
  }
}

function reset() {
  resetModel(initialSnapshot.value)
  clearValidate()
}

function resetFields(input?: NamePath | NamePath[]) {
  const snapshot = initialSnapshot.value
  if (!snapshot) return

  const nameList = normalizeNameList(input)
  if (nameList == null || nameList.length === 0) {
    reset()
    return
  }

  const model = activeModel.value
  for (const path of nameList.map((name) => toPath(name))) {
    const value = getPathValue(snapshot, path)
    if (value === undefined) continue
    setPathValue(model, path, cloneModel({ value }).value)
  }
  clearValidate(nameList)
}

function registerField(field: MFormFieldRegistration) {
  fields.set(field.key, field)
}

function unregisterField(key: string) {
  fields.delete(key)
  setError(key)
}

function notifyBlur(key: string) {
  void runField(key, 'blur')
}

function notifyChange(key: string) {
  void runField(key, 'change')
}

function notifyInput(key: string) {
  void runField(key, 'input')
}

function revalidate(key: string) {
  void runField(key, 'all')
}

const context = computed(() => ({
  model: activeModel.value,
  rules: props.rules,
  labelPosition: resolvedLabelPosition.value,
  labelAlign: props.labelAlign,
  labelWidth: props.labelWidth,
  requireMark: resolvedRequireMark.value,
  disabled: props.disabled,
  size: props.size,
  validateOn: validateOn.value,
  registerField,
  unregisterField,
  notifyBlur,
  notifyChange,
  notifyInput,
  revalidate,
}))

provide(M_FORM_KEY, context)
provide(M_FORM_ERRORS_KEY, internalErrors)
provide(M_FORM_WARNINGS_KEY, internalWarnings)

/** Imperative API bound to a `useForm()` instance. */
const api: FormInstanceApi = {
  getFieldValue: name => getPathValue(activeModel.value, toPath(name)),
  getFieldsValue: () => cloneModel(activeModel.value),
  setFieldValue: (name, value) => setPathValue(activeModel.value, toPath(name), value),
  validate: nameList => validate(nameList),
  clearValidate: nameList => clearValidate(nameList),
  resetFields: nameList => resetFields(nameList),
  reset: () => reset(),
  scrollToField: (name, options) => scrollToField(toKey(name), options),
  scrollToFirstError: options => scrollToFirstError(options),
  getErrors: () => ({ ...internalErrors }),
  getWarnings: () => ({ ...internalWarnings }),
}

let unbindForm: (() => void) | null = null

watch(
  () => props.form,
  (instance) => {
    unbindForm?.()
    unbindForm = instance ? bindFormInstance(instance as FormInstance, api) : null
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  unbindForm?.()
  unbindForm = null
})

async function onSubmit() {
  if (validateOn.value.includes('submit')) {
    const { valid } = await validate()
    emit('submit', { valid })
    return
  }
  emit('submit', { valid: true })
}

defineExpose({
  ...api,
  errors: internalErrors,
  warnings: internalWarnings,
})
</script>

<template>
  <form
    ref="formRoot"
    v-bind="rootAttrs"
    class="m-form"
    :class="[
      `m-form--label-${resolvedLabelPosition}`,
      `m-form--align-${labelAlign}`,
      sizeClass ? `m-form--size-${sizeClass}` : undefined,
      {
        'm-form--disabled': disabled,
        'm-form--inline': inline,
      },
    ]"
    :aria-disabled="disabled || undefined"
    @submit.prevent="onSubmit"
  >
    <fieldset class="m-form__fieldset" :disabled="disabled">
      <slot />
    </fieldset>
  </form>
</template>
