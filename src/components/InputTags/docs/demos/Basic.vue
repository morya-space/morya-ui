<script setup lang="ts">
import { MInputTags } from 'morya-ui'
import { ref } from 'vue'

const tags = ref(['vue', 'design'])
</script>

<template>
  <MInputTags v-model="tags" />
</template>
