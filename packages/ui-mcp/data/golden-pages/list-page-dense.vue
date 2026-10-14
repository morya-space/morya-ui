<script setup lang="ts">
/**
 * 黄金样例：列表页 · dense（高密度工具台）
 * structure: list · style: dense
 * 结构与 list-page.vue 完全相同；差异只在「密度」一处，通过一组联动 craft 表达：
 *   MPageContent density="compact" · 控件 size="small" · MTable size="small" · 筛选 variant="plain"。
 * 气质跟 styleDirection / 参考走，不要把本文件当唯一审美。
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
          <!-- dense 关键：整页 density="compact" -->
          <MPageContent fill density="compact">
            <MPageHeader title="{{页面标题}}">
              <template #actions>
                <MButton size="small" type="primary">
                  {{主操作}}
                </MButton>
              </template>
            </MPageHeader>

            <!-- dense 关键：筛选 variant="plain" + 控件 size="small" -->
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
                <MButton size="small">
                  查询
                </MButton>
                <MButton size="small" @click="resetFilters" type="text">
                  重置
                </MButton>
              </template>
            </MPageFilters>

            <!-- dense 关键：MTable size="small" -->
            <MTable
              :columns="columns"
              :rows="rows"
              :rows-per-page="10"
              fill
              paginator
              size="small"
              row-key="id"
              aria-label="{{列表}}"
            >
              <template #cell-status="{ value }">
                <MStatus
                  :label="value === 'active' ? '启用' : '停用'"
                  :type="value === 'active' ? 'success' : 'secondary'"
                />
              </template>
              <template #cell-actions>
                <MSpace>
                  <MButton size="small" type="text">
                    编辑
                  </MButton>
                  <MButton size="small" type="text" danger>
                    删除
                  </MButton>
                </MSpace>
              </template>
              <template #empty>
                <MEmpty title="{{空态标题}}" description="{{空态说明}}" icon="user">
                  <template #extra>
                    <MButton size="small" type="primary">
                      {{空态主操作}}
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
