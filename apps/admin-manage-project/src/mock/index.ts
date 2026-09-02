export interface Student {
  id: string
  name: string
  studentNo: string
  grade: string
  className: string
  status: 'active' | 'leave' | 'graduated'
  enrolledAt: string
}

export interface Teacher {
  id: string
  name: string
  title: string
  department: string
  courses: number
  status: 'active' | 'inactive'
}

export interface Course {
  id: string
  name: string
  category: string
  credits: number
  teacher: string
  enrolled: number
  capacity: number
  status: 'open' | 'full' | 'closed'
}

export interface ClassGroup {
  id: string
  name: string
  grade: string
  headTeacher: string
  students: number
  room: string
}

export interface AuditLog {
  id: string
  operator: string
  action: string
  target: string
  ip: string
  time: string
}

export interface RoleRecord {
  id: string
  name: string
  code: string
  users: number
  permissions: string
  status: 'active' | 'disabled'
}

export interface PermissionNode {
  id: string
  name: string
  code: string
  type: 'menu' | 'button' | 'api'
  module: string
}

export interface WorkflowTask {
  id: string
  title: string
  applicant: string
  type: string
  step: string
  status: 'pending' | 'approved' | 'rejected'
  updatedAt: string
}

export interface MessageRecord {
  id: string
  channel: '站内信' | '邮件' | '短信'
  title: string
  template: string
  sentAt: string
  status: 'success' | 'failed' | 'pending'
}

export interface SchedulerJob {
  id: string
  name: string
  cron: string
  lastRun: string
  nextRun: string
  status: 'running' | 'paused' | 'idle'
}

export interface SystemParam {
  id: string
  key: string
  value: string
  group: string
  description: string
}

export interface DictEntry {
  id: string
  type: string
  label: string
  value: string
  sort: number
  status: 'enabled' | 'disabled'
}

export interface RecycleItem {
  id: string
  name: string
  module: string
  deletedBy: string
  deletedAt: string
  expireAt: string
}

export interface ErrorRecord {
  id: string
  endpoint: string
  code: number
  message: string
  count: number
  lastSeen: string
}

export const students: Student[] = [
  { id: 's1', name: '陈小明', studentNo: '2026001', grade: '高一', className: '高一(1)班', status: 'active', enrolledAt: '2026-09-01' },
  { id: 's2', name: '刘雨萱', studentNo: '2026002', grade: '高一', className: '高一(1)班', status: 'active', enrolledAt: '2026-09-01' },
  { id: 's3', name: '王浩然', studentNo: '2026003', grade: '高一', className: '高一(2)班', status: 'leave', enrolledAt: '2026-09-01' },
  { id: 's4', name: '赵思琪', studentNo: '2025008', grade: '高二', className: '高二(3)班', status: 'active', enrolledAt: '2025-09-01' },
  { id: 's5', name: '孙嘉怡', studentNo: '2024012', grade: '高三', className: '高三(2)班', status: 'graduated', enrolledAt: '2024-09-01' },
  { id: 's6', name: '周子涵', studentNo: '2026004', grade: '高一', className: '高一(2)班', status: 'active', enrolledAt: '2026-09-02' },
]

export const teachers: Teacher[] = [
  { id: 't1', name: '李老师', title: '高级教师', department: '数学组', courses: 3, status: 'active' },
  { id: 't2', name: '王老师', title: '一级教师', department: '语文组', courses: 2, status: 'active' },
  { id: 't3', name: '张老师', title: '实验员', department: '物理组', courses: 4, status: 'active' },
  { id: 't4', name: '赵老师', title: '青年教师', department: '英语组', courses: 2, status: 'inactive' },
]

export const courses: Course[] = [
  { id: 'c1', name: '高等数学', category: '理科', credits: 4, teacher: '李老师', enrolled: 42, capacity: 50, status: 'open' },
  { id: 'c2', name: '现代文阅读', category: '文科', credits: 3, teacher: '王老师', enrolled: 50, capacity: 50, status: 'full' },
  { id: 'c3', name: '力学实验', category: '实验', credits: 2, teacher: '张老师', enrolled: 28, capacity: 30, status: 'open' },
  { id: 'c4', name: '英语口语', category: '语言', credits: 2, teacher: '赵老师', enrolled: 15, capacity: 40, status: 'open' },
  { id: 'c5', name: '信息技术', category: '通识', credits: 2, teacher: '李老师', enrolled: 0, capacity: 45, status: 'closed' },
]

export const classGroups: ClassGroup[] = [
  { id: 'cl1', name: '高一(1)班', grade: '高一', headTeacher: '王老师', students: 48, room: 'A301' },
  { id: 'cl2', name: '高一(2)班', grade: '高一', headTeacher: '李老师', students: 46, room: 'A302' },
  { id: 'cl3', name: '高二(3)班', grade: '高二', headTeacher: '张老师', students: 44, room: 'B201' },
]

export const auditLogs: AuditLog[] = [
  { id: 'a1', operator: '张教务', action: '更新', target: '学生 陈小明', ip: '10.0.12.8', time: '2026-09-02 09:12' },
  { id: 'a2', operator: '李老师', action: '导出', target: '课程名单', ip: '10.0.12.15', time: '2026-09-02 08:45' },
  { id: 'a3', operator: '系统', action: '删除', target: '临时班级', ip: '127.0.0.1', time: '2026-09-01 23:10' },
]

