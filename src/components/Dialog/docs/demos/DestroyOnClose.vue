<script setup lang="ts">
import { MButton, MDialog, MInput } from 'morya-ui'
import { ref } from 'vue'

const visible = ref(false)
const text = ref('')
</script>

<template>
  <MButton label="打开对话框" @click="visible = true" />
  <MDialog v-model="visible" title="关闭时销毁内容" destroy-on-close>
    <p>在输入框里写点什么，关闭后再打开：内容会被重置（输入框被重新挂载）。</p>
    <MInput v-model="text" placeholder="输入点东西试试" />
  </MDialog>
</template>
