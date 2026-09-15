<script setup lang="ts">
import { MOrderList } from 'morya-ui'
import { ref } from 'vue'

const items = ref(['Design', 'Development', 'Testing', 'Release'])
</script>

<template>
  <MOrderList v-model="items" />
</template>
