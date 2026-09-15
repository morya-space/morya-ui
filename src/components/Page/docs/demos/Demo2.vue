<script setup lang="ts">
import {
  MButton,
  MForm,
  MFormItem,
  MInput,
  MPageContent,
  MPageHeader,
  MPageSection,
  MSpace,
} from 'morya-ui'
import { ref } from 'vue'

const name = ref('')
</script>

<template>
  <div
    class="doc-demo-frame"
    style="border:1px solid var(--m-color-border);border-radius:var(--m-radius-md);overflow:hidden;background:var(--m-color-surface)"
  >
    <MPageContent width="narrow">
      <MPageHeader title="新建用户" description="填写基本信息。" />
      <MPageSection variant="form">
        <MForm @submit.prevent>
          <MFormItem label="姓名" name="name">
            <MInput v-model="name" fluid />
          </MFormItem>
          <MPageSection variant="actions">
            <MSpace>
              <MButton native-type="submit" severity="primary">
                保存
              </MButton>
              <MButton severity="secondary">
                取消
              </MButton>
            </MSpace>
          </MPageSection>
        </MForm>
      </MPageSection>
    </MPageContent>
  </div>
</template>
