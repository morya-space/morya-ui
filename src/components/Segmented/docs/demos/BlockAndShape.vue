<script setup lang="ts">
import type { IconName } from '../../../Icon/types'
import type { SegmentedOption } from '../../types'
import { MSegmented } from 'morya-ui'
import { ref } from 'vue'

const value = ref('list')
const options: SegmentedOption[] = [
  { label: 'List', value: 'list', icon: 'list' as IconName },
  { label: 'Kanban', value: 'kanban', icon: 'table' as IconName },
  { label: 'Calendar', value: 'calendar', icon: 'calendar' as IconName },
]
</script>

<template>
  <MSegmented
    v-model="value"
    :options="options"
    block
    shape="round"
  />
</template>
