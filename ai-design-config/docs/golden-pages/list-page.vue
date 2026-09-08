<script setup lang="ts">
/**
 * 黄金样例：列表页
 * @see DESIGN.md §3
 */
import {
  RdBreadcrumb,
  RdButton,
  RdConfigProvider,
  RdInput,
  RdLayout,
  RdLayoutContent,
  RdLayoutHeader,
  RdLayoutSider,
  RdMenu,
  RdSelect,
  RdSpace,
  RdTable,
  RdTag,
  zhCN,
} from '@wise-kit/ui'
import { ref } from 'vue'

const keyword = ref('')
const status = ref<string | undefined>()

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
  <RdConfigProvider :locale="zhCN">
    <RdLayout has-sider class="page-list">
      <RdLayoutSider class="page-list__sider">
        <RdMenu :model="[{ label: '用户管理', key: 'users' }, { label: '角色管理', key: 'roles' }]" />
      </RdLayoutSider>

      <RdLayout>
        <RdLayoutHeader class="page-list__header">
          <RdBreadcrumb :model="[{ label: '首页', to: '/' }, { label: '用户管理' }]" />
        </RdLayoutHeader>

        <RdLayoutContent class="page-list__content">
          <!-- 筛选区 -->
          <section class="page-list__filters" aria-label="筛选">
            <RdSpace wrap>
              <RdInput v-model="keyword" placeholder="搜索名称" clearable style="width: 14rem" />
              <RdSelect
                v-model="status"
                :options="statusOptions"
                placeholder="状态"
                clearable
                style="width: 10rem"
              />
              <RdButton severity="primary">查询</RdButton>
              <RdButton severity="secondary">重置</RdButton>
            </RdSpace>
          </section>

          <!-- 工具栏 -->
          <header class="page-list__toolbar">
            <h1 class="page-list__title">用户管理</h1>
            <RdButton severity="primary">新建用户</RdButton>
          </header>

          <!-- 表格 -->
          <RdTable
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
              <RdTag :value="value === 'active' ? '启用' : '停用'" :severity="value === 'active' ? 'success' : 'secondary'" />
            </template>
            <template #cell-actions>
              <RdSpace>
                <RdButton severity="secondary" size="small">编辑</RdButton>
                <RdButton severity="danger" size="small">删除</RdButton>
              </RdSpace>
            </template>
            <template #empty>
              <p class="page-list__empty">暂无用户数据</p>
            </template>
          </RdTable>
        </RdLayoutContent>
      </RdLayout>
    </RdLayout>
  </RdConfigProvider>
</template>

<style scoped>
.page-list {
  min-height: 100vh;
  background: var(--rd-color-surface);
}

.page-list__sider {
  border-right: 1px solid var(--rd-color-border);
}

.page-list__header {
  padding: var(--rd-space-4) var(--rd-space-6);
  border-bottom: 1px solid var(--rd-color-border);
  background: var(--rd-color-surface);
}

.page-list__content {
  padding: var(--rd-space-6);
  display: flex;
  flex-direction: column;
  gap: var(--rd-space-4);
}

.page-list__filters {
  padding: var(--rd-space-4);
  background: color-mix(in srgb, var(--rd-color-border) 25%, transparent);
  border-radius: var(--rd-radius-md);
  border: 1px solid var(--rd-color-border);
}

.page-list__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--rd-space-4);
}

.page-list__title {
  margin: 0;
  font-size: var(--rd-font-size-lg);
  font-weight: 600;
  color: var(--rd-color-text);
}

.page-list__empty {
  margin: 0;
  padding: var(--rd-space-8);
  text-align: center;
  color: var(--rd-color-text-muted);
}
</style>
