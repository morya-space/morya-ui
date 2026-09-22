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
  MDivider,
  MLayout,
  MLayoutContent,
  MLayoutHeader,
  MPageContent,
  MPageHeader,
  MPageSection,
  MSpace,
  MStatus,
  MTable,
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

const activityColumns = [
  { key: 'time', label: '时间', width: 160 },
  { key: 'action', label: '动作' },
  { key: 'channel', label: '来源', width: 100 },
]

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
                  :severity="profile.status === 'active' ? 'success' : 'secondary'"
                />
                <MButton severity="primary">
                  编辑
                </MButton>
                <MButton severity="secondary">
                  返回
                </MButton>
                <MButton severity="danger" text>
                  删除
                </MButton>
              </MSpace>
            </template>
          </MPageHeader>

          <MPageSection title="摘要">
            <MSpace wrap style="gap: var(--m-space-2)">
              <MTag :value="profile.role" />
              <MTag :value="profile.dept" severity="info" />
            </MSpace>
            <p class="detail-lead">
              工作邮箱 {{ profile.email }} · 入职 {{ profile.joinedAt }}
            </p>
          </MPageSection>

          <MCard title="基本信息">
            <dl class="detail-props">
              <div>
                <dt>姓名</dt>
                <dd>{{ profile.name }}</dd>
              </div>
              <div>
                <dt>邮箱</dt>
                <dd>{{ profile.email }}</dd>
              </div>
              <div>
                <dt>角色</dt>
                <dd>{{ profile.role }}</dd>
              </div>
              <div>
                <dt>部门</dt>
                <dd>{{ profile.dept }}</dd>
              </div>
              <div>
                <dt>入职日期</dt>
                <dd>{{ profile.joinedAt }}</dd>
              </div>
              <div>
                <dt>状态</dt>
                <dd>
                  <MStatus
                    :label="profile.status === 'active' ? '启用' : '停用'"
                    :severity="profile.status === 'active' ? 'success' : 'secondary'"
                  />
                </dd>
              </div>
            </dl>
          </MCard>

          <MDivider />

          <MCard title="近期活动">
            <MTable
              :columns="activityColumns"
              :rows="activityRows"
              row-key="id"
              striped
              bordered
              aria-label="近期活动"
            />
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

.detail-props {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--m-space-4) var(--m-space-6);
  margin: 0;
}

.detail-props dt {
  margin: 0 0 var(--m-space-1);
  color: var(--m-color-text-muted);
  font-size: var(--m-font-size-xs);
}

.detail-props dd {
  margin: 0;
  color: var(--m-color-text);
  font-size: var(--m-font-size-md);
}

@media (max-width: 640px) {
  .detail-props {
    grid-template-columns: 1fr;
  }
}
</style>
