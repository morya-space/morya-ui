<script setup lang="ts">
import { MButton } from 'morya-ui'
</script>

<template>
  <div class="grid gap-4 w-full">
    <div class="flex flex-wrap gap-3 items-center">
      <MButton label="Outlined" outlined />
      <MButton label="Success" severity="success" outlined />
      <MButton label="Danger" severity="danger" outlined />
    </div>
    <div class="flex flex-wrap gap-3 items-center">
      <MButton label="Raised" raised />
      <MButton label="Rounded" rounded />
      <MButton label="Plain Text" text plain />
    </div>
    <div class="flex flex-wrap gap-3 items-center">
      <MButton label="Small" size="small" />
      <MButton label="Large" size="large" />
      <MButton label="Fluid" fluid />
    </div>
  </div>
</template>
