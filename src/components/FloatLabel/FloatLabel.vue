<script setup lang="ts">
import type { FloatLabelProps } from './types'
import { onMounted, ref } from 'vue'
import { useRdId } from '../../shared/useRdId'

const props = defineProps<FloatLabelProps>()

const root = ref<HTMLElement | null>(null)
const inputId = useRdId()
const labelFor = ref<string | undefined>(undefined)

onMounted(() => {
  const control = root.value?.querySelector<HTMLElement>(
    'input, textarea, select, [role="combobox"], [role="spinbutton"]',
  )
  if (!control) return
  if (!control.id) control.id = inputId
  labelFor.value = control.id
})
</script>

<template>
  <span ref="root" class="rd-float-label">
    <slot />
    <label v-if="props.label || $slots.label" :for="labelFor">
      <slot name="label">{{ props.label }}</slot>
    </label>
  </span>
</template>
