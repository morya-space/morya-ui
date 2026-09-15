<script setup lang="ts">
import { MInput } from 'morya-ui'
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(24rem,100%)">
    <MInput size="small" label="Small" placeholder="Small" />
    <MInput label="Normal" placeholder="Normal" />
    <MInput size="large" label="Large" placeholder="Large" />
  </div>
</template>
