<script setup lang="ts">
import { computed, ref } from 'vue'
import { WiButton, WiInput, WiSpace, WiTag } from '@well-insight/ui'
import ListPageTemplate from '@/components/ListPageTemplate.vue'
import { teachers } from '@/mock'

const keyword = ref('')

const columns = [
  { key: 'name', label: '姓名' },
  { key: 'title', label: '职称' },
  { key: 'department', label: '院系' },
  { key: 'courses', label: '课程数', width: 88 },
  { key: 'status', label: '状态', width: 88 },
  { key: 'actions', label: '操作', width: 120 },
]

const rows = computed(() =>
  teachers.filter((row) => !keyword.value || row.name.includes(keyword.value)),
)

function resetFilters() {
  keyword.value = ''
}
</script>

<template>
  <ListPageTemplate
    title="教师管理"
    table-label="教师列表"
    :columns="columns"
    :rows="rows"
  >
    <template #filters>
      <WiSpace wrap>
        <WiInput v-model="keyword" placeholder="姓名关键词" clearable style="width: 12rem" />
        <WiButton>查询</WiButton>
        <WiButton severity="secondary" @click="resetFilters">重置</WiButton>
      </WiSpace>
    </template>

    <template #cell-status="{ value }">
      <WiTag :value="value === 'active' ? '在职' : '离职'" :severity="value === 'active' ? 'success' : 'secondary'" />
    </template>

    <template #cell-actions>
      <WiButton size="small" severity="secondary">详情</WiButton>
    </template>
  </ListPageTemplate>
</template>
