<script setup lang="ts">
import { computed } from 'vue'
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
import { useLocale } from '@/composables/useLocale'
import {
  courses,
  dashboardStats,
  enrollmentTrend,
  gradeDistribution,
  workflowTasks,
} from '@/mock'

const { t } = useLocale()

const stats = computed<Array<{ label: string; value: string; trend: string; icon: IconName }>>(() => [
  {
    label: t('在校学生', 'Enrolled students'),
    value: dashboardStats.students.toLocaleString(),
    trend: '+3.2%',
    icon: 'user',
  },
  {
    label: t('在职教师', 'Teachers'),
    value: String(dashboardStats.teachers),
    trend: '+1',
    icon: 'user',
  },
  {
    label: t('开设课程', 'Courses'),
    value: String(dashboardStats.courses),
    trend: '+6',
    icon: 'star',
  },
  {
    label: t('选课完成率', 'Enrollment rate'),
    value: `${dashboardStats.enrollmentRate}%`,
    trend: '+2.1%',
    icon: 'sort',
  },
])

const recentColumns = computed(() => [
  { key: 'title', label: t('标题', 'Title') },
  { key: 'applicant', label: t('申请人', 'Applicant'), width: 96 },
  { key: 'status', label: t('状态', 'Status'), width: 96 },
])

const maxTrend = Math.max(...enrollmentTrend.map((item) => item.count))

function statusLabel(value: unknown) {
  if (value === 'pending') return t('待审批', 'Pending')
  if (value === 'approved') return t('已通过', 'Approved')
  return t('已驳回', 'Rejected')
}

function statusSeverity(value: unknown) {
  if (value === 'pending') return 'warn'
  if (value === 'approved') return 'success'
  return 'danger'
}
</script>

<template>
  <WiLayoutContent content-class="dashboard">
    <h1 class="dashboard__title">{{ t('仪表盘', 'Dashboard') }}</h1>

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

    <WiGrid :cols="2" :x-gap="16" :y-gap="16" class="dashboard__main">
      <WiGridItem :span="1">
        <WiCard :title="t('近 6 个月选课趋势', 'Enrollment trend (6 months)')">
          <div class="admin-bar-chart" role="img" :aria-label="t('选课趋势柱状图', 'Enrollment bar chart')">
            <div v-for="item in enrollmentTrend" :key="item.month" class="admin-bar-chart__item">
              <div
                class="admin-bar-chart__bar"
                :style="{ height: `${(item.count / maxTrend) * 100}%` }"
              />
              <span>{{ item.month }}</span>
            </div>
          </div>
        </WiCard>
      </WiGridItem>
      <WiGridItem :span="1">
        <WiCard :title="t('年级人数分布', 'Students by grade')">
          <ul class="admin-stat-list">
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
        <WiCard :title="t('待办审批', 'Pending approvals')">
          <WiTable
            :columns="recentColumns"
            :rows="workflowTasks as unknown as Record<string, unknown>[]"
            size="small"
            :paginator="false"
            bordered
            :aria-label="t('待办审批列表', 'Pending approval list')"
          >
            <template #cell-status="{ value }">
              <WiTag :value="statusLabel(value)" :severity="statusSeverity(value)" />
            </template>
          </WiTable>
        </WiCard>
      </WiGridItem>
      <WiGridItem :span="1">
        <WiCard :title="t('热门课程', 'Popular courses')">
          <WiTable
            :columns="[
              { key: 'name', label: t('课程', 'Course') },
              { key: 'enrolled', label: t('人数', 'Count'), width: 72 },
            ]"
            :rows="courses.slice(0, 4) as unknown as Record<string, unknown>[]"
            size="small"
            :paginator="false"
            bordered
            :aria-label="t('热门课程列表', 'Popular courses list')"
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
  color: var(--wi-color-text);
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
  font-size: 1.5rem;
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

.dashboard__main {
  margin-top: var(--wi-space-2);
}
</style>
