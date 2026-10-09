<script setup lang="ts">
import { MBadge } from 'morya-ui'
</script>

<template>
  <div class="flex flex-wrap gap-3 items-center">
    <MBadge :value="1" />
    <MBadge :value="2" type="secondary" />
    <MBadge :value="3" type="success" />
    <MBadge :value="4" type="info" />
    <MBadge :value="5" type="warning" />
    <MBadge :value="6" type="danger" />
    <MBadge :value="7" type="contrast" />
  </div>
</template>
