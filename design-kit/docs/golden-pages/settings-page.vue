<script setup lang="ts">
/**
 * 黄金样例：设置 / 配置页
 * 窄栏 + Tabs 分组 + MPageSection form；保存用 message 单行回执。
 * @see DESIGN.md · page-layouts.md § Settings · visual-craft § Ops polish
 */
import {
  MBreadcrumb,
  MButton,
  MConfigProvider,
  MForm,
  MFormItem,
  MInput,
  MLayout,
  MLayoutContent,
  MLayoutHeader,
  MPageContent,
  MPageHeader,
  MPageSection,
  MSelect,
  MSpace,
  MSwitch,
  MTabs,
  message,
  zhCN,
} from 'morya-ui'
import { reactive, ref } from 'vue'

const activeTab = ref('profile')
const submitting = ref(false)

const tabs = [
  { label: '资料', value: 'profile' },
  { label: '通知', value: 'notify' },
  { label: '安全', value: 'security' },
]

const profile = reactive({
  displayName: '林晓',
  email: 'linxiao@example.com',
  language: 'zh-CN' as string | undefined,
})

const notify = reactive({
  emailDigest: true,
  productUpdates: false,
})

const languageOptions = [
  { label: '简体中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' },
]

async function saveProfile() {
  submitting.value = true
  try {
    // await api.saveProfile(profile)
    message.success('资料已保存')
  } finally {
    submitting.value = false
  }
}

async function saveNotify() {
  submitting.value = true
  try {
    // await api.saveNotify(notify)
    message.success('通知偏好已保存')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <MConfigProvider :locale="zhCN">
    <MLayout fill-viewport>
      <MLayoutHeader padding="var(--m-space-4) var(--m-space-6)">
        <MBreadcrumb :model="[{ label: '首页', to: '/' }, { label: '系统设置' }]" />
      </MLayoutHeader>

      <MLayoutContent>
        <MPageContent width="narrow">
          <MPageHeader
            title="系统设置"
            description="按域分组配置；切换 Tab 时保留未保存输入，保存成功用 message 一句话回执。"
          />

          <MTabs v-model="activeTab" :tabs="tabs">
            <template #default="{ activeValue }">
              <MPageSection v-if="activeValue === 'profile'" variant="form" title="个人资料">
                <MForm @submit.prevent="saveProfile">
                  <MFormItem label="显示名称" name="displayName" required>
                    <MInput v-model="profile.displayName" fluid />
                  </MFormItem>
                  <MFormItem label="工作邮箱" name="email" required>
                    <MInput v-model="profile.email" type="email" fluid />
                  </MFormItem>
                  <MFormItem label="界面语言" name="language">
                    <MSelect
                      v-model="profile.language"
                      :options="languageOptions"
                      placeholder="选择语言"
                      fluid
                    />
                  </MFormItem>
                  <MPageSection variant="actions">
                    <MSpace>
                      <MButton native-type="submit" severity="primary" :loading="submitting">
                        保存资料
                      </MButton>
                      <MButton severity="secondary" text native-type="button">
                        恢复默认
                      </MButton>
                    </MSpace>
                  </MPageSection>
                </MForm>
              </MPageSection>

              <MPageSection v-else-if="activeValue === 'notify'" variant="form" title="通知">
                <MForm @submit.prevent="saveNotify">
                  <MFormItem label="邮件摘要" name="emailDigest">
                    <MSwitch v-model="notify.emailDigest" />
                  </MFormItem>
                  <MFormItem label="产品动态" name="productUpdates">
                    <MSwitch v-model="notify.productUpdates" />
                  </MFormItem>
                  <MPageSection variant="actions">
                    <MButton native-type="submit" severity="primary" :loading="submitting">
                      保存通知
                    </MButton>
                  </MPageSection>
                </MForm>
              </MPageSection>

              <MPageSection v-else variant="form" title="安全">
                <p class="settings-hint">
                  修改密码、两步验证等敏感操作放在此区；危险动作使用 severity="danger" 并配合确认。
                </p>
                <MSpace>
                  <MButton severity="secondary">
                    修改密码
                  </MButton>
                  <MButton severity="danger" text>
                    注销账号
                  </MButton>
                </MSpace>
              </MPageSection>
            </template>
          </MTabs>
        </MPageContent>
      </MLayoutContent>
    </MLayout>
  </MConfigProvider>
</template>

<style scoped>
.settings-hint {
  margin: 0 0 var(--m-space-4);
  color: var(--m-color-text-muted);
  font-size: var(--m-font-size-sm);
}
</style>
