<script setup lang="ts">
import type { MultipleSelectStatus } from './hooks'
import { computed } from 'vue'
import { useWiLocale } from '../../locale'
import WiCheckbox from '../Checkbox/Checkbox.vue'

const props = defineProps<{
  status: MultipleSelectStatus
}>()

const emit = defineEmits<{ (event: 'change', value: boolean): void }>()

const locale = useWiLocale()
const checked = computed(() => props.status === 'allSelected')
const indeterminate = computed(() => props.status === 'partSelected')

function onToggle() {
  emit('change', !checked.value)
}
</script>

<template>
  <div class="wi-table__checkbox-hit" @click.stop.prevent="onToggle">
    <WiCheckbox
      :model-value="checked"
      :indeterminate="indeterminate"
      :aria-label="locale.selectAllPage"
      tabindex="-1"
    />
  </div>
</template>
