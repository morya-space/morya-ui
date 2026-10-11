<script setup lang="ts">
import { MDatePicker } from 'morya-ui'
import { ref } from 'vue'

const date = ref<string | null>('2024-06-15')
</script>

<template>
  <div style="max-width: 32rem">
    <p style="margin: 0 0 8px; color: var(--m-color-text-muted); font-size: 13px">
      Use <code>:teleport="false"</code> with <code>append-to="self"</code> to render the panel inline — useful inside cards or custom layouts.
    </p>
    <div style="border: 1px solid var(--m-color-border); border-radius: 8px; padding: 16px; background: var(--m-color-surface)">
      <MDatePicker v-model="date" label="Inline panel" :teleport="false" append-to="self" />
    </div>
  </div>
</template>
