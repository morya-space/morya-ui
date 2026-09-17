<script setup lang="ts">
import { MButton, MResult } from 'morya-ui'
</script>

<template>
  <div class="grid gap-6" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
    <MResult
      size="small"
      status="success"
      title="保存成功"
    >
      <template #footer>
        <MButton
          label="知道了"
          size="small"
          severity="secondary"
        />
      </template>
    </MResult>
    <MResult
      size="small"
      status="error"
      title="上传失败"
    >
      <template #footer>
        <MButton
          label="重试"
          size="small"
        />
      </template>
    </MResult>
  </div>
</template>
