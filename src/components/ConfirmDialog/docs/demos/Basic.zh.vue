<script setup lang="ts">
import { MButton, MConfirmDialog } from 'morya-ui'
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <MButton label="删除" @click="visible = true" danger type="primary"/>
  <MConfirmDialog
    v-model="visible"
    header="删除确认"
    message="确定要删除该项吗？此操作不可撤销。"
    accept-label="删除"
    reject-label="取消"
    accept-color="danger"
  />
</template>
