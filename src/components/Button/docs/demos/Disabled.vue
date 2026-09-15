<script setup lang="ts">
import { MButton } from 'morya-ui'
</script>

<template>
  <div class="flex flex-wrap gap-3 items-center">
    <MButton label="Disabled" disabled />
    <MButton label="Disabled Outlined" outlined disabled />
    <MButton label="Disabled Text" text disabled />
  </div>
</template>
