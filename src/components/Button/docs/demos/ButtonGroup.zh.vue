<script setup lang="ts">
import { MButton, MButtonGroup, MFlex } from 'morya-ui'
</script>

<template>
  <MFlex vertical gap="medium">
    <MButtonGroup aria-label="行内操作">
      <MButton label="编辑" />
      <MButton label="分享" />
      <MButton danger label="删除" />
    </MButtonGroup>
    <MButtonGroup block aria-label="表单操作">
      <MButton label="取消" />
      <MButton type="primary" label="确认" />
    </MButtonGroup>
  </MFlex>
</template>
