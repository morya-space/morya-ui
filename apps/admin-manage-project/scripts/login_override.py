LOGIN_VIEW = """<script setup lang="ts">
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
  useToast,
} from '@well-insight/ui'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const route = useRoute()
const { login, verifyMfa, mfaVerified, user } = useAuth()
const toast = useToast()

const tab = ref('password')
const account = ref('admin')
const password = ref('admin123')
const otp = ref('')
const loading = ref(false)
const error = ref('')

const showMfa = computed(() => route.query.mfa === '1' || (user.value && !mfaVerified.value))

async function onLogin() {
  loading.value = true
  error.value = ''
  try {
    await login({ account: account.value, password: password.value })
    toast.add({ severity: 'success', summary: '登录成功', detail: '欢迎回来', life: 3000 })
    router.push('/dashboard')
  } catch (err) {
    const message = err instanceof Error ? err.message : '登录失败'
    if (message === 'MFA_REQUIRED') {
      router.replace('/login?mfa=1')
      error.value = '需要 MFA 验证，演示验证码 123456'
    } else {
      error.value = message
    }
  } finally {
    loading.value = false
  }
}

async function onVerifyMfa() {
  loading.value = true
  error.value = ''
  try {
    await verifyMfa(otp.value)
    toast.add({ severity: 'success', summary: '验证成功', life: 2500 })
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
      <WiForm @submit.prevent="onVerifyMfa">
        <WiFormItem label="MFA 验证码" name="otp" required>
          <WiInputOtp v-model="otp" :length="6" />
        </WiFormItem>
        <WiButton native-type="submit" fluid :loading="loading">完成验证</WiButton>
      </WiForm>
    </template>

    <template v-else>
      <WiTabs v-model="tab" :tabs="[{ label: '账号密码', value: 'password' }, { label: '邮箱验证码', value: 'otp' }]" />
      <WiForm @submit.prevent="onLogin">
        <WiFormItem label="账号" name="account" required>
          <WiInput v-model="account" placeholder="admin / teacher" fluid />
        </WiFormItem>
        <WiFormItem v-if="tab === 'password'" label="密码" name="password" required>
          <WiInput v-model="password" type="password" fluid />
        </WiFormItem>
        <WiFormItem v-else label="邮箱验证码" name="emailOtp">
          <WiSpace>
            <WiInput placeholder="name@educloud.cn" fluid />
            <WiButton severity="secondary">获取验证码</WiButton>
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
"""
