<script setup lang="ts">
import type { FloatLabelProps } from './types'
import { onMounted, ref, useAttrs } from 'vue'
import { useRootParts } from '../../shared/useComponentAttrs'
import { useMId } from '../../shared/useMId'

defineOptions({ inheritAttrs: false })

const props = defineProps<FloatLabelProps>()
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const root = ref<HTMLElement | null>(null)
const inputId = useMId()
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
  <span ref="root" v-bind="rootAttrs" class="m-float-label">
    <slot />
    <label v-if="props.label || $slots.label" :for="labelFor">
      <slot name="label">{{ props.label }}</slot>
    </label>
  </span>
</template>
