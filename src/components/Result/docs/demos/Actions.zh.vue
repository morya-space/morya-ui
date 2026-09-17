<script setup lang="ts">
import { MButton, MResult } from 'morya-ui'
</script>

<template>
  <div class="grid gap-8">
    <MResult status="success" description="订单已创建，可在列表中查看详情。">
      <template #footer>
        <MButton label="查看订单" />
        <MButton label="返回首页" severity="secondary" text />
      </template>
    </MResult>
    <MResult status="error" description="请检查网络后重试，或联系管理员。">
      <template #footer>
        <MButton label="重试" />
      </template>
    </MResult>
  </div>
</template>
