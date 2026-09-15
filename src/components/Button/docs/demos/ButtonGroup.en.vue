<script setup lang="ts">
import { MButton, MButtonGroup } from 'morya-ui'
</script>

<template>
  <MButtonGroup aria-label="Align">
    <MButton label="Left" />
    <MButton label="Center" severity="secondary" />
    <MButton label="Right" severity="secondary" />
  </MButtonGroup>
</template>
