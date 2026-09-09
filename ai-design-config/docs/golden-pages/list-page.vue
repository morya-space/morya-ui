<script setup lang="ts">
/**
 * 黄金样例：列表页
 * @see DESIGN.md §3
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
  MSelect,
  MSpace,
  MTable,
  MTag,
  zhCN,
} from 'morya-ui'
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
  <MConfigProvider :locale="zhCN">
    <MLayout has-sider class="page-list">
      <MLayoutSider class="page-list__sider">
        <MMenu :model="[{ label: '用户管理', key: 'users' }, { label: '角色管理', key: 'roles' }]" />
      </MLayoutSider>

      <MLayout>
        <MLayoutHeader class="page-list__header">
          <MBreadcrumb :model="[{ label: '首页', to: '/' }, { label: '用户管理' }]" />
        </MLayoutHeader>

        <MLayoutContent class="page-list__content">
          <!-- 筛选区 -->
          <section class="page-list__filters" aria-label="筛选">
            <MSpace wrap>
              <MInput v-model="keyword" placeholder="搜索名称" clearable style="width: 14rem" />
              <MSelect
                v-model="status"
                :options="statusOptions"
                placeholder="状态"
                clearable
                style="width: 10rem"
              />
              <MButton severity="primary">查询</MButton>
              <MButton severity="secondary">重置</MButton>
            </MSpace>
          </section>

          <!-- 工具栏 -->
          <header class="page-list__toolbar">
            <h1 class="page-list__title">用户管理</h1>
            <MButton severity="primary">新建用户</MButton>
          </header>

          <!-- 表格 -->
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
                <MButton severity="secondary" size="small">编辑</MButton>
                <MButton severity="danger" size="small">删除</MButton>
              </MSpace>
            </template>
            <template #empty>
              <p class="page-list__empty">暂无用户数据</p>
            </template>
          </MTable>
        </MLayoutContent>
      </MLayout>
    </MLayout>
  </MConfigProvider>
</template>

<style scoped>
.page-list {
  min-height: 100vh;
  background: var(--m-color-surface);
}

.page-list__sider {
  border-right: 1px solid var(--m-color-border);
}

.page-list__header {
  padding: var(--m-space-4) var(--m-space-6);
  border-bottom: 1px solid var(--m-color-border);
  background: var(--m-color-surface);
}

.page-list__content {
  padding: var(--m-space-6);
  display: flex;
  flex-direction: column;
  gap: var(--m-space-4);
}

.page-list__filters {
  padding: var(--m-space-4);
  background: color-mix(in srgb, var(--m-color-border) 25%, transparent);
  border-radius: var(--m-radius-md);
  border: 1px solid var(--m-color-border);
}

.page-list__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--m-space-4);
}

.page-list__title {
  margin: 0;
  font-size: var(--m-font-size-lg);
  font-weight: 600;
  color: var(--m-color-text);
}

.page-list__empty {
  margin: 0;
  padding: var(--m-space-8);
  text-align: center;
  color: var(--m-color-text-muted);
}
</style>
