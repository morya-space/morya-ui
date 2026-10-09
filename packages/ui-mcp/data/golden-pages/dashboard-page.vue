<script setup lang="ts">
/**
 * 黄金样例：仪表盘�?
 * @see DESIGN.md · morya-ui-pages references/page-layouts.md · visual-craft § Ops polish
 */
import {
  MAlert,
  MBreadcrumb,
  MCard,
  MConfigProvider,
  MGrid,
  MGridItem,
  MLayout,
  MLayoutContent,
  MLayoutHeader,
  MPageContent,
  MEmpty,
  MPageHeader,
  MPageStat,
  MStatistic,
  MStatus,
  MTable,
  MTag,
  zhCN,
} from 'morya-ui'

const stats = [
  { label: '总用�?, value: '12,480', trend: '+8.2%', trendDirection: 'up' as const, trendLabel: '较上�?, icon: 'users' },
  { label: '今日活跃', value: '1,926', trend: '+3.1%', trendDirection: 'up' as const, trendLabel: '较昨�?, icon: 'activity' },
  { label: '待处理工�?, value: '47', trend: '-12%', trendDirection: 'down' as const, trendLabel: '较上�?, trendSeverity: 'warn' as const, icon: 'clipboard' },
  { label: '系统健康', value: '99.9%', trend: '稳定', trendSeverity: 'secondary' as const, icon: 'heart' },
]

const recentColumns = [
  { key: 'id', label: '工单�?, width: 96 },
  { key: 'title', label: '标题' },
  { key: 'priority', label: '优先�?, width: 96 },
  { key: 'status', label: '状�?, width: 110 },
]

const recentRows = [
  { id: 'WO-1024', title: '登录异常反馈', priority: 'high', status: 'open' },
  { id: 'WO-1023', title: '导出任务超时', priority: 'medium', status: 'progress' },
  { id: 'WO-1022', title: '权限配置咨询', priority: 'low', status: 'done' },
]

function prioritySeverity(p: string) {
  if (p === 'high') return 'danger'
  if (p === 'medium') return 'warn'
  return 'secondary'
}

function priorityLabel(p: string) {
  if (p === 'high') return '�?
  if (p === 'medium') return '�?
  return '�?
}

function statusLabel(s: string) {
  if (s === 'open') return '待处�?
  if (s === 'progress') return '进行�?
  return '已完�?
}

function statusSeverity(s: string) {
  if (s === 'open') return 'warn'
  if (s === 'progress') return 'info'
  return 'success'
}
</script>

<template>
  <MConfigProvider :locale="zhCN">
    <MLayout fill-viewport>
      <MLayoutHeader padding="var(--m-space-4) var(--m-space-6)">
        <MBreadcrumb :model="[{ label: '首页' }, { label: '仪表�? }]" />
      </MLayoutHeader>

      <MLayoutContent>
        <MPageContent density="spacious">
          <MPageHeader
            title="运营概览" description="关注今日活跃与待处理工单，异常优先下钻�?
          />

          <MAlert
            severity="info" title="报表管道延迟�?15 分钟" description="实时告警仍可用；看板数字以管道落库为准�?
            closable
          />

          <MGrid :cols="4" :x-gap="16" :y-gap="16" responsive="screen">
            <MGridItem v-for="item in stats" :key="item.label" :span="1">
              <MPageStat
                :label="item.label" :value="item.value" :trend="item.trend" :trend-severity="item.trendSeverity ?? 'primary'" :trend-direction="item.trendDirection" :trend-label="item.trendLabel" :icon="item.icon"
              />
            </MGridItem>
          </MGrid>

          <MGrid :cols="2" :x-gap="16" :y-gap="16" responsive="screen">
            <MGridItem :span="1">
              <MCard title="趋势概览" shadow="always">
                <MEmpty
                  title="还没有趋势数�?
                  description="接入图表后将展示�?7 日活跃与转化�?
                  illustration="activity-low"
                />
              </MCard>
            </MGridItem>
            <MGridItem :span="1">
              <MCard title="最近工�? shadow="always">
                <div class="dashboard-plain-stats">
                  <MStatistic title="本周新建" :value="128" />
                  <MStatistic title="平均处理时长" :value="2.4" suffix="h" :precision="1" />
                </div>
                <MTable
                  :columns="recentColumns" :rows="recentRows" size="small" :paginator="false" bordered
                  row-key="id" aria-label="最近工�?
                >
                  <template #cell-priority="{ value }">
                    <MTag
                      :value="priorityLabel(String(value))" :severity="prioritySeverity(String(value))"
                    />
                  </template>
                  <template #cell-status="{ value }">
                    <MStatus
                      :label="statusLabel(String(value))" :severity="statusSeverity(String(value))"
                    />
                  </template>
                </MTable>
              </MCard>
            </MGridItem>
          </MGrid>
        </MPageContent>
      </MLayoutContent>
    </MLayout>
  </MConfigProvider>
</template>

<style scoped>
.dashboard-plain-stats {
  display: flex;
  flex-wrap: wrap;
  gap: var(--m-space-6);
  margin-bottom: var(--m-space-4);
}
</style>
