<script setup lang="ts">
import { MButton, message } from 'morya-ui'
</script>

<template>
  <div class="flex flex-wrap gap-3">
    <MButton label="Success" @click="message.success('保存成功')" color="success" variant="solid"/>
    <MButton label="Info" @click="message.info('这是一条提示')" color="info" variant="solid"/>
    <MButton label="Warn" @click="message.warn('请核对后再提交')" color="warning" variant="solid"/>
    <MButton label="Error" @click="message.error('请求失败，请重试')" danger type="primary"/>
    <MButton
      label="Closable"
      @click="message.info({ content: '可手动关闭', closable: true, life: 0 })"
    />
  </div>
</template>
