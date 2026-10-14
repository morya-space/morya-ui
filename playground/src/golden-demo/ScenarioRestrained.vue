<script setup lang="ts">
// 新版 restrained 默认：无 variant/striped/bordered，quiet flat，唯一 primary，密度默认
import {
  MBreadcrumb, MButton, MConfigProvider, MEmpty, MInput, MLayout, MLayoutContent,
  MLayoutHeader, MLayoutSider, MMenu, MPageContent, MPageFilters, MPageHeader,
  MSelect, MSpace, MStatus, MTable, zhCN,
} from 'morya-ui'
import { ref } from 'vue'

const keyword = ref('')
const status = ref<string | undefined>()
const siderCollapsed = ref(false)

const menuModel = [
  { key: 'users', label: '成员', icon: 'user', to: '/users' },
  { key: 'roles', label: '角色', icon: 'shield', to: '/roles' },
  { key: 'settings', label: '设置', icon: 'settings', to: '/settings' },
]
const statusOptions = [
  { label: '全部', value: '' },
  { label: '启用', value: 'active' },
  { label: '停用', value: 'inactive' },
]
const columns = [
  { key: 'name', label: '名称' },
  { key: 'status', label: '状态', width: 120 },
  { key: 'updatedAt', label: '更新时间', width: 140 },
  { key: 'actions', label: '操作', width: 148 },
]
const rows = [
  { id: '1', name: '林晓 · 产品设计', status: 'active', updatedAt: '2026-09-01' },
  { id: '2', name: '周然 · 平台研发', status: 'inactive', updatedAt: '2026-08-28' },
  { id: '3', name: '陈默 · 客户成功', status: 'active', updatedAt: '2026-08-25' },
]
function resetFilters() { keyword.value = ''; status.value = undefined }
</script>

<template>
  <MConfigProvider :locale="zhCN">
    <MLayout has-sider fill-viewport>
      <MLayoutSider v-model:collapsed="siderCollapsed" bordered :collapsed-width="72">
        <MMenu :model="menuModel" :collapsed="siderCollapsed" :collapsed-width="72" selected-key="users" />
      </MLayoutSider>
      <MLayout>
        <MLayoutHeader padding="var(--m-space-4) var(--m-space-6)">
          <MBreadcrumb :model="[{ label: '首页', to: '/' }, { label: '成员' }]" />
        </MLayoutHeader>
        <MLayoutContent>
          <!-- restrained：无 fill 硬套，无 variant/striped/bordered -->
          <MPageContent fill>
            <MPageHeader title="成员" description="管理团队账号与权限。">
              <template #actions><MButton type="primary">邀请成员</MButton></template>
            </MPageHeader>
            <!-- 条件少：基础筛选（不折叠、无 chips） -->
            <MPageFilters aria-label="筛选">
              <MSpace wrap>
                <MInput v-model="keyword" placeholder="搜索成员" clearable style="width: 14rem" />
                <MSelect v-model="status" :options="statusOptions" placeholder="状态" clearable style="width: 200px" />
              </MSpace>
              <template #actions>
                <MButton>查询</MButton>
                <MButton @click="resetFilters" type="text">重置</MButton>
              </template>
            </MPageFilters>
            <MTable :columns="columns" :rows="rows" :rows-per-page="5" fill paginator row-key="id" aria-label="成员列表">
              <template #cell-status="{ value }">
                <MStatus :label="value === 'active' ? '启用' : '停用'" :type="value === 'active' ? 'success' : 'secondary'" />
              </template>
              <template #cell-actions>
                <MSpace>
                  <MButton size="small" type="text">编辑</MButton>
                  <MButton size="small" type="text" danger>移除</MButton>
                </MSpace>
              </template>
              <template #empty>
                <MEmpty title="还没有成员" description="邀请第一位成员加入协作。" icon="user">
                  <template #extra><MButton type="primary">邀请成员</MButton></template>
                </MEmpty>
              </template>
            </MTable>
          </MPageContent>
        </MLayoutContent>
      </MLayout>
    </MLayout>
  </MConfigProvider>
</template>
