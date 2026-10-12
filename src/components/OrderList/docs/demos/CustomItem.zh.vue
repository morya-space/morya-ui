<script setup lang="ts">
import { MOrderList } from 'morya-ui'
import { ref } from 'vue'

interface Task {
  id: number
  title: string
  tag: string
}

const tasks = ref<Task[]>([
  { id: 1, title: '需求评审', tag: '产品' },
  { id: 2, title: '接口设计', tag: '后端' },
  { id: 3, title: '页面开发', tag: '前端' },
  { id: 4, title: '联调测试', tag: 'QA' },
])
</script>

<template>
  <MOrderList v-model="tasks" data-key="id">
    <template #item="{ item, selected }">
      <span style="display:flex;justify-content:space-between;width:100%;gap:0.5rem">
        <span>{{ (item as Task).title }}</span>
        <span
          :style="{
            fontSize: '0.75rem',
            padding: '0 0.4rem',
            borderRadius: '999px',
            background: selected ? 'var(--m-color-primary)' : 'var(--m-color-border)',
            color: selected ? 'var(--m-color-on-emphasis)' : 'var(--m-color-text-muted)',
          }"
        >{{ (item as Task).tag }}</span>
      </span>
    </template>
  </MOrderList>
</template>
