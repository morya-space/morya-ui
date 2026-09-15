<script setup lang="ts">
import { MInput } from 'morya-ui'
import { ref } from 'vue'

const password = ref('')
</script>

<template>
  <MInput v-model="password" type="password" label="Password" placeholder="••••••••" />
</template>
