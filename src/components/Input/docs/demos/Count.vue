<script setup lang="ts">
import { MInput } from 'morya-ui'
import { ref } from 'vue'

const bio = ref('Hello')
</script>

<template>
  <MInput v-model="bio" label="Bio" :maxlength="20" show-count />
</template>
