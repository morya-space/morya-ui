<script setup lang="ts">
import { MDatePicker } from 'morya-ui'
import { ref } from 'vue'

const date = ref<string | null>('2024-06-15')
</script>

<template>
  <div style="max-width: 32rem">
    <p style="margin: 0 0 8px; color: var(--m-color-text-muted); font-size: 13px">
      使用 <code>:teleport="false"</code> + <code>append-to="self"</code> 让面板就地渲染，适合嵌入卡片或自定义布局。
    </p>
    <div style="border: 1px solid var(--m-color-border); border-radius: 8px; padding: 16px; background: var(--m-color-surface)">
      <MDatePicker v-model="date" label="内联面板" :teleport="false" append-to="self" />
    </div>
  </div>
</template>
