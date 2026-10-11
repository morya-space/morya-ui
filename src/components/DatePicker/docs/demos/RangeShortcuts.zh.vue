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
  { label: '最近 7 天', value: () => [iso(daysAgo(6)), iso(new Date())] as [string, string] },
  { label: '最近 30 天', value: () => [iso(daysAgo(29)), iso(new Date())] as [string, string] },
  { label: '最近 90 天', value: () => [iso(daysAgo(89)), iso(new Date())] as [string, string] },
]

const monthShortcuts = [
  {
    label: '本月',
    value: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      return [iso(start), iso(now)] as [string, string]
    },
  },
  {
    label: '上月',
    value: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const end = new Date(now.getFullYear(), now.getMonth(), 0)
      return [iso(start), iso(end)] as [string, string]
    },
  },
  {
    label: '今年',
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
      label="最近 N 天"
      :shortcuts="recentShortcuts"
      help-text="匹配当前值的快捷键会高亮"
    />
    <MDatePicker
      v-model="month"
      type="daterange"
      label="按月 / 按年"
      :shortcuts="monthShortcuts"
    />
  </div>
</template>
