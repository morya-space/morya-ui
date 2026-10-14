<script setup lang="ts">
/**
 * 黄金样例：仪表盘页（结构母版）
 * 结构骨架：面包屑 → 页头 → 可选告警 → KPI 网格 → 主区两栏。
 * 视觉（密度/阴影/插画/文案）跟 styleDirection / 参考走，本样例仅镜像块顺序，不是唯一正确答案。
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
  { label: '总用户', value: '12,480', trend: '+8.2%', trendDirection: 'up' as const, trendLabel: '较上月', icon: 'users' },
  { label: '今日活跃', value: '1,926', trend: '+3.1%', trendDirection: 'up' as const, trendLabel: '较昨日', icon: 'activity' },
  { label: '待处理工单', value: '47', trend: '-12%', trendDirection: 'down' as const, trendLabel: '较上周', trendType: 'warning' as const, icon: 'clipboard' },
  { label: '系统健康', value: '99.9%', trend: '稳定', trendType: 'secondary' as const, icon: 'heart' },
]

const recentColumns = [
  { key: 'id', label: '工单号', width: 96 },
  { key: 'title', label: '标题' },
  { key: 'priority', label: '优先级', width: 96 },
  { key: 'status', label: '状态', width: 110 },
]

const recentRows = [
  { id: 'WO-1024', title: '登录异常反馈', priority: 'high', status: 'open' },
  { id: 'WO-1023', title: '导出任务超时', priority: 'medium', status: 'progress' },
  { id: 'WO-1022', title: '权限配置咨询', priority: 'low', status: 'done' },
]

function priorityType(p: string) {
  if (p === 'high') return 'danger'
  if (p === 'medium') return 'warning'
  return 'secondary'
}

function priorityLabel(p: string) {
  if (p === 'high') return '高'
  if (p === 'medium') return '中'
  return '低'
}

function statusLabel(s: string) {
  if (s === 'open') return '待处理'
  if (s === 'progress') return '进行中'
  return '已完成'
}

function statusType(s: string) {
  if (s === 'open') return 'warning'
  if (s === 'progress') return 'info'
  return 'success'
}
</script>

<template>
  <MConfigProvider :locale="zhCN">
    <MLayout fill-viewport>
      <MLayoutHeader padding="var(--m-space-4) var(--m-space-6)">
        <MBreadcrumb :model="[{ label: '首页' }, { label: '仪表盘' }]" />
      </MLayoutHeader>

      <MLayoutContent>
        <!-- density 跟 styleDirection；仪表盘常用 spacious，但不强制 -->
        <MPageContent>
          <!-- 标题/描述用领域真实文案替换 -->
          <MPageHeader
            title="{{页面标题}}"
            description="{{页面说明}}"
          />

          <!-- 可选告警：有实时性/延迟等提示时用 -->
          <MAlert
            type="info"
            title="{{可选告警标题}}"
            description="{{可选告警说明}}"
            closable
          />

          <MGrid :cols="4" :x-gap="16" :y-gap="16" responsive="screen">
            <MGridItem v-for="item in stats" :key="item.label" :span="1">
              <MPageStat
                :label="item.label"
                :value="item.value"
                :trend="item.trend"
                :trend-type="item.trendType ?? 'primary'"
                :trend-direction="item.trendDirection"
                :trend-label="item.trendLabel"
                :icon="item.icon"
              />
            </MGridItem>
          </MGrid>

          <MGrid :cols="2" :x-gap="16" :y-gap="16" responsive="screen">
            <MGridItem :span="1">
              <!-- shadow / 是否用 MCard 包图表区跟 styleDirection -->
              <MCard title="{{主图表区标题}}">
                <MEmpty
                  title="{{图表空态标题}}"
                  description="{{图表空态说明}}"
                  illustration="activity-low"
                />
              </MCard>
            </MGridItem>
            <MGridItem :span="1">
              <MCard title="{{最近列表区标题}}">
                <div class="dashboard-plain-stats">
                  <MStatistic title="{{统计1}}" :value="128" />
                  <MStatistic title="{{统计2}}" :value="2.4" suffix="h" :precision="1" />
                </div>
                <!-- 嵌入式次要表格：不用 fill/paginator；bordered/size 跟密度 -->
                <MTable
                  :columns="recentColumns"
                  :rows="recentRows"
                  size="small"
                  :paginator="false"
                  row-key="id"
                  aria-label="{{最近列表}}"
                >
                  <template #cell-priority="{ value }">
                    <MTag
                      :value="priorityLabel(String(value))"
                      :type="priorityType(String(value))"
                    />
                  </template>
                  <template #cell-status="{ value }">
                    <MStatus
                      :label="statusLabel(String(value))"
                      :type="statusType(String(value))"
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
