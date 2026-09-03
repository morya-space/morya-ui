import type { Ref } from 'vue'
import { ref, watch } from 'vue'
import type {
  AuditLog,
  ClassGroup,
  Course,
  DictEntry,
  PermissionNode,
  RecycleItem,
  RoleRecord,
  SchedulerJob,
  Student,
  Teacher,
  UserRecord,
} from './index'
import * as seed from './index'

export type StoreKey =
  | 'students'
  | 'teachers'
  | 'courses'
  | 'classGroups'
  | 'users'
  | 'roles'
  | 'permissions'
  | 'dictionaries'
  | 'schedulerJobs'
  | 'recycleBin'
  | 'auditLogs'

const STORE_MODULE_LABEL: Record<StoreKey, string> = {
  students: '学生管理',
  teachers: '教师管理',
  courses: '课程管理',
  classGroups: '班级管理',
  users: '用户管理',
  roles: '角色管理',
  permissions: '权限配置',
  dictionaries: '字典管理',
  schedulerJobs: '定时任务',
  recycleBin: '回收站',
  auditLogs: '操作日志',
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function loadItems<T>(storageKey: string, fallback: T[]): T[] {
  if (typeof localStorage === 'undefined') return clone(fallback)
  try {
    const raw = localStorage.getItem(storageKey)
    if (raw) return JSON.parse(raw) as T[]
  } catch {
    // ignore corrupt cache
  }
  return clone(fallback)
}

function persistItems<T>(storageKey: string, items: T[]) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(storageKey, JSON.stringify(items))
}

function nextId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}

function formatNow() {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
}

function formatDate() {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

function expireDate(days = 30) {
  const now = new Date()
  now.setDate(now.getDate() + days)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

export interface MockStore<T extends { id: string }> {
  key: StoreKey
  items: Ref<T[]>
  create: (input: Omit<T, 'id'> & { id?: string }) => T
  update: (id: string, patch: Partial<T>) => T | undefined
  remove: (id: string) => T | undefined
  getById: (id: string) => T | undefined
  softRemove: (record: T, deletedBy: string, displayName?: string) => void
}

function createStore<T extends { id: string }>(
  key: StoreKey,
  seedData: T[],
): MockStore<T> {
  const storageKey = `edu-admin-store-${key}`
  const items = ref(loadItems<T>(storageKey, seedData)) as Ref<T[]>

  watch(
    items,
    (value) => persistItems(storageKey, value),
    { deep: true },
  )

  function create(input: Omit<T, 'id'> & { id?: string }) {
    const record = { ...input, id: input.id ?? nextId(key) } as T
    items.value = [...items.value, record]
    appendAudit('新建', record.id)
    return record
  }

  function update(id: string, patch: Partial<T>) {
    let updated: T | undefined
    items.value = items.value.map((item) => {
      if (item.id !== id) return item
      updated = { ...item, ...patch }
      return updated
    })
    if (updated) appendAudit('更新', id)
    return updated
  }

  function remove(id: string) {
    const target = items.value.find((item) => item.id === id)
    items.value = items.value.filter((item) => item.id !== id)
    if (target) appendAudit('删除', id)
    return target
  }

  function getById(id: string) {
    return items.value.find((item) => item.id === id)
  }

  function softRemove(record: T, deletedBy: string, displayName?: string) {
    remove(record.id)
    const recycleStore = stores.recycleBin
    recycleStore.items.value = [
      ...recycleStore.items.value,
      {
        id: nextId('rb'),
        name: displayName ?? String((record as Record<string, unknown>).name ?? record.id),
        module: STORE_MODULE_LABEL[key],
        deletedBy,
        deletedAt: formatDate(),
        expireAt: expireDate(),
        sourceKey: key,
        payload: JSON.stringify(record),
      } satisfies RecycleItem,
    ]
  }

  function appendAudit(action: string, targetId: string) {
    const auditStore = stores.auditLogs
    auditStore.items.value = [
      {
        id: nextId('a'),
        operator: currentOperator(),
        action,
        target: `${STORE_MODULE_LABEL[key]} ${targetId}`,
        ip: '127.0.0.1',
        time: formatNow(),
      } satisfies AuditLog,
      ...auditStore.items.value,
    ].slice(0, 200)
  }

  return { key, items, create, update, remove, getById, softRemove }
}

let operatorName = '系统'

export function setMockOperator(name: string) {
  operatorName = name || '系统'
}

function currentOperator() {
  return operatorName
}

export const stores = {
  students: createStore<Student>('students', seed.students),
  teachers: createStore<Teacher>('teachers', seed.teachers),
  courses: createStore<Course>('courses', seed.courses),
  classGroups: createStore<ClassGroup>('classGroups', seed.classGroups),
  users: createStore<UserRecord>('users', seed.users),
  roles: createStore<RoleRecord>('roles', seed.roles),
  permissions: createStore<PermissionNode>('permissions', seed.permissions),
  dictionaries: createStore<DictEntry>('dictionaries', seed.dictionaries),
  schedulerJobs: createStore<SchedulerJob>('schedulerJobs', seed.schedulerJobs),
  recycleBin: createStore<RecycleItem>('recycleBin', seed.recycleBin),
  auditLogs: createStore<AuditLog>('auditLogs', seed.auditLogs),
}

export function restoreFromRecycle(item: RecycleItem): boolean {
  if (!item.sourceKey || !item.payload) return false
  const key = item.sourceKey as Exclude<StoreKey, 'recycleBin' | 'auditLogs'>
  const store = stores[key]
  if (!store) return false
  try {
    const record = JSON.parse(item.payload) as { id: string }
    const exists = store.items.value.some((row) => row.id === record.id)
    if (!exists) {
      ;(store.items.value as { id: string }[]).push(record)
    }
    stores.recycleBin.remove(item.id)
    stores.auditLogs.items.value = [
      {
        id: nextId('a'),
        operator: currentOperator(),
        action: '恢复',
        target: `${item.module} ${item.name}`,
        ip: '127.0.0.1',
        time: formatNow(),
      } satisfies AuditLog,
      ...stores.auditLogs.items.value,
    ].slice(0, 200)
    return true
  } catch {
    return false
  }
}

export function purgeRecycleItem(id: string) {
  stores.recycleBin.remove(id)
}
