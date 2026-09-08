<script setup lang="ts">
/**
 * 黄金样例：表单页
 * @see DESIGN.md §3
 */
import {
  WkBreadcrumb,
  WkButton,
  WkConfigProvider,
  WkDatePicker,
  WkForm,
  WkFormItem,
  WkInput,
  WkLayout,
  WkLayoutContent,
  WkLayoutHeader,
  WkSelect,
  WkSpace,
  WkSwitch,
  WkTextarea,
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
  <WkConfigProvider :locale="zhCN">
    <WkLayout class="page-form">
      <WkLayoutHeader class="page-form__header">
        <WkBreadcrumb :model="[{ label: '首页', to: '/' }, { label: '用户管理', to: '/users' }, { label: '新建用户' }]" />
      </WkLayoutHeader>

      <WkLayoutContent class="page-form__content">
        <header class="page-form__intro">
          <h1 class="page-form__title">新建用户</h1>
          <p class="page-form__desc">填写基本信息并分配角色。</p>
        </header>

        <WkForm class="page-form__form" @submit="onSubmit">
          <WkFormItem label="姓名" name="name" required>
            <WkInput v-model="model.name" placeholder="请输入姓名" fluid />
          </WkFormItem>

          <WkFormItem label="邮箱" name="email" required>
            <WkInput v-model="model.email" type="email" placeholder="name@example.com" fluid />
          </WkFormItem>

          <WkFormItem label="角色" name="role" required>
            <WkSelect v-model="model.role" :options="roleOptions" placeholder="请选择角色" fluid />
          </WkFormItem>

          <WkFormItem label="入职日期" name="joinedAt">
            <WkDatePicker v-model="model.joinedAt" placeholder="选择日期" fluid />
          </WkFormItem>

          <WkFormItem label="启用账号" name="active">
            <WkSwitch v-model="model.active" />
          </WkFormItem>

          <WkFormItem label="简介" name="bio">
            <WkTextarea v-model="model.bio" :rows="4" placeholder="可选" fluid />
          </WkFormItem>

          <footer class="page-form__actions">
            <WkSpace>
              <WkButton native-type="submit" severity="primary" :loading="submitting">保存</WkButton>
              <WkButton severity="secondary">取消</WkButton>
            </WkSpace>
          </footer>
        </WkForm>
      </WkLayoutContent>
    </WkLayout>
  </WkConfigProvider>
</template>

<style scoped>
.page-form {
  min-height: 100vh;
  background: var(--wk-color-surface);
}

.page-form__header {
  padding: var(--wk-space-4) var(--wk-space-6);
  border-bottom: 1px solid var(--wk-color-border);
  background: var(--wk-color-surface);
}

.page-form__content {
  padding: var(--wk-space-6);
  max-width: 42rem;
}

.page-form__intro {
  margin-bottom: var(--wk-space-6);
}

.page-form__title {
  margin: 0 0 var(--wk-space-2);
  font-size: var(--wk-font-size-lg);
  font-weight: 600;
  color: var(--wk-color-text);
}

.page-form__desc {
  margin: 0;
  color: var(--wk-color-text-muted);
  font-size: var(--wk-font-size-md);
}

.page-form__form {
  padding: var(--wk-space-6);
  background: var(--wk-color-surface);
  border: 1px solid var(--wk-color-border);
  border-radius: var(--wk-radius-md);
  box-shadow: var(--wk-shadow-sm);
}

.page-form__actions {
  margin-top: var(--wk-space-6);
  padding-top: var(--wk-space-4);
  border-top: 1px solid var(--wk-color-border);
}
</style>
