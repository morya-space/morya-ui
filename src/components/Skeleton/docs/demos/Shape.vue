<script setup lang="ts">
import { MSkeleton } from 'morya-ui'
</script>

<template>
  <div class="flex flex-wrap gap-4 items-center">
    <MSkeleton shape="circle" width="3rem" height="3rem" />
    <MSkeleton width="10rem" height="3rem" />
  </div>
</template>
