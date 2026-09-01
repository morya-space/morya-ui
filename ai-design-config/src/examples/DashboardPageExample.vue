<script setup lang="ts">
/**
 * 黄金样例：仪表盘页
 * @see DESIGN.md §3
 */
import {
  WiBreadcrumb,
  WiCard,
  WiGrid,
  WiGridItem,
  WiIcon,
  WiLayout,
  WiLayoutContent,
  WiLayoutHeader,
  WiSpace,
  WiTable,
  WiTag,
} from '@well-insight/ui'

const stats = [
  { label: '总用户', value: '12,480', trend: '+8.2%', icon: 'users' },
  { label: '今日活跃', value: '1,926', trend: '+3.1%', icon: 'activity' },
  { label: '待处理工单', value: '47', trend: '-12%', icon: 'clipboard' },
  { label: '系统健康', value: '99.9%', trend: '稳定', icon: 'heart' },
]

const recentColumns = [
  { key: 'id', label: '工单号', width: '6rem' },
  { key: 'title', label: '标题' },
  { key: 'priority', label: '优先级', width: '6rem' },
  { key: 'status', label: '状态', width: '6rem' },
]

const recentRows = [
  { id: '#1024', title: '登录异常反馈', priority: 'high', status: 'open' },
  { id: '#1023', title: '导出任务超时', priority: 'medium', status: 'progress' },
  { id: '#1022', title: '权限配置咨询', priority: 'low', status: 'done' },
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
  <WiLayout class="page-dashboard">
    <WiLayoutHeader class="page-dashboard__header">
      <WiBreadcrumb :model="[{ label: '首页' }, { label: '仪表盘' }]" />
    </WiLayoutHeader>

    <WiLayoutContent class="page-dashboard__content">
      <h1 class="page-dashboard__title">仪表盘</h1>

      <!-- KPI 卡片 -->
      <WiGrid :cols="4" :x-gap="16" :y-gap="16" responsive="screen">
        <WiGridItem v-for="item in stats" :key="item.label" :span="1">
          <WiCard class="page-dashboard__stat">
            <WiSpace align="center" justify="space-between">
              <div>
                <p class="page-dashboard__stat-label">{{ item.label }}</p>
                <p class="page-dashboard__stat-value">{{ item.value }}</p>
                <p class="page-dashboard__stat-trend">{{ item.trend }}</p>
              </div>
              <WiIcon :name="item.icon" size="lg" aria-hidden="true" />
            </WiSpace>
          </WiCard>
        </WiGridItem>
      </WiGrid>

      <!-- 主内容两栏 -->
      <WiGrid :cols="2" :x-gap="16" :y-gap="16" class="page-dashboard__main">
        <WiGridItem :span="1">
          <WiCard title="趋势概览">
            <div class="page-dashboard__chart-placeholder" role="img" aria-label="图表占位">
              图表区域（接入 ECharts / 业务组件）
            </div>
          </WiCard>
        </WiGridItem>
        <WiGridItem :span="1">
          <WiCard title="最近工单">
            <WiTable :columns="recentColumns" :rows="recentRows" row-key="id" size="small">
              <template #cell-priority="{ row }">
                <WiTag :value="row.priority" :severity="prioritySeverity(row.priority)" />
              </template>
              <template #cell-status="{ row }">
                <WiTag :value="statusLabel(row.status)" severity="info" />
              </template>
            </WiTable>
          </WiCard>
        </WiGridItem>
      </WiGrid>
    </WiLayoutContent>
  </WiLayout>
</template>

<style scoped>
.page-dashboard {
  min-height: 100vh;
  background: var(--wi-color-surface);
}

.page-dashboard__header {
  padding: var(--wi-space-4) var(--wi-space-6);
  border-bottom: 1px solid var(--wi-color-border);
}

.page-dashboard__content {
  padding: var(--wi-space-6);
  display: flex;
  flex-direction: column;
  gap: var(--wi-space-6);
}

.page-dashboard__title {
  margin: 0;
  font-size: var(--wi-font-size-lg);
  color: var(--wi-color-text);
}

.page-dashboard__stat-label {
  margin: 0;
  color: var(--wi-color-text-muted);
  font-size: var(--wi-font-size-sm);
}

.page-dashboard__stat-value {
  margin: var(--wi-space-1) 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--wi-color-text);
}

.page-dashboard__stat-trend {
  margin: 0;
  color: var(--wi-color-primary);
  font-size: var(--wi-font-size-sm);
}

.page-dashboard__main {
  margin-top: var(--wi-space-2);
}

.page-dashboard__chart-placeholder {
  display: grid;
  place-items: center;
  min-height: 12rem;
  border: 1px dashed var(--wi-color-border);
  border-radius: var(--wi-radius-md);
  color: var(--wi-color-text-muted);
  font-size: var(--wi-font-size-sm);
}
</style>
