<script setup lang="ts">
/**
 * 黄金样例：表单页
 * @see DESIGN.md §3
 */
import {
  RdBreadcrumb,
  RdButton,
  RdConfigProvider,
  RdDatePicker,
  RdForm,
  RdFormItem,
  RdInput,
  RdLayout,
  RdLayoutContent,
  RdLayoutHeader,
  RdSelect,
  RdSpace,
  RdSwitch,
  RdTextarea,
  zhCN,
} from '@wise-kit/ui'
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
  <RdConfigProvider :locale="zhCN">
    <RdLayout class="page-form">
      <RdLayoutHeader class="page-form__header">
        <RdBreadcrumb :model="[{ label: '首页', to: '/' }, { label: '用户管理', to: '/users' }, { label: '新建用户' }]" />
      </RdLayoutHeader>

      <RdLayoutContent class="page-form__content">
        <header class="page-form__intro">
          <h1 class="page-form__title">新建用户</h1>
          <p class="page-form__desc">填写基本信息并分配角色。</p>
        </header>

        <RdForm class="page-form__form" @submit="onSubmit">
          <RdFormItem label="姓名" name="name" required>
            <RdInput v-model="model.name" placeholder="请输入姓名" fluid />
          </RdFormItem>

          <RdFormItem label="邮箱" name="email" required>
            <RdInput v-model="model.email" type="email" placeholder="name@example.com" fluid />
          </RdFormItem>

          <RdFormItem label="角色" name="role" required>
            <RdSelect v-model="model.role" :options="roleOptions" placeholder="请选择角色" fluid />
          </RdFormItem>

          <RdFormItem label="入职日期" name="joinedAt">
            <RdDatePicker v-model="model.joinedAt" placeholder="选择日期" fluid />
          </RdFormItem>

          <RdFormItem label="启用账号" name="active">
            <RdSwitch v-model="model.active" />
          </RdFormItem>

          <RdFormItem label="简介" name="bio">
            <RdTextarea v-model="model.bio" :rows="4" placeholder="可选" fluid />
          </RdFormItem>

          <footer class="page-form__actions">
            <RdSpace>
              <RdButton native-type="submit" severity="primary" :loading="submitting">保存</RdButton>
              <RdButton severity="secondary">取消</RdButton>
            </RdSpace>
          </footer>
        </RdForm>
      </RdLayoutContent>
    </RdLayout>
  </RdConfigProvider>
</template>

<style scoped>
.page-form {
  min-height: 100vh;
  background: var(--rd-color-surface);
}

.page-form__header {
  padding: var(--rd-space-4) var(--rd-space-6);
  border-bottom: 1px solid var(--rd-color-border);
  background: var(--rd-color-surface);
}

.page-form__content {
  padding: var(--rd-space-6);
  max-width: 42rem;
}

.page-form__intro {
  margin-bottom: var(--rd-space-6);
}

.page-form__title {
  margin: 0 0 var(--rd-space-2);
  font-size: var(--rd-font-size-lg);
  font-weight: 600;
  color: var(--rd-color-text);
}

.page-form__desc {
  margin: 0;
  color: var(--rd-color-text-muted);
  font-size: var(--rd-font-size-md);
}

.page-form__form {
  padding: var(--rd-space-6);
  background: var(--rd-color-surface);
  border: 1px solid var(--rd-color-border);
  border-radius: var(--rd-radius-md);
  box-shadow: var(--rd-shadow-sm);
}

.page-form__actions {
  margin-top: var(--rd-space-6);
  padding-top: var(--rd-space-4);
  border-top: 1px solid var(--rd-color-border);
}
</style>
