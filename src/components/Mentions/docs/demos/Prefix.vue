<script setup lang="ts">
import { MMentions } from 'morya-ui'
import { ref } from 'vue'

const value = ref('')
const options = [
  { value: 'light', label: 'Light theme' },
  { value: 'dark', label: 'Dark theme' },
]
</script>

<template>
  <MMentions
    v-model="value"
    :options="options"
    :prefix="['@', '#']"
    placeholder="Use @user or #tag"
  />
</template>
