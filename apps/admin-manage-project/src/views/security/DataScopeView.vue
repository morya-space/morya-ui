<script setup lang="ts">
import { ref } from 'vue'
import {
  WiButton,
  WiCard,
  WiForm,
  WiFormItem,
  WiLayoutContent,
  WiRadio,
  WiRadioGroup,
  WiSelect,
  WiSpace,
  useToast,
} from '@well-insight/ui'

const toast = useToast()
const scope = ref('department')
const department = ref('math')

function save() {
  toast.add({ severity: 'success', summary: '配置已保存', life: 2500 })
}

function reset() {
  scope.value = 'department'
  department.value = 'math'
}
</script>

<template>
  <WiLayoutContent content-class="data-scope">
    <header class="data-scope__intro">
      <h1 class="data-scope__title">数据权限</h1>
      <p class="data-scope__desc">配置角色可访问的数据范围，支持按院系隔离。</p>
    </header>

    <WiCard title="数据范围配置" class="data-scope__card">
      <WiForm label-position="top">
        <WiFormItem label="数据范围" name="scope">
          <WiRadioGroup v-model="scope">
            <WiSpace vertical>
              <WiRadio value="self" label="仅本人数据" />
              <WiRadio value="department" label="本部门数据" />
              <WiRadio value="all" label="全部数据" />
            </WiSpace>
          </WiRadioGroup>
        </WiFormItem>
        <WiFormItem v-if="scope === 'department'" label="所属院系" name="department">
          <WiSelect
            v-model="department"
            :options="[
              { label: '数学组', value: 'math' },
              { label: '语文组', value: 'chinese' },
              { label: '英语组', value: 'english' },
            ]"
            fluid
          />
        </WiFormItem>
        <footer class="data-scope__actions">
          <WiSpace>
            <WiButton @click="save">保存配置</WiButton>
            <WiButton severity="secondary" @click="reset">重置</WiButton>
          </WiSpace>
        </footer>
      </WiForm>
    </WiCard>
  </WiLayoutContent>
</template>

<style scoped>
:deep(.data-scope) {
  padding: var(--wi-space-6);
  max-width: 40rem;
  display: flex;
  flex-direction: column;
  gap: var(--wi-space-4);
}

.data-scope__title {
  margin: 0;
  font-size: var(--wi-font-size-lg);
  font-weight: 600;
}

.data-scope__desc {
  margin: var(--wi-space-2) 0 0;
  color: var(--wi-color-text-muted);
  font-size: var(--wi-font-size-sm);
}

.data-scope__card {
  box-shadow: var(--wi-shadow-sm);
}

.data-scope__actions {
  margin-top: var(--wi-space-4);
  padding-top: var(--wi-space-4);
  border-top: 1px solid var(--wi-color-border);
}
</style>
