import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src')

const files = {
  'views/system/SystemConfigView.vue': `<script setup lang="ts">
import { ref } from 'vue'
import { WiButton, WiInput, WiLayoutContent, WiTable, useToast } from '@well-insight/ui'
import { systemParams, type SystemParam } from '@/mock'

type SystemParamRow = SystemParam & Record<string, unknown>

const toast = useToast()
const rows = ref<SystemParamRow[]>(systemParams.map((item) => ({ ...item })))

const columns = [
  { key: 'group', label: '\u5206\u7ec4', width: 96 },
  { key: 'key', label: '\u53c2\u6570\u952e' },
  { key: 'value', label: '\u53c2\u6570\u503c', width: 160 },
  { key: 'description', label: '\u8bf4\u660e' },
  { key: 'actions', label: '\u64cd\u4f5c', width: 96 },
]

function save(row: SystemParamRow) {
  toast.add({ severity: 'success', summary: '\u53c2\u6570\u5df2\u66f4\u65b0', detail: row.key, life: 2500 })
}
</script>

<template>
  <WiLayoutContent class="config-page">
    <h1>\u7cfb\u7edf\u914d\u7f6e</h1>
    <p class="config-page__desc">\u52a8\u6001\u53c2\u6570\u4fee\u6539\u540e\u5373\u65f6\u751f\u6548\uff0c\u65e0\u9700\u91cd\u542f\u670d\u52a1\uff08\u7eaf\u524d\u7aef\u6f14\u793a\uff09\u3002</p>
    <WiTable :columns="columns" :rows="rows" striped bordered :paginator="false">
      <template #cell-value="{ row }">
        <WiInput v-model="(row as SystemParamRow).value" size="small" />
      </template>
      <template #cell-actions="{ row }">
        <WiButton size="small" @click="save(row as SystemParamRow)">\u4fdd\u5b58</WiButton>
      </template>
    </WiTable>
  </WiLayoutContent>
</template>

<style scoped>
.config-page {
  padding: var(--wi-space-6);
  display: flex;
  flex-direction: column;
  gap: var(--wi-space-4);
}

.config-page h1 {
  margin: 0;
  font-size: var(--wi-font-size-lg);
  font-weight: 600;
}

.config-page__desc {
  margin: 0;
  color: var(--wi-color-text-muted);
}
</style>
`,
  'views/NotFoundView.vue': `<script setup lang="ts">
import { useRouter } from 'vue-router'
import { WiButton, WiLayoutContent } from '@well-insight/ui'

const router = useRouter()
</script>

<template>
  <WiLayoutContent class="not-found">
    <h1>404</h1>
    <p>\u9875\u9762\u4e0d\u5b58\u5728\u6216\u5df2\u88ab\u79fb\u9664\u3002</p>
    <WiButton @click="router.push('/dashboard')">\u8fd4\u56de\u9996\u9875</WiButton>
  </WiLayoutContent>
</template>

<style scoped>
.not-found {
  padding: var(--wi-space-12);
  text-align: center;
}

.not-found h1 {
  margin: 0 0 var(--wi-space-2);
  font-size: 3rem;
  color: var(--wi-color-text-muted);
}

.not-found p {
  margin: 0 0 var(--wi-space-4);
  color: var(--wi-color-text-muted);
}
</style>
`,
}

for (const [rel, content] of Object.entries(files)) {
  writeFileSync(join(root, rel), content, 'utf8')
  console.log('wrote', rel)
}

