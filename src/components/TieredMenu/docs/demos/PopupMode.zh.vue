<script setup lang="ts">
import { MButton, MTieredMenu } from 'morya-ui'
import { ref } from 'vue'

const open = ref(false)
const model = [{ label: '复制' }, { label: '粘贴' }]
</script>

<template>
  <MButton label="操作" @click="open = true" />
  <MTieredMenu v-model="open" popup :model="model" />
</template>
