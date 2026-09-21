<script setup lang="ts">
/**
 * 黄金样例：登录页（Account + 轻量品牌）
 * @see DESIGN.md · surfaces § Account · visual-craft § Atmosphere
 */
import {
  MButton,
  MConfigProvider,
  MForm,
  MFormItem,
  MInput,
  MInputPassword,
  MSpace,
  zhCN,
} from 'morya-ui'
import { reactive, ref } from 'vue'

const submitting = ref(false)
const formError = ref('')

const model = reactive({
  email: '',
  password: '',
})

async function onSubmit() {
  formError.value = ''
  submitting.value = true
  try {
    // await api.login(model)
    if (!model.email || !model.password) {
      formError.value = '请输入邮箱和密码后再试。'
      return
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <MConfigProvider :locale="zhCN">
    <div class="login-shell">
      <aside class="login-brand" aria-label="品牌">
        <p class="login-brand__mark">青禾书房</p>
        <h1 class="login-brand__title">把好书留在手边</h1>
        <p class="login-brand__lead">
          店员与会员共用同一套账户。登录后继续进货、上架与会员服务。
        </p>
      </aside>

      <main class="login-main">
        <div class="login-panel">
          <header class="login-panel__header">
            <h2>登录</h2>
            <p>使用工作邮箱进入后台。</p>
          </header>

          <p v-if="formError" class="login-alert" role="alert">
            {{ formError }}
          </p>

          <MForm @submit="onSubmit">
            <MFormItem label="邮箱" name="email" required>
              <MInput
                v-model="model.email"
                type="email"
                placeholder="name@qinghe.example"
                autocomplete="username"
                fluid
              />
            </MFormItem>

            <MFormItem label="密码" name="password" required>
              <MInputPassword
                v-model="model.password"
                placeholder="请输入密码"
                autocomplete="current-password"
                fluid
              />
            </MFormItem>

            <MSpace style="margin-top: var(--m-space-2)" alignment="center">
              <MButton type="submit" label="登录" severity="primary" :loading="submitting" />
              <MButton type="button" label="忘记密码" severity="secondary" text />
            </MSpace>
          </MForm>
        </div>
      </main>
    </div>
  </MConfigProvider>
</template>

<style scoped>
.login-shell {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  min-height: 100vh;
  background: var(--m-color-surface);
  color: var(--m-color-text);
}

.login-brand {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: var(--m-space-4);
  padding: clamp(2rem, 6vw, 4.5rem);
  overflow: hidden;
  background:
    radial-gradient(
      80% 60% at 10% 20%,
      color-mix(in srgb, var(--m-color-primary) 22%, transparent),
      transparent 55%
    ),
    linear-gradient(
      165deg,
      color-mix(in srgb, var(--m-color-primary) 16%, var(--m-color-surface)) 0%,
      var(--m-color-surface) 55%,
      color-mix(in srgb, var(--m-color-border) 35%, var(--m-color-surface)) 100%
    );
  border-right: 1px solid var(--m-color-border);
}

.login-brand::after {
  content: '';
  position: absolute;
  inset: auto -10% -20% 40%;
  height: 55%;
  border-radius: 50%;
  background: color-mix(in srgb, var(--m-color-primary) 12%, transparent);
  pointer-events: none;
}

.login-brand__mark,
.login-brand__title,
.login-brand__lead {
  position: relative;
  z-index: 1;
}

.login-brand__mark {
  margin: 0;
  font-size: 0.8125rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--m-color-text-muted);
}

.login-brand__title {
  margin: 0;
  max-width: 12em;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 650;
  line-height: 1.15;
  letter-spacing: -0.03em;
}

.login-brand__lead {
  margin: 0;
  max-width: 28rem;
  color: var(--m-color-text-muted);
  line-height: 1.6;
}

.login-main {
  display: grid;
  place-items: center;
  padding: var(--m-space-6);
}

.login-panel {
  width: min(100%, 22rem);
}

.login-panel__header {
  margin-bottom: var(--m-space-5);
}

.login-panel__header h2 {
  margin: 0 0 var(--m-space-2);
  font-size: 1.5rem;
  font-weight: 650;
}

.login-panel__header p {
  margin: 0;
  color: var(--m-color-text-muted);
}

.login-alert {
  margin: 0 0 var(--m-space-4);
  padding: var(--m-space-3) var(--m-space-4);
  border: 1px solid color-mix(in srgb, var(--m-color-danger) 40%, var(--m-color-border));
  border-radius: var(--m-radius-md);
  background: color-mix(in srgb, var(--m-color-danger) 10%, var(--m-color-surface));
  color: var(--m-color-danger);
  font-size: 0.875rem;
  line-height: 1.45;
}

@media (prefers-reduced-motion: no-preference) {
  .login-panel {
    animation: login-panel-in 420ms ease both;
  }
}

@keyframes login-panel-in {
  from {
    opacity: 0;
    transform: translateY(0.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .login-shell {
    grid-template-columns: 1fr;
  }

  .login-brand {
    border-right: 0;
    border-bottom: 1px solid var(--m-color-border);
    min-height: 12rem;
  }
}
</style>
