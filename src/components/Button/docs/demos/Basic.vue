<script setup lang="ts">
import { MButton } from 'morya-ui'
</script>

<template>
  <div class="flex flex-wrap gap-3 items-center">
    <MButton>Submit</MButton>
    <MButton label="Label Prop" />
    <MButton severity="secondary" label="Secondary" />
  </div>
</template>
