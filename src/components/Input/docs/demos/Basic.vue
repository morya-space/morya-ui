<script setup lang="ts">
import { MInput } from 'morya-ui'
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <MInput v-model="value" label="Name" placeholder="Enter your name" />
</template>
