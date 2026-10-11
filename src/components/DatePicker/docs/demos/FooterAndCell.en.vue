<script setup lang="ts">
import { MButton, MDatePicker, MTag } from 'morya-ui'
import { ref } from 'vue'

const value = ref<string | null>('2024-06-15')

const holidays = new Set(['2024-06-10', '2024-06-17'])

function pad(n: number) {
  return String(n).padStart(2, '0')
}
function iso(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}
function today(): string {
  return iso(new Date())
}
</script>

<template>
  <MDatePicker v-model="value" label="Footer + custom cell">
    <template #cell="{ date }">
      <span style="position: relative">
        {{ date.getDate() }}
        <span
          v-if="holidays.has(iso(date))"
          style="position: absolute; bottom: 2px; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; border-radius: 50%; background: var(--m-color-primary)"
        />
      </span>
    </template>
    <template #footer="{ close }">
      <MTag value="Dot = holiday" type="secondary" />
      <MButton size="small" @click="value = today(); close()">Today</MButton>
    </template>
  </MDatePicker>
</template>
