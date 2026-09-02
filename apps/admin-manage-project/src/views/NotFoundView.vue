<script setup lang="ts">
import { useRouter } from 'vue-router'
import { WiButton, WiLayoutContent } from '@well-insight/ui'

const router = useRouter()
</script>

<template>
  <WiLayoutContent content-class="not-found">
    <h1>404</h1>
    <p>页面不存在或已被移除。</p>
    <WiButton @click="router.push('/dashboard')">返回首页</WiButton>
  </WiLayoutContent>
</template>

<style scoped>
:deep(.not-found) {
  padding: var(--wi-space-12);
  text-align: center;
}

.not-found h1 {
  margin: 0 0 var(--wi-space-2);
  font-size: 3rem;
  color: var(--wi-color-text-muted);
}

.not-found p {
  margin: 0 0 var(--wi-space-4);
  color: var(--wi-color-text-muted);
}
</style>
