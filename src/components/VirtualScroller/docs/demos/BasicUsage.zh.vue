<script setup lang="ts">
import { MVirtualScroller } from 'morya-ui'

const items = Array.from({ length: 1000 }, (_, i) => `行 ${i + 1}`)
</script>

<template>
  <MVirtualScroller :items="items" :item-size="36" :height="220">
    <template #item="{ item, index }">
      <div style="padding:0 0.75rem;display:flex;align-items:center;height:100%;border-bottom:1px solid var(--m-color-border)">
        {{ item }} <span style="margin-left:auto;color:var(--m-color-text-muted);font-size:0.75rem">#{{ index }}</span>
      </div>
    </template>
  </MVirtualScroller>
</template>
