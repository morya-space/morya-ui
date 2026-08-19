<script setup lang="ts">
import { computed, provide, reactive } from 'vue'
import {
  WD_FORM_ERRORS_KEY,
  WD_FORM_KEY,
  type WdFormFieldRegistration,
} from './context'
import type { FormProps, FormValidateTrigger } from './types'

const props = withDefaults(defineProps<FormProps>(), {
  labelPosition: 'top',
  requireMark: true,
  disabled: false,
  validateOn: () => ['submit'] as FormValidateTrigger[],
})

const emit = defineEmits<{
  (event: 'submit', payload: { valid: boolean }): void
  (event: 'validate', payload: { valid: boolean; errors: Record<string, string> }): void
}>()

const fields = new Map<string, WdFormFieldRegistration>()
const internalErrors = reactive<Record<string, string>>({})

const validateOn = computed<FormValidateTrigger[]>(() => {
  const value = props.validateOn
  return Array.isArray(value) ? value : [value]
})

function setError(name: string, message?: string) {
  if (message) internalErrors[name] = message
  else delete internalErrors[name]
}

async function runField(name: string): Promise<boolean> {
  const field = fields.get(name)
  if (!field) return true
  const result = await field.validate()
  const message = typeof result === 'string' && result.trim() ? result.trim() : undefined
  setError(name, message)
  return !message
}

async function validate(name?: string) {
  if (name) {
    const valid = await runField(name)
    const errors = { ...internalErrors }
    emit('validate', { valid, errors })
    return { valid, errors }
  }
  const names = [...fields.keys()]
  const results = await Promise.all(names.map((fieldName) => runField(fieldName)))
  const valid = results.every(Boolean)
  const errors = { ...internalErrors }
  emit('validate', { valid, errors })
  return { valid, errors }
}

function clearValidate(name?: string) {
  if (name) setError(name, undefined)
  else Object.keys(internalErrors).forEach((key) => setError(key, undefined))
}

function registerField(field: WdFormFieldRegistration) {
  fields.set(field.name, field)
}

function unregisterField(name: string) {
  fields.delete(name)
  setError(name, undefined)
}

function notifyBlur(name: string) {
  if (validateOn.value.includes('blur')) void runField(name)
}

function notifyChange(name: string) {
  if (validateOn.value.includes('change')) void runField(name)
}

const context = computed(() => ({
  labelPosition: props.labelPosition,
  labelWidth: props.labelWidth,
  requireMark: props.requireMark,
  disabled: props.disabled,
  validateOn: validateOn.value,
  registerField,
  unregisterField,
  notifyBlur,
  notifyChange,
}))

provide(WD_FORM_KEY, context)
provide(WD_FORM_ERRORS_KEY, internalErrors)

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
    class="wd-form"
    :class="[
      `wd-form--label-${labelPosition}`,
      { 'wd-form--disabled': disabled },
    ]"
    @submit.prevent="onSubmit"
  >
    <slot />
  </form>
</template>
