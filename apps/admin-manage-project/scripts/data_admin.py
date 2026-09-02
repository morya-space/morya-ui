ADMIN_LAYOUT = r"""<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import {
  WiAvatar,
  WiBreadcrumb,
  WiButton,
  WiDropdown,
  WiIcon,
  WiLayout,
  WiLayoutHeader,
  WiLayoutSider,
  WiMenu,
  WiSpace,
  useTheme,
} from '@well-insight/ui'
import AppCommandMenu from '@/components/AppCommandMenu.vue'
import { adminMenu, menuKeyFromPath, routeByMenuKey } from '@/config/navigation'
import { useAuth } from '@/composables/useAuth'
import { useLocale } from '@/composables/useLocale'

const router = useRouter()
const route = useRoute()
const { user, logout } = useAuth()
const { toggleLocale, t } = useLocale()
const { isDark, toggleTheme } = useTheme()

const collapsed = ref(false)
const commandOpen = ref(false)
const selectedKey = ref<string | null>(menuKeyFromPath(route.path))

watch(() => route.path, (path) => {
  selectedKey.value = menuKeyFromPath(path)
})

const breadcrumbs = computed(() => {
  const segments = route.path.split('/').filter(Boolean)
  const items = [{ label: t('\u9996\u9875', 'Home'), to: '/dashboard' }]
  const labels: Record<string, string> = {
    dashboard: t('\u4eea\u8868\u76d8', 'Dashboard'),
    security: t('\u6743\u9650\u4e0e\u5b89\u5168', 'Security'),
    academic: t('\u6559\u52a1\u4e1a\u52a1', 'Academic'),
    system: t('\u7cfb\u7edf\u8fd0\u8425', 'System'),
    analytics: t('\u5206\u6790\u62a5\u8868', 'Analytics'),
    extras: t('\u80fd\u529b\u589e\u5f3a', 'Extras'),
    users: t('\u7528\u6237\u7ba1\u7406', 'Users'),
    roles: t('\u89d2\u8272\u7ba1\u7406', 'Roles'),
    permissions: t('\u6743\u9650\u7ba1\u7406', 'Permissions'),
    'data-scope': t('\u6570\u636e\u6743\u9650', 'Data Scope'),
    'audit-logs': t('\u5ba1\u8ba1\u65e5\u5fd7', 'Audit Logs'),
    students: t('\u5b66\u751f\u7ba1\u7406', 'Students'),
    teachers: t('\u6559\u5e08\u7ba1\u7406', 'Teachers'),
    courses: t('\u8bfe\u7a0b\u7ba1\u7406', 'Courses'),
    classes: t('\u73ed\u7ea7\u7ba1\u7406', 'Classes'),
    'enrollment-form': t('\u9009\u8bfe\u62a5\u540d', 'Enrollment'),
    'batch-ops': t('\u6279\u91cf\u64cd\u4f5c', 'Batch Ops'),
    workflow: t('\u5ba1\u6279\u6d41\u7a0b', 'Workflow'),
    messages: t('\u6d88\u606f\u4e2d\u5fc3', 'Messages'),
    scheduler: t('\u5b9a\u65f6\u4efb\u52a1', 'Scheduler'),
    config: t('\u7cfb\u7edf\u914d\u7f7e', 'Config'),
    dictionary: t('\u5b57\u5178\u7ba1\u7406', 'Dictionary'),
    reports: t('\u6570\u636e\u62a5\u8868', 'Reports'),
    'error-monitor': t('\u5f02\u5e38\u76d1\u63a7', 'Errors'),
    'recycle-bin': t('\u56de\u6536\u7ad9', 'Recycle Bin'),
  }
  let acc = ''
  for (const seg of segments) {
    acc += `/${seg}`
    items.push({ label: labels[seg] || seg, to: acc })
  }
  return items
})

const userMenu = [
  { label: t('\u4e2a\u4eba\u4e2d\u5fc3', 'Profile'), command: () => router.push('/system/config') },
  { label: t('\u9000\u51fa\u767b\u5f55', 'Sign out'), command: logout },
]

function onMenuSelect(item: { key?: string }) {
  if (!item.key) return
  const path = routeByMenuKey[item.key]
  if (path) router.push(path)
}
</script>

<template>
  <WiLayout has-sider class="admin-shell">
    <WiLayoutSider v-model:collapsed="collapsed" show-trigger bordered class="admin-shell__sider">
      <div class="admin-shell__brand">
        <WiIcon name="home" size="lg" aria-hidden="true" />
        <span v-if="!collapsed" class="admin-shell__brand-text">\u667a\u5b66\u4e91</span>
      </div>
      <WiMenu
        :model="adminMenu"
        :selected-key="selectedKey"
        :collapsed="collapsed"
        @select="onMenuSelect"
      />
    </WiLayoutSider>

    <WiLayout>
      <WiLayoutHeader bordered class="admin-shell__header">
        <WiBreadcrumb :model="breadcrumbs" />
        <WiSpace align="center">
          <WiButton
            severity="secondary"
            size="small"
            :aria-label="t('\u5168\u5c40\u641c\u7d22', 'Global search')"
            @click="commandOpen = true"
          >
            <WiIcon name="search" aria-hidden="true" />
            <span class="admin-shell__search-hint">Ctrl+K</span>
          </WiButton>
          <WiButton
            severity="secondary"
            size="small"
            icon-only
            :icon="isDark ? 'eye-off' : 'eye'"
            :aria-label="t('\u5207\u6362\u4e3b\u9898', 'Toggle theme')"
            @click="toggleTheme"
          />
          <WiButton severity="secondary" size="small" @click="toggleLocale">
            {{ t('EN', '\u4e2d') }}
          </WiButton>
          <WiDropdown :items="userMenu" trigger="click">
            <template #trigger>
              <button type="button" class="admin-shell__user">
                <WiAvatar :label="user?.name?.slice(0, 1) || 'U'" size="sm" />
                <span>{{ user?.name }}</span>
              </button>
            </template>
          </WiDropdown>
        </WiSpace>
      </WiLayoutHeader>

      <RouterView />
    </WiLayout>
  </WiLayout>

  <AppCommandMenu v-model="commandOpen" />
</template>

<style scoped>
.admin-shell {
  min-height: 100vh;
  background: var(--wi-color-surface);
}

.admin-shell__sider {
  background: var(--wi-color-surface);
}

.admin-shell__brand {
  display: flex;
  align-items: center;
  gap: var(--wi-space-2);
  padding: var(--wi-space-4) var(--wi-space-4) var(--wi-space-3);
  color: var(--wi-color-primary);
  font-weight: 700;
  font-size: var(--wi-font-size-md);
}

.admin-shell__brand-text {
  white-space: nowrap;
}

.admin-shell__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--wi-space-4);
  padding: 0 var(--wi-space-6);
  min-height: var(--wi-layout-header-height);
}

.admin-shell__search-hint {
  margin-left: var(--wi-space-1);
  color: var(--wi-color-text-muted);
  font-size: var(--wi-font-size-xs);
}

.admin-shell__user {
  display: inline-flex;
  align-items: center;
  gap: var(--wi-space-2);
  padding: var(--wi-space-1) var(--wi-space-2);
  border: 1px solid var(--wi-color-border);
  border-radius: var(--wi-radius-md);
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.admin-shell__user:hover {
  background: color-mix(in srgb, var(--wi-color-border) 30%, transparent);
}
</style>
"""
