<script setup lang="ts">
import { MButton, MTable } from 'morya-ui'
import { ref } from 'vue'

const loading = ref(false)
const columns = [
  { key: 'name', label: '姓名', minWidth: 120 },
  { key: 'role', label: '角色', minWidth: 120 },
]
</script>

<template>
  <div class="grid gap-3">
    <MButton :label="loading ? '结束加载' : '开始加载'" @click="loading = !loading" />
    <MTable
      :columns="columns"
      :rows="[]"
      :loading="loading"
      empty-text="还没有数据"
      empty-description="创建第一条记录后会显示在这里"
      :paginator="false"
    />
  </div>
</template>
