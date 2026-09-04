<script setup lang="ts">
/**
 * 黄金样例：表单页
 * @see DESIGN.md §3
 */
import {
  WdBreadcrumb,
  WdButton,
  WdConfigProvider,
  WdDatePicker,
  WdForm,
  WdFormItem,
  WdInput,
  WdLayout,
  WdLayoutContent,
  WdLayoutHeader,
  WdSelect,
  WdSpace,
  WdSwitch,
  WdTextarea,
  zhCN,
} from '@wex-design/ui'
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
  <WdConfigProvider :locale="zhCN">
    <WdLayout class="page-form">
      <WdLayoutHeader class="page-form__header">
        <WdBreadcrumb :model="[{ label: '首页', to: '/' }, { label: '用户管理', to: '/users' }, { label: '新建用户' }]" />
      </WdLayoutHeader>

      <WdLayoutContent class="page-form__content">
        <header class="page-form__intro">
          <h1 class="page-form__title">新建用户</h1>
          <p class="page-form__desc">填写基本信息并分配角色。</p>
        </header>

        <WdForm class="page-form__form" @submit="onSubmit">
          <WdFormItem label="姓名" name="name" required>
            <WdInput v-model="model.name" placeholder="请输入姓名" fluid />
          </WdFormItem>

          <WdFormItem label="邮箱" name="email" required>
            <WdInput v-model="model.email" type="email" placeholder="name@example.com" fluid />
          </WdFormItem>

          <WdFormItem label="角色" name="role" required>
            <WdSelect v-model="model.role" :options="roleOptions" placeholder="请选择角色" fluid />
          </WdFormItem>

          <WdFormItem label="入职日期" name="joinedAt">
            <WdDatePicker v-model="model.joinedAt" placeholder="选择日期" fluid />
          </WdFormItem>

          <WdFormItem label="启用账号" name="active">
            <WdSwitch v-model="model.active" />
          </WdFormItem>

          <WdFormItem label="简介" name="bio">
            <WdTextarea v-model="model.bio" :rows="4" placeholder="可选" fluid />
          </WdFormItem>

          <footer class="page-form__actions">
            <WdSpace>
              <WdButton native-type="submit" severity="primary" :loading="submitting">保存</WdButton>
              <WdButton severity="secondary">取消</WdButton>
            </WdSpace>
          </footer>
        </WdForm>
      </WdLayoutContent>
    </WdLayout>
  </WdConfigProvider>
</template>

<style scoped>
.page-form {
  min-height: 100vh;
  background: var(--wd-color-surface);
}

.page-form__header {
  padding: var(--wd-space-4) var(--wd-space-6);
  border-bottom: 1px solid var(--wd-color-border);
  background: var(--wd-color-surface);
}

.page-form__content {
  padding: var(--wd-space-6);
  max-width: 42rem;
}

.page-form__intro {
  margin-bottom: var(--wd-space-6);
}

.page-form__title {
  margin: 0 0 var(--wd-space-2);
  font-size: var(--wd-font-size-lg);
  font-weight: 600;
  color: var(--wd-color-text);
}

.page-form__desc {
  margin: 0;
  color: var(--wd-color-text-muted);
  font-size: var(--wd-font-size-md);
}

.page-form__form {
  padding: var(--wd-space-6);
  background: var(--wd-color-surface);
  border: 1px solid var(--wd-color-border);
  border-radius: var(--wd-radius-md);
  box-shadow: var(--wd-shadow-sm);
}

.page-form__actions {
  margin-top: var(--wd-space-6);
  padding-top: var(--wd-space-4);
  border-top: 1px solid var(--wd-color-border);
}
</style>
