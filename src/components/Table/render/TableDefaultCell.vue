<script setup lang="ts">
import { computed } from 'vue'
import MTooltip from '../../Tooltip/Tooltip.vue'
import { generateColumnContent } from '../core/utils'
import type { TableItem } from '../types'

const props = defineProps<{
  column: string
  item: TableItem
  showTooltip: boolean
}>()

const text = computed(() => generateColumnContent(props.column, props.item))
</script>

<template>
  <MTooltip
    v-if="showTooltip"
    :content="text"
  >
    <span class="m-table__tooltip-trigger">
      <span class="m-table__cell-text">{{ text }}</span>
    </span>
  </MTooltip>
  <span
    v-else
    class="m-table__cell-text"
  >{{ text }}</span>
</template>
