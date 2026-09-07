<script setup lang="ts">
/**
 * 黄金样例：仪表盘页
 * @see DESIGN.md §3
 */
import {
  RdBreadcrumb,
  RdCard,
  RdConfigProvider,
  RdGrid,
  RdGridItem,
  RdIcon,
  RdLayout,
  RdLayoutContent,
  RdLayoutHeader,
  RdSpace,
  RdTable,
  RdTag,
  zhCN,
} from '@roost-design/ui'

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
  <RdConfigProvider :locale="zhCN">
    <RdLayout class="page-dashboard">
      <RdLayoutHeader class="page-dashboard__header">
        <RdBreadcrumb :model="[{ label: '首页' }, { label: '仪表盘' }]" />
      </RdLayoutHeader>

      <RdLayoutContent class="page-dashboard__content">
        <h1 class="page-dashboard__title">仪表盘</h1>

        <!-- KPI 卡片 -->
        <RdGrid :cols="4" :x-gap="16" :y-gap="16" responsive="screen">
          <RdGridItem v-for="item in stats" :key="item.label" :span="1">
            <RdCard class="page-dashboard__stat">
              <RdSpace align="center" justify="space-between">
                <div>
                  <p class="page-dashboard__stat-label">{{ item.label }}</p>
                  <p class="page-dashboard__stat-value">{{ item.value }}</p>
                  <p class="page-dashboard__stat-trend">{{ item.trend }}</p>
                </div>
                <RdIcon :name="item.icon" size="lg" aria-hidden="true" class="page-dashboard__stat-icon" />
              </RdSpace>
            </RdCard>
          </RdGridItem>
        </RdGrid>

        <!-- 主内容两栏 -->
        <RdGrid :cols="2" :x-gap="16" :y-gap="16" class="page-dashboard__main">
          <RdGridItem :span="1">
            <RdCard title="趋势概览">
              <div class="page-dashboard__chart-placeholder" role="img" aria-label="图表占位">
                图表区域（接入 ECharts / 业务组件）
              </div>
            </RdCard>
          </RdGridItem>
          <RdGridItem :span="1">
            <RdCard title="最近工单">
              <RdTable :columns="recentColumns" :rows="recentRows" size="small" :paginator="false" bordered>
                <template #cell-priority="{ value }">
                  <RdTag :value="String(value)" :severity="prioritySeverity(String(value))" />
                </template>
                <template #cell-status="{ value }">
                  <RdTag :value="statusLabel(String(value))" severity="info" />
                </template>
              </RdTable>
            </RdCard>
          </RdGridItem>
        </RdGrid>
      </RdLayoutContent>
    </RdLayout>
  </RdConfigProvider>
</template>

<style scoped>
.page-dashboard {
  min-height: 100vh;
  background: var(--rd-color-surface);
}

.page-dashboard__header {
  padding: var(--rd-space-4) var(--rd-space-6);
  border-bottom: 1px solid var(--rd-color-border);
  background: var(--rd-color-surface);
}

.page-dashboard__content {
  padding: var(--rd-space-6);
  display: flex;
  flex-direction: column;
  gap: var(--rd-space-6);
}

.page-dashboard__title {
  margin: 0;
  font-size: var(--rd-font-size-lg);
  font-weight: 600;
  color: var(--rd-color-text);
}

.page-dashboard__stat {
  box-shadow: var(--rd-shadow-sm);
}

.page-dashboard__stat-label {
  margin: 0;
  color: var(--rd-color-text-muted);
  font-size: var(--rd-font-size-sm);
}

.page-dashboard__stat-value {
  margin: var(--rd-space-1) 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--rd-color-text);
}

.page-dashboard__stat-trend {
  margin: 0;
  color: var(--rd-color-primary);
  font-size: var(--rd-font-size-sm);
}

.page-dashboard__stat-icon {
  color: var(--rd-color-primary);
  opacity: 0.85;
}

.page-dashboard__main {
  margin-top: var(--rd-space-2);
}

.page-dashboard__chart-placeholder {
  display: grid;
  place-items: center;
  min-height: 12rem;
  border: 1px dashed var(--rd-color-border);
  border-radius: var(--rd-radius-md);
  color: var(--rd-color-text-muted);
  font-size: var(--rd-font-size-sm);
  background: color-mix(in srgb, var(--rd-color-border) 15%, transparent);
}
</style>
