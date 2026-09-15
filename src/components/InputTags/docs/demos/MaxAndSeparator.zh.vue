<script setup lang="ts">
import { MInputTags } from 'morya-ui'
import { ref } from 'vue'

const tags = ref(['vue'])
</script>

<template>
  <MInputTags v-model="tags" :max="3" separator="," placeholder="逗号分隔，最多 3 个" />
</template>
