<script setup lang="ts">
/**
 * 黄金样例：表单页
 * @see DESIGN.md §3
 */
import {
  WiBreadcrumb,
  WiButton,
  WiConfigProvider,
  WiDatePicker,
  WiForm,
  WiFormItem,
  WiInput,
  WiLayout,
  WiLayoutContent,
  WiLayoutHeader,
  WiSelect,
  WiSpace,
  WiSwitch,
  WiTextarea,
  zhCN,
} from '@well-insight/ui'
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
  <WiConfigProvider :locale="zhCN">
    <WiLayout class="page-form">
      <WiLayoutHeader class="page-form__header">
        <WiBreadcrumb :model="[{ label: '首页', to: '/' }, { label: '用户管理', to: '/users' }, { label: '新建用户' }]" />
      </WiLayoutHeader>

      <WiLayoutContent class="page-form__content">
        <header class="page-form__intro">
          <h1 class="page-form__title">新建用户</h1>
          <p class="page-form__desc">填写基本信息并分配角色。</p>
        </header>

        <WiForm class="page-form__form" @submit="onSubmit">
          <WiFormItem label="姓名" name="name" required>
            <WiInput v-model="model.name" placeholder="请输入姓名" fluid />
          </WiFormItem>

          <WiFormItem label="邮箱" name="email" required>
            <WiInput v-model="model.email" type="email" placeholder="name@example.com" fluid />
          </WiFormItem>

          <WiFormItem label="角色" name="role" required>
            <WiSelect v-model="model.role" :options="roleOptions" placeholder="请选择角色" fluid />
          </WiFormItem>

          <WiFormItem label="入职日期" name="joinedAt">
            <WiDatePicker v-model="model.joinedAt" placeholder="选择日期" fluid />
          </WiFormItem>

          <WiFormItem label="启用账号" name="active">
            <WiSwitch v-model="model.active" />
          </WiFormItem>

          <WiFormItem label="简介" name="bio">
            <WiTextarea v-model="model.bio" :rows="4" placeholder="可选" fluid />
          </WiFormItem>

          <footer class="page-form__actions">
            <WiSpace>
              <WiButton native-type="submit" severity="primary" :loading="submitting">保存</WiButton>
              <WiButton severity="secondary">取消</WiButton>
            </WiSpace>
          </footer>
        </WiForm>
      </WiLayoutContent>
    </WiLayout>
  </WiConfigProvider>
</template>

<style scoped>
.page-form {
  min-height: 100vh;
  background: var(--wi-color-surface);
}

.page-form__header {
  padding: var(--wi-space-4) var(--wi-space-6);
  border-bottom: 1px solid var(--wi-color-border);
  background: var(--wi-color-surface);
}

.page-form__content {
  padding: var(--wi-space-6);
  max-width: 42rem;
}

.page-form__intro {
  margin-bottom: var(--wi-space-6);
}

.page-form__title {
  margin: 0 0 var(--wi-space-2);
  font-size: var(--wi-font-size-lg);
  font-weight: 600;
  color: var(--wi-color-text);
}

.page-form__desc {
  margin: 0;
  color: var(--wi-color-text-muted);
  font-size: var(--wi-font-size-md);
}

.page-form__form {
  padding: var(--wi-space-6);
  background: var(--wi-color-surface);
  border: 1px solid var(--wi-color-border);
  border-radius: var(--wi-radius-md);
  box-shadow: var(--wi-shadow-sm);
}

.page-form__actions {
  margin-top: var(--wi-space-6);
  padding-top: var(--wi-space-4);
  border-top: 1px solid var(--wi-color-border);
}
</style>
