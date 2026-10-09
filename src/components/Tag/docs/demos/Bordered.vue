<script setup lang="ts">
import { MTag } from 'morya-ui'
</script>

<template>
  <div class="flex flex-wrap gap-3 items-center">
    <MTag value="Filled" />
    <MTag value="Bordered" bordered />
    <MTag value="Success" type="success" bordered />
    <MTag value="Custom" color="#1677ff" bordered />
  </div>
</template>
