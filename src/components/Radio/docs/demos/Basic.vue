<script setup lang="ts">
import { MRadio } from 'morya-ui'
import { ref } from 'vue'

const size = ref('md')
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1rem">
    <MRadio v-model="size" name="size" value="sm" label="Small" />
    <MRadio v-model="size" name="size" value="md" label="Medium" />
    <MRadio v-model="size" name="size" value="lg" label="Large" />
  </div>
</template>
