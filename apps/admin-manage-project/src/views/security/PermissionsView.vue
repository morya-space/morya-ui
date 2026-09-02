<script setup lang="ts">
import { WiTag } from '@well-insight/ui'
import ListPageTemplate from '@/components/ListPageTemplate.vue'
import { permissions } from '@/mock'

const columns = [
  { key: 'name', label: '权限名称' },
  { key: 'code', label: '标识' },
  { key: 'type', label: '类型', width: 88 },
  { key: 'module', label: '模块', width: 96 },
]
</script>

<template>
  <ListPageTemplate
    title="权限清单"
    table-label="权限列表"
    :columns="columns"
    :rows="permissions"
    :paginator="false"
    :show-create="false"
  >
    <template #cell-type="{ value }">
      <WiTag
        :value="value === 'menu' ? '菜单' : value === 'button' ? '按钮' : '接口'"
        :severity="value === 'menu' ? 'info' : value === 'button' ? 'warn' : 'secondary'"
      />
    </template>
  </ListPageTemplate>
</template>
