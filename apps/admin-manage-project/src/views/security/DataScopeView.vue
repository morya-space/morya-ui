<script setup lang="ts">
import { ref } from 'vue'
import {
  WiButton,
  WiForm,
  WiFormItem,
  WiRadio,
  WiRadioGroup,
  WiSelect,
  WiSpace,
} from '@well-insight/ui'
import FormPageTemplate from '@/components/FormPageTemplate.vue'
import { useLocale } from '@/composables/useLocale'
import { useActionFeedback } from '@/composables/useActionFeedback'

const feedback = useActionFeedback()
const { t } = useLocale()
const scope = ref('department')
const department = ref('math')

function save() {
  feedback.ok(t('配置已保存', 'Settings saved'))
}

function reset() {
  scope.value = 'department'
  department.value = 'math'
}
</script>

<template>
  <FormPageTemplate
    :title="t('数据权限', 'Data Scope')"
    :description="t('配置角色可访问的数据范围，支持按院系隔离。', 'Configure which data each role can access, including department isolation.')"
  >
    <WiForm label-position="top">
      <WiFormItem :label="t('数据范围', 'Scope')" name="scope">
        <WiRadioGroup v-model="scope">
          <WiSpace vertical>
            <WiRadio value="self" :label="t('仅本人数据', 'Own records only')" />
            <WiRadio value="department" :label="t('本部门数据', 'Department data')" />
            <WiRadio value="all" :label="t('全部数据', 'All data')" />
          </WiSpace>
        </WiRadioGroup>
      </WiFormItem>
      <WiFormItem v-if="scope === 'department'" :label="t('所属院系', 'Department')" name="department">
        <WiSelect
          v-model="department"
          :options="[
            { label: t('数学组', 'Mathematics'), value: 'math' },
            { label: t('语文组', 'Chinese'), value: 'chinese' },
            { label: t('英语组', 'English'), value: 'english' },
          ]"
          fluid
        />
      </WiFormItem>
    </WiForm>

    <template #actions>
      <WiSpace>
        <WiButton @click="save">{{ t('保存配置', 'Save') }}</WiButton>
        <WiButton severity="secondary" @click="reset">{{ t('重置', 'Reset') }}</WiButton>
      </WiSpace>
    </template>
  </FormPageTemplate>
</template>