const patches = [
  {
    file: 'views/security/DataScopeView.vue',
    from: '<WiCard title="??? \uFFFD ??????">',
    to: '<WiCard title="\u6570\u636e\u8303\u56f4\u914d\u7f6e">',
  },
  {
    file: 'views/security/DataScopeView.vue',
    from: '<WiRadio value="all" label="\u6570\u636e\u8303\u56f4" />',
    to: '<WiRadio value="all" label="\u5168\u90e8\u6570\u636e" />',
  },
  {
    file: 'views/security/DataScopeView.vue',
    from: '<WiFormItem v-if="scope === \'department\'" label="\u6570\u636e\u8303\u56f4" name="department">',
    to: '<WiFormItem v-if="scope === \'department\'" label="\u6240\u5c5e\u9662\u7cfb" name="department">',
  },
  {
    file: 'views/security/DataScopeView.vue',
    from: '<WiButton severity="secondary">\u4fdd\u5b58\u914d\u7f6e</WiButton>',
    to: '<WiButton severity="secondary">\u91cd\u7f6e</WiButton>',
  },
  {
    file: 'views/academic/CoursesView.vue',
    from: '<WiButton size="small" severity="secondary">??</WiButton>',
    to: '<WiButton size="small" severity="secondary">\u7f16\u8f91</WiButton>',
  },
  {
    file: 'views/academic/StudentsView.vue',
    from: '        ??\n      </WiButton>',
    to: '        \u5bfc\u51fa CSV\n      </WiButton>',
  },
  {
    file: 'views/auth/RegisterView.vue',
    from: '<WiFormItem label="\u59d3\u540d" name="email"',
    to: '<WiFormItem label="\u90ae\u7bb1" name="email"',
  },
  {
    file: 'views/auth/RegisterView.vue',
    from: '<WiFormItem label="\u59d3\u540d" name="password"',
    to: '<WiFormItem label="\u5bc6\u7801" name="password"',
  },
  {
    file: 'views/academic/EnrollmentFormView.vue',
    from: '<WiFormItem label="\u5b66\u751f\u59d3\u540d" name="courseId"',
    to: '<WiFormItem label="\u7533\u8bf7\u8bfe\u7a0b" name="courseId"',
  },
  {
    file: 'views/academic/EnrollmentFormView.vue',
    from: '<WiFormItem label="\u5b66\u751f\u59d3\u540d" name="applyDate"',
    to: '<WiFormItem label="\u7533\u8bf7\u65e5\u671f" name="applyDate"',
  },
  {
    file: 'views/academic/EnrollmentFormView.vue',
    from: '<WiFormItem label="\u5b66\u751f\u59d3\u540d" name="reason"',
    to: '<WiFormItem label="\u7533\u8bf7\u7406\u7531" name="reason"',
  },
  {
    file: 'views/academic/EnrollmentFormView.vue',
    from: '<WiFormItem label="\u4e0a\u4f20\u6750\u6599" name="notify"',
    to: '<WiFormItem label="\u901a\u77e5\u5bb6\u957f" name="notify"',
  },
  {
    file: 'views/academic/EnrollmentFormView.vue',
    from: '@click="saveDraft">\u63d0\u4ea4\u7533\u8bf7</WiButton>',
    to: '@click="saveDraft">\u4fdd\u5b58\u8349\u7a3f</WiButton>',
  },
]

for (const { file, from, to } of patches) {
  const path = join(root, file)
  const content = readFileSync(path, 'utf8')
  if (!content.includes(from)) {
    console.warn('skip patch (pattern not found):', file)
    continue
  }
  writeFileSync(path, content.replace(from, to), 'utf8')
  console.log('patched', file)
}

function patchFormSubmit(file, fnName) {
  const path = join(root, file)
  let content = readFileSync(path, 'utf8')
  if (content.includes('onSubmitForm(payload') || content.includes('onLoginSubmit(payload')) return

  const insertBefore = `async function ${fnName}() {`
  const wrapper = `async function onSubmitForm(payload: { valid: boolean }) {
  if (!payload.valid) return
  await ${fnName}()
}

${insertBefore}`
  content = content.replace(insertBefore, wrapper)
  content = content.replace(`@submit.prevent="${fnName}"`, '@submit="onSubmitForm"')
  writeFileSync(path, content, 'utf8')
  console.log('form submit patched', file)
}

patchFormSubmit('views/auth/LoginView.vue', 'onLogin')
patchFormSubmit('views/auth/RegisterView.vue', 'onSubmit')
patchFormSubmit('views/academic/EnrollmentFormView.vue', 'onSubmit')

// LoginView also has MFA form
{
  const path = join(root, 'views/auth/LoginView.vue')
  let content = readFileSync(path, 'utf8')
  if (!content.includes('onVerifyMfaSubmit')) {
    content = content.replace(
      'async function onVerifyMfa() {',
      `async function onVerifyMfaSubmit(payload: { valid: boolean }) {
  if (!payload.valid) return
  await onVerifyMfa()
}

async function onVerifyMfa() {`,
    )
    content = content.replace('@submit.prevent="onVerifyMfa"', '@submit="onVerifyMfaSubmit"')
    writeFileSync(path, content, 'utf8')
    console.log('MFA form submit patched LoginView.vue')
  }
}
