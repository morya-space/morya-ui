<script setup lang="ts">
import { MProgressBar } from 'morya-ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1.5rem;align-items:center;width:100%">
    <MProgressBar :value="72" type="circle" status="success" />
    <MProgressBar :value="40" status="warning" style="flex:1;min-width:12rem" />
    <MProgressBar :value="50" status="active" style="flex:1;min-width:12rem" />
    <MProgressBar :value="70" status="exception" style="flex:1;min-width:12rem" />
  </div>
</template>
