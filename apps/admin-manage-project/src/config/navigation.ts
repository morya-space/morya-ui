import type { MenuItem } from '@well-insight/ui'

export interface NavRouteMeta {
  title: string
  titleEn: string
}

/** Path segment → [zh, en] — single source for menu, breadcrumb, and page titles. */
export const pathSegmentLabels: Record<string, [string, string]> = {
  dashboard: ['仪表盘', 'Dashboard'],
  security: ['权限与安全', 'Security'],
  academic: ['教务业务', 'Academic'],
  system: ['系统运营', 'System'],
  analytics: ['数据与监控', 'Analytics'],
  extras: ['体验增强', 'Extras'],
  users: ['用户管理', 'Users'],
  roles: ['角色管理', 'Roles'],
  permissions: ['权限配置', 'Permissions'],
  'data-scope': ['数据权限', 'Data Scope'],
  'audit-logs': ['操作日志', 'Audit Logs'],
  students: ['学生管理', 'Students'],
  teachers: ['教师管理', 'Teachers'],
  courses: ['课程管理', 'Courses'],
  classes: ['班级管理', 'Classes'],
  'enrollment-form': ['选课表单', 'Enrollment Form'],
  'batch-ops': ['批量处理', 'Batch Ops'],
  workflow: ['审批流程', 'Workflow'],
  messages: ['消息中心', 'Messages'],
  scheduler: ['定时任务', 'Scheduler'],
  config: ['系统配置', 'Config'],
  dictionary: ['字典管理', 'Dictionary'],
  reports: ['数据报表', 'Reports'],
  'error-monitor': ['异常监控', 'Error Monitor'],
  'recycle-bin': ['回收站', 'Recycle Bin'],
}

export function segmentLabel(
  segment: string,
  t: (zh: string, en: string) => string,
): string {
  const pair = pathSegmentLabels[segment]
  return pair ? t(pair[0], pair[1]) : segment
}

export function buildBreadcrumbs(
  path: string,
  t: (zh: string, en: string) => string,
): Array<{ label: string; to?: string }> {
  const segments = path.split('/').filter(Boolean)
  const items: Array<{ label: string; to?: string }> = [
    { label: t('首页', 'Home'), to: '/dashboard' },
  ]
  let acc = ''
  for (const seg of segments) {
    acc += `/${seg}`
    items.push({ label: segmentLabel(seg, t), to: acc })
  }
  return items
}

export const adminMenu: MenuItem[] = [
  {
    key: 'dashboard',
    label: pathSegmentLabels.dashboard[0],
    icon: 'home',
  },
  {
    key: 'security',
    label: pathSegmentLabels.security[0],
    icon: 'shield',
    items: [
      { key: 'users', label: pathSegmentLabels.users[0], icon: 'user' },
      { key: 'roles', label: pathSegmentLabels.roles[0], icon: 'shield' },
      { key: 'permissions', label: pathSegmentLabels.permissions[0], icon: 'lock' },
      { key: 'data-scope', label: pathSegmentLabels['data-scope'][0], icon: 'database' },
      { key: 'audit-logs', label: pathSegmentLabels['audit-logs'][0], icon: 'clock' },
    ],
  },
  {
    key: 'academic',
    label: pathSegmentLabels.academic[0],
    icon: 'book',
    items: [
      { key: 'students', label: pathSegmentLabels.students[0], icon: 'user' },
      { key: 'teachers', label: pathSegmentLabels.teachers[0], icon: 'user' },
      { key: 'courses', label: pathSegmentLabels.courses[0], icon: 'book' },
      { key: 'classes', label: pathSegmentLabels.classes[0], icon: 'home' },
      { key: 'enrollment-form', label: pathSegmentLabels['enrollment-form'][0], icon: 'edit' },
      { key: 'batch-ops', label: pathSegmentLabels['batch-ops'][0], icon: 'grip' },
      { key: 'workflow', label: pathSegmentLabels.workflow[0], icon: 'link' },
    ],
  },
  {
    key: 'system',
    label: pathSegmentLabels.system[0],
    icon: 'settings',
    items: [
      { key: 'messages', label: pathSegmentLabels.messages[0], icon: 'mail' },
      { key: 'scheduler', label: pathSegmentLabels.scheduler[0], icon: 'clock' },
      { key: 'config', label: pathSegmentLabels.config[0], icon: 'settings' },
      { key: 'dictionary', label: pathSegmentLabels.dictionary[0], icon: 'menu' },
    ],
  },
  {
    key: 'analytics',
    label: pathSegmentLabels.analytics[0],
    icon: 'chart-bar',
    items: [
      { key: 'reports', label: pathSegmentLabels.reports[0], icon: 'chart-bar' },
      { key: 'error-monitor', label: pathSegmentLabels['error-monitor'][0], icon: 'warning' },
    ],
  },
  {
    key: 'extras',
    label: pathSegmentLabels.extras[0],
    icon: 'star',
    items: [
      { key: 'recycle-bin', label: pathSegmentLabels['recycle-bin'][0], icon: 'trash' },
    ],
  },
]

export const routeByMenuKey: Record<string, string> = {
  dashboard: '/dashboard',
  users: '/security/users',
  roles: '/security/roles',
  permissions: '/security/permissions',
  'data-scope': '/security/data-scope',
  'audit-logs': '/security/audit-logs',
  students: '/academic/students',
  teachers: '/academic/teachers',
  courses: '/academic/courses',
  classes: '/academic/classes',
  'enrollment-form': '/academic/enrollment-form',
  'batch-ops': '/academic/batch-ops',
  workflow: '/academic/workflow',
  messages: '/system/messages',
  scheduler: '/system/scheduler',
  config: '/system/config',
  dictionary: '/system/dictionary',
  reports: '/analytics/reports',
  'error-monitor': '/analytics/error-monitor',
  'recycle-bin': '/extras/recycle-bin',
}

export const commandItems = [
  { label: '仪表盘', route: '/dashboard', icon: 'home', keywords: 'dashboard 首页' },
  { label: '学生管理', route: '/academic/students', icon: 'user', keywords: 'student 学生' },
  { label: '课程管理', route: '/academic/courses', icon: 'book', keywords: 'course 课程' },
  { label: '审批流程', route: '/academic/workflow', icon: 'link', keywords: 'workflow 审批' },
  { label: '消息中心', route: '/system/messages', icon: 'mail', keywords: 'message 消息' },
  { label: '回收站', route: '/extras/recycle-bin', icon: 'trash', keywords: 'recycle 回收' },
]

export function menuKeyFromPath(path: string): string | null {
  const entry = Object.entries(routeByMenuKey).find(([, route]) => route === path)
  return entry?.[0] ?? null
}
