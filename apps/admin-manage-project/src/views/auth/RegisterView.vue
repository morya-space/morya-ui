<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  WiButton,
  WiCard,
  WiForm,
  WiFormItem,
  WiInput,
  useToast,
} from '@well-insight/ui'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { register } = useAuth()
const toast = useToast()
const loading = ref(false)

const model = reactive({
  name: '',
  email: '',
  password: '',
  confirm: '',
})

async function onSubmitForm(payload: { valid: boolean }) {
  if (!payload.valid) return
  await onSubmit()
}

async function onSubmit() {
  if (model.password !== model.confirm) {
    toast.add({ severity: 'warn', summary: '两次密码不一致', life: 3000 })
    return
  }
  loading.value = true
  try {
    await register({ name: model.name, email: model.email, password: model.password })
    toast.add({ severity: 'success', summary: '注册成功', life: 2500 })
    router.push('/dashboard')
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: '注册失败',
      detail: err instanceof Error ? err.message : undefined,
      life: 3500,
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <WiCard class="register-page">
    <header class="register-page__header">
      <h1>注册智学云账号</h1>
      <p>演示注册，数据保存在 localStorage</p>
    </header>
    <WiForm @submit="onSubmitForm">
      <WiFormItem label="姓名" name="name" required>
        <WiInput v-model="model.name" fluid />
      </WiFormItem>
      <WiFormItem label="邮箱" name="email" required>
        <WiInput v-model="model.email" type="email" fluid />
      </WiFormItem>
      <WiFormItem label="密码" name="password" required>
        <WiInput v-model="model.password" type="password" fluid />
      </WiFormItem>
      <WiFormItem label="确认密码" name="confirm" required>
        <WiInput v-model="model.confirm" type="password" fluid />
      </WiFormItem>
      <WiButton native-type="submit" fluid :loading="loading">提交注册</WiButton>
    </WiForm>
    <p class="register-page__footer">
      已有账号？
      <RouterLink to="/login">去登录</RouterLink>
    </p>
  </WiCard>
</template>

<style scoped>
.register-page {
  width: min(100%, 26rem);
  padding: var(--wi-space-6);
  box-shadow: var(--wi-shadow-md);
}

.register-page__header h1 {
  margin: 0 0 var(--wi-space-2);
  font-size: var(--wi-font-size-lg);
}

.register-page__header p {
  margin: 0 0 var(--wi-space-4);
  color: var(--wi-color-text-muted);
  font-size: var(--wi-font-size-sm);
}

.register-page__footer {
  margin-top: var(--wi-space-4);
  text-align: center;
  color: var(--wi-color-text-muted);
  font-size: var(--wi-font-size-sm);
}

.register-page__footer a {
  color: var(--wi-color-primary);
}
</style>
