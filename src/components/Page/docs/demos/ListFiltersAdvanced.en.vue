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
    items.push({ key: 'keyword', label: `Keyword: ${keyword.value.trim()}` })
  }
  if (status.value && status.value !== 'all') {
    items.push({
      key: 'status',
      label: `Status: ${status.value === 'active' ? 'Active' : 'Inactive'}`,
    })
  }
  if (department.value) {
    items.push({ key: 'department', label: `Department: ${department.value}` })
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
      <MPageHeader title="Users" description="Collapsible advanced filters and active tags.">
        <template #actions>
          <MButton severity="primary">
            Create
          </MButton>
        </template>
      </MPageHeader>
      <MPageFilters
        v-model:expanded="filtersExpanded"
        aria-label="Filters"
        variant="filled"
        collapsible
      >
        <MSpace wrap>
          <MInput v-model="keyword" placeholder="Search name" clearable style="width: 14rem" />
          <MSelect
            v-model="status"
            :options="[
              { label: 'All', value: 'all' },
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
            ]"
            placeholder="Status"
            style="width: 10rem"
          />
          <MButton severity="secondary">
            Search
          </MButton>
          <MButton severity="secondary" text @click="resetAll">
            Reset
          </MButton>
        </MSpace>
        <template #advanced>
          <MSpace wrap>
            <MSelect
              v-model="department"
              :options="[
                { label: 'Engineering', value: 'Engineering' },
                { label: 'Operations', value: 'Operations' },
              ]"
              placeholder="Department"
              clearable
              style="width: 10rem"
            />
          </MSpace>
        </template>
      </MPageFilters>
      <MPageFilterChips v-if="activeFilters.length" label="Active" aria-label="Active filters">
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
