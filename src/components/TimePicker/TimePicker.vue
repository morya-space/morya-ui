<script setup lang="ts">
import type { TimePickerEmits, TimePickerProps } from './types'
import { useAttrs } from 'vue'
import MDatePicker from '../DatePicker/DatePicker.vue'

defineOptions({ inheritAttrs: false, name: 'MTimePicker' })

const props = withDefaults(defineProps<TimePickerProps>(), {
  modelValue: null,
  disabled: false,
  invalid: false,
  clearable: true,
  showSeconds: false,
  teleport: true,
  format: 'HH:mm',
})

const emit = defineEmits<TimePickerEmits>()
const attrs = useAttrs()
</script>

<template>
  <MDatePicker
    v-bind="{ ...attrs, ...props }"
    type="time"
    @update:model-value="emit('update:modelValue', $event)"
    @clear="emit('clear')"
    @show="emit('show')"
    @hide="emit('hide')"
    @change="emit('change', $event)"
  />
</template>
