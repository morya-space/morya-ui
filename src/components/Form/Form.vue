<script setup lang="ts">
import { computed, provide, reactive } from 'vue'
import {
  WI_FORM_ERRORS_KEY,
  WI_FORM_KEY,
  type WiFormFieldRegistration,
} from './context'
import type { FormProps, FormValidateTrigger } from './types'

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

const validateOn = computed<FormValidateTrigger[]>(() => {
  const value = props.validateOn
  return Array.isArray(value) ? value : [value]
})
const resolvedLabelPosition = computed(() => props.labelPosition ?? props.labelPlacement ?? 'top')

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

defineExpose({ validate, clearValidate, errors: internalErrors })
</script>

<template>
  <form
    class="wi-form"
    :class="[
      `wi-form--label-${resolvedLabelPosition}`,
      `wi-form--align-${labelAlign}`,
      {
        'wi-form--disabled': disabled,
        'wi-form--inline': inline,
      },
    ]"
    @submit.prevent="onSubmit"
  >
    <slot />
  </form>
</template>
