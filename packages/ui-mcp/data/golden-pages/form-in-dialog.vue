<script setup lang="ts">
/**
 * 黄金样例：列表内短表单弹窗（form-in-dialog）
 * 留在列表页，用 MDialog 承载 ≤8 字段的新建/编辑；长表单仍走 form-page / Drawer。
 * @see DESIGN.md · page-layouts.md · pattern form-in-dialog
 */
import {
  MBreadcrumb,
  MButton,
  MConfigProvider,
  MDialog,
  MForm,
  MFormItem,
  MInput,
  MLayout,
  MLayoutContent,
  MLayoutHeader,
  MPageContent,
  MPageHeader,
  MSelect,
  MSpace,
  MStatus,
  MTable,
  message,
  zhCN,
} from 'morya-ui'
import { reactive, ref } from 'vue'

const dialogOpen = ref(false)
const submitting = ref(false)
const editingId = ref<string | null>(null)

const model = reactive({
  name: '',
  email: '',
  role: undefined as string | undefined,
})

const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '成员', value: 'member' },
]

const columns = [
  { key: 'name', label: '姓名' },
  { key: 'email', label: '邮箱' },
  { key: 'status', label: '状态', width: 100 },
  { key: 'actions', label: '操作', width: 120 },
]

const rows = ref([
  { id: '1', name: '林晓', email: 'linxiao@example.com', status: 'active', role: 'member' },
  { id: '2', name: '周然', email: 'zhouran@example.com', status: 'inactive', role: 'admin' },
])

const dialogTitle = () => (editingId.value ? '编辑用户' : '新建用户')

function resetModel() {
  model.name = ''
  model.email = ''
  model.role = undefined
  editingId.value = null
}

function openCreate() {
  resetModel()
  dialogOpen.value = true
}

function openEdit(row: (typeof rows.value)[number]) {
  editingId.value = row.id
  model.name = row.name
  model.email = row.email
  model.role = row.role
  dialogOpen.value = true
}

function closeDialog() {
  dialogOpen.value = false
  resetModel()
}

async function onSave() {
  submitting.value = true
  try {
    // await api.save(model)
    message.success(editingId.value ? '已保存' : '已创建')
    closeDialog()
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <MConfigProvider :locale="zhCN">
    <MLayout fill-viewport>
      <MLayoutHeader padding="var(--m-space-4) var(--m-space-6)">
        <MBreadcrumb :model="[{ label: '首页', to: '/' }, { label: '用户管理' }]" />
      </MLayoutHeader>

      <MLayoutContent>
        <MPageContent>
          <MPageHeader title="用户管理" description="短表单留在列表内弹窗；字段多时再走独立表单页。">
            <template #actions>
              <MButton severity="primary" @click="openCreate">
                新建用户
              </MButton>
            </template>
          </MPageHeader>

          <MTable
            :columns="columns"
            :rows="rows"
            row-key="id"
            striped
            bordered
            aria-label="用户列表"
          >
            <template #cell-status="{ value }">
              <MStatus
                :label="value === 'active' ? '启用' : '停用'"
                :severity="value === 'active' ? 'success' : 'secondary'"
              />
            </template>
            <template #cell-actions="{ row }">
              <MButton severity="secondary" size="small" text @click="openEdit(row)">
                编辑
              </MButton>
            </template>
          </MTable>
        </MPageContent>
      </MLayoutContent>
    </MLayout>

    <MDialog
      v-model="dialogOpen"
      :header="dialogTitle()"
      width="32rem"
      @close="resetModel"
    >
      <MForm @submit.prevent="onSave">
        <MFormItem label="姓名" name="name" required>
          <MInput v-model="model.name" placeholder="请输入姓名" fluid />
        </MFormItem>
        <MFormItem label="邮箱" name="email" required>
          <MInput v-model="model.email" type="email" placeholder="name@example.com" fluid />
        </MFormItem>
        <MFormItem label="角色" name="role" required>
          <MSelect v-model="model.role" :options="roleOptions" placeholder="请选择角色" fluid />
        </MFormItem>
      </MForm>

      <template #footer>
        <MSpace style="justify-content: flex-end; width: 100%">
          <MButton severity="secondary" text :disabled="submitting" @click="closeDialog">
            取消
          </MButton>
          <MButton severity="primary" :loading="submitting" @click="onSave">
            保存
          </MButton>
        </MSpace>
      </template>
    </MDialog>
  </MConfigProvider>
</template>
