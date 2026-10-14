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
          <!-- 结果壳：视觉（渐变/虚线边框）跟 styleDirection；此处保留 token-only 极简壳 -->
          <div class="result-shell">
            <MResult
              status="403"
              title="{{结果标题}}"
              description="{{结果说明}}"
              size="large"
            >
              <template #footer>
                <MSpace>
                  <MButton type="primary">
                    {{主操作}}
                  </MButton>
                  <MButton type="text">
                    {{次操作}}
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
  background: var(--m-color-surface);
  border: 1px solid var(--m-color-border);
}
</style>
