<script setup lang="ts">
/**
 * 黄金样例：列表页 · dense（高密度工具台）
 * structure: list · style: dense
 * 镜像区块顺序；气质跟 styleDirection / 参考走，不要把本文件当唯一审美。
 * @see list-page.vue · style-presets.md · page-layouts.md
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
  MPageFilters,
  MPageHeader,
  MSelect,
  MSpace,
  MStatus,
  MTable,
  zhCN,
} from 'morya-ui'
import { ref } from 'vue'

const keyword = ref('')
const status = ref<string | undefined>()
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

function resetFilters() {
  keyword.value = ''
  status.value = undefined
}

const columns = [
  { key: 'name', label: '名称' },
  { key: 'status', label: '状态', width: 96 },
  { key: 'updatedAt', label: '更新', width: 110 },
  { key: 'actions', label: '操作', width: 120 },
]

const rows = [
  { id: '1', name: '示例项目 A', status: 'active', updatedAt: '09-01' },
  { id: '2', name: '示例项目 B', status: 'inactive', updatedAt: '08-28' },
  { id: '3', name: '示例项目 C', status: 'active', updatedAt: '08-25' },
  { id: '4', name: '示例项目 D', status: 'active', updatedAt: '08-20' },
  { id: '5', name: '示例项目 E', status: 'inactive', updatedAt: '08-15' },
  { id: '6', name: '示例项目 F', status: 'active', updatedAt: '08-12' },
  { id: '7', name: '示例项目 G', status: 'inactive', updatedAt: '08-10' },
  { id: '8', name: '示例项目 H', status: 'active', updatedAt: '08-08' },
]
</script>

<template>
  <MConfigProvider :locale="zhCN">
    <MLayout has-sider fill-viewport>
      <MLayoutSider v-model:collapsed="siderCollapsed" bordered :collapsed-width="64">
        <MMenu
          :model="menuModel"
          :collapsed="siderCollapsed"
          :collapsed-width="64"
          selected-key="users"
        />
      </MLayoutSider>

      <MLayout>
        <MLayoutHeader padding="var(--m-space-3) var(--m-space-4)">
          <MBreadcrumb :model="[{ label: '首页', to: '/' }, { label: '用户管理' }]" />
        </MLayoutHeader>

        <MLayoutContent>
          <MPageContent fill density="compact">
            <MPageHeader title="用户管理">
              <template #actions>
                <MButton severity="primary" size="small">
                  新建
                </MButton>
              </template>
            </MPageHeader>

            <MPageFilters aria-label="筛选" variant="plain">
              <MSpace wrap>
                <MInput
                  v-model="keyword"
                  placeholder="搜索"
                  clearable
                  size="small"
                  style="width: 11rem"
                />
                <MSelect
                  v-model="status"
                  :options="statusOptions"
                  placeholder="状态"
                  clearable
                  size="small"
                  style="width: 8rem"
                />
              </MSpace>
              <template #actions>
                <MButton severity="secondary" size="small">
                  查询
                </MButton>
                <MButton severity="secondary" size="small" text @click="resetFilters">
                  重置
                </MButton>
              </template>
            </MPageFilters>

            <MTable
              :columns="columns"
              :rows="rows"
              :rows-per-page="10"
              fill
              paginator
              size="small"
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
                <MEmpty title="暂无数据" description="创建后在此浏览。" icon="user">
                  <template #extra>
                    <MButton severity="primary" size="small">
                      新建
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
