<script setup lang="ts">
import type { DataViewProps } from './types'
import { computed, ref, watch } from 'vue'
import WiPagination from '../Pagination/Pagination.vue'

const props = withDefaults(defineProps<DataViewProps>(), {
  value: () => [],
  layout: 'list',
  paginator: false,
  rows: 10,
})

const page = ref(1)

const pagedValue = computed(() => {
  if (!props.paginator) return props.value
  const start = (page.value - 1) * props.rows
  return props.value.slice(start, start + props.rows)
})

const rootClass = computed(() => [
  'wi-dataview',
  `wi-dataview--${props.layout}`,
])

watch(
  () => [props.value.length, props.rows, props.paginator] as const,
  () => {
    page.value = 1
  },
)
</script>

<template>
  <div :class="rootClass">
    <div class="wi-dataview__content">
      <slot v-if="layout === 'list'" name="list" :items="pagedValue">
        <ul class="wi-dataview__list">
          <li v-for="(item, index) in pagedValue" :key="index" class="wi-dataview__list-item">
            {{ item }}
          </li>
        </ul>
      </slot>
      <slot v-else name="grid" :items="pagedValue">
        <div class="wi-dataview__grid">
          <div v-for="(item, index) in pagedValue" :key="index" class="wi-dataview__grid-item">
            {{ item }}
          </div>
        </div>
      </slot>
    </div>
    <WiPagination
      v-if="paginator"
      v-model="page"
      class="wi-dataview__paginator"
      :total-records="value.length"
      :rows="rows"
    />
  </div>
</template>
