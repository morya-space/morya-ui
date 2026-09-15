<script setup lang="ts">
import { MConfigProvider, MInput, MTextarea } from 'morya-ui'
</script>

<template>
  <div style="display:grid;gap:1rem;grid-template-columns:1fr 1fr">
    <MConfigProvider input-variant="outlined">
      <p style="margin:0 0 0.5rem;font-size:0.75rem;color:var(--m-color-text-muted)">
        outlined
      </p>
      <div style="display:grid;gap:0.5rem">
        <MInput placeholder="Outlined input" />
        <MTextarea placeholder="Outlined textarea" :rows="2" />
      </div>
    </MConfigProvider>
    <MConfigProvider input-variant="filled">
      <p style="margin:0 0 0.5rem;font-size:0.75rem;color:var(--m-color-text-muted)">
        filled
      </p>
      <div style="display:grid;gap:0.5rem">
        <MInput placeholder="Filled input" />
        <MTextarea placeholder="Filled textarea" :rows="2" />
      </div>
    </MConfigProvider>
  </div>
</template>
