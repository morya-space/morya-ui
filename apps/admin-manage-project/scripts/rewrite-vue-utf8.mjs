import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src')

/** @type {Record<string, string>} */
const files = {
  'components/ListPageTemplate.vue': `<script setup lang="ts">
import {
  WiBreadcrumb,
  WiButton,
  WiLayoutContent,
  WiSpace,
  WiTable,
} from '@well-insight/ui'

const props = withDefaults(defineProps<{
  title: string
  breadcrumbs: Array<{ label: string; to?: string }>
  columns: Array<{ key: string; label: string; width?: number }>
  rows: unknown[]
  loading?: boolean
  rowKey?: string
  paginator?: boolean
  rowsPerPage?: number
  selectionMode?: 'multiple' | 'single'
}>(), {
  loading: false,
  rowKey: 'id',
  paginator: true,
  rowsPerPage: 10,
  selectionMode: undefined,
})

const emit = defineEmits<{
  create: []
  search: []
  reset: []
}>()

const selection = defineModel<unknown[] | null>('selection')
</script>

<template>
  <WiLayoutContent class="list-page">
    <WiBreadcrumb :model="breadcrumbs" class="list-page__breadcrumb" />

    <section class="list-page__filters" aria-label="筛选条件">
      <slot name="filters" />
    </section>

    <header class="list-page__toolbar">
      <h1 class="list-page__title">{{ title }}</h1>
      <WiSpace>
        <slot name="actions" />
        <WiButton @click="emit('create')">新建</WiButton>
      </WiSpace>
    </header>

    <WiTable
      v-model:selection="selection as Record<string, unknown>[] | null"
      :columns="columns"
      :rows="rows as unknown as Record<string, unknown>[]"
      :loading="loading"
      :row-key="rowKey"
      :paginator="paginator"
      :rows-per-page="rowsPerPage"
      :selection-mode="selectionMode"
      striped
      bordered
    >
      <template v-for="(_, name) in $slots" #[name]="slotData">
        <slot v-if="String(name).startsWith('cell-') || name === 'empty'" :name="name" v-bind="slotData" />
      </template>
      <template #empty>
        <slot name="empty">
          <p class="list-page__empty">暂无数据</p>
        </slot>
      </template>
    </WiTable>
  </WiLayoutContent>
</template>

<style scoped>
.list-page {
  padding: var(--wi-space-6);
  display: flex;
  flex-direction: column;
  gap: var(--wi-space-4);
}

.list-page__breadcrumb {
  margin-bottom: var(--wi-space-1);
}

.list-page__filters {
  padding: var(--wi-space-4);
  background: color-mix(in srgb, var(--wi-color-border) 25%, transparent);
  border: 1px solid var(--wi-color-border);
  border-radius: var(--wi-radius-md);
}

.list-page__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--wi-space-4);
  flex-wrap: wrap;
}

.list-page__title {
  margin: 0;
  font-size: var(--wi-font-size-lg);
  font-weight: 600;
}

.list-page__empty {
  margin: 0;
  padding: var(--wi-space-8);
  text-align: center;
  color: var(--wi-color-text-muted);
}
</style>
`,

  'components/AppCommandMenu.vue': `<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { WiCommandMenu } from '@well-insight/ui'
import { commandItems } from '@/config/navigation'

const open = defineModel<boolean>({ default: false })
const router = useRouter()

const items = computed(() =>
  commandItems.map((item) => ({
    label: item.label,
    icon: item.icon,
    command: () => {
      router.push(item.route)
      open.value = false
    },
  })),
)

function onKeydown(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    open.value = true
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <WiCommandMenu
    v-model="open"
    :model="items"
    placeholder="搜索菜单、学生、课程\u2026 (Ctrl+K)"
  />
</template>
`,
}

for (const [rel, content] of Object.entries(files)) {
  const target = join(root, rel)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, content, 'utf8')
  console.log('wrote', rel)
}
