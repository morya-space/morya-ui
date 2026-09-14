<script setup lang="ts">
/**
 * 黄金样例：仪表盘页
 * @see DESIGN.md §3
 */
import {
  MBreadcrumb,
  MCard,
  MConfigProvider,
  MGrid,
  MGridItem,
  MLayout,
  MLayoutContent,
  MLayoutHeader,
  MPageContent,
  MPageHeader,
  MPagePlaceholder,
  MPageStat,
  MTable,
  MTag,
  zhCN,
} from 'morya-ui'

const stats = [
  { label: '总用户', value: '12,480', trend: '+8.2%', icon: 'users' },
  { label: '今日活跃', value: '1,926', trend: '+3.1%', icon: 'activity' },
  { label: '待处理工单', value: '47', trend: '-12%', trendSeverity: 'warn' as const, icon: 'clipboard' },
  { label: '系统健康', value: '99.9%', trend: '稳定', trendSeverity: 'secondary' as const, icon: 'heart' },
]

const recentColumns = [
  { key: 'id', label: '工单号', width: 96 },
  { key: 'title', label: '标题' },
  { key: 'priority', label: '优先级', width: 96 },
  { key: 'status', label: '状态', width: 96 },
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

function statusLabel(s: string) {
  if (s === 'open') return '待处理'
  if (s === 'progress') return '进行中'
  return '已完成'
}
</script>

<template>
  <MConfigProvider :locale="zhCN">
    <MLayout fill-viewport>
      <MLayoutHeader :padding="'var(--m-space-4) var(--m-space-6)'">
        <MBreadcrumb :model="[{ label: '首页' }, { label: '仪表盘' }]" />
      </MLayoutHeader>

      <MLayoutContent>
        <MPageContent density="spacious">
          <MPageHeader title="仪表盘" />

          <MGrid :cols="4" :x-gap="16" :y-gap="16" responsive="screen">
            <MGridItem v-for="item in stats" :key="item.label" :span="1">
              <MPageStat
                :label="item.label"
                :value="item.value"
                :trend="item.trend"
                :trend-severity="item.trendSeverity ?? 'primary'"
                :icon="item.icon"
              />
            </MGridItem>
          </MGrid>

          <MGrid :cols="2" :x-gap="16" :y-gap="16">
            <MGridItem :span="1">
              <MCard title="趋势概览">
                <MPagePlaceholder aria-label="图表占位" description="图表区域（接入 ECharts / 业务组件）" />
              </MCard>
            </MGridItem>
            <MGridItem :span="1">
              <MCard title="最近工单">
                <MTable :columns="recentColumns" :rows="recentRows" size="small" :paginator="false" bordered>
                  <template #cell-priority="{ value }">
                    <MTag :value="String(value)" :severity="prioritySeverity(String(value))" />
                  </template>
                  <template #cell-status="{ value }">
                    <MTag :value="statusLabel(String(value))" severity="info" />
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
