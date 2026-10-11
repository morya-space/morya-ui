<script setup lang="ts">
import { MButton, MDatePicker, MIcon } from 'morya-ui'
import { ref } from 'vue'

const date1 = ref<string | null>('2024-06-15')
const date2 = ref<string | null>(null)
</script>

<template>
  <div style="display: grid; gap: 16px; max-width: 32rem">
    <MDatePicker v-model="date1" label="按钮触发器">
      <template #trigger="{ value }">
        <MButton type="default" size="small">
          <MIcon name="calendar" size="sm" style="margin-right: 4px" />
          {{ value || '选择日期' }}
        </MButton>
      </template>
    </MDatePicker>

    <MDatePicker v-model="date2" label="纯图标触发器">
      <template #trigger="{ value }">
        <button
          type="button"
          style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; border: 1px solid var(--m-color-border); border-radius: var(--m-radius-control); background: var(--m-color-surface); cursor: pointer"
        >
          <MIcon name="calendar" size="sm" />
          <span v-if="value">{{ value }}</span>
          <span v-else style="color: var(--m-color-text-muted)">未选择</span>
        </button>
      </template>
    </MDatePicker>
  </div>
</template>
