<script setup lang="ts">
/**
 * 黄金样例：详情页
 * @see DESIGN.md · morya-ui-pages references/page-layouts.md · visual-craft § Ops polish
 */
import {
  MBreadcrumb,
  MButton,
  MCard,
  MConfigProvider,
  MDescriptions,
  MDescriptionsItem,
  MDivider,
  MLayout,
  MLayoutContent,
  MLayoutHeader,
  MList,
  MListItem,
  MListItemMeta,
  MPageContent,
  MPageHeader,
  MPageSection,
  MSpace,
  MStatus,
  MTag,
  zhCN,
} from 'morya-ui'

const profile = {
  name: '林晓',
  email: 'linxiao@example.com',
  role: '成员',
  dept: '产品设计',
  joinedAt: '2025-03-12',
  status: 'active' as const,
}

const activityRows = [
  { id: '1', time: '2026-09-20 14:22', action: '更新了个人资料', channel: 'Web' },
  { id: '2', time: '2026-09-18 09:05', action: '重置了登录密码', channel: 'Web' },
  { id: '3', time: '2026-09-12 18:41', action: '加入「产品设计」部门', channel: 'Admin' },
]
</script>

<template>
  <MConfigProvider :locale="zhCN">
    <MLayout fill-viewport>
      <MLayoutHeader padding="var(--m-space-4) var(--m-space-6)">
        <MBreadcrumb
          :model="[
            { label: '首页', to: '/' },
            { label: '用户管理', to: '/users' },
            { label: profile.name },
          ]"
        />
      </MLayoutHeader>

      <MLayoutContent>
        <MPageContent>
          <MPageHeader
            :title="profile.name"
            description="查看账号摘要、属性与近期活动。编辑走同页弹窗或独立表单页，勿做成营销落地。"
          >
            <template #actions>
              <MSpace>
                <MStatus
                  :label="profile.status === 'active' ? '启用' : '停用'"
                  :type="profile.status === 'active' ? 'success' : 'secondary'"
                />
                <MButton type="primary">
                  编辑
                </MButton>
                <MButton>
                  返回
                </MButton>
                <MButton type="text" danger>
                  删除
                </MButton>
              </MSpace>
            </template>
          </MPageHeader>

          <MPageSection title="摘要">
            <MSpace wrap style="gap: var(--m-space-2)">
              <MTag :value="profile.role" />
              <MTag :value="profile.dept" type="info" />
            </MSpace>
            <p class="detail-lead">
              工作邮箱 {{ profile.email }} · 入职 {{ profile.joinedAt }}
            </p>
          </MPageSection>

          <MDescriptions title="基本信息" bordered :column="2">
            <MDescriptionsItem label="姓名">
              {{ profile.name }}
            </MDescriptionsItem>
            <MDescriptionsItem label="邮箱">
              {{ profile.email }}
            </MDescriptionsItem>
            <MDescriptionsItem label="角色">
              {{ profile.role }}
            </MDescriptionsItem>
            <MDescriptionsItem label="部门">
              {{ profile.dept }}
            </MDescriptionsItem>
            <MDescriptionsItem label="入职日期">
              {{ profile.joinedAt }}
            </MDescriptionsItem>
            <MDescriptionsItem label="状态">
              <MStatus
                :label="profile.status === 'active' ? '启用' : '停用'"
                :type="profile.status === 'active' ? 'success' : 'secondary'"
              />
            </MDescriptionsItem>
          </MDescriptions>

          <MDivider />

          <MCard title="近期活动">
            <MList
              :items="activityRows"
              row-key="id"
              size="small"
            >
              <template #item="{ item }">
                <MListItem>
                  <MListItemMeta
                    :title="item.action"
                    :description="`${item.time} · ${item.channel}`"
                  />
                </MListItem>
              </template>
            </MList>
          </MCard>
        </MPageContent>
      </MLayoutContent>
    </MLayout>
  </MConfigProvider>
</template>

<style scoped>
.detail-lead {
  margin: var(--m-space-3) 0 0;
  color: var(--m-color-text-muted);
  font-size: var(--m-font-size-sm);
}
</style>
