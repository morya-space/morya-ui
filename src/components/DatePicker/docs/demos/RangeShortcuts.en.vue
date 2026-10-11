<script setup lang="ts">
import { MDatePicker } from 'morya-ui'
import { ref } from 'vue'

const recent = ref<[string, string] | null>(null)
const month = ref<[string, string] | null>(null)

function iso(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function daysAgo(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

const recentShortcuts = [
  { label: 'Last 7 days', value: () => [iso(daysAgo(6)), iso(new Date())] as [string, string] },
  { label: 'Last 30 days', value: () => [iso(daysAgo(29)), iso(new Date())] as [string, string] },
  { label: 'Last 90 days', value: () => [iso(daysAgo(89)), iso(new Date())] as [string, string] },
]

const monthShortcuts = [
  {
    label: 'This month',
    value: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      return [iso(start), iso(now)] as [string, string]
    },
  },
  {
    label: 'Last month',
    value: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const end = new Date(now.getFullYear(), now.getMonth(), 0)
      return [iso(start), iso(end)] as [string, string]
    },
  },
  {
    label: 'Year to date',
    value: () => {
      const now = new Date()
      return [`${now.getFullYear()}-01-01`, iso(now)] as [string, string]
    },
  },
]
</script>

<template>
  <div style="display: grid; gap: 12px; max-width: 32rem">
    <MDatePicker
      v-model="recent"
      type="daterange"
      label="Recent N days"
      :shortcuts="recentShortcuts"
      help-text="Shortcuts matching the current value get highlighted"
    />
    <MDatePicker
      v-model="month"
      type="daterange"
      label="By month / year"
      :shortcuts="monthShortcuts"
    />
  </div>
</template>
