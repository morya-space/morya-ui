<script setup lang="ts">
import { MBadge } from 'morya-ui'
</script>

<template>
  <div class="flex flex-wrap gap-3 items-center">
    <MBadge :value="2" />
    <MBadge value="New" />
    <MBadge />
  </div>
</template>
