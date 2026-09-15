<script setup lang="ts">
import { MButton, MConfigProvider, MDialog } from 'morya-ui'
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <MConfigProvider append-to="body" :z-index="2200">
    <MButton label="打开对话框" @click="visible = true" />
    <MDialog v-model="visible" header="挂载到 body" width="24rem">
      <p style="margin:0">
        浮层默认 Teleport 到 body，zIndex 基准由 ConfigProvider 提供。
      </p>
    </MDialog>
  </MConfigProvider>
</template>
