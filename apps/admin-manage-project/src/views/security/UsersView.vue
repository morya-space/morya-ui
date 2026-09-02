<script setup lang="ts">
import { WiButton, WiSpace, WiTag } from '@well-insight/ui'
import ListPageTemplate from '@/components/ListPageTemplate.vue'

const rows = [
  { id: 'u1', name: '张管理员', email: 'admin@educloud.cn', role: '超级管理员', status: 'active', lastLogin: '2026-09-02 08:30' },
  { id: 'u2', name: '李老师', email: 'li@educloud.cn', role: '教务主任', status: 'active', lastLogin: '2026-09-01 17:20' },
  { id: 'u3', name: '王班主任', email: 'wang@educloud.cn', role: '班主任', status: 'inactive', lastLogin: '2026-08-28 09:10' },
]

const columns = [
  { key: 'name', label: '姓名' },
  { key: 'email', label: '邮箱' },
  { key: 'role', label: '角色' },
  { key: 'status', label: '状态', width: 88 },
  { key: 'lastLogin', label: '最近登录', width: 140 },
  { key: 'actions', label: '操作', width: 120 },
]
</script>

<template>
  <ListPageTemplate
    title="用户管理"
    table-label="用户列表"
    :columns="columns"
    :rows="rows"
    :show-create="false"
  >
    <template #cell-status="{ value }">
      <WiTag :value="value === 'active' ? '正常' : '停用'" :severity="value === 'active' ? 'success' : 'secondary'" />
    </template>
    <template #cell-actions>
      <WiSpace>
        <WiButton size="small" severity="secondary">编辑</WiButton>
        <WiButton size="small" severity="danger">禁用</WiButton>
      </WiSpace>
    </template>
  </ListPageTemplate>
</template>
