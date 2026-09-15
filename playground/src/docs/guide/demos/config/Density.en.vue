<script setup lang="ts">
import { MButton, MConfigProvider, MInput } from 'morya-ui'
import { ref } from 'vue'

const density = ref<'compact' | 'comfortable' | 'spacious'>('compact')
</script>

<template>
  <div class="grid gap-3">
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
      <MButton
        v-for="item in (['compact', 'comfortable', 'spacious'] as const)"
        :key="item"
        :label="item"
        :outlined="density !== item"
        size="small"
        @click="density = item"
      />
    </div>
    <MConfigProvider :density="density" :global-density="false">
      <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;padding:0.75rem;border:1px solid var(--m-color-border);border-radius:var(--m-radius-md)">
        <MButton label="Save" />
        <MInput placeholder="Nickname" class="w-48" />
      </div>
    </MConfigProvider>
  </div>
</template>
