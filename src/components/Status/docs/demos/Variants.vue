<script setup lang="ts">
import { MStatus } from 'morya-ui'
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-4 items-center">
      <MStatus label="已完成" type="success" variant="tag" />
      <MStatus label="运行中" type="info" variant="tag" processing />
      <MStatus label="待审核" type="warning" variant="tag" />
      <MStatus label="失败" type="danger" variant="tag" />
      <MStatus label="已归档" variant="tag" />
      <MStatus label="已禁用" variant="tag" disabled />
    </div>
    <div class="flex flex-wrap gap-4 items-center">
      <MStatus label="自定义图标" type="success" icon="check" />
      <MStatus label="已完成" type="success" variant="text" />
      <MStatus label="同步中…" type="info" variant="text" />
      <MStatus label="—" variant="text" />
    </div>
  </div>
</template>
