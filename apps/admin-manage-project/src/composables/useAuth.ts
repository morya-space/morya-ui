import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
}

const storageKey = 'edu-admin-auth'

const user = ref<AuthUser | null>(readUser())
const mfaVerified = ref(false)

function readUser(): AuthUser | null {
  if (typeof localStorage === 'undefined') return null
  try {
    const raw = localStorage.getItem(storageKey)
    return raw ? JSON.parse(raw) as AuthUser : null
  } catch {
    return null
  }
}

function persistUser(next: AuthUser | null) {
  user.value = next
  if (next) localStorage.setItem(storageKey, JSON.stringify(next))
  else localStorage.removeItem(storageKey)
}

export function useAuth() {
  const router = useRouter()
  const isAuthenticated = computed(() => Boolean(user.value && mfaVerified.value))

  async function login(payload: { account: string; password: string; otp?: string }) {
    await delay(400)
    const demoAccounts: Record<string, { password: string; user: AuthUser }> = {
      admin: {
        password: 'admin123',
        user: { id: 'u1', name: '张教务', email: 'admin@educloud.cn', role: '超级管理员' },
      },
      teacher: {
        password: 'teacher123',
        user: { id: 'u2', name: '李老师', email: 'li@educloud.cn', role: '教务主任' },
      },
    }
    const account = payload.account.trim().toLowerCase()
    const record = demoAccounts[account]
    if (!record || record.password !== payload.password) {
      throw new Error('账号或密码错误')
    }
    if (account === 'admin' && payload.otp !== '123456') {
      mfaVerified.value = false
      persistUser(record.user)
      throw new Error('MFA_REQUIRED')
    }
    persistUser(record.user)
    mfaVerified.value = true
  }

  async function verifyMfa(code: string) {
    await delay(300)
    if (code !== '123456') throw new Error('验证码错误')
    mfaVerified.value = true
  }

  async function register(payload: { name: string; email: string; password: string }) {
    await delay(500)
    if (!payload.name || !payload.email || !payload.password) {
      throw new Error('请填写完整信息')
    }
    persistUser({
      id: `u-${Date.now()}`,
      name: payload.name,
      email: payload.email,
      role: '访客',
    })
    mfaVerified.value = true
  }

  function logout() {
    persistUser(null)
    mfaVerified.value = false
    router.push('/login')
  }

  return {
    user,
    isAuthenticated,
    mfaVerified,
    login,
    verifyMfa,
    register,
    logout,
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
