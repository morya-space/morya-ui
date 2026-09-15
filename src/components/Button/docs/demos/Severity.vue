<script setup lang="ts">
import { MButton } from 'morya-ui'
</script>

<template>
  <div class="flex flex-wrap gap-3 items-center">
    <MButton label="Primary" />
    <MButton label="Secondary" severity="secondary" />
    <MButton label="Success" severity="success" />
    <MButton label="Info" severity="info" />
    <MButton label="Warn" severity="warn" />
    <MButton label="Help" severity="help" />
    <MButton label="Danger" severity="danger" />
    <MButton label="Contrast" severity="contrast" />
  </div>
</template>
