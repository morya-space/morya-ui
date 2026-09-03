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

function label(segment: string, t: (zh: string, en: string) => string) {
  return segmentLabel(segment, t)
}

export function buildAdminMenu(t: (zh: string, en: string) => string): MenuItem[] {
  return [
    {
      key: 'dashboard',
      label: label('dashboard', t),
      icon: 'home',
    },
    {
      key: 'security',
      label: label('security', t),
      icon: 'shield',
      items: [
        { key: 'users', label: label('users', t), icon: 'user' },
        { key: 'roles', label: label('roles', t), icon: 'shield' },
        { key: 'permissions', label: label('permissions', t), icon: 'lock' },
        { key: 'data-scope', label: label('data-scope', t), icon: 'database' },
        { key: 'audit-logs', label: label('audit-logs', t), icon: 'clock' },
      ],
    },
    {
      key: 'academic',
      label: label('academic', t),
      icon: 'book',
      items: [
        { key: 'students', label: label('students', t), icon: 'user' },
        { key: 'teachers', label: label('teachers', t), icon: 'user' },
        { key: 'courses', label: label('courses', t), icon: 'book' },
        { key: 'classes', label: label('classes', t), icon: 'home' },
        { key: 'enrollment-form', label: label('enrollment-form', t), icon: 'edit' },
        { key: 'batch-ops', label: label('batch-ops', t), icon: 'grip' },
        { key: 'workflow', label: label('workflow', t), icon: 'link' },
      ],
    },
    {
      key: 'system',
      label: label('system', t),
      icon: 'settings',
      items: [
        { key: 'messages', label: label('messages', t), icon: 'mail' },
        { key: 'scheduler', label: label('scheduler', t), icon: 'clock' },
        { key: 'config', label: label('config', t), icon: 'settings' },
        { key: 'dictionary', label: label('dictionary', t), icon: 'menu' },
      ],
    },
    {
      key: 'analytics',
      label: label('analytics', t),
      icon: 'chart-bar',
      items: [
        { key: 'reports', label: label('reports', t), icon: 'chart-bar' },
        { key: 'error-monitor', label: label('error-monitor', t), icon: 'warning' },
      ],
    },
    {
      key: 'extras',
      label: label('extras', t),
      icon: 'star',
      items: [
        { key: 'recycle-bin', label: label('recycle-bin', t), icon: 'trash' },
      ],
    },
  ]
}

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

export interface CommandItemDef {
  segment: string
  route: string
  icon: string
  keywordsZh: string
  keywordsEn: string
}

export const commandItemDefs: CommandItemDef[] = [
  { segment: 'dashboard', route: '/dashboard', icon: 'home', keywordsZh: 'dashboard 首页', keywordsEn: 'dashboard home' },
  { segment: 'students', route: '/academic/students', icon: 'user', keywordsZh: 'student 学生', keywordsEn: 'student students' },
  { segment: 'courses', route: '/academic/courses', icon: 'book', keywordsZh: 'course 课程', keywordsEn: 'course courses' },
  { segment: 'workflow', route: '/academic/workflow', icon: 'link', keywordsZh: 'workflow 审批', keywordsEn: 'workflow approval' },
  { segment: 'messages', route: '/system/messages', icon: 'mail', keywordsZh: 'message 消息', keywordsEn: 'message inbox' },
  { segment: 'recycle-bin', route: '/extras/recycle-bin', icon: 'trash', keywordsZh: 'recycle 回收', keywordsEn: 'recycle bin trash' },
]

export function buildCommandItems(t: (zh: string, en: string) => string) {
  return commandItemDefs.map((item) => ({
    label: label(item.segment, t),
    route: item.route,
    icon: item.icon,
    keywords: t(item.keywordsZh, item.keywordsEn),
  }))
}

export function menuKeyFromPath(path: string): string | null {
  const entry = Object.entries(routeByMenuKey).find(([, route]) => route === path)
  return entry?.[0] ?? null
}

export function pageTitleFromPath(
  path: string,
  t: (zh: string, en: string) => string,
): string {
  const segments = path.split('/').filter(Boolean)
  const last = segments.at(-1)
  return last ? label(last, t) : label('dashboard', t)
}
