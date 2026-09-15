<script setup lang="ts">
import { MInputTags } from 'morya-ui'
import { ref } from 'vue'

const tags = ref(['vue'])
</script>

<template>
  <MInputTags v-model="tags" :max="3" separator="," placeholder="Comma-separated, max 3" />
</template>
