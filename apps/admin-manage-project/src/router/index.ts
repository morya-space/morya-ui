import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/',
      component: () => import('@/layouts/AuthLayout.vue'),
      meta: { public: true },
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/auth/LoginView.vue'),
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/views/auth/RegisterView.vue'),
        },
      ],
    },
    {
      path: '/',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: 'dashboard', component: () => import('@/views/dashboard/DashboardView.vue') },
        { path: 'security/users', component: () => import('@/views/security/UsersView.vue') },
        { path: 'security/roles', component: () => import('@/views/security/RolesView.vue') },
        { path: 'security/permissions', component: () => import('@/views/security/PermissionsView.vue') },
        { path: 'security/data-scope', component: () => import('@/views/security/DataScopeView.vue') },
        { path: 'security/audit-logs', component: () => import('@/views/security/AuditLogsView.vue') },
        { path: 'academic/students', component: () => import('@/views/academic/StudentsView.vue') },
        { path: 'academic/teachers', component: () => import('@/views/academic/TeachersView.vue') },
        { path: 'academic/courses', component: () => import('@/views/academic/CoursesView.vue') },
        { path: 'academic/classes', component: () => import('@/views/academic/ClassesView.vue') },
        { path: 'academic/enrollment-form', component: () => import('@/views/academic/EnrollmentFormView.vue') },
        { path: 'academic/batch-ops', component: () => import('@/views/academic/BatchOpsView.vue') },
        { path: 'academic/workflow', component: () => import('@/views/academic/WorkflowView.vue') },
        { path: 'system/messages', component: () => import('@/views/system/MessageCenterView.vue') },
        { path: 'system/scheduler', component: () => import('@/views/system/SchedulerView.vue') },
        { path: 'system/config', component: () => import('@/views/system/SystemConfigView.vue') },
        { path: 'system/dictionary', component: () => import('@/views/system/DictionaryView.vue') },
        { path: 'analytics/reports', component: () => import('@/views/analytics/ReportsView.vue') },
        { path: 'analytics/error-monitor', component: () => import('@/views/analytics/ErrorMonitorView.vue') },
        { path: 'extras/recycle-bin', component: () => import('@/views/extras/RecycleBinView.vue') },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

router.beforeEach((to) => {
  const { isAuthenticated, user, mfaVerified } = useAuth()
  if (to.meta.public) {
    if (isAuthenticated.value && (to.name === 'login' || to.name === 'register')) {
      return '/dashboard'
    }
    return true
  }
  if (!user.value) return '/login'
  if (!mfaVerified.value && to.path !== '/login') return '/login?mfa=1'
  if (to.meta.requiresAuth && !isAuthenticated.value) return '/login'
  return true
})
