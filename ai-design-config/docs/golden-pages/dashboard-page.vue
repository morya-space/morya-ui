<script setup lang="ts">
/**
 * 黄金样例：仪表盘页
 * @see DESIGN.md §3
 */
import {
  WdBreadcrumb,
  WdCard,
  WdConfigProvider,
  WdGrid,
  WdGridItem,
  WdIcon,
  WdLayout,
  WdLayoutContent,
  WdLayoutHeader,
  WdSpace,
  WdTable,
  WdTag,
  zhCN,
} from '@wex-design/ui'

const stats = [
  { label: '总用户', value: '12,480', trend: '+8.2%', icon: 'users' },
  { label: '今日活跃', value: '1,926', trend: '+3.1%', icon: 'activity' },
  { label: '待处理工单', value: '47', trend: '-12%', icon: 'clipboard' },
  { label: '系统健康', value: '99.9%', trend: '稳定', icon: 'heart' },
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
  <WdConfigProvider :locale="zhCN">
    <WdLayout class="page-dashboard">
      <WdLayoutHeader class="page-dashboard__header">
        <WdBreadcrumb :model="[{ label: '首页' }, { label: '仪表盘' }]" />
      </WdLayoutHeader>

      <WdLayoutContent class="page-dashboard__content">
        <h1 class="page-dashboard__title">仪表盘</h1>

        <!-- KPI 卡片 -->
        <WdGrid :cols="4" :x-gap="16" :y-gap="16" responsive="screen">
          <WdGridItem v-for="item in stats" :key="item.label" :span="1">
            <WdCard class="page-dashboard__stat">
              <WdSpace align="center" justify="space-between">
                <div>
                  <p class="page-dashboard__stat-label">{{ item.label }}</p>
                  <p class="page-dashboard__stat-value">{{ item.value }}</p>
                  <p class="page-dashboard__stat-trend">{{ item.trend }}</p>
                </div>
                <WdIcon :name="item.icon" size="lg" aria-hidden="true" class="page-dashboard__stat-icon" />
              </WdSpace>
            </WdCard>
          </WdGridItem>
        </WdGrid>

        <!-- 主内容两栏 -->
        <WdGrid :cols="2" :x-gap="16" :y-gap="16" class="page-dashboard__main">
          <WdGridItem :span="1">
            <WdCard title="趋势概览">
              <div class="page-dashboard__chart-placeholder" role="img" aria-label="图表占位">
                图表区域（接入 ECharts / 业务组件）
              </div>
            </WdCard>
          </WdGridItem>
          <WdGridItem :span="1">
            <WdCard title="最近工单">
              <WdTable :columns="recentColumns" :rows="recentRows" size="small" :paginator="false" bordered>
                <template #cell-priority="{ value }">
                  <WdTag :value="String(value)" :severity="prioritySeverity(String(value))" />
                </template>
                <template #cell-status="{ value }">
                  <WdTag :value="statusLabel(String(value))" severity="info" />
                </template>
              </WdTable>
            </WdCard>
          </WdGridItem>
        </WdGrid>
      </WdLayoutContent>
    </WdLayout>
  </WdConfigProvider>
</template>

<style scoped>
.page-dashboard {
  min-height: 100vh;
  background: var(--wd-color-surface);
}

.page-dashboard__header {
  padding: var(--wd-space-4) var(--wd-space-6);
  border-bottom: 1px solid var(--wd-color-border);
  background: var(--wd-color-surface);
}

.page-dashboard__content {
  padding: var(--wd-space-6);
  display: flex;
  flex-direction: column;
  gap: var(--wd-space-6);
}

.page-dashboard__title {
  margin: 0;
  font-size: var(--wd-font-size-lg);
  font-weight: 600;
  color: var(--wd-color-text);
}

.page-dashboard__stat {
  box-shadow: var(--wd-shadow-sm);
}

.page-dashboard__stat-label {
  margin: 0;
  color: var(--wd-color-text-muted);
  font-size: var(--wd-font-size-sm);
}

.page-dashboard__stat-value {
  margin: var(--wd-space-1) 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--wd-color-text);
}

.page-dashboard__stat-trend {
  margin: 0;
  color: var(--wd-color-primary);
  font-size: var(--wd-font-size-sm);
}

.page-dashboard__stat-icon {
  color: var(--wd-color-primary);
  opacity: 0.85;
}

.page-dashboard__main {
  margin-top: var(--wd-space-2);
}

.page-dashboard__chart-placeholder {
  display: grid;
  place-items: center;
  min-height: 12rem;
  border: 1px dashed var(--wd-color-border);
  border-radius: var(--wd-radius-md);
  color: var(--wd-color-text-muted);
  font-size: var(--wd-font-size-sm);
  background: color-mix(in srgb, var(--wd-color-border) 15%, transparent);
}
</style>
