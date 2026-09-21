<script setup lang="ts">
/**
 * 黄金样例：列表空状态（Flow）
 * @see DESIGN.md · page-layouts.md · surfaces § Flow
 * 可嵌在列表页 MPageContent / MTable #empty 中；此处给出完整可运行骨架。
 */
import {
  MBreadcrumb,
  MButton,
  MConfigProvider,
  MEmpty,
  MLayout,
  MLayoutContent,
  MLayoutHeader,
  MPageContent,
  MPageToolbar,
  zhCN,
} from 'morya-ui'
</script>

<template>
  <MConfigProvider :locale="zhCN">
    <MLayout fill-viewport>
      <MLayoutHeader padding="var(--m-space-4) var(--m-space-6)">
        <MBreadcrumb :model="[{ label: '首页', to: '/' }, { label: '课程' }]" />
      </MLayoutHeader>

      <MLayoutContent>
        <MPageContent>
          <MPageToolbar title="课程">
            <template #actions>
              <MButton label="新建课程" />
            </template>
          </MPageToolbar>

          <div class="empty-state-shell">
            <MEmpty
              title="还没有课程"
              description="创建第一门课程后，学员就能在目录里看到它。也可以稍后从模板导入。"
              icon="book"
            >
              <template #extra>
                <MButton label="创建第一门课程" />
                <MButton label="从模板导入" severity="secondary" text />
              </template>
            </MEmpty>
          </div>
        </MPageContent>
      </MLayoutContent>
    </MLayout>
  </MConfigProvider>
</template>

<style scoped>
.empty-state-shell {
  border: 1px dashed color-mix(in srgb, var(--m-color-border) 80%, var(--m-color-primary));
  border-radius: var(--m-radius-md);
  background:
    radial-gradient(
      120% 80% at 50% 0%,
      color-mix(in srgb, var(--m-color-primary) 10%, transparent),
      transparent 55%
    ),
    var(--m-color-surface);
}
</style>
