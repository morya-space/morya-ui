<script setup lang="ts">
import { MButton, MTieredMenu } from 'morya-ui'
import { ref } from 'vue'

const open = ref(false)
const model = [{ label: 'Copy' }, { label: 'Paste' }]
</script>

<template>
  <MButton label="Actions" @click="open = true" />
  <MTieredMenu v-model="open" popup :model="model" />
</template>
