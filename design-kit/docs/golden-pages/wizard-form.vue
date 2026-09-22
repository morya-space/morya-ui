<script setup lang="ts">
/**
 * 黄金样例：分步向导（wizard-form）
 * MStepper + 每步一个主任务；完成态可接 result-page。
 * @see DESIGN.md · surfaces § Flow · pattern wizard-form
 */
import {
  MBreadcrumb,
  MButton,
  MConfigProvider,
  MForm,
  MFormItem,
  MInput,
  MInputTags,
  MLayout,
  MLayoutContent,
  MLayoutHeader,
  MPageContent,
  MPageHeader,
  MPageSection,
  MSelect,
  MSpace,
  MStepper,
  message,
  zhCN,
} from 'morya-ui'
import { computed, reactive, ref } from 'vue'

const activeStep = ref(0)
const submitting = ref(false)

const steps = [
  { label: '工作空间', description: '名称与地区' },
  { label: '邀请成员', description: '可选邮箱' },
  { label: '确认', description: '核对后创建' },
]

const model = reactive({
  name: '',
  region: undefined as string | undefined,
  invites: [] as string[],
})

const regionOptions = [
  { label: '中国大陆', value: 'cn' },
  { label: '亚太', value: 'apac' },
  { label: '北美', value: 'na' },
]

const canNext = computed(() => {
  if (activeStep.value === 0) return Boolean(model.name && model.region)
  return true
})

function back() {
  if (activeStep.value > 0) activeStep.value -= 1
}

function next() {
  if (!canNext.value) return
  if (activeStep.value < steps.length - 1) activeStep.value += 1
}

async function finish() {
  submitting.value = true
  try {
    // await api.createWorkspace(model)
    message.success('工作空间已创建')
    // 成功页可镜像 get_golden_page('result-page')，将 status 改为 success
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <MConfigProvider :locale="zhCN">
    <MLayout fill-viewport>
      <MLayoutHeader padding="var(--m-space-4) var(--m-space-6)">
        <MBreadcrumb
          :model="[
            { label: '首页', to: '/' },
            { label: '工作空间', to: '/workspaces' },
            { label: '创建' },
          ]"
        />
      </MLayoutHeader>

      <MLayoutContent>
        <MPageContent width="narrow">
          <MPageHeader
            title="创建工作空间"
            description="三步完成；每步只做一件事。Stepper 使用 steps（不是 items）。"
          />

          <MStepper v-model="activeStep" :steps="steps" linear />

          <MPageSection variant="form">
            <MForm v-if="activeStep === 0" @submit.prevent="next">
              <MFormItem label="名称" name="name" required>
                <MInput v-model="model.name" placeholder="例如：青禾书房" fluid />
              </MFormItem>
              <MFormItem label="地区" name="region" required>
                <MSelect
                  v-model="model.region"
                  :options="regionOptions"
                  placeholder="选择地区"
                  fluid
                />
              </MFormItem>
            </MForm>

            <MForm v-else-if="activeStep === 1" @submit.prevent="next">
              <MFormItem label="邀请邮箱" name="invites">
                <MInputTags
                  v-model="model.invites"
                  placeholder="输入邮箱后回车"
                />
              </MFormItem>
              <p class="wizard-hint">
                可跳过；稍后也可在成员管理中邀请。
              </p>
            </MForm>

            <div v-else class="wizard-summary">
              <p><strong>名称</strong> {{ model.name || '—' }}</p>
              <p><strong>地区</strong> {{ model.region || '—' }}</p>
              <p><strong>邀请</strong> {{ model.invites.length ? model.invites.join('、') : '暂无' }}</p>
            </div>

            <MPageSection variant="actions">
              <MSpace>
                <MButton
                  severity="secondary"
                  text
                  :disabled="activeStep === 0 || submitting"
                  @click="back"
                >
                  上一步
                </MButton>
                <MButton
                  v-if="activeStep < steps.length - 1"
                  severity="primary"
                  :disabled="!canNext"
                  @click="next"
                >
                  下一步
                </MButton>
                <MButton
                  v-else
                  severity="primary"
                  :loading="submitting"
                  @click="finish"
                >
                  创建
                </MButton>
              </MSpace>
            </MPageSection>
          </MPageSection>
        </MPageContent>
      </MLayoutContent>
    </MLayout>
  </MConfigProvider>
</template>

<style scoped>
.wizard-hint,
.wizard-summary {
  margin: 0;
  color: var(--m-color-text-muted);
  font-size: var(--m-font-size-sm);
}

.wizard-summary {
  display: grid;
  gap: var(--m-space-2);
}

.wizard-summary p {
  margin: 0;
}
</style>
