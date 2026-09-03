<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  WiButton,
  WiCard,
  WiForm,
  WiFormItem,
  WiInput,
  WiInputOtp,
  WiMessage,
  WiSpace,
  WiTabs,
} from '@well-insight/ui'
import { useActionFeedback } from '@/composables/useActionFeedback'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const route = useRoute()
const { login, verifyMfa, mfaVerified, user } = useAuth()
const feedback = useActionFeedback()

const tab = ref('password')
const account = ref('admin')
const password = ref('admin123')
const email = ref('')
const otp = ref('')
const loading = ref(false)
const error = ref('')

const showMfa = computed(() => route.query.mfa === '1' || (user.value && !mfaVerified.value))

async function onSubmitForm(payload: { valid: boolean }) {
  if (!payload.valid) return
  if (tab.value === 'otp') {
    error.value = '邮箱验证码登录暂未开放，请使用账号密码'
    return
  }
  await onLogin()
}

async function onLogin() {
  loading.value = true
  error.value = ''
  try {
    await login({ account: account.value, password: password.value })
    feedback.notify('登录成功', '欢迎回来')
    router.push('/dashboard')
  } catch (err) {
    const msg = err instanceof Error ? err.message : '登录失败'
    if (msg === 'MFA_REQUIRED') {
      router.replace('/login?mfa=1')
      error.value = '需要 MFA 验证，演示验证码 123456'
    } else {
      error.value = msg
    }
  } finally {
    loading.value = false
  }
}

async function onVerifyMfaSubmit(payload: { valid: boolean }) {
  if (!payload.valid) return
  await onVerifyMfa()
}

async function onVerifyMfa() {
  loading.value = true
  error.value = ''
  try {
    await verifyMfa(otp.value)
    feedback.ok('验证成功')
    router.push('/dashboard')
  } catch (err) {
    error.value = err instanceof Error ? err.message : '验证失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <WiCard class="login-page">
    <header class="login-page__header">
      <h1>智学云 · 教育管理后台</h1>
      <p>演示账号 admin / admin123 · MFA 123456</p>
    </header>

    <WiMessage v-if="error" severity="error" :closable="false">{{ error }}</WiMessage>

    <template v-if="showMfa">
      <WiForm @submit="onVerifyMfaSubmit">
        <WiFormItem label="MFA 验证码" name="otp" required>
          <WiInputOtp v-model="otp" :length="6" />
        </WiFormItem>
        <WiButton native-type="submit" fluid :loading="loading">完成验证</WiButton>
      </WiForm>
    </template>

    <template v-else>
      <WiTabs
        v-model="tab"
        :tabs="[
          { label: '账号密码', value: 'password' },
          { label: '邮箱验证码', value: 'otp' },
        ]"
      />
      <WiForm @submit="onSubmitForm">
        <WiFormItem v-if="tab === 'password'" label="账号" name="account" required>
          <WiInput v-model="account" placeholder="admin / teacher" fluid />
        </WiFormItem>
        <WiFormItem v-if="tab === 'password'" label="密码" name="password" required>
          <WiInput v-model="password" type="password" fluid />
        </WiFormItem>
        <WiFormItem v-else label="邮箱验证码" name="emailOtp">
          <WiSpace>
            <WiInput v-model="email" placeholder="name@educloud.cn" fluid />
            <WiButton severity="secondary" type="button">获取验证码</WiButton>
          </WiSpace>
        </WiFormItem>
        <WiButton native-type="submit" fluid :loading="loading">登录</WiButton>
      </WiForm>
      <p class="login-page__footer">
        还没有账号？
        <RouterLink to="/register">注册</RouterLink>
      </p>
    </template>
  </WiCard>
</template>

<style scoped>
.login-page {
  width: min(100%, 26rem);
  padding: var(--wi-space-6);
  box-shadow: var(--wi-shadow-md);
}

.login-page__header h1 {
  margin: 0 0 var(--wi-space-2);
  font-size: var(--wi-font-size-lg);
}

.login-page__header p {
  margin: 0 0 var(--wi-space-4);
  color: var(--wi-color-text-muted);
  font-size: var(--wi-font-size-sm);
}

.login-page__footer {
  margin: var(--wi-space-4) 0 0;
  text-align: center;
  color: var(--wi-color-text-muted);
  font-size: var(--wi-font-size-sm);
}

.login-page__footer a {
  color: var(--wi-color-primary);
}
</style>
