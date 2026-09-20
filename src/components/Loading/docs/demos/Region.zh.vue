<script setup lang="ts">
import { MButton, MLoading, vLoading } from 'morya-ui'
import { ref } from 'vue'

const loading = ref(true)
</script>

<template>
  <div class="grid gap-4">
    <MLoading :loading="loading" text="加载中" effect="wave">
      <div class="min-h-32 p-4">
        区域内容
      </div>
    </MLoading>
    <div
      v-loading="loading"
      m-loading-text="加载中"
      m-loading-effect="circular"
      class="min-h-32 rounded-md border border-solid border-[var(--m-color-border)] p-4"
    >
      指令覆盖的区域
    </div>
    <div>
      <MButton size="small" :label="loading ? '结束加载' : '开始加载'" @click="loading = !loading" />
    </div>
  </div>
</template>
