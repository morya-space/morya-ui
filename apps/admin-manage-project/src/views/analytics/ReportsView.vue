<script setup lang="ts">
import { computed, ref } from 'vue'
import { WiButton, WiCard, WiGrid, WiGridItem, WiLayoutContent, WiSelect, WiSpace } from '@well-insight/ui'
import ListFilterField from '@/components/ListFilterField.vue'
import { useLocale } from '@/composables/useLocale'
import { enrollmentTrend, gradeDistribution } from '@/mock'

const { t } = useLocale()
const dimension = ref('grade')
const maxTrend = Math.max(...enrollmentTrend.map((item) => item.count))

const dimensionOptions = computed(() => [
  { label: t('按年级', 'By grade'), value: 'grade' },
  { label: t('按院系', 'By department'), value: 'department' },
  { label: t('按月份', 'By month'), value: 'month' },
])
</script>

<template>
  <WiLayoutContent content-class="reports-page">
    <header class="reports-page__header">
      <div>
        <h1 class="reports-page__title">{{ t('数据报表', 'Reports') }}</h1>
        <p class="reports-page__desc">
          {{ t('支持按年级、院系或月份维度查看统计（演示）。', 'View stats by grade, department, or month (demo).') }}
        </p>
      </div>
      <WiSpace>
        <ListFilterField size="sm">
          <WiSelect v-model="dimension" :options="dimensionOptions" />
        </ListFilterField>
        <WiButton severity="secondary">{{ t('导出 Excel', 'Export Excel') }}</WiButton>
        <WiButton severity="secondary">{{ t('导出 PDF', 'Export PDF') }}</WiButton>
      </WiSpace>
    </header>

    <WiGrid :cols="2" :x-gap="16" :y-gap="16">
      <WiGridItem :span="1">
        <WiCard :title="t('选课趋势', 'Enrollment trend')" class="reports-page__card">
          <div class="admin-bar-chart" role="img" :aria-label="t('选课趋势柱状图', 'Enrollment bar chart')">
            <div v-for="item in enrollmentTrend" :key="item.month" class="admin-bar-chart__item">
              <div class="admin-bar-chart__bar" :style="{ height: `${(item.count / maxTrend) * 100}%` }" />
              <span>{{ item.month }}</span>
            </div>
          </div>
        </WiCard>
      </WiGridItem>
      <WiGridItem :span="1">
        <WiCard :title="t('年级人数分布', 'Students by grade')" class="reports-page__card">
          <ul class="admin-stat-list">
            <li v-for="item in gradeDistribution" :key="item.grade">
              <span>{{ item.grade }}</span>
              <strong>{{ item.count }}</strong>
            </li>
          </ul>
        </WiCard>
      </WiGridItem>
    </WiGrid>
  </WiLayoutContent>
</template>

<style scoped>
:deep(.reports-page) {
  padding: var(--wi-space-6);
  display: flex;
  flex-direction: column;
  gap: var(--wi-space-4);
}

.reports-page__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--wi-space-4);
  flex-wrap: wrap;
}

.reports-page__title {
  margin: 0;
  font-size: var(--wi-font-size-lg);
  font-weight: 600;
}

.reports-page__desc {
  margin: var(--wi-space-2) 0 0;
  color: var(--wi-color-text-muted);
  font-size: var(--wi-font-size-sm);
}

.reports-page__card {
  box-shadow: var(--wi-shadow-sm);
}
</style>
