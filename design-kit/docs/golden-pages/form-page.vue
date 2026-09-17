<script setup lang="ts">
/**
 * 黄金样例：表单页
 * @see DESIGN.md §3
 */
import {
  MBreadcrumb,
  MButton,
  MConfigProvider,
  MDatePicker,
  MForm,
  MFormItem,
  MInput,
  MLayout,
  MLayoutContent,
  MLayoutHeader,
  MPageContent,
  MPageHeader,
  MPageSection,
  MSelect,
  MSpace,
  MSwitch,
  MTextarea,
  zhCN,
} from 'morya-ui'
import { reactive, ref } from 'vue'

const submitting = ref(false)

const model = reactive({
  name: '',
  email: '',
  role: undefined as string | undefined,
  active: true,
  joinedAt: null as string | null,
  bio: '',
})

const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '成员', value: 'member' },
]

async function onSubmit() {
  submitting.value = true
  try {
    // await api.save(model)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <MConfigProvider :locale="zhCN">
    <MLayout fill-viewport>
      <MLayoutHeader padding="var(--m-space-4) var(--m-space-6)">
        <MBreadcrumb :model="[{ label: '首页', to: '/' }, { label: '用户管理', to: '/users' }, { label: '新建用户' }]" />
      </MLayoutHeader>

      <MLayoutContent>
        <MPageContent width="narrow">
          <MPageHeader title="新建用户" description="填写基本信息并分配角色。" />

          <MPageSection variant="form">
            <MForm @submit="onSubmit">
              <MFormItem label="姓名" name="name" required>
                <MInput v-model="model.name" placeholder="请输入姓名" fluid />
              </MFormItem>

              <MFormItem label="邮箱" name="email" required>
                <MInput v-model="model.email" type="email" placeholder="name@example.com" fluid />
              </MFormItem>

              <MFormItem label="角色" name="role" required>
                <MSelect v-model="model.role" :options="roleOptions" placeholder="请选择角色" fluid />
              </MFormItem>

              <MFormItem label="入职日期" name="joinedAt">
                <MDatePicker v-model="model.joinedAt" placeholder="选择日期" fluid />
              </MFormItem>

              <MFormItem label="启用账号" name="active">
                <MSwitch v-model="model.active" />
              </MFormItem>

              <MFormItem label="简介" name="bio">
                <MTextarea v-model="model.bio" :rows="4" placeholder="可选" fluid />
              </MFormItem>

              <MPageSection variant="actions">
                <MSpace>
                  <MButton native-type="submit" severity="primary" :loading="submitting">
                    保存
                  </MButton>
                  <MButton severity="secondary">
                    取消
                  </MButton>
                </MSpace>
              </MPageSection>
            </MForm>
          </MPageSection>
        </MPageContent>
      </MLayoutContent>
    </MLayout>
  </MConfigProvider>
</template>
