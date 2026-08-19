<script setup lang="ts">
import { computed, inject, onBeforeUnmount, useId, watch } from 'vue'
import { useWdLocale } from '../../locale'
import { WD_FORM_ERRORS_KEY, WD_FORM_KEY } from './context'
import type { FormItemProps } from './types'

const props = withDefaults(defineProps<FormItemProps>(), {
  required: false,
  invalid: false,
})

const form = inject(WD_FORM_KEY, null)
const formErrors = inject(WD_FORM_ERRORS_KEY, null)
const locale = useWdLocale()
const autoId = useId()

const labelPosition = computed(() => props.labelPosition ?? form?.value.labelPosition ?? 'top')
const labelWidth = computed(() => props.labelWidth ?? form?.value.labelWidth)
const showRequireMark = computed(() => Boolean(props.required && (form?.value.requireMark ?? true)))
const fieldName = computed(() => props.name ?? props.for)
const internalError = computed(() => {
  const name = fieldName.value
  if (!name || !formErrors) return undefined
  return formErrors[name]
})
const displayError = computed(() => props.error ?? internalError.value)
const isInvalid = computed(() => props.invalid || Boolean(displayError.value))
const controlId = computed(() => props.for ?? `wd-form-item-${autoId}`)
const messageId = computed(() => `${controlId.value}-message`)
const requiredLabel = computed(() => locale.value.required)

const rootClass = computed(() => [
  'wd-form-item',
  `wd-form-item--label-${labelPosition.value}`,
  {
    'wd-form-item--invalid': isInvalid.value,
    'wd-form-item--required': props.required,
  },
])

const labelStyle = computed(() =>
  labelPosition.value === 'left' && labelWidth.value ? { width: labelWidth.value } : undefined,
)

watch(
  () => [fieldName.value, props.validate] as const,
  ([name, validate]) => {
    if (!form?.value || !name || !validate) return
    form.value.registerField({
      name,
      validate: async () => validate(),
    })
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  const name = fieldName.value
  if (name) form?.value.unregisterField(name)
})

function onFocusOut() {
  const name = fieldName.value
  if (name) form?.value.notifyBlur(name)
}

function onChange() {
  const name = fieldName.value
  if (name) form?.value.notifyChange(name)
}
</script>

<template>
  <div :class="rootClass" @focusout="onFocusOut" @change="onChange">
    <label
      v-if="label"
      class="wd-form-item__label"
      :for="controlId"
      :style="labelStyle"
    >
      <span v-if="showRequireMark" class="wd-form-item__required" :aria-label="requiredLabel">*</span>
      {{ label }}
    </label>
    <div class="wd-form-item__body">
      <div class="wd-form-item__control">
        <slot
          :id="controlId"
          :invalid="isInvalid"
          :described-by="displayError || help ? messageId : undefined"
          :error="displayError"
        />
      </div>
      <p
        v-if="displayError"
        :id="messageId"
        class="wd-form-item__error"
        role="alert"
      >
        {{ displayError }}
      </p>
      <p
        v-else-if="help"
        :id="messageId"
        class="wd-form-item__help"
      >
        {{ help }}
      </p>
    </div>
  </div>
</template>
