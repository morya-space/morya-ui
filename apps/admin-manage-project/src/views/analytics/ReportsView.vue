<script setup lang="ts">
import { ref } from 'vue'
import { WiButton, WiCard, WiGrid, WiGridItem, WiLayoutContent, WiSelect, WiSpace } from '@well-insight/ui'
import { enrollmentTrend, gradeDistribution } from '@/mock'

const dimension = ref('grade')
const maxTrend = Math.max(...enrollmentTrend.map((item) => item.count))
</script>

<template>
  <WiLayoutContent content-class="reports-page">
    <header class="reports-page__header">
      <div>
        <h1 class="reports-page__title">数据报表</h1>
        <p class="reports-page__desc">支持按年级、院系或月份维度查看统计（演示）。</p>
      </div>
      <WiSpace>
        <WiSelect
          v-model="dimension"
          :options="[
            { label: '按年级', value: 'grade' },
            { label: '按院系', value: 'department' },
            { label: '按月份', value: 'month' },
          ]"
          style="width: 10rem"
        />
        <WiButton severity="secondary">导出 Excel</WiButton>
        <WiButton severity="secondary">导出 PDF</WiButton>
      </WiSpace>
    </header>

    <WiGrid :cols="2" :x-gap="16" :y-gap="16">
      <WiGridItem :span="1">
        <WiCard title="选课趋势" class="reports-page__card">
          <div class="reports-page__bars" role="img" aria-label="选课趋势柱状图">
            <div v-for="item in enrollmentTrend" :key="item.month" class="reports-page__bar-item">
              <div class="reports-page__bar" :style="{ height: `${(item.count / maxTrend) * 100}%` }" />
              <span>{{ item.month }}</span>
            </div>
          </div>
        </WiCard>
      </WiGridItem>
      <WiGridItem :span="1">
        <WiCard title="年级人数分布" class="reports-page__card">
          <ul class="reports-page__list">
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

.reports-page__bars {
  display: flex;
  align-items: flex-end;
  gap: var(--wi-space-3);
  min-height: 10rem;
}

.reports-page__bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--wi-space-2);
  height: 10rem;
  justify-content: flex-end;
  font-size: var(--wi-font-size-xs);
  color: var(--wi-color-text-muted);
}

.reports-page__bar {
  width: 100%;
  max-width: 2.5rem;
  border-radius: var(--wi-radius-sm) var(--wi-radius-sm) 0 0;
  background: color-mix(in srgb, var(--wi-color-primary) 70%, transparent);
}

.reports-page__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--wi-space-3);
}

.reports-page__list li {
  display: flex;
  justify-content: space-between;
  padding: var(--wi-space-3);
  border: 1px solid var(--wi-color-border);
  border-radius: var(--wi-radius-md);
}
</style>
