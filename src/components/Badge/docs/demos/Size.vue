<script setup lang="ts">
import { MBadge } from 'morya-ui'
</script>

<template>
  <div class="flex flex-wrap gap-3 items-center">
    <MBadge :value="8" size="small" />
    <MBadge :value="9" />
    <MBadge :value="10" size="large" />
  </div>
</template>
