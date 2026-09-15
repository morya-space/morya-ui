<script setup lang="ts">
/**
 * 黄金样例：列表空状态（Flow）
 * @see DESIGN.md §3 · morya-ui-pages surfaces § Flow
 * 可嵌在列表页 MPageContent / MTable #empty 中；此处给出完整可运行骨架。
 */
import {
  MBreadcrumb,
  MButton,
  MConfigProvider,
  MIcon,
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

          <div class="empty-state" role="status">
            <div class="empty-state__mark" aria-hidden="true">
              <MIcon name="book" size="lg" />
            </div>
            <h2 class="empty-state__title">还没有课程</h2>
            <p class="empty-state__desc">
              创建第一门课程后，学员就能在目录里看到它。也可以稍后从模板导入。
            </p>
            <div class="empty-state__actions">
              <MButton label="创建第一门课程" />
              <MButton label="从模板导入" severity="secondary" text />
            </div>
          </div>
        </MPageContent>
      </MLayoutContent>
    </MLayout>
  </MConfigProvider>
</template>

<style scoped>
.empty-state {
  display: grid;
  justify-items: center;
  gap: var(--m-space-3);
  padding: clamp(2.5rem, 8vh, 4.5rem) var(--m-space-6);
  text-align: center;
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

.empty-state__mark {
  display: grid;
  place-items: center;
  width: 3.25rem;
  height: 3.25rem;
  margin-bottom: var(--m-space-2);
  border-radius: 999px;
  color: var(--m-color-primary);
  background: color-mix(in srgb, var(--m-color-primary) 14%, var(--m-color-surface));
}

.empty-state__title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 650;
  letter-spacing: -0.02em;
}

.empty-state__desc {
  margin: 0;
  max-width: 28rem;
  color: var(--m-color-text-muted);
  line-height: 1.55;
}

.empty-state__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--m-space-3);
  margin-top: var(--m-space-3);
}
</style>
