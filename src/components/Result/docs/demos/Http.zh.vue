<script setup lang="ts">
import { MButton, MResult } from 'morya-ui'
</script>

<template>
  <div class="grid gap-8">
    <MResult status="403" description="你没有访问该资源的权限。">
      <template #footer>
        <MButton label="返回" severity="secondary" />
      </template>
    </MResult>
    <MResult status="404" description="页面不存在或已被移除。" />
    <MResult status="500" description="服务暂时不可用，请稍后再试。" />
    <MResult :status="('418' as any)" description="服务器拒绝泡茶请求。" />
  </div>
</template>
