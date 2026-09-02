<script setup lang="ts">
import type { IconName } from '@well-insight/ui'
import {
  WiCard,
  WiGrid,
  WiGridItem,
  WiIcon,
  WiLayoutContent,
  WiSpace,
  WiTable,
  WiTag,
} from '@well-insight/ui'
import {
  courses,
  dashboardStats,
  enrollmentTrend,
  gradeDistribution,
  workflowTasks,
} from '@/mock'

const stats: Array<{ label: string; value: string; trend: string; icon: IconName }> = [
  { label: '在校学生', value: dashboardStats.students.toLocaleString(), trend: '+3.2%', icon: 'user' },
  { label: '在职教师', value: String(dashboardStats.teachers), trend: '+1', icon: 'user' },
  { label: '开设课程', value: String(dashboardStats.courses), trend: '+6', icon: 'star' },
  { label: '选课完成率', value: `${dashboardStats.enrollmentRate}%`, trend: '+2.1%', icon: 'sort' },
]

const recentColumns = [
  { key: 'title', label: '标题' },
  { key: 'applicant', label: '申请人', width: 96 },
  { key: 'status', label: '状态', width: 96 },
]

const maxTrend = Math.max(...enrollmentTrend.map((item) => item.count))
</script>

<template>
  <WiLayoutContent content-class="dashboard">
    <h1 class="dashboard__title">仪表盘</h1>

    <WiGrid :cols="4" :x-gap="16" :y-gap="16" responsive="screen">
      <WiGridItem v-for="item in stats" :key="item.label" :span="1">
        <WiCard class="dashboard__stat">
          <WiSpace align="center" justify="space-between">
            <div>
              <p class="dashboard__stat-label">{{ item.label }}</p>
              <p class="dashboard__stat-value">{{ item.value }}</p>
              <p class="dashboard__stat-trend">{{ item.trend }}</p>
            </div>
            <WiIcon :name="item.icon" size="lg" class="dashboard__stat-icon" aria-hidden="true" />
          </WiSpace>
        </WiCard>
      </WiGridItem>
    </WiGrid>

    <WiGrid :cols="2" :x-gap="16" :y-gap="16">
      <WiGridItem :span="1">
        <WiCard title="近 6 个月选课趋势">
          <div class="dashboard__bars" role="img" aria-label="选课趋势柱状图">
            <div v-for="item in enrollmentTrend" :key="item.month" class="dashboard__bar-item">
              <div
                class="dashboard__bar"
                :style="{ height: `${(item.count / maxTrend) * 100}%` }"
              />
              <span>{{ item.month }}</span>
            </div>
          </div>
        </WiCard>
      </WiGridItem>
      <WiGridItem :span="1">
        <WiCard title="年级人数分布">
          <ul class="dashboard__grades">
            <li v-for="item in gradeDistribution" :key="item.grade">
              <span>{{ item.grade }}</span>
              <strong>{{ item.count }}</strong>
            </li>
          </ul>
        </WiCard>
      </WiGridItem>
    </WiGrid>

    <WiGrid :cols="2" :x-gap="16" :y-gap="16">
      <WiGridItem :span="1">
        <WiCard title="待办审批">
          <WiTable
            :columns="recentColumns"
            :rows="workflowTasks as unknown as Record<string, unknown>[]"
            size="small"
            :paginator="false"
            bordered
            aria-label="待办审批列表"
          >
            <template #cell-status="{ value }">
              <WiTag
                :value="value === 'pending' ? '待审批' : value === 'approved' ? '已通过' : '已驳回'"
                :severity="value === 'pending' ? 'warn' : value === 'approved' ? 'success' : 'danger'"
              />
            </template>
          </WiTable>
        </WiCard>
      </WiGridItem>
      <WiGridItem :span="1">
        <WiCard title="热门课程">
          <WiTable
            :columns="[{ key: 'name', label: '课程' }, { key: 'enrolled', label: '人数', width: 72 }]"
            :rows="courses.slice(0, 4) as unknown as Record<string, unknown>[]"
            size="small"
            :paginator="false"
            bordered
            aria-label="热门课程列表"
          />
        </WiCard>
      </WiGridItem>
    </WiGrid>
  </WiLayoutContent>
</template>

<style scoped>
:deep(.dashboard) {
  padding: var(--wi-space-6);
  display: flex;
  flex-direction: column;
  gap: var(--wi-space-6);
}

.dashboard__title {
  margin: 0;
  font-size: var(--wi-font-size-lg);
  font-weight: 600;
}

.dashboard__stat {
  box-shadow: var(--wi-shadow-sm);
}

.dashboard__stat-label {
  margin: 0;
  color: var(--wi-color-text-muted);
  font-size: var(--wi-font-size-sm);
}

.dashboard__stat-value {
  margin: var(--wi-space-1) 0;
  color: var(--wi-color-text);
  font-size: var(--wi-font-size-lg);
  font-weight: 700;
}

.dashboard__stat-trend {
  margin: 0;
  color: var(--wi-color-primary);
  font-size: var(--wi-font-size-sm);
}

.dashboard__stat-icon {
  color: var(--wi-color-primary);
  opacity: 0.85;
}

.dashboard__bars {
  display: flex;
  align-items: flex-end;
  gap: var(--wi-space-3);
  min-height: 10rem;
  padding-top: var(--wi-space-2);
}

.dashboard__bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--wi-space-2);
  height: 10rem;
  justify-content: flex-end;
  color: var(--wi-color-text-muted);
  font-size: var(--wi-font-size-xs);
}

.dashboard__bar {
  width: 100%;
  max-width: 2.5rem;
  border-radius: var(--wi-radius-sm) var(--wi-radius-sm) 0 0;
  background: color-mix(in srgb, var(--wi-color-primary) 75%, transparent);
}

.dashboard__grades {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--wi-space-3);
}

.dashboard__grades li {
  display: flex;
  justify-content: space-between;
  padding: var(--wi-space-3);
  border: 1px solid var(--wi-color-border);
  border-radius: var(--wi-radius-md);
}
</style>