export const roles: RoleRecord[] = [
  { id: 'r1', name: '超级管理员', code: 'super_admin', users: 2, permissions: '全部权限', status: 'active' },
  { id: 'r2', name: '教务主任', code: 'dean', users: 5, permissions: '教务模块', status: 'active' },
  { id: 'r3', name: '班主任', code: 'head_teacher', users: 32, permissions: '班级与学生', status: 'active' },
  { id: 'r4', name: '访客', code: 'guest', users: 8, permissions: '只读', status: 'disabled' },
]

export const permissions: PermissionNode[] = [
  { id: 'p1', name: '学生管理', code: 'student:view', type: 'menu', module: '教务' },
  { id: 'p2', name: '删除学生', code: 'student:delete', type: 'button', module: '教务' },
  { id: 'p3', name: '课程审批', code: 'course:approve', type: 'api', module: '流程' },
  { id: 'p4', name: '系统配置', code: 'system:config', type: 'menu', module: '系统' },
]

export const workflowTasks: WorkflowTask[] = [
  { id: 'w1', title: '转班申请 - 王浩然', applicant: '王老师', type: '转班', step: '教务审核', status: 'pending', updatedAt: '2026-09-02 10:00' },
  { id: 'w2', title: '新开课程 - 人工智能导论', applicant: '张老师', type: '开课', step: '已完成', status: 'approved', updatedAt: '2026-09-01 16:30' },
  { id: 'w3', title: '请假 - 刘雨萱', applicant: '刘雨萱', type: '请假', step: '班主任审批', status: 'pending', updatedAt: '2026-09-02 07:50' },
]

export const messages: MessageRecord[] = [
  { id: 'm1', channel: '站内信', title: '选课开始提醒', template: 'enrollment_start', sentAt: '2026-09-01 08:00', status: 'success' },
  { id: 'm2', channel: '短信', title: '考勤异常通知', template: 'attendance_alert', sentAt: '2026-09-02 07:30', status: 'success' },
  { id: 'm3', channel: '邮件', title: '周报推送', template: 'weekly_report', sentAt: '2026-09-02 06:00', status: 'failed' },
]

export const schedulerJobs: SchedulerJob[] = [
  { id: 'j1', name: '同步学籍数据', cron: '0 2 * * *', lastRun: '2026-09-02 02:00', nextRun: '2026-09-03 02:00', status: 'idle' },
  { id: 'j2', name: '生成考勤报表', cron: '0 6 * * 1', lastRun: '2026-09-01 06:00', nextRun: '2026-09-08 06:00', status: 'running' },
  { id: 'j3', name: '清理过期草稿', cron: '*/30 * * * *', lastRun: '2026-09-02 14:00', nextRun: '2026-09-02 14:30', status: 'paused' },
]

export const systemParams: SystemParam[] = [
  { id: 'sp1', key: 'registration.verify', value: 'true', group: '注册', description: '是否开启注册邮箱验证' },
  { id: 'sp2', key: 'enrollment.deadline', value: '2026-09-15', group: '选课', description: '选课截止日期' },
  { id: 'sp3', key: 'order.auto_close_minutes', value: '30', group: '订单', description: '未支付订单自动关闭时间（分钟）' },
]

export const dictionaries: DictEntry[] = [
  { id: 'd1', type: 'student_status', label: '在读', value: 'active', sort: 1, status: 'enabled' },
  { id: 'd2', type: 'student_status', label: '休学', value: 'leave', sort: 2, status: 'enabled' },
  { id: 'd3', type: 'course_category', label: '理科', value: 'science', sort: 1, status: 'enabled' },
  { id: 'd4', type: 'course_category', label: '文科', value: 'arts', sort: 2, status: 'enabled' },
]

export const recycleBin: RecycleItem[] = [
  { id: 'rb1', name: '临时班级 测试A', module: '班级管理', deletedBy: '张教务', deletedAt: '2026-08-30', expireAt: '2026-09-29' },
  { id: 'rb2', name: '课程草稿 化学实验', module: '课程管理', deletedBy: '李老师', deletedAt: '2026-08-28', expireAt: '2026-09-27' },
]

export const errorRecords: ErrorRecord[] = [
  { id: 'e1', endpoint: '/api/enrollment/submit', code: 500, message: 'Internal Server Error', count: 12, lastSeen: '2026-09-02 13:58' },
  { id: 'e2', endpoint: '/api/students/export', code: 403, message: 'Forbidden', count: 3, lastSeen: '2026-09-02 11:20' },
]

export const dashboardStats = {
  students: 2840,
  teachers: 186,
  courses: 128,
  enrollmentRate: 92.4,
  activeToday: 1962,
  pendingApprovals: 17,
  systemHealth: 99.6,
}

export const gradeDistribution = [
  { grade: '高一', count: 980 },
  { grade: '高二', count: 920 },
  { grade: '高三', count: 940 },
]

export const enrollmentTrend = [
  { month: '3月', count: 820 },
  { month: '4月', count: 910 },
  { month: '5月', count: 880 },
  { month: '6月', count: 960 },
  { month: '7月', count: 1020 },
  { month: '8月', count: 1100 },
]
