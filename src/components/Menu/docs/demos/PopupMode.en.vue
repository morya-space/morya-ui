<script setup lang="ts">
import { MButton, MMenu } from 'morya-ui'
import { ref } from 'vue'

const open = ref(false)
const model = [
  { label: 'Copy', command: () => undefined },
  { separator: true },
  { label: 'Delete', disabled: true },
]
</script>

<template>
  <MMenu v-model="open" popup :model="model">
    <MButton label="More" @click="open = !open" />
  </MMenu>
</template>
