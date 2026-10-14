<script setup lang="ts">
// 新版 dense 变体：density="compact" + size="small" 联动，plain 筛选
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
  { key: 'orders', label: '工单', icon: 'clipboard', to: '/orders' },
  { key: 'agents', label: '坐席', icon: 'user', to: '/agents' },
  { key: 'settings', label: '设置', icon: 'settings', to: '/settings' },
]
const statusOptions = [
  { label: '全部', value: '' },
  { label: '待处理', value: 'open' },
  { label: '已完成', value: 'done' },
]
const columns = [
  { key: 'name', label: '工单' },
  { key: 'status', label: '状态', width: 96 },
  { key: 'updatedAt', label: '更新', width: 110 },
  { key: 'actions', label: '操作', width: 120 },
]
const rows = [
  { id: '1', name: 'WO-1024 登录异常', status: 'open', updatedAt: '09-01' },
  { id: '2', name: 'WO-1023 导出超时', status: 'done', updatedAt: '08-28' },
  { id: '3', name: 'WO-1022 权限咨询', status: 'open', updatedAt: '08-25' },
]
function resetFilters() { keyword.value = ''; status.value = undefined }
</script>

<template>
  <MConfigProvider :locale="zhCN">
    <MLayout has-sider fill-viewport>
      <MLayoutSider v-model:collapsed="siderCollapsed" bordered :collapsed-width="64">
        <MMenu :model="menuModel" :collapsed="siderCollapsed" :collapsed-width="64" selected-key="orders" />
      </MLayoutSider>
      <MLayout>
        <MLayoutHeader padding="var(--m-space-3) var(--m-space-4)">
          <MBreadcrumb :model="[{ label: '首页', to: '/' }, { label: '工单' }]" />
        </MLayoutHeader>
        <MLayoutContent>
          <MPageContent fill density="compact">
            <MPageHeader title="工单">
              <template #actions><MButton size="small" type="primary">新建工单</MButton></template>
            </MPageHeader>
            <MPageFilters aria-label="筛选" variant="plain">
              <MSpace wrap>
                <MInput v-model="keyword" placeholder="搜索" clearable size="small" style="width: 11rem" />
                <MSelect v-model="status" :options="statusOptions" placeholder="状态" clearable size="small" style="width: 8rem" />
              </MSpace>
              <template #actions>
                <MButton size="small">查询</MButton>
                <MButton size="small" @click="resetFilters" type="text">重置</MButton>
              </template>
            </MPageFilters>
            <MTable :columns="columns" :rows="rows" :rows-per-page="10" fill paginator size="small" row-key="id" aria-label="工单列表">
              <template #cell-status="{ value }">
                <MStatus :label="value === 'open' ? '待处理' : '已完成'" :type="value === 'open' ? 'warning' : 'success'" />
              </template>
              <template #cell-actions>
                <MSpace>
                  <MButton size="small" type="text">处理</MButton>
                  <MButton size="small" type="text" danger>关闭</MButton>
                </MSpace>
              </template>
              <template #empty>
                <MEmpty title="暂无工单" description="新建后开始处理。" icon="clipboard">
                  <template #extra><MButton size="small" type="primary">新建工单</MButton></template>
                </MEmpty>
              </template>
            </MTable>
          </MPageContent>
        </MLayoutContent>
      </MLayout>
    </MLayout>
  </MConfigProvider>
</template>
