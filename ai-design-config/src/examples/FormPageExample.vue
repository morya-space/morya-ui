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
    <MLayout class="page-form">
      <MLayoutHeader class="page-form__header">
        <MBreadcrumb :model="[{ label: '首页', to: '/' }, { label: '用户管理', to: '/users' }, { label: '新建用户' }]" />
      </MLayoutHeader>

      <MLayoutContent class="page-form__content">
        <header class="page-form__intro">
          <h1 class="page-form__title">新建用户</h1>
          <p class="page-form__desc">填写基本信息并分配角色。</p>
        </header>

        <MForm class="page-form__form" @submit="onSubmit">
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

          <footer class="page-form__actions">
            <MSpace>
              <MButton native-type="submit" severity="primary" :loading="submitting">保存</MButton>
              <MButton severity="secondary">取消</MButton>
            </MSpace>
          </footer>
        </MForm>
      </MLayoutContent>
    </MLayout>
  </MConfigProvider>
</template>

<style scoped>
.page-form {
  min-height: 100vh;
  background: var(--m-color-surface);
}

.page-form__header {
  padding: var(--m-space-4) var(--m-space-6);
  border-bottom: 1px solid var(--m-color-border);
  background: var(--m-color-surface);
}

.page-form__content {
  padding: var(--m-space-6);
  max-width: 42rem;
}

.page-form__intro {
  margin-bottom: var(--m-space-6);
}

.page-form__title {
  margin: 0 0 var(--m-space-2);
  font-size: var(--m-font-size-lg);
  font-weight: 600;
  color: var(--m-color-text);
}

.page-form__desc {
  margin: 0;
  color: var(--m-color-text-muted);
  font-size: var(--m-font-size-md);
}

.page-form__form {
  padding: var(--m-space-6);
  background: var(--m-color-surface);
  border: 1px solid var(--m-color-border);
  border-radius: var(--m-radius-md);
  box-shadow: var(--m-shadow-sm);
}

.page-form__actions {
  margin-top: var(--m-space-6);
  padding-top: var(--m-space-4);
  border-top: 1px solid var(--m-color-border);
}
</style>
