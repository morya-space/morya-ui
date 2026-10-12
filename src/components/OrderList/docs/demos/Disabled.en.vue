<script setup lang="ts">
import { MOrderList } from 'morya-ui'
import { ref } from 'vue'

const items = ref(['Design', 'Develop', 'Test', 'Release'])
</script>

<template>
  <MOrderList v-model="items" disabled />
</template>
