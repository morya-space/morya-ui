<script setup lang="ts">
import { WiButton, WiTag } from '@well-insight/ui'
import ListPageTemplate from '@/components/ListPageTemplate.vue'
import { roles } from '@/mock'

const columns = [
  { key: 'name', label: '角色名称' },
  { key: 'code', label: '编码' },
  { key: 'users', label: '用户数', width: 88 },
  { key: 'permissions', label: '权限范围' },
  { key: 'status', label: '状态', width: 88 },
  { key: 'actions', label: '操作', width: 120 },
]
</script>

<template>
  <ListPageTemplate
    title="角色管理"
    table-label="角色列表"
    :columns="columns"
    :rows="roles"
    :show-create="false"
  >
    <template #cell-status="{ value }">
      <WiTag :value="value === 'active' ? '启用' : '停用'" :severity="value === 'active' ? 'success' : 'secondary'" />
    </template>
    <template #cell-actions>
      <WiButton size="small" severity="secondary">分配权限</WiButton>
    </template>
  </ListPageTemplate>
</template>
