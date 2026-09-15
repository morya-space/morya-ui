<script setup lang="ts">
import { MProgressBar } from 'morya-ui'
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(28rem,100%)">
    <MProgressBar :value="35" />
    <MProgressBar :value="70" :show-value="false" />
    <MProgressBar mode="indeterminate" />
  </div>
</template>
