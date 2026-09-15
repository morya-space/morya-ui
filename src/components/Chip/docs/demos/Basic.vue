<script setup lang="ts">
import { MChip } from 'morya-ui'
</script>

<template>
  <div class="flex flex-wrap gap-3 items-center">
    <MChip label="Basic" />
    <MChip label="With Icon" icon="check" />
    <MChip label="Removable" removable />
    <MChip label="Success" severity="success" size="small" />
    <MChip label="Disabled" removable disabled />
  </div>
</template>
