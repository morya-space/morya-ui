<script setup lang="ts">
import { MButton, MResult } from 'morya-ui'
</script>

<template>
  <div class="grid gap-8">
    <MResult status="403" description="你没有访问该资源的权限。">
      <template #extra>
        <MButton label="返回" severity="secondary" />
      </template>
    </MResult>
    <MResult status="404" description="页面不存在或已被移除。" />
    <MResult status="500" description="服务暂时不可用，请稍后再试。" />
  </div>
</template>
