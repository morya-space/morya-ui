<script setup lang="ts">
import { MCard, MTag } from 'morya-ui'
</script>

<template>
  <MCard>
    <template #header>
      <div style="display:flex;align-items:center;justify-content:space-between;width:100%;gap:1rem">
        <strong>Custom header</strong>
        <MTag value="Active" severity="success" />
      </div>
    </template>
    Prefer the header slot when you need more than title/subtitle text.
  </MCard>
</template>
