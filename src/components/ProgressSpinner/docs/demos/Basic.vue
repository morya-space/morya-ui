<script setup lang="ts">
import { MProgressSpinner } from 'morya-ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1.5rem;align-items:center">
    <MProgressSpinner />
    <MProgressSpinner stroke-width="4" animation-duration="0.6s" />
  </div>
</template>
