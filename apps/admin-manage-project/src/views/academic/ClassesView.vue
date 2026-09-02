<script setup lang="ts">
import { WiButton, WiSpace } from '@well-insight/ui'
import ListPageTemplate from '@/components/ListPageTemplate.vue'
import { classGroups } from '@/mock'

const columns = [
  { key: 'name', label: '班级' },
  { key: 'grade', label: '年级', width: 88 },
  { key: 'headTeacher', label: '班主任' },
  { key: 'students', label: '人数', width: 72 },
  { key: 'room', label: '教室', width: 88 },
  { key: 'actions', label: '操作', width: 120 },
]
</script>

<template>
  <ListPageTemplate
    title="班级管理"
    table-label="班级列表"
    :columns="columns"
    :rows="classGroups"
  >
    <template #cell-actions>
      <WiSpace>
        <WiButton size="small" severity="secondary">花名册</WiButton>
        <WiButton size="small" severity="secondary">课表</WiButton>
      </WiSpace>
    </template>
  </ListPageTemplate>
</template>
