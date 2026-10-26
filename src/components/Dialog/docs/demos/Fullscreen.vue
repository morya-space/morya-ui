<script setup lang="ts">
import { MButton, MDialog } from 'morya-ui'
import { ref } from 'vue'

const visible = ref(false)
const fullscreen = ref(false)
</script>

<template>
  <MButton label="打开全屏对话框" @click="visible = true" />
  <MDialog
    v-model="visible"
    v-model:fullscreen="fullscreen"
    title="全屏对话框"
    maximizable
  >
    <p>通过 <code>v-model:fullscreen</code> 双向绑定全屏状态。</p>
    <p>当前 fullscreen 状态：<strong>{{ fullscreen }}</strong></p>
    <p>你也可以点标题栏的最大化 / 还原按钮，两种状态会保持同步。</p>
  </MDialog>
</template>
