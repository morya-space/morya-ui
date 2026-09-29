<script setup lang="ts">
import { MAlert } from 'morya-ui'
</script>

<template>
  <MAlert
    severity="warning"
    title="可关闭"
    description="点击右上角关闭本条提示。"
    closable
  />
</template>
