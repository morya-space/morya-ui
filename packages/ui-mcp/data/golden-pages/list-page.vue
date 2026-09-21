<script setup lang="ts">
/**
 * 黄金样例：列表页
 * @see DESIGN.md · morya-ui-pages references/page-layouts.md
 */
import {
  MBreadcrumb,
  MButton,
  MConfigProvider,
  MInput,
  MLayout,
  MLayoutContent,
  MLayoutHeader,
  MLayoutSider,
  MMenu,
  MPageContent,
  MPageFilters,
  MPageToolbar,
  MSelect,
  MSpace,
  MTable,
  MTag,
  zhCN,
} from 'morya-ui'
import { ref } from 'vue'

const keyword = ref('')
const status = ref<string | undefined>()

const menuModel = [
  { key: 'users', label: '用户管理', icon: 'user', to: '/users' },
  { key: 'roles', label: '角色管理', icon: 'shield', to: '/roles' },
]

const statusOptions = [
  { label: '全部', value: '' },
  { label: '启用', value: 'active' },
  { label: '停用', value: 'inactive' },
]

const columns = [
  { key: 'name', label: '名称' },
  { key: 'status', label: '状态' },
  { key: 'updatedAt', label: '更新时间' },
  { key: 'actions', label: '操作', width: 128 },
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
          <MPageContent>
            <MPageFilters aria-label="筛选">
              <MSpace wrap>
                <MInput v-model="keyword" placeholder="搜索名称" clearable style="width: 14rem" />
                <MSelect
                  v-model="status"
                  :options="statusOptions"
                  placeholder="状态"
                  clearable
                  style="width: 10rem"
                />
                <MButton severity="primary">
                  查询
                </MButton>
                <MButton severity="secondary">
                  重置
                </MButton>
              </MSpace>
            </MPageFilters>

            <MPageToolbar title="用户管理">
              <template #actions>
                <MButton severity="primary">
                  新建用户
                </MButton>
              </template>
            </MPageToolbar>

            <MTable
              :columns="columns"
              :rows="rows"
              :rows-per-page="3"
              paginator
              striped
              bordered
              row-key="id"
              aria-label="用户列表"
            >
              <template #cell-status="{ value }">
                <MTag :value="value === 'active' ? '启用' : '停用'" :severity="value === 'active' ? 'success' : 'secondary'" />
              </template>
              <template #cell-actions>
                <MSpace>
                  <MButton severity="secondary" size="small">
                    编辑
                  </MButton>
                  <MButton severity="danger" size="small">
                    删除
                  </MButton>
                </MSpace>
              </template>
              <template #empty>
                <p style="margin: 0; padding: var(--m-space-8); text-align: center; color: var(--m-color-text-muted)">
                  暂无用户数据
                </p>
              </template>
            </MTable>
          </MPageContent>
        </MLayoutContent>
      </MLayout>
    </MLayout>
  </MConfigProvider>
</template>
