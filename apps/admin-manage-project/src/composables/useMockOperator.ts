import { watchEffect } from 'vue'
import { setMockOperator } from '@/mock/store'
import { useAuth } from './useAuth'

export function useMockOperator() {
  const { user } = useAuth()
  watchEffect(() => {
    setMockOperator(user.value?.name ?? '系统')
  })
}
