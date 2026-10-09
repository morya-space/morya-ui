<script setup lang="ts">
import type { TableColumnDefinition} from 'morya-ui';
import { MButton, MFlex, MTable   } from 'morya-ui';
import { computed, reactive, ref } from 'vue';

const columns: TableColumnDefinition[] = [
  { key: 'name', label: '商品名称' },
  { key: 'sku', label: 'SKU', width: 130 },
  { key: 'category', label: '分类', width: 100 },
  { key: 'price', label: '价格', width: 110, align: 'end' as const },
  { key: 'stock', label: '库存', width: 88, align: 'end' as const },
  { key: 'status', label: '状态', width: 100 },
  { key: 'updatedAt', label: '更新时间', width: 120 },
  { key: 'actions', label: '操作', width: 220, align: 'center' as const },
]

const rows = ref([{ id: 'p1', name: 'Morya Pro 年订阅', sku: 'MY-PRO-Y', category: '订阅', price: 12800, stock: 999, status: 'on', updatedAt: '2026-09-20' },
  { id: 'p2', name: 'Morya 标准版', sku: 'MY-STD-Y', category: '订阅', price: 1999, stock: 999, status: 'on', updatedAt: '2026-09-18' },
  { id: 'p3', name: '企业席位扩容包', sku: 'MY-SEAT-10', category: '增值', price: 3600, stock: 200, status: 'on', updatedAt: '2026-09-15' },
  { id: 'p4', name: '私有化部署服务', sku: 'MY-PRIV', category: '服务', price: 68000, stock: 20, status: 'on', updatedAt: '2026-09-12' },
  { id: 'p5', name: '设计资源扩展包', sku: 'MY-ASSET', category: '增值', price: 680, stock: 500, status: 'on', updatedAt: '2026-09-10' },
  { id: 'p6', name: '旧版试用套餐', sku: 'MY-TRIAL-L', category: '订阅', price: 0, stock: 0, status: 'off', updatedAt: '2026-08-01' },])
const keyword = ref('')
const status = ref<string | undefined>()
const category = ref<string | undefined>()
const filtersExpanded = ref(false)
const applied = reactive({
  keyword: '',
  status: undefined as string | undefined,
  category: undefined as string | undefined,
})

const filteredRows = computed(() => {
  const kw = applied.keyword.trim().toLowerCase()
  return rows.value.filter((row) => {
    if (kw && ![row.name, row.sku].some(v => v.toLowerCase().includes(kw)))
      return false
    if (applied.status && row.status !== applied.status)
      return false
    if (applied.category && row.category !== applied.category)
      return false
    return true
  })
})

</script>

<template>
  <MFlex class="w-full h-full">
    <MTable
      :columns="columns"
      :rows="filteredRows"
      :rows-per-page="8"
      fill
      paginator
      striped
      bordered
      row-key="id"
      aria-label="商品列表"
    >
      <template #cell-price="{ value }">
        {{ Number(value) }}
      </template>
      <template #cell-status="{ value }">
        <MStatus
          :label="value === 'on' ? '上架' : '下架'"
          :type="value === 'on' ? 'success' : 'secondary'"
        />
      </template>
      <template #cell-actions>
        <MSpace>
          <MButton label="编辑" size="small" type="text"/>
          <MButton label="切换状态" size="small" type="text"/>
          <MButton label="删除" size="small" type="text" danger/>
        </MSpace>
      </template>
      <template #empty>
        <MEmpty title="还没有商品" description="创建第一个套餐或增值包后即可上架销售。" icon="box">
          <template #extra>
            <MButton label="新建商品" type="primary"/>
          </template>
        </MEmpty>
      </template>
    </MTable>
  </MFlex>
</template>

<style scoped>

</style>