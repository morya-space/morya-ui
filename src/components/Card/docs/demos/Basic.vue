<script setup lang="ts">
import { MButton, MCard } from 'morya-ui'
</script>

<template>
  <MCard title="Project overview" subtitle="Updated 2 hours ago">
    <p style="margin:0;color:var(--m-color-text-muted)">
      Title and subtitle align in the header. Body content stays in the default slot.
    </p>
    <template #footer>
      <div style="display:flex;gap:0.75rem;justify-content:flex-end;width:100%">
        <MButton label="Dismiss" severity="secondary" text />
        <MButton label="Continue" />
      </div>
    </template>
  </MCard>
</template>
