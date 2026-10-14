<script setup lang="ts">
/**
 * 黄金样例：列表页 · rail（侧栏强调）
 * structure: list · style: rail
 * 结构与 list-page.vue 完全相同；差异只在「侧栏 chrome」一处（品牌区 + 侧栏氛围），
 * 内容区（筛选/表格/空态）与 list-page 一致。氛围跟 styleDirection / 参考走。
 * @see list-page.vue · style-presets.md · visual-craft § Atmosphere
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
  { key: 'status', label: '状态', width: 120 },
  { key: 'updatedAt', label: '更新时间', width: 140 },
  { key: 'actions', label: '操作', width: 148 },
]

const rows = [
  { id: '1', name: '示例项目 A', status: 'active', updatedAt: '2026-09-01' },
  { id: '2', name: '示例项目 B', status: 'inactive', updatedAt: '2026-08-28' },
  { id: '3', name: '示例项目 C', status: 'active', updatedAt: '2026-08-25' },
]
</script>

<template>
  <MConfigProvider :locale="zhCN">
    <MLayout has-sider fill-viewport>
      <!-- rail 关键：侧栏承载品牌区 + 侧栏氛围；内容区保持克制 -->
      <MLayoutSider
        v-model:collapsed="siderCollapsed"
        bordered
        :collapsed-width="72"
        class="gp-rail-sider"
      >
        <div class="gp-rail-sider__brand">
          <span class="gp-rail-sider__mark" aria-hidden="true" />
          <span v-if="!siderCollapsed" class="gp-rail-sider__name">{{品牌名}}</span>
        </div>
        <MMenu
          :model="menuModel"
          :collapsed="siderCollapsed"
          :collapsed-width="72"
          selected-key="users"
        />
      </MLayoutSider>

      <MLayout>
        <MLayoutHeader padding="var(--m-space-4) var(--m-space-6)" class="gp-rail-header">
          <MBreadcrumb :model="[{ label: '首页', to: '/' }, { label: '用户管理' }]" />
        </MLayoutHeader>

        <!-- 内容区与 list-page 一致；视觉（variant/内联宽度）跟 styleDirection -->
        <MLayoutContent>
          <MPageContent fill>
            <MPageHeader title="{{页面标题}}" description="{{页面说明}}">
              <template #actions>
                <MButton type="primary">
                  {{主操作}}
                </MButton>
              </template>
            </MPageHeader>

            <MPageFilters aria-label="筛选" collapsible>
              <MSpace wrap>
                <MInput v-model="keyword" placeholder="搜索名称" clearable style="width: 14rem" />
                <MSelect
                  v-model="status"
                  :options="statusOptions"
                  placeholder="状态"
                  clearable
                  style="width: 10rem"
                />
              </MSpace>
              <template #actions>
                <MButton>
                  查询
                </MButton>
                <MButton @click="resetFilters" type="text">
                  重置
                </MButton>
              </template>
            </MPageFilters>

            <MTable
              :columns="columns"
              :rows="rows"
              :rows-per-page="5"
              fill
              paginator
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
                <MEmpty
                  title="{{空态标题}}"
                  description="{{空态说明}}"
                  icon="user"
                >
                  <template #extra>
                    <MButton type="primary">
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

<style scoped>
/* rail 关键：侧栏氛围（token-only，不默认渐变/发光） */
.gp-rail-sider {
  background: var(--m-color-surface);
}

.gp-rail-sider__brand {
  align-items: center;
  display: flex;
  gap: var(--m-space-2);
  min-height: 3rem;
  padding: var(--m-space-3) var(--m-space-4);
}

.gp-rail-sider__mark {
  background: var(--m-color-primary);
  border-radius: var(--m-radius-sm);
  flex-shrink: 0;
  height: 1.25rem;
  width: 1.25rem;
}

.gp-rail-sider__name {
  color: var(--m-color-text);
  font-size: var(--m-font-size-md);
  font-weight: 600;
  letter-spacing: -0.02em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gp-rail-header {
  border-bottom: 1px solid var(--m-color-border);
}
</style>
