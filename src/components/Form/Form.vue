<script setup lang="ts">
import type { WiFormFieldRegistration } from './context'
import type { FormProps, FormValidateTrigger } from './types'
import { computed, provide, reactive, ref, toRaw, watch } from 'vue'
import { resolveSizeClass } from '../../shared/types'
import {
  WI_FORM_KEY,
  WI_FORM_ERRORS_KEY,
} from './context'

const props = withDefaults(defineProps<FormProps>(), {
  labelPosition: undefined,
  labelPlacement: undefined,
  labelAlign: 'left',
  inline: false,
  requireMark: true,
  disabled: false,
  validateOn: () => ['submit'] as FormValidateTrigger[],
})

const emit = defineEmits<{
  (event: 'submit', payload: { valid: boolean }): void
  (event: 'validate', payload: { valid: boolean; errors: Record<string, string> }): void
}>()

const fields = new Map<string, WiFormFieldRegistration>()
const internalErrors = reactive<Record<string, string>>({})
const initialSnapshot = ref<Record<string, unknown> | undefined>(undefined)

function cloneModel(model: Record<string, unknown>) {
  return JSON.parse(JSON.stringify(toRaw(model))) as Record<string, unknown>
}

watch(
  () => props.model,
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
const sizeClass = computed(() => (props.size ? resolveSizeClass(props.size) : undefined))

function setError(name: string, message?: string) {
  if (message) internalErrors[name] = message
  else delete internalErrors[name]
}

async function runField(name: string, trigger: FormValidateTrigger | 'all' = 'all'): Promise<boolean> {
  const field = fields.get(name)
  if (!field) return true
  const result = await field.validate(trigger)
  const message = typeof result === 'string' && result.trim() ? result.trim() : undefined
  setError(name, message)
  return !message
}

async function validate(name?: string) {
  if (name) {
    const valid = await runField(name, 'all')
    const errors = { ...internalErrors }
    emit('validate', { valid, errors })
    return { valid, errors }
  }
  const names = [...fields.keys()]
  const results = await Promise.all(names.map((fieldName) => runField(fieldName, 'all')))
  const valid = results.every(Boolean)
  const errors = { ...internalErrors }
  emit('validate', { valid, errors })
  return { valid, errors }
}

function clearValidate(name?: string) {
  if (name) setError(name, undefined)
  else Object.keys(internalErrors).forEach((key) => setError(key, undefined))
}

function resetModel(snapshot?: Record<string, unknown>) {
  if (!props.model || !snapshot) return
  for (const key of Object.keys(props.model)) {
    if (key in snapshot) props.model[key] = cloneModel({ [key]: snapshot[key] })[key]
    else delete props.model[key]
  }
  for (const key of Object.keys(snapshot)) {
    if (!(key in props.model)) props.model[key] = cloneModel({ [key]: snapshot[key] })[key]
  }
}

function reset() {
  resetModel(initialSnapshot.value)
  clearValidate()
}

function resetFields(names?: string | string[]) {
  const snapshot = initialSnapshot.value
  if (!props.model || !snapshot) return
  const list = names == null ? Object.keys(snapshot) : Array.isArray(names) ? names : [names]
  for (const name of list) {
    if (name in snapshot) props.model[name] = cloneModel({ [name]: snapshot[name] })[name]
  }
  if (names == null) clearValidate()
  else if (Array.isArray(names)) names.forEach((name) => clearValidate(name))
  else clearValidate(names)
}

function registerField(field: WiFormFieldRegistration) {
  fields.set(field.name, field)
}

function unregisterField(name: string) {
  fields.delete(name)
  setError(name, undefined)
}

function notifyBlur(name: string) {
  void runField(name, 'blur')
}

function notifyChange(name: string) {
  void runField(name, 'change')
}

function notifyInput(name: string) {
  void runField(name, 'input')
}

const context = computed(() => ({
  model: props.model,
  rules: props.rules,
  labelPosition: resolvedLabelPosition.value,
  labelAlign: props.labelAlign,
  labelWidth: props.labelWidth,
  requireMark: props.requireMark,
  disabled: props.disabled,
  size: props.size,
  validateOn: validateOn.value,
  registerField,
  unregisterField,
  notifyBlur,
  notifyChange,
  notifyInput,
}))

provide(WI_FORM_KEY, context)
provide(WI_FORM_ERRORS_KEY, internalErrors)

async function onSubmit() {
  if (validateOn.value.includes('submit')) {
    const { valid } = await validate()
    emit('submit', { valid })
    return
  }
  emit('submit', { valid: true })
}

defineExpose({ validate, clearValidate, reset, resetFields, errors: internalErrors })
</script>

<template>
  <form
    class="wi-form"
    :class="[
      `wi-form--label-${resolvedLabelPosition}`,
      `wi-form--align-${labelAlign}`,
      sizeClass ? `wi-form--size-${sizeClass}` : undefined,
      {
        'wi-form--disabled': disabled,
        'wi-form--inline': inline,
      },
    ]"
    :aria-disabled="disabled || undefined"
    @submit.prevent="onSubmit"
  >
    <fieldset class="wi-form__fieldset" :disabled="disabled">
      <slot />
    </fieldset>
  </form>
</template>
