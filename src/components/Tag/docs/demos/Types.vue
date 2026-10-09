<script setup lang="ts">
import { MTag } from 'morya-ui'
</script>

<template>
  <div class="flex flex-wrap gap-3 items-center">
    <MTag value="Primary" />
    <MTag value="Secondary" type="secondary" />
    <MTag value="Success" type="success" />
    <MTag value="Info" type="info" />
    <MTag value="Warning" type="warning" />
    <MTag value="Danger" type="danger" />
    <MTag value="Contrast" type="contrast" />
  </div>
</template>
