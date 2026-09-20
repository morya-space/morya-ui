<script setup lang="ts">
import { MLoading } from 'morya-ui'

const effects = [
  { id: 'circular', label: '圆环' },
  { id: 'aurora', label: '极光环' },
  { id: 'bounce', label: '弹跳球' },
  { id: 'wave', label: '波浪条' },
  { id: 'pulse', label: '脉冲环' },
  { id: 'stardust', label: '星尘' },
] as const
</script>

<template>
  <div class="grid grid-cols-2 gap-4 md:grid-cols-3">
    <div
      v-for="item in effects"
      :key="item.id"
      class="flex min-h-36 items-center justify-center rounded-md border border-solid border-[var(--m-color-border)] bg-[var(--m-color-surface)] p-4"
    >
      <MLoading :effect="item.id" :text="item.label" />
    </div>
  </div>
</template>
