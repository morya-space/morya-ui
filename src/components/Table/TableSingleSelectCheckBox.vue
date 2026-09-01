<script setup lang="ts">
import { useWiLocale } from '../../locale'
import WiCheckbox from '../Checkbox/Checkbox.vue'

defineProps<{
  checked: boolean
  rowIndex: number
}>()

const emit = defineEmits<{ (event: 'change'): void }>()

const locale = useWiLocale()
</script>

<template>
  <div class="wi-table__checkbox-hit" @click.stop.prevent="emit('change')">
    <WiCheckbox
      :model-value="checked"
      :aria-label="locale.selectRow.replace('{index}', String(rowIndex))"
      tabindex="-1"
    />
  </div>
</template>
