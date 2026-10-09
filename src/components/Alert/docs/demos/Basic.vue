<script setup lang="ts">
import { MAlert, MSpace } from 'morya-ui'
</script>

<template>
  <MSpace
    vertical
    size="medium"
    style="width: 100%"
  >
    <MAlert
      title="提示"
      description="这是一条信息说明。"
    />
    <MAlert
      type="success"
      title="成功"
      description="操作已完成。"
    />
    <MAlert
      type="warning"
      title="注意"
      description="请核对后再提交。"
    />
    <MAlert
      type="danger"
      title="错误"
      description="请求失败，请稍后重试。"
    />
  </MSpace>
</template>
