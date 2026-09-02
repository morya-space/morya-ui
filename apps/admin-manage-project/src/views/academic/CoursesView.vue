<script setup lang="ts">
import { computed, ref } from 'vue'
import { WiButton, WiInput, WiSelect, WiSpace, WiTag } from '@well-insight/ui'
import ListPageTemplate from '@/components/ListPageTemplate.vue'
import { courses } from '@/mock'

const keyword = ref('')
const category = ref<string | undefined>()

const columns = [
  { key: 'name', label: '课程名称' },
  { key: 'category', label: '类别' },
  { key: 'credits', label: '学分', width: 72 },
  { key: 'teacher', label: '任课教师' },
  { key: 'enrolled', label: '已选/容量', width: 112 },
  { key: 'status', label: '状态', width: 88 },
  { key: 'actions', label: '操作', width: 120 },
]

const rows = computed(() =>
  courses.filter((row) => {
    const matchKeyword = !keyword.value || row.name.includes(keyword.value)
    const matchCategory = !category.value || row.category === category.value
    return matchKeyword && matchCategory
  }),
)

function resetFilters() {
  keyword.value = ''
  category.value = undefined
}
</script>

<template>
  <ListPageTemplate
    title="课程管理"
    table-label="课程列表"
    :columns="columns"
    :rows="rows"
  >
    <template #filters>
      <WiSpace wrap>
        <WiInput v-model="keyword" placeholder="课程名称" clearable style="width: 12rem" />
        <WiSelect
          v-model="category"
          :options="[{ label: '理科', value: '理科' }, { label: '文科', value: '文科' }, { label: '实验', value: '实验' }]"
          placeholder="类别"
          clearable
          style="width: 8rem"
        />
        <WiButton>查询</WiButton>
        <WiButton severity="secondary" @click="resetFilters">重置</WiButton>
      </WiSpace>
    </template>

    <template #cell-enrolled="{ row }">
      {{ row.enrolled }} / {{ row.capacity }}
    </template>

    <template #cell-status="{ value }">
      <WiTag
        :value="value === 'open' ? '开放' : value === 'full' ? '已满' : '关闭'"
        :severity="value === 'open' ? 'success' : value === 'full' ? 'warn' : 'secondary'"
      />
    </template>

    <template #cell-actions>
      <WiButton size="small" severity="secondary">编辑</WiButton>
    </template>
  </ListPageTemplate>
</template>
