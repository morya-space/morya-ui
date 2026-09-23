<script setup lang="ts">
import {
  MButton,
  MInput,
  MPageContent,
  MPageFilterChips,
  MPageFilters,
  MPageHeader,
  MSelect,
  MSpace,
  MTag,
} from 'morya-ui'
import { computed, ref } from 'vue'

const keyword = ref('')
const status = ref<string | null>('active')
const filtersExpanded = ref(false)
const department = ref<string | null>(null)

const activeFilters = computed(() => {
  const items: Array<{ key: string; label: string }> = []
  if (keyword.value.trim()) {
    items.push({ key: 'keyword', label: `关键词：${keyword.value.trim()}` })
  }
  if (status.value && status.value !== 'all') {
    items.push({ key: 'status', label: `状态：${status.value === 'active' ? '启用' : '停用'}` })
  }
  if (department.value) {
    items.push({ key: 'department', label: `部门：${department.value}` })
  }
  return items
})

function clearFilter(key: string) {
  if (key === 'keyword') keyword.value = ''
  if (key === 'status') status.value = 'all'
  if (key === 'department') department.value = null
}

function resetAll() {
  keyword.value = ''
  status.value = 'all'
  department.value = null
}
</script>

<template>
  <div
    class="doc-demo-frame"
    style="border:1px solid var(--m-color-border);border-radius:var(--m-radius-md);overflow:visible;background:var(--m-color-surface)"
  >
    <MPageContent>
      <MPageHeader title="用户管理" description="折叠高级筛选，已选条件用 Tag 展示。">
        <template #actions>
          <MButton severity="primary">
            新建
          </MButton>
        </template>
      </MPageHeader>
      <MPageFilters
        v-model:expanded="filtersExpanded"
        aria-label="筛选"
        variant="filled"
        collapsible
      >
        <MSpace wrap>
          <MInput v-model="keyword" placeholder="搜索名称" clearable style="width: 14rem" />
          <MSelect
            v-model="status"
            :options="[
              { label: '全部', value: 'all' },
              { label: '启用', value: 'active' },
              { label: '停用', value: 'inactive' },
            ]"
            placeholder="状态"
            style="width: 10rem"
          />
          <MButton severity="secondary">
            查询
          </MButton>
          <MButton severity="secondary" text @click="resetAll">
            重置
          </MButton>
        </MSpace>
        <template #advanced>
          <MSpace wrap>
            <MSelect
              v-model="department"
              :options="[
                { label: '研发', value: '研发' },
                { label: '运营', value: '运营' },
              ]"
              placeholder="部门"
              clearable
              style="width: 10rem"
            />
          </MSpace>
        </template>
      </MPageFilters>
      <MPageFilterChips v-if="activeFilters.length" label="已选" aria-label="已选筛选">
        <MTag
          v-for="item in activeFilters"
          :key="item.key"
          :value="item.label"
          size="small"
          bordered
          closable
          @close="clearFilter(item.key)"
        />
      </MPageFilterChips>
    </MPageContent>
  </div>
</template>
