<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
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
import { buildAdminMenu, buildBreadcrumbs, menuKeyFromPath, routeByMenuKey } from '@/config/navigation'
import { useAuth } from '@/composables/useAuth'
import { useLocale } from '@/composables/useLocale'
import { useMockOperator } from '@/composables/useMockOperator'

const router = useRouter()
const route = useRoute()
const { user, logout } = useAuth()
const { toggleLocale, toggleDensity, isCompact, t } = useLocale()
const { isDark, toggleTheme } = useTheme()
useMockOperator()

const collapsed = ref(false)
const commandOpen = ref(false)
const selectedKey = ref<string | null>(menuKeyFromPath(route.path))

watch(() => route.path, (path) => {
  selectedKey.value = menuKeyFromPath(path)
})

const breadcrumbs = computed(() => buildBreadcrumbs(route.path, t))
const adminMenu = computed(() => buildAdminMenu(t))

const userMenu = [
  { label: t('个人中心', 'Profile'), command: () => router.push('/system/config') },
  { label: t('退出登录', 'Sign out'), command: logout },
]

function onMenuSelect(item: { key?: string }) {
  if (!item.key) return
  const path = routeByMenuKey[item.key]
  if (path) router.push(path)
}
</script>

<template>
  <WiLayout class="admin-shell">
    <WiLayoutHeader bordered class="admin-shell__header">
      <div class="admin-shell__header-start">
        <RouterLink to="/dashboard" class="admin-shell__brand">
          <WiIcon name="home" size="lg" aria-hidden="true" />
          <span class="admin-shell__brand-text">智学云</span>
        </RouterLink>
        <WiBreadcrumb :model="breadcrumbs" />
      </div>
      <WiSpace align="center">
        <WiButton
          severity="secondary"
          size="small"
          :aria-label="t('全局搜索', 'Global search')"
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
          :aria-label="t('切换主题', 'Toggle theme')"
          @click="toggleTheme"
        />
        <WiButton
          severity="secondary"
          size="small"
          :aria-label="t('切换密度', 'Toggle density')"
          @click="toggleDensity"
        >
          {{ t(isCompact ? '标准' : '紧凑', isCompact ? 'Comfortable' : 'Compact') }}
        </WiButton>
        <WiButton severity="secondary" size="small" @click="toggleLocale">
          {{ t('EN', '中') }}
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

    <WiLayout has-sider class="admin-shell__body">
      <WiLayoutSider
        v-model:collapsed="collapsed"
        collapse-mode="width"
        show-trigger
        bordered
        class="admin-shell__sider"
        :collapsed-width="64"
        :padding="collapsed ? '0.75rem 0' : undefined"
      >
        <WiMenu
          :model="adminMenu"
          :selected-key="selectedKey"
          :collapsed="collapsed"
          :collapsed-width="80"
          accordion
          @select="onMenuSelect"
        />
      </WiLayoutSider>

      <RouterView />
    </WiLayout>
  </WiLayout>

  <AppCommandMenu v-model="commandOpen" />
</template>

<style scoped>
.admin-shell {
  height: 100%;
  background: var(--wi-color-surface);
}

.admin-shell__body {
  flex: 1 1 auto;
  min-height: 0;
  min-width: 0;
}

.admin-shell__sider {
  background: var(--wi-color-surface);
}

.admin-shell__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--wi-space-4);
  padding: 0 var(--wi-space-6);
  min-height: var(--wi-layout-header-height);
}

.admin-shell__header-start {
  display: flex;
  align-items: center;
  gap: var(--wi-space-4);
  min-width: 0;
}

.admin-shell__brand {
  display: inline-flex;
  align-items: center;
  gap: var(--wi-space-2);
  flex-shrink: 0;
  color: var(--wi-color-primary);
  font-weight: 700;
  font-size: var(--wi-font-size-md);
  text-decoration: none;
}

.admin-shell__brand:hover {
  color: var(--wi-color-primary-hover);
}

.admin-shell__brand-text {
  white-space: nowrap;
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
