<script setup lang="ts">
import { MButton, MConfigProvider, MInput } from 'morya-ui'
</script>

<template>
  <div class="grid gap-4">
    <MConfigProvider density="compact">
      <div style="display:flex;gap:0.75rem;align-items:center">
        <MButton label="compact" />
        <MInput placeholder="compact" class="w-40" />
      </div>
    </MConfigProvider>
    <MConfigProvider density="spacious">
      <div style="display:flex;gap:0.75rem;align-items:center">
        <MButton label="spacious" />
        <MInput placeholder="spacious" class="w-40" />
      </div>
    </MConfigProvider>
  </div>
</template>
