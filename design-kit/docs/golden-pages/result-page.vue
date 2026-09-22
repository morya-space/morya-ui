<script setup lang="ts">
/**
 * 黄金样例：结果 / 阻断页（System）
 * 默认展示 403；换成 success / 404 / 500 时只改 status + 文案 + #footer 动作。
 * 无数据空态请用 empty-state / MEmpty，不要用 MResult。
 * @see DESIGN.md · surfaces § System · MResult API（操作用 #footer）
 */
import {
  MBreadcrumb,
  MButton,
  MConfigProvider,
  MLayout,
  MLayoutContent,
  MLayoutHeader,
  MPageContent,
  MResult,
  MSpace,
  zhCN,
} from 'morya-ui'
</script>

<template>
  <MConfigProvider :locale="zhCN">
    <MLayout fill-viewport>
      <MLayoutHeader padding="var(--m-space-4) var(--m-space-6)">
        <MBreadcrumb
          :model="[
            { label: '首页', to: '/' },
            { label: '项目管理', to: '/projects' },
            { label: '无权限' },
          ]"
        />
      </MLayoutHeader>

      <MLayoutContent>
        <MPageContent>
          <div class="result-shell">
            <MResult
              status="403"
              title="没有权限查看该项目"
              description="当前账号无权访问「青禾书房」工作区。可返回上一页，或联系管理员开通权限。"
              size="large"
            >
              <template #footer>
                <MSpace>
                  <MButton severity="primary">
                    返回上一页
                  </MButton>
                  <MButton severity="secondary" text>
                    联系管理员
                  </MButton>
                </MSpace>
              </template>
            </MResult>
          </div>
        </MPageContent>
      </MLayoutContent>
    </MLayout>
  </MConfigProvider>
</template>

<style scoped>
.result-shell {
  display: grid;
  place-items: center;
  min-height: min(28rem, 70vh);
  padding: var(--m-space-8) var(--m-space-4);
  border-radius: var(--m-radius-lg);
  background:
    radial-gradient(
      70% 55% at 50% 0%,
      color-mix(in srgb, var(--m-color-primary) 10%, transparent),
      transparent 60%
    ),
    var(--m-color-surface);
  border: 1px dashed color-mix(in srgb, var(--m-color-border) 80%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  .result-shell {
    background: var(--m-color-surface);
  }
}
</style>
