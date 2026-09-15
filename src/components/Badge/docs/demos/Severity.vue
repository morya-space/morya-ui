<script setup lang="ts">
import { MBadge } from 'morya-ui'
</script>

<template>
  <div class="flex flex-wrap gap-3 items-center">
    <MBadge :value="1" />
    <MBadge :value="2" severity="secondary" />
    <MBadge :value="3" severity="success" />
    <MBadge :value="4" severity="info" />
    <MBadge :value="5" severity="warn" />
    <MBadge :value="6" severity="danger" />
    <MBadge :value="7" severity="contrast" />
  </div>
</template>
