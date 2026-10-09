<script setup lang="ts">
import { MTag } from 'morya-ui'
</script>

<template>
  <div class="flex flex-wrap gap-3 items-center">
    <MTag value="New" icon="plus" type="info" />
    <MTag value="Done" icon="check" type="success" />
    <MTag value="Alert" icon="info" type="warning" rounded />
  </div>
</template>
