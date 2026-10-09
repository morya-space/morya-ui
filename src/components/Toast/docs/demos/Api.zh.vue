<script setup lang="ts">
import { MButton, toast } from 'morya-ui'
</script>

<template>
  <div class="flex flex-wrap gap-3 items-center">
    <MButton label="Success" @click="toast.success({ summary: '已保存', detail: '变更已生效。' })" color="success" variant="solid"/>
    <MButton label="Info" @click="toast.info({ summary: '提示', detail: '可以继续操作。' })" color="info" variant="solid"/>
    <MButton label="Warn" @click="toast.warn({ summary: '注意', detail: '请再核对一次。' })" color="warning" variant="solid"/>
    <MButton label="Error" @click="toast.error({ summary: '失败', detail: '请稍后重试。' })" danger type="primary"/>
  </div>
</template>
