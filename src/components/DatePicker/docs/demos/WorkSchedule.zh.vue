<script setup lang="ts">
import { MDatePicker, MTag } from 'morya-ui'
import { computed, ref } from 'vue'

const selectedDates = ref<string[]>([])

const sorted = computed(() =>
  [...selectedDates.value].sort((a, b) => (a < b ? -1 : 1)),
)

const weekdayMap = ['日', '一', '二', '三', '四', '五', '六']
function formatDay(iso: string) {
  const d = new Date(iso)
  return `${iso.slice(5)} 周${weekdayMap[d.getDay()]}`
}
</script>

<template>
  <div style="display: grid; gap: 12px; max-width: 32rem">
    <MDatePicker
      v-model="selectedDates"
      label="选择排班日期"
      multiple
      help-text="点击切换选中；可跨月选择多天"
    />
    <div v-if="sorted.length" style="display: flex; flex-wrap: wrap; gap: 6px">
      <MTag v-for="iso in sorted" :key="iso" :value="formatDay(iso)" type="primary" />
    </div>
    <p v-else style="color: var(--m-color-text-muted); font-size: 13px; margin: 0">
      尚未选择任何日期
    </p>
  </div>
</template>
