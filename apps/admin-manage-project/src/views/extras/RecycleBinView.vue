<script setup lang="ts">
import { WiButton, WiSpace, useToast } from '@well-insight/ui'
import ListPageTemplate from '@/components/ListPageTemplate.vue'
import { recycleBin } from '@/mock'

const toast = useToast()

const columns = [
  { key: 'name', label: '名称' },
  { key: 'module', label: '模块', width: 112 },
  { key: 'deletedBy', label: '删除人', width: 96 },
  { key: 'deletedAt', label: '删除时间', width: 112 },
  { key: 'expireAt', label: '过期时间', width: 112 },
  { key: 'actions', label: '操作', width: 120 },
]

function restore(name: string) {
  toast.add({ severity: 'success', summary: '已恢复', detail: name, life: 2500 })
}
</script>

<template>
  <ListPageTemplate
    title="回收站"
    table-label="回收站列表"
    :columns="columns"
    :rows="recycleBin"
    :paginator="false"
  >
    <template #cell-actions="{ row }">
      <WiSpace>
        <WiButton size="small" @click="restore(row.name)">恢复</WiButton>
        <WiButton size="small" severity="danger">彻底删除</WiButton>
      </WiSpace>
    </template>
  </ListPageTemplate>
</template>
