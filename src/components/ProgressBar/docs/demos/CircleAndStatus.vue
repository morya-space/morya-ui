<script setup lang="ts">
import { MProgressBar } from 'morya-ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1.5rem;align-items:center">
    <MProgressBar :value="72" type="circle" status="success" />
    <MProgressBar :value="40" status="warn" />
  </div>
</template>
