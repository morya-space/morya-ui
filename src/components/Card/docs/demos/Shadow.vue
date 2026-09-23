<script setup lang="ts">
import { MCard } from 'morya-ui'
</script>

<template>
  <div style="display:grid;gap:var(--m-space-4);max-width:28rem;padding:var(--m-space-2)">
    <MCard title="Flat (default)" shadow="never">
      Flat surface; use `shadow="hover"` when you want elevation on interaction only.
    </MCard>
    <MCard title="Hover shadow" shadow="hover">
      Same elevation as `always`, shown only on hover (`--m-card-shadow-rest`).
    </MCard>
    <MCard title="Always elevated" shadow="always">
      Resting shadow (`--m-card-shadow-rest` → `--m-shadow-raised`); use for dashboard modules.
    </MCard>
  </div>
</template>
