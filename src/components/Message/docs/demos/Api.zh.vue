<script setup lang="ts">
import { MButton, message } from 'morya-ui'
</script>

<template>
  <div class="flex flex-wrap gap-3">
    <MButton label="Success" severity="success" @click="message.success('保存成功')" />
    <MButton label="Info" severity="info" @click="message.info('这是一条提示')" />
    <MButton label="Warn" severity="warn" @click="message.warn('请核对后再提交')" />
    <MButton label="Error" severity="danger" @click="message.error('请求失败，请重试')" />
    <MButton
      label="Closable"
      @click="message.info({ content: '可手动关闭', closable: true, life: 0 })"
    />
  </div>
</template>
