<script setup lang="ts">
/**
 * 黄金样例：列表页
 * @see DESIGN.md §3
 */
import {
  WiBreadcrumb,
  WiButton,
  WiInput,
  WiLayout,
  WiLayoutContent,
  WiLayoutHeader,
  WiLayoutSider,
  WiMenu,
  WiSelect,
  WiSpace,
  WiTable,
  WiTag,
} from '@well-insight/ui'
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
]
</script>

<template>
  <WiLayout has-sider class="page-list">
    <WiLayoutSider class="page-list__sider">
      <WiMenu :model="[{ label: '用户管理', key: 'users' }, { label: '角色管理', key: 'roles' }]" />
    </WiLayoutSider>

    <WiLayout>
      <WiLayoutHeader class="page-list__header">
        <WiBreadcrumb :model="[{ label: '首页', to: '/' }, { label: '用户管理' }]" />
      </WiLayoutHeader>

      <WiLayoutContent class="page-list__content">
        <!-- 筛选区 -->
        <section class="page-list__filters" aria-label="筛选">
          <WiSpace wrap>
            <WiInput v-model="keyword" placeholder="搜索名称" clearable style="width: 14rem" />
            <WiSelect
              v-model="status"
              :options="statusOptions"
              placeholder="状态"
              clearable
              style="width: 10rem"
            />
            <WiButton severity="primary">查询</WiButton>
            <WiButton severity="secondary">重置</WiButton>
          </WiSpace>
        </section>

        <!-- 工具栏 -->
        <header class="page-list__toolbar">
          <h1 class="page-list__title">用户管理</h1>
          <WiButton severity="primary">新建用户</WiButton>
        </header>

        <!-- 表格 -->
        <WiTable
          :columns="columns"
          :rows="rows"
          :rows-per-page="10"
          striped
          bordered
          row-key="id"
          aria-label="用户列表"
        >
          <template #cell-status="{ value }">
            <WiTag :value="value === 'active' ? '启用' : '停用'" :severity="value === 'active' ? 'success' : 'secondary'" />
          </template>
          <template #cell-actions>
            <WiSpace>
              <WiButton severity="secondary" size="small">编辑</WiButton>
              <WiButton severity="danger" size="small">删除</WiButton>
            </WiSpace>
          </template>
        </WiTable>
      </WiLayoutContent>
    </WiLayout>
  </WiLayout>
</template>

<style scoped>
.page-list {
  min-height: 100vh;
  background: var(--wi-color-surface);
}

.page-list__sider {
  border-right: 1px solid var(--wi-color-border);
}

.page-list__header {
  padding: var(--wi-space-4) var(--wi-space-6);
  border-bottom: 1px solid var(--wi-color-border);
}

.page-list__content {
  padding: var(--wi-space-6);
  display: flex;
  flex-direction: column;
  gap: var(--wi-space-4);
}

.page-list__filters {
  padding: var(--wi-space-4);
  background: color-mix(in srgb, var(--wi-color-border) 25%, transparent);
  border-radius: var(--wi-radius-md);
}

.page-list__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--wi-space-4);
}

.page-list__title {
  margin: 0;
  font-size: var(--wi-font-size-lg);
  color: var(--wi-color-text);
}
</style>
