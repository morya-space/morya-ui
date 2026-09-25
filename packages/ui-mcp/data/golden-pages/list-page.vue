<script setup lang="ts">
/**
 * 黄金样例：列表页（结构母版 · style: soft）
 * structure: list · style: soft
 * 全视口主列表使用 fill；气质变体见 list-page-dense / list-page-rail。
 * 镜像区块顺序；视觉跟 styleDirection / 参考走，不要把 soft 当唯一正确答案。
 * @see DESIGN.md · page-layouts.md · style-presets.md · visual-craft § Ops polish
 */
import {
  MBreadcrumb,
  MButton,
  MConfigProvider,
  MEmpty,
  MInput,
  MLayout,
  MLayoutContent,
  MLayoutHeader,
  MLayoutSider,
  MMenu,
  MPageContent,
  MPageFilterChips,
  MPageFilters,
  MPageHeader,
  MSelect,
  MSpace,
  MStatus,
  MTable,
  MTag,
  zhCN,
} from 'morya-ui'
import { computed, ref } from 'vue'

const keyword = ref('')
const status = ref<string | undefined>()
const department = ref<string | null>(null)
const filtersExpanded = ref(false)
const siderCollapsed = ref(false)

const menuModel = [
  { key: 'users', label: '用户管理', icon: 'user', to: '/users' },
  { key: 'roles', label: '角色管理', icon: 'shield', to: '/roles' },
  { key: 'settings', label: '系统设置', icon: 'settings', to: '/settings' },
]

const statusOptions = [
  { label: '全部', value: '' },
  { label: '启用', value: 'active' },
  { label: '停用', value: 'inactive' },
]

const departmentOptions = [
  { label: '研发', value: '研发' },
  { label: '运营', value: '运营' },
  { label: '市场', value: '市场' },
]

const activeFilters = computed(() => {
  const items: Array<{ key: string; label: string }> = []
  if (keyword.value.trim()) {
    items.push({ key: 'keyword', label: `关键词：${keyword.value.trim()}` })
  }
  if (status.value) {
    const label = statusOptions.find((o) => o.value === status.value)?.label ?? status.value
    items.push({ key: 'status', label: `状态：${label}` })
  }
  if (department.value) {
    items.push({ key: 'department', label: `部门：${department.value}` })
  }
  return items
})

function clearFilter(key: string) {
  if (key === 'keyword') keyword.value = ''
  if (key === 'status') status.value = undefined
  if (key === 'department') department.value = null
}

function resetFilters() {
  keyword.value = ''
  status.value = undefined
  department.value = null
}

const columns = [
  { key: 'name', label: '名称' },
  { key: 'status', label: '状态', width: 120 },
  { key: 'updatedAt', label: '更新时间', width: 140 },
  { key: 'actions', label: '操作', width: 148 },
]

const rows = [
  { id: '1', name: '示例项目 A', status: 'active', updatedAt: '2026-09-01' },
  { id: '2', name: '示例项目 B', status: 'inactive', updatedAt: '2026-08-28' },
  { id: '3', name: '示例项目 C', status: 'active', updatedAt: '2026-08-25' },
  { id: '4', name: '示例项目 D', status: 'active', updatedAt: '2026-08-20' },
  { id: '5', name: '示例项目 E', status: 'inactive', updatedAt: '2026-08-15' },
]
</script>

<template>
  <MConfigProvider :locale="zhCN">
    <MLayout has-sider fill-viewport>
      <MLayoutSider v-model:collapsed="siderCollapsed" bordered :collapsed-width="72">
        <MMenu
          :model="menuModel"
          :collapsed="siderCollapsed"
          :collapsed-width="72"
          selected-key="users"
        />
      </MLayoutSider>

      <MLayout>
        <MLayoutHeader padding="var(--m-space-4) var(--m-space-6)">
          <MBreadcrumb :model="[{ label: '首页', to: '/' }, { label: '用户管理' }]" />
        </MLayoutHeader>

        <MLayoutContent>
          <MPageContent fill>
            <MPageHeader title="用户管理" description="维护账号、角色与权限。">
              <template #actions>
                <MButton severity="primary">
                  新建用户
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
                  :options="statusOptions"
                  placeholder="状态"
                  clearable
                  style="width: 10rem"
                />
                <MButton severity="secondary">
                  查询
                </MButton>
                <MButton severity="secondary" text @click="resetFilters">
                  重置
                </MButton>
              </MSpace>
              <template #advanced>
                <MSpace wrap>
                  <MSelect
                    v-model="department"
                    :options="departmentOptions"
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

            <MTable
              :columns="columns"
              :rows="rows"
              :rows-per-page="5"
              fill
              paginator
              striped
              bordered
              row-key="id"
              aria-label="用户列表"
            >
              <template #cell-status="{ value }">
                <MStatus
                  :label="value === 'active' ? '启用' : '停用'"
                  :severity="value === 'active' ? 'success' : 'secondary'"
                />
              </template>
              <template #cell-actions>
                <MSpace>
                  <MButton severity="secondary" size="small" text>
                    编辑
                  </MButton>
                  <MButton severity="danger" size="small" text>
                    删除
                  </MButton>
                </MSpace>
              </template>
              <template #empty>
                <MEmpty
                  title="还没有用户"
                  description="创建第一个用户后，即可分配角色与权限。"
                  icon="user"
                >
                  <template #extra>
                    <MButton severity="primary">
                      新建用户
                    </MButton>
                  </template>
                </MEmpty>
              </template>
            </MTable>
          </MPageContent>
        </MLayoutContent>
      </MLayout>
    </MLayout>
  </MConfigProvider>
</template>
