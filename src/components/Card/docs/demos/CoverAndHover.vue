<script setup lang="ts">
import { MCard } from 'morya-ui'
</script>

<template>
  <MCard title="Cover card" hoverable size="small">
    <template #cover>
      <div style="height:6rem;background:color-mix(in srgb, var(--m-color-primary) 18%, transparent)" />
    </template>
    Hover to lift. Set `bordered` to false for a borderless surface.
  </MCard>
</template>
