<script setup lang="ts">
import { MButton, toast } from 'morya-ui'
</script>

<template>
  <div class="flex flex-wrap gap-3 items-center">
    <MButton
      label="Success"
      severity="success"
      @click="toast.success({ summary: '已保存', detail: '变更已生效。' })"
    />
    <MButton
      label="Info"
      severity="info"
      @click="toast.info({ summary: '提示', detail: '可以继续操作。' })"
    />
    <MButton
      label="Warn"
      severity="warn"
      @click="toast.warn({ summary: '注意', detail: '请再核对一次。' })"
    />
    <MButton
      label="Error"
      severity="danger"
      @click="toast.error({ summary: '失败', detail: '请稍后重试。' })"
    />
  </div>
</template>
