import type { ComponentRecord, GuideRecord, Locale } from './catalog.js'
import {
  findComponent,
  findGuide,
  loadCatalog,
  normalizeName,
  resolveLocale,
  textResult,
  toKebab,
} from './catalog.js'
import { componentDecisions, findDecision, scoreDecision } from './decisions.js'
import { designRules, findPattern, pagePatterns, scorePattern } from './patterns.js'
import { countCatalogResourceTemplates, countCatalogResources } from './resources.js'

function inspectButtonIconOnlyUsage(code: string, issues: Array<{ type: string; message: string }>) {
  const pairedTagRe = /<WkButton\b([^>]*)>([\s\S]*?)<\/WkButton>/gi
  let match = pairedTagRe.exec(code)
  while (match !== null) {
    const attrs = match[1] || ''
    const inner = (match[2] || '').replace(/<!--[\s\S]*?-->/g, '').trim()
    const hasIconOnly = /\b(?:icon-only|iconOnly)\b/.test(attrs)
    const hasIconProp = /\b(?::icon|icon=)/.test(attrs)
    if (hasIconOnly && !hasIconProp) {
      issues.push({
        type: 'icon-only-missing-icon',
        message: 'WkButton with icon-only must set icon (or :icon). Default slot content is not rendered when iconOnly is true.',
      })
    }
    if (hasIconOnly && inner.length > 0) {
      issues.push({
        type: 'icon-only-default-slot',
        message: 'WkButton with icon-only ignores default slot content. Pass the icon via icon / :icon instead.',
      })
    }
    match = pairedTagRe.exec(code)
  }

  const selfClosingRe = /<WkButton\b([^>]*)\/>/gi
  match = selfClosingRe.exec(code)
  while (match !== null) {
    const attrs = match[1] || ''
    const hasIconOnly = /\b(?:icon-only|iconOnly)\b/.test(attrs)
    const hasIconProp = /\b(?::icon|icon=)/.test(attrs)
    if (hasIconOnly && !hasIconProp) {
      issues.push({
        type: 'icon-only-missing-icon',
        message: 'WkButton with icon-only must set icon (or :icon).',
      })
    }
    match = selfClosingRe.exec(code)
  }
}

function pickLocale<T extends { locales: Partial<Record<Locale, unknown>> }>(
  record: T,
  locale: Locale,
) {
  return record.locales[locale] || record.locales['zh-CN'] || record.locales['en-US'] || null
}

function vueName(name: string): string {
  return `Wk${name}`
}

function generatedPageCode(patternId: string, intent: string, locale: Locale): { script: string; template: string; style: string } {
  const zh = locale === 'zh-CN'
  const isList = patternId === 'admin-list'
  const isDashboard = patternId === 'dashboard'
  const isDetail = patternId === 'detail-page'
  const isEmpty = patternId === 'empty-state'
  const isWizard = patternId === 'wizard-form'
  const isSettings = patternId === 'settings-page'
  const isAuth = patternId === 'auth-page'
  const isForm = patternId === 'form-page' || isSettings
  const useLayoutShell = isList || isForm || isDashboard || isDetail || isSettings
  const title = intent || (zh ? '业务页面' : 'Business page')

  const layoutImports = useLayoutShell
    ? ', WkLayout, WkLayoutContent, WkLayoutHeader, WkLayoutSider, WkBreadcrumb'
    : ''
  const listImports = isList ? ', WkSelect, WkSpace, WkTable' : ''
  const formImports = isForm || isAuth || isWizard ? ', WkForm, WkFormItem, WkSelect' : ''
  const dashboardImports = isDashboard ? ', WkCard, WkGrid, WkGridItem, WkSkeleton, WkTable' : ''
  const detailImports = isDetail ? ', WkDivider' : ''
  const emptyImports = isEmpty ? ', WkDataView' : ''
  const wizardImports = isWizard ? ', WkStepper' : ''
  const settingsImports = isSettings ? ', WkTabs' : ''

  const script = `<script setup lang="ts">
import { ref } from 'vue'
import { WkButton, WkCard, WkConfigProvider, WkInput, WkTag, zhCN${layoutImports}${listImports}${formImports}${dashboardImports}${detailImports}${emptyImports}${wizardImports}${settingsImports} } from '@wise-kit/ui'

const loading = ref(false)
const error = ref('')
${isList ? `const keyword = ref('')
const rows = ref<Record<string, unknown>[]>([])
const columns = [{ key: 'name', label: '${zh ? '名称' : 'Name'}' }, { key: 'status', label: '${zh ? '状态' : 'Status'}' }]
` : ''}${isForm || isAuth || isWizard ? `const model = ref({ name: '' })
` : ''}${isDashboard ? `const metrics = ref([
  { label: '${zh ? '总用户' : 'Users'}', value: '0' },
  { label: '${zh ? '今日活跃' : 'Active today'}', value: '0' },
])
` : ''}${isWizard ? `const activeStep = ref(0)
` : ''}

async function submit() {
  loading.value = true
  error.value = ''
  try {
    // Replace with the page API request.
  } finally {
    loading.value = false
  }
}
</script>`

  const listContent = `          <section class="wk-generated-filters" aria-label="${zh ? '筛选' : 'Filters'}">
            <WkSpace wrap>
              <WkInput v-model="keyword" placeholder="${zh ? '搜索关键词' : 'Search keyword'}" clearable style="width: 14rem" />
              <WkButton severity="primary">${zh ? '查询' : 'Search'}</WkButton>
              <WkButton severity="secondary">${zh ? '重置' : 'Reset'}</WkButton>
            </WkSpace>
          </section>
          <header class="wk-generated-toolbar">
            <h1 class="wk-generated-title">${title}</h1>
            <WkButton severity="primary">${zh ? '新建' : 'Create'}</WkButton>
          </header>
          <WkTable :columns="columns" :rows="rows" :loading="loading" paginator :rows-per-page="10" striped bordered row-key="id">
            <template #empty>
              <p class="wk-generated-muted">${zh ? '暂无数据' : 'No data yet'}</p>
            </template>
          </WkTable>`

  const formContent = `          <header class="wk-generated-intro">
            <h1 class="wk-generated-title">${title}</h1>
            <p class="wk-generated-muted">${zh ? '填写表单并保存。' : 'Fill in the form and save.'}</p>
          </header>
          <WkForm class="wk-generated-form" @submit.prevent="submit">
            <WkFormItem label="${zh ? '名称' : 'Name'}" name="name" required>
              <WkInput v-model="model.name" fluid />
            </WkFormItem>
            <footer class="wk-generated-actions">
              <WkButton native-type="submit" severity="primary" :loading="loading">${zh ? '保存' : 'Save'}</WkButton>
              <WkButton severity="secondary">${zh ? '取消' : 'Cancel'}</WkButton>
            </footer>
          </WkForm>`

  const dashboardContent = `          <h1 class="wk-generated-title">${title}</h1>
          <WkGrid :cols="2" :x-gap="16" :y-gap="16" responsive="screen">
            <WkGridItem v-for="metric in metrics" :key="metric.label" :span="1">
              <WkCard>
                <p class="wk-generated-muted">{{ metric.label }}</p>
                <strong class="wk-generated-metric">{{ metric.value }}</strong>
              </WkCard>
            </WkGridItem>
          </WkGrid>
          <WkCard :title="${zh ? '趋势概览' : 'Trend overview'}">
            <WkSkeleton v-if="loading" height="8rem" />
            <p v-else class="wk-generated-muted">${zh ? '接入图表或业务组件。' : 'Connect charts or business widgets here.'}</p>
          </WkCard>`

  const detailContent = `          <header class="wk-generated-toolbar">
            <div>
              <h1 class="wk-generated-title">${title}</h1>
              <WkTag value="${zh ? '正常' : 'Active'}" severity="success" />
            </div>
            <WkButton severity="primary" outlined>${zh ? '编辑' : 'Edit'}</WkButton>
          </header>
          <WkCard>
            <WkDivider />
            <dl class="wk-generated-details">
              <div><dt>${zh ? '名称' : 'Name'}</dt><dd>${zh ? '示例资源' : 'Example resource'}</dd></div>
              <div><dt>${zh ? '更新时间' : 'Updated'}</dt><dd>—</dd></div>
            </dl>
          </WkCard>`

  const settingsContent = `          <h1 class="wk-generated-title">${title}</h1>
          <WkTabs :value="'general'" :items="[{ label: '${zh ? '常规' : 'General'}', value: 'general' }]" />
          <WkForm class="wk-generated-form" @submit.prevent="submit">
            <WkFormItem label="${zh ? '显示名称' : 'Display name'}" name="name">
              <WkInput v-model="model.name" fluid />
            </WkFormItem>
            <WkButton native-type="submit" severity="primary" :loading="loading">${zh ? '保存设置' : 'Save settings'}</WkButton>
          </WkForm>`

  let innerTemplate = ''
  if (isList) {
    innerTemplate = `<WkConfigProvider :locale="zhCN">
  <WkLayout has-sider class="wk-generated-page">
    <WkLayoutSider class="wk-generated-sider" />
    <WkLayout>
      <WkLayoutHeader class="wk-generated-header">
        <WkBreadcrumb :model="[{ label: '${zh ? '首页' : 'Home'}', to: '/' }, { label: '${title}' }]" />
      </WkLayoutHeader>
      <WkLayoutContent class="wk-generated-content">
${listContent}
      </WkLayoutContent>
    </WkLayout>
  </WkLayout>
</WkConfigProvider>`
  } else if (useLayoutShell) {
    const content = isDashboard ? dashboardContent : isDetail ? detailContent : isSettings ? settingsContent : formContent
    innerTemplate = `<WkConfigProvider :locale="zhCN">
  <WkLayout class="wk-generated-page">
    <WkLayoutHeader class="wk-generated-header">
      <WkBreadcrumb :model="[{ label: '${zh ? '首页' : 'Home'}', to: '/' }, { label: '${title}' }]" />
    </WkLayoutHeader>
    <WkLayoutContent class="wk-generated-content">
${content}
    </WkLayoutContent>
  </WkLayout>
</WkConfigProvider>`
  } else if (isAuth) {
    innerTemplate = `<WkConfigProvider :locale="zhCN">
  <main class="wk-generated-page wk-generated-auth">
    <WkCard>
      <WkForm label-position="top" @submit.prevent="submit">
        <WkFormItem label="${zh ? '邮箱' : 'Email'}" name="email">
          <WkInput type="email" fluid />
        </WkFormItem>
        <WkFormItem label="${zh ? '密码' : 'Password'}" name="password">
          <WkInput type="password" fluid />
        </WkFormItem>
        <WkButton native-type="submit" severity="primary" :loading="loading" fluid>${zh ? '登录' : 'Sign in'}</WkButton>
      </WkForm>
    </WkCard>
  </main>
</WkConfigProvider>`
  } else if (isEmpty) {
    innerTemplate = `<WkConfigProvider :locale="zhCN">
  <main class="wk-generated-page">
    <WkCard>
      <WkDataView :value="[]">
        <template #empty>
          <div class="wk-generated-empty">
            <strong>${zh ? '暂无内容' : 'Nothing here yet'}</strong>
            <p class="wk-generated-muted">${zh ? '创建第一条记录开始使用。' : 'Create your first record to get started.'}</p>
            <WkButton severity="primary" @click="submit">${zh ? '创建' : 'Create'}</WkButton>
          </div>
        </template>
      </WkDataView>
    </WkCard>
  </main>
</WkConfigProvider>`
  } else if (isWizard) {
    innerTemplate = `<WkConfigProvider :locale="zhCN">
  <main class="wk-generated-page">
    <WkCard>
      <WkStepper v-model="activeStep" :items="[${zh ? "'基本信息', '确认'" : "'Details', 'Confirm'"}]" />
      <WkForm label-position="top" @submit.prevent="submit">
        <WkFormItem label="${zh ? '名称' : 'Name'}" name="name"><WkInput v-model="model.name" fluid /></WkFormItem>
        <WkButton native-type="submit" severity="primary" :loading="loading">${zh ? '下一步' : 'Next'}</WkButton>
      </WkForm>
    </WkCard>
  </main>
</WkConfigProvider>`
  } else {
    innerTemplate = `<WkConfigProvider :locale="zhCN">
  <main class="wk-generated-page">
    <WkCard>
      <p class="wk-generated-muted">${zh ? '将此区域替换为页面内容。' : 'Replace this area with page content.'}</p>
      <WkTag value="${zh ? '示例' : 'Example'}" severity="info" />
    </WkCard>
  </main>
</WkConfigProvider>`
  }

  const template = `<template>
  ${innerTemplate}
  <p v-if="error" role="alert" class="wk-generated-error">${'{{ error }}'}</p>
</template>`

  const style = `<style scoped>
.wk-generated-page { min-height: 100vh; background: var(--wk-color-surface); }
.wk-generated-sider { border-right: 1px solid var(--wk-color-border); }
.wk-generated-header { padding: var(--wk-space-4) var(--wk-space-6); border-bottom: 1px solid var(--wk-color-border); }
.wk-generated-content { padding: var(--wk-space-6); display: flex; flex-direction: column; gap: var(--wk-space-4); }
.wk-generated-filters { padding: var(--wk-space-4); background: color-mix(in srgb, var(--wk-color-border) 25%, transparent); border-radius: var(--wk-radius-md); border: 1px solid var(--wk-color-border); }
.wk-generated-toolbar, .wk-generated-actions { display: flex; gap: var(--wk-space-3); align-items: center; justify-content: space-between; flex-wrap: wrap; }
.wk-generated-title { margin: 0; font-size: var(--wk-font-size-lg); font-weight: 600; color: var(--wk-color-text); }
.wk-generated-intro { margin-bottom: var(--wk-space-2); }
.wk-generated-form { padding: var(--wk-space-6); border: 1px solid var(--wk-color-border); border-radius: var(--wk-radius-md); box-shadow: var(--wk-shadow-sm); }
.wk-generated-auth { display: grid; place-items: center; padding: var(--wk-space-8); max-width: 24rem; margin: 0 auto; }
.wk-generated-metric { display: block; font-size: var(--wk-font-size-lg); margin: var(--wk-space-2) 0; }
.wk-generated-details { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--wk-space-4); margin: 0; }
.wk-generated-details dt { color: var(--wk-color-text-muted); font-size: var(--wk-font-size-sm); }
.wk-generated-details dd { margin: var(--wk-space-1) 0 0; }
.wk-generated-empty { display: grid; gap: var(--wk-space-2); justify-items: center; padding: var(--wk-space-8); text-align: center; }
.wk-generated-muted { margin: 0; color: var(--wk-color-text-muted); }
.wk-generated-error { color: var(--wk-color-danger); padding: 0 var(--wk-space-6); }
@media (max-width: 48rem) { .wk-generated-content { padding: var(--wk-space-4); } .wk-generated-details { grid-template-columns: 1fr; } }
</style>`
  return { script, template, style }
}

function scoreMatch(haystack: string, query: string): number {
  const text = haystack.toLowerCase()
  const q = query.toLowerCase()
  if (!q) return 0
  if (text === q) return 100
  if (text.startsWith(q)) return 80
  if (text.includes(q)) return 50
  const parts = q.split(/\s+/).filter(Boolean)
  let score = 0
  for (const part of parts) {
    if (text.includes(part)) score += 20
  }
  return score
}

function componentSearchBlob(component: ComponentRecord): string {
  return [
    component.id,
    component.name,
    component.exportName,
    component.category,
    component.description,
    component.descriptionEn,
    ...component.props.map((item) => `${item.name} ${item.description}`),
    ...component.examples.map((item) => `${item.section} ${item.code}`),
  ].join('\n')
}

function pagination(total: number, offset: number, limit: number) {
  const nextOffset = offset + limit
  return {
    total,
    count: Math.max(Math.min(limit, total - offset), 0),
    offset,
    limit,
    has_more: nextOffset < total,
    ...(nextOffset < total ? { next_offset: nextOffset } : {}),
  }
}

function apiCoverage(component: ComponentRecord, examples: ComponentRecord['examples']) {
  const source = examples.map((example) => example.code).join('\n')
  const has = (name: string) => {
    const kebab = toKebab(name)
    return new RegExp(`(?:^|[\\s:@])(?:${name}|${kebab})(?:[\\s=/>]|$)`, 'i').test(source) ||
      (name === 'modelValue' && /v-model(?:[:=]|\\s)/i.test(source))
  }
  const eventHas = (name: string) => source.includes(`@${name}`) || source.includes(`@${toKebab(name)}`)
  const slotHas = (name: string) => source.includes(`#${name}`) ||
    (name === 'default' && source.includes('<Wk') && source.includes('</Wk>'))
  const summary = (items: string[], predicate: (item: string) => boolean) => ({
    total: items.length,
    covered: items.filter(predicate).length,
    missing: items.filter((item) => !predicate(item)),
  })
  return {
    props: summary(component.props.map((item) => item.name), has),
    events: summary(component.events.map((item) => item.name), eventHas),
    slots: summary(component.slots.map((item) => item.name), slotHas),
    methods: summary((component.methods || []).map((item) => item.name), (name) =>
      new RegExp(`(?:\\.|ref\\?\\.)${name}\\s*\\(`).test(source) || source.includes(`\`${name}\``),
    ),
  }
}

function guideSearchBlob(guide: GuideRecord): string {
  return [
    guide.id,
    guide.title,
    guide.titleEn,
    guide.description,
    guide.descriptionEn,
    guide.locales['zh-CN']?.markdown || '',
    guide.locales['en-US']?.markdown || '',
  ].join('\n')
}

export function createToolHandlers(catalog = loadCatalog()) {
  function list(args: {
    kind?: 'components' | 'guides' | 'examples' | 'categories' | 'patterns'
    mode?: string
    limit?: number
    offset?: number
  }) {
    const kind = args.kind || 'components'
    const limit = Math.min(Math.max(args.limit ?? 50, 1), 200)
    const offset = Math.max(args.offset ?? 0, 0)
    const locale = resolveLocale(args.mode)

    if (kind === 'guides') {
      const items = catalog.guides.slice(offset, offset + limit).map((guide) => {
        const local = pickLocale(guide, locale) as GuideRecord['locales'][Locale]
        return {
          id: guide.id,
          title: local?.title || guide.title,
          description: local?.description || guide.description,
          order: guide.order,
        }
      })
      return textResult({ kind, ...pagination(catalog.guides.length, offset, limit), items })
    }

    if (kind === 'patterns') return listPatterns(args)

    if (kind === 'categories') {
      const counts = new Map<string, number>()
      for (const component of catalog.components) {
        const key = component.category || 'Uncategorized'
        counts.set(key, (counts.get(key) || 0) + 1)
      }
      const allItems = [...counts.entries()]
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => a.category.localeCompare(b.category))
      const items = allItems.slice(offset, offset + limit)
      return textResult({ kind, ...pagination(allItems.length, offset, limit), items })
    }

    if (kind === 'examples') {
      const flat = catalog.components.flatMap((component) =>
        component.examples
          .filter((example) => !args.mode || example.locale === locale)
          .map((example) => ({
            component: component.id,
            exportName: component.exportName,
            ...example,
          })),
      )
      return textResult({
        kind,
        ...pagination(flat.length, offset, limit),
        items: flat.slice(offset, offset + limit),
      })
    }

    const items = catalog.components.slice(offset, offset + limit).map((component) => ({
      id: component.id,
      exportName: component.exportName,
      category: component.category,
      description:
        locale === 'en-US'
          ? component.descriptionEn || component.description
          : component.description || component.descriptionEn,
    }))
    return textResult({ kind: 'components', ...pagination(catalog.components.length, offset, limit), items })
  }

  function search(args: {
    query: string
    scope?: 'all' | 'components' | 'guides' | 'api' | 'examples' | 'patterns' | 'decisions'
    mode?: string
    limit?: number
    offset?: number
  }) {
    const query = args.query.trim()
    const scope = args.scope || 'all'
    const limit = Math.min(Math.max(args.limit ?? 10, 1), 50)
    const offset = Math.max(args.offset ?? 0, 0)
    const locale = resolveLocale(args.mode)
    const hits: Array<{ type: string; id: string; title: string; score: number; snippet?: string }> =
      []

    if (scope === 'all' || scope === 'components' || scope === 'api' || scope === 'examples') {
      for (const component of catalog.components) {
        let score = scoreMatch(componentSearchBlob(component), query)
        if (scope === 'api') {
          score = Math.max(
            ...component.props.map((prop) =>
              scoreMatch(`${prop.name} ${prop.type} ${prop.description}`, query),
            ),
            0,
          )
        }
        if (scope === 'examples') {
          score = Math.max(
            ...component.examples.map((example) =>
              scoreMatch(`${example.section} ${example.code}`, query),
            ),
            0,
          )
        }
        if (score > 0) {
          hits.push({
            type: 'component',
            id: component.id,
            title: component.exportName,
            score,
            snippet:
              locale === 'en-US'
                ? component.descriptionEn || component.description
                : component.description,
          })
        }
      }
    }

    if (scope === 'all' || scope === 'patterns') {
      for (const pattern of pagePatterns) {
        const score = scorePattern(pattern, query)
        if (score > 0) {
          const title = locale === 'en-US' ? pattern.titleEn : pattern.title
          hits.push({
            type: 'pattern',
            id: pattern.id,
            title,
            score,
            snippet: locale === 'en-US' ? pattern.descriptionEn : pattern.description,
          })
        }
      }
    }

    if (scope === 'all' || scope === 'decisions') {
      for (const decision of componentDecisions) {
        const score = scoreDecision(decision, query)
        if (score > 0) {
          hits.push({
            type: 'decision',
            id: decision.id,
            title: locale === 'en-US' ? decision.titleEn : decision.title,
            score,
            snippet: locale === 'en-US' ? decision.questionEn : decision.question,
          })
        }
      }
    }

    if (scope === 'all' || scope === 'guides') {
      for (const guide of catalog.guides) {
        const score = scoreMatch(guideSearchBlob(guide), query)
        if (score > 0) {
          const local = pickLocale(guide, locale) as GuideRecord['locales'][Locale]
          hits.push({
            type: 'guide',
            id: guide.id,
            title: local?.title || guide.title,
            score,
            snippet: local?.description || guide.description,
          })
        }
      }
    }

    hits.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    return textResult({
      query,
      scope,
      ...pagination(hits.length, offset, limit),
      items: hits.slice(offset, offset + limit),
    })
  }

  function getComponent(args: {
    component?: string
    components?: string[]
    mode?: string
    detail?: 'compact' | 'full'
    includeApi?: boolean
    includeExamples?: boolean
    examplesLimit?: number
    examplesOffset?: number
    sections?: string[]
  }) {
    const names = [
      ...(args.component ? [args.component] : []),
      ...((args.components || []).filter(Boolean) as string[]),
    ].slice(0, 10)

    if (names.length === 0) {
      return textResult({ error: 'Provide component or components.' })
    }

    const locale = resolveLocale(args.mode)
    const detail = args.detail || 'compact'
    const includeApi = args.includeApi ?? detail === 'full'
    const includeExamples = args.includeExamples ?? detail === 'full'

    const items = names.map((name) => {
      const component = findComponent(catalog, name)
      if (!component) return { query: name, error: `Component not found: ${name}` }
      const local = pickLocale(component, locale) as ComponentRecord['locales'][Locale]
      const selectedSections = (args.sections || [])
        .map((section) => normalizeName(section))
        .filter(Boolean)

      const sections =
        local?.sections?.filter((section) => {
          if (selectedSections.length === 0) return detail === 'full'
          return selectedSections.includes(normalizeName(section.id)) ||
            selectedSections.includes(normalizeName(section.title))
        }) || []

      const localeExamples = component.examples.filter((example) => example.locale === locale)
      const examplesLimit = Math.min(Math.max(args.examplesLimit ?? 8, 1), 100)
      const examplesOffset = Math.max(args.examplesOffset ?? 0, 0)
      const examplePage = localeExamples.slice(examplesOffset, examplesOffset + examplesLimit)

      return {
        id: component.id,
        exportName: component.exportName,
        category: component.category,
        description: local?.description || component.description,
        import: component.import,
        ...(includeApi
          ? {
              props: component.props,
              events: component.events,
              slots: component.slots,
              methods: component.methods || [],
              apiCoverage: apiCoverage(component, localeExamples),
            }
          : {}),
        ...(includeExamples
          ? {
              examples: examplePage,
              exampleCount: localeExamples.length,
              examplesOffset,
              examplesLimit,
              hasMoreExamples: examplesOffset + examplesLimit < localeExamples.length,
              ...(examplesOffset + examplesLimit < localeExamples.length
                ? { nextExamplesOffset: examplesOffset + examplesLimit }
                : {}),
            }
          : {
              exampleCount: localeExamples.length,
              examplesOffset: 0,
              examplesLimit,
              hasMoreExamples: localeExamples.length > 0,
            }),
        sections:
          detail === 'full' || selectedSections.length
            ? sections.map((section) => ({
                id: section.id,
                title: section.title,
                body: section.body,
              }))
            : (local?.sections || []).map((section) => section.title).filter(Boolean),
        ...(detail === 'full' ? { markdown: local?.markdown } : {}),
      }
    })

    return textResult(names.length === 1 ? items[0] : { items })
  }

  function getExample(args: {
    component: string
    mode?: string
    section?: string
    variant?: string
  }) {
    const component = findComponent(catalog, args.component)
    if (!component) return textResult({ error: `Component not found: ${args.component}` })
    const locale = resolveLocale(args.mode)
    let examples = component.examples.filter((example) => example.locale === locale)
    if (examples.length === 0) examples = component.examples

    if (args.section) {
      const key = normalizeName(args.section)
      examples = examples.filter(
        (example) =>
          normalizeName(example.section) === key || normalizeName(example.sectionId) === key,
      )
    }
    if (args.variant) {
      const key = normalizeName(args.variant)
      examples = examples.filter(
        (example) =>
          normalizeName(example.id) === key || normalizeName(example.section).includes(key),
      )
    }

    if (examples.length === 0) {
      return textResult({
        error: `No example found for ${component.exportName}`,
        availableSections: [...new Set(component.examples.map((item) => item.section))],
      })
    }

    const example = examples[0]
    return textResult({
      component: component.id,
      exportName: component.exportName,
      import: component.import,
      example,
    })
  }

  function getGuide(args: {
    guide: string
    mode?: string
    section?: string
    detail?: 'compact' | 'full'
  }) {
    const guide = findGuide(catalog, args.guide)
    if (!guide) return textResult({ error: `Guide not found: ${args.guide}` })
    const locale = resolveLocale(args.mode)
    const local = pickLocale(guide, locale) as GuideRecord['locales'][Locale]
    const detail = args.detail || 'compact'

    if (args.section && local?.sections) {
      const key = normalizeName(args.section)
      const section = local.sections.find(
        (item) => normalizeName(item.id) === key || normalizeName(item.title) === key,
      )
      if (!section) {
        return textResult({
          error: `Section not found: ${args.section}`,
          availableSections: local.sections.map((item) => item.title).filter(Boolean),
        })
      }
      return textResult({
        id: guide.id,
        title: local.title,
        section,
      })
    }

    return textResult({
      id: guide.id,
      title: local?.title || guide.title,
      description: local?.description || guide.description,
      sections: (local?.sections || []).map((section) => section.title).filter(Boolean),
      ...(detail === 'full' ? { markdown: local?.markdown, bodySections: local?.sections } : {}),
    })
  }

  function listPatterns(args: { mode?: string; limit?: number; offset?: number }) {
    const locale = resolveLocale(args.mode)
    const limit = Math.min(Math.max(args.limit ?? 50, 1), 200)
    const offset = Math.max(args.offset ?? 0, 0)
    const items = pagePatterns.slice(offset, offset + limit).map((pattern) => ({
      id: pattern.id,
      title: locale === 'en-US' ? pattern.titleEn : pattern.title,
      description: locale === 'en-US' ? pattern.descriptionEn : pattern.description,
      keywords: pattern.keywords,
      components: pattern.components.map((item) => item.component),
    }))
    return textResult({ kind: 'patterns', ...pagination(pagePatterns.length, offset, limit), items })
  }

  function getPattern(args: { pattern: string; mode?: string }) {
    const pattern = findPattern(args.pattern)
    if (!pattern) {
      return textResult({
        error: `Pattern not found: ${args.pattern}`,
        availablePatterns: pagePatterns.map((item) => item.id),
      })
    }
    const locale = resolveLocale(args.mode)
    return textResult({
      id: pattern.id,
      title: locale === 'en-US' ? pattern.titleEn : pattern.title,
      description: locale === 'en-US' ? pattern.descriptionEn : pattern.description,
      keywords: pattern.keywords,
      components: pattern.components,
      structure: pattern.structure,
      layout: pattern.layout,
      styleRules: pattern.styleRules,
      interactionRules: pattern.interactionRules,
      avoid: pattern.avoid,
    })
  }

  function recommendPage(args: {
    intent: string
    pageType?: string
    features?: string[]
    mode?: string
    includeScaffold?: boolean
  }) {
    const query = [args.intent, args.pageType || '', ...(args.features || [])].join(' ')
    const ranked = pagePatterns
      .map((pattern) => ({ pattern, score: scorePattern(pattern, query) }))
      .sort((a, b) => b.score - a.score || a.pattern.id.localeCompare(b.pattern.id))
    const best = ranked[0]
    if (!best || best.score === 0) {
      return textResult({
        error: 'No page pattern matched the request.',
        suggestions: pagePatterns.map((pattern) => ({ id: pattern.id, title: pattern.title })),
      })
    }
    const locale = resolveLocale(args.mode)
    const result: Record<string, unknown> = {
      intent: args.intent,
      pageType: args.pageType,
      matchedPattern: best.pattern.id,
      title: locale === 'en-US' ? best.pattern.titleEn : best.pattern.title,
      confidence: best.score,
      goldenPage: best.pattern.goldenPage,
      components: best.pattern.components,
      structure: best.pattern.structure,
      layout: best.pattern.layout,
      styleRules: best.pattern.styleRules,
      interactionRules: best.pattern.interactionRules,
      avoid: best.pattern.avoid,
      alternatives: ranked.slice(1, 3).filter((item) => item.score > 0).map((item) => ({ id: item.pattern.id, score: item.score })),
      nextStep: locale === 'en-US'
        ? `Read goldenPage (${best.pattern.goldenPage || 'none'}) and matchedPattern with get_pattern, then verify component APIs with get_component or get_example. Pass includeScaffold: true for a starter Vue file aligned with WkLayout shell.`
        : `先阅读 goldenPage（${best.pattern.goldenPage || '无'}）并用 get_pattern 读取 matchedPattern，再用 get_component 或 get_example 核对组件 API。需要 starter 代码时传 includeScaffold: true（已对齐 WkLayout 骨架）。`,
    }
    if (args.includeScaffold) {
      const code = generatedPageCode(best.pattern.id, args.intent, locale)
      const componentSource = `${code.script}\n\n${code.template}\n\n${code.style}`
      result.scaffold = {
        vue: code,
        files: { component: componentSource },
        warnings: [
          locale === 'en-US'
            ? 'Scaffold only: replace sample API state, data, and events with the application implementation.'
            : '仅为脚手架：请将示例 API 状态、数据和事件替换为实际业务实现。',
        ],
      }
    }
    return textResult(result)
  }

  function getDesignRules(args: { mode?: string } = {}) {
    const locale = resolveLocale(args.mode)
    if (locale === 'zh-CN') return textResult(designRules)
    return textResult({
      tokens: {
        colors: ['--wk-color-primary', '--wk-color-surface', '--wk-color-text', '--wk-color-border'],
        spacing: '--wk-space-*',
        radius: '--wk-radius-sm/md/lg',
        typography: '--wk-font-size-xs/sm/md/lg',
        motion: '--wk-motion-fast/normal',
      },
      actions: {
        primary: { component: 'WkButton', props: ['omit severity or use primary'] },
        secondary: { component: 'WkButton', props: ['severity="secondary"', 'outlined or text'] },
        destructive: { component: 'WkButton', props: ['severity="danger"'], requiresConfirmation: true },
        cancel: { component: 'WkButton', props: ['severity="secondary"', 'text'] },
      },
      status: { component: 'WkTag', mapping: { active: 'success', pending: 'warn', disabled: 'secondary', error: 'danger' } },
      feedback: {
        default: 'message',
        message: { when: ['single-line action result', 'save/delete/create confirmations'] },
        toast: { when: ['summary + detail', 'async or background notifications'] },
        inlineMessage: { component: 'WkMessage', when: ['persistent form/auth errors'] },
        doc: 'docs/feedback-message-vs-toast.md',
      },
      global: [
        'Prefer library components and --wk-* tokens; do not maintain a second color system.',
        'Default action feedback to message; do not use toast with summary-only text.',
        'Icon-only buttons must provide aria-label or ariaLabel.',
        'Form controls must have a visible label or an equivalent accessible name.',
        'Overlays teleport to body by default; only change appendTo for a clear layout constraint.',
        'Prefer documented component variants over deep CSS overrides.',
      ],
    })
  }

  function recommendComponent(args: {
    query?: string
    decision?: string
    mode?: string
    limit?: number
    offset?: number
  }) {
    const locale = resolveLocale(args.mode)

    if (!args.query && !args.decision) {
      const limit = Math.min(Math.max(args.limit ?? 50, 1), 200)
      const offset = Math.max(args.offset ?? 0, 0)
      const items = componentDecisions.slice(offset, offset + limit).map((decision) => ({
        id: decision.id,
        title: locale === 'en-US' ? decision.titleEn : decision.title,
        question: locale === 'en-US' ? decision.questionEn : decision.question,
        keywords: decision.keywords,
        options: decision.options.map((option) => option.component),
      }))
      return textResult({ kind: 'decisions', ...pagination(componentDecisions.length, offset, limit), items })
    }

    if (args.decision && !args.query) {
      const decision = findDecision(args.decision)
      if (!decision) {
        return textResult({
          error: `Decision not found: ${args.decision}`,
          availableDecisions: componentDecisions.map((item) => item.id),
        })
      }
      return textResult({
        id: decision.id,
        title: locale === 'en-US' ? decision.titleEn : decision.title,
        question: locale === 'en-US' ? decision.questionEn : decision.question,
        keywords: decision.keywords,
        options: decision.options.map((option) => ({
          component: option.component,
          when: locale === 'en-US' ? option.whenEn : option.when,
          avoidWhen: locale === 'en-US' ? option.avoidWhenEn : option.avoidWhen,
        })),
      })
    }

    if (!args.query) {
      return textResult({
        error: 'Provide query for a recommendation, or omit query/decision to list decision guides.',
      })
    }

    const ranked = componentDecisions
      .map((decision) => ({ decision, score: scoreDecision(decision, args.query!) }))
      .sort((a, b) => b.score - a.score || a.decision.id.localeCompare(b.decision.id))
    const matched = args.decision ? findDecision(args.decision) : ranked[0]?.decision
    if (!matched || (!args.decision && (ranked[0]?.score || 0) === 0)) {
      return textResult({ error: `No component decision matched: ${args.query}`, suggestions: componentDecisions.map((item) => item.id) })
    }
    return textResult({
      query: args.query,
      decision: matched.id,
      title: locale === 'en-US' ? matched.titleEn : matched.title,
      question: locale === 'en-US' ? matched.questionEn : matched.question,
      recommendations: matched.options.map((option) => ({
        component: option.component,
        when: locale === 'en-US' ? option.whenEn : option.when,
        avoidWhen: locale === 'en-US' ? option.avoidWhenEn : option.avoidWhen,
      })),
      nextStep: locale === 'en-US'
        ? 'Use get_component and get_example for the selected component before implementing.'
        : '实现前请用 get_component 和 get_example 核对所选组件 API。',
    })
  }

  function getSetup(args: { environment?: string; mode?: string }) {
    const locale = resolveLocale(args.mode)
    const quickStart = findGuide(catalog, 'quick-start')
    const config = findGuide(catalog, 'config')
    const theme = findGuide(catalog, 'theme')
    const intro = findGuide(catalog, 'introduction')

    const pickMarkdown = (guide?: GuideRecord) => {
      if (!guide) return null
      const local = pickLocale(guide, locale) as GuideRecord['locales'][Locale]
      return {
        id: guide.id,
        title: local?.title || guide.title,
        markdown: local?.markdown || '',
      }
    }

    return textResult({
      library: catalog.library,
      environment: args.environment || 'vue3-vite',
      install: 'pnpm add @wise-kit/ui',
      peer: 'vue@^3.3.0',
      styles: "import '@wise-kit/ui/styles.css'",
      guides: {
        introduction: pickMarkdown(intro),
        quickStart: pickMarkdown(quickStart),
        config: pickMarkdown(config),
        theme: pickMarkdown(theme),
      },
    })
  }

  function validateUsage(args: {
    component?: string
    code?: string
    mode?: string
    usages?: Array<{ component?: string; code?: string }>
  }) {
    const usages =
      args.usages && args.usages.length > 0
        ? args.usages
        : [{ component: args.component, code: args.code }]

    const reports = usages.slice(0, 10).map((usage) => {
      const code = usage.code || ''
      const componentTagMatch = code.match(/<(Wk)([A-Z][A-Za-z0-9]*)\b/)
      const componentImportMatch = code.match(/import\s*\{[^}]*\b(Wk)([A-Z][A-Za-z0-9]*)\b/)
      const componentName =
        usage.component ||
        (componentTagMatch ? `${componentTagMatch[1]}${componentTagMatch[2]}` : undefined) ||
        (componentImportMatch ? `${componentImportMatch[1]}${componentImportMatch[2]}` : undefined)

      if (!componentName) {
        return { error: 'Could not determine component. Pass component explicitly.' }
      }

      const component = findComponent(catalog, componentName)
      if (!component) return { component: componentName, error: `Component not found: ${componentName}` }

      const knownProps = new Set(
        component.props.flatMap((prop) => [prop.name, toKebab(prop.name)].filter(Boolean)),
      )
      const knownEvents = new Set(
        component.events.flatMap((event) => {
          const name = event.name.replace(/^on/, '')
          return [event.name, name, toKebab(name), `on${name[0]?.toUpperCase()}${name.slice(1)}`]
        }),
      )

      const issues: Array<{ type: string; message: string }> = []

      if (code && !code.includes('@wise-kit/ui') && /import\s+/.test(code)) {
        if (!/from\s+['"]@wise-kit\/ui['"]/.test(code)) {
          issues.push({
            type: 'import',
            message: `Import should come from '@wise-kit/ui' (expected ${component.exportName}).`,
          })
        }
      }

      const attrRe = /<Wk[A-Z][A-Za-z0-9]*\b([^>]*)>/g
      let tagMatch = attrRe.exec(code)
      while (tagMatch !== null) {
        const attrs = tagMatch[1] || ''
        const attrNames = [
          ...attrs.matchAll(/(?:^|\s)(?:v-bind:|:)([A-Za-z_][\w-]*)/g),
          ...attrs.matchAll(/(?:^|\s)([A-Z_][\w-]*)\s*=/gi),
          ...attrs.matchAll(/(?:^|\s)(v-model(?:\.[\w-]+)?)/g),
        ].map((match) => match[1])

        for (const attr of attrNames) {
          if (!attr || attr.startsWith('v-') || attr === 'class' || attr === 'style' || attr === 'key') {
            continue
          }
          if (attr.startsWith('on') || attr.startsWith('@')) continue
          if (!knownProps.has(attr) && !knownProps.has(toKebab(attr))) {
            // event listeners written as @click already skipped; allow aria-* and data-*
            if (attr.startsWith('aria-') || attr.startsWith('data-')) continue
            if (knownProps.size > 0) {
              issues.push({
                type: 'unknown-prop',
                message: `Unknown prop '${attr}' on ${component.exportName}.`,
              })
            }
          }
        }

        const eventNames = [...attrs.matchAll(/(?:^|\s)@([A-Z_][\w-]*)/gi)].map((match) => match[1])
        for (const eventName of eventNames) {
          if (knownEvents.size === 0) continue
          if (
            !knownEvents.has(eventName) &&
            !knownEvents.has(toKebab(eventName)) &&
            eventName !== 'click'
          ) {
            // soft warning only when events are documented and clearly unknown
            if (![...knownEvents].some((item) => normalizeName(item) === normalizeName(eventName))) {
              issues.push({
                type: 'unknown-event',
                message: `Event '@${eventName}' is not listed in ${component.exportName} docs.`,
              })
            }
          }
        }
        tagMatch = attrRe.exec(code)
      }

      if (component.id === 'Button' && code) {
        inspectButtonIconOnlyUsage(code, issues)
      }

      return {
        component: component.id,
        exportName: component.exportName,
        ok: issues.length === 0,
        issues,
        knownProps: component.props.map((item) => item.name),
        knownEvents: component.events.map((item) => item.name),
      }
    })

    return textResult(reports.length === 1 ? reports[0] : { reports })
  }

  function version() {
    const patternReferences = pagePatterns.flatMap((pattern) =>
      pattern.components
        .filter((item) => !findComponent(catalog, item.component))
        .map((item) => ({ pattern: pattern.id, component: item.component })),
    )
    return textResult({
      mcp: catalog.mcp,
      library: catalog.library,
      generatedAt: catalog.generatedAt,
      counts: {
        components: catalog.components.length,
        guides: catalog.guides.length,
        examples: catalog.components.reduce((sum, item) => sum + item.examples.length, 0),
        patterns: pagePatterns.length,
        decisions: componentDecisions.length,
        resources: countCatalogResources(catalog),
        resourceTemplates: countCatalogResourceTemplates(),
      },
      health: {
        ok: patternReferences.length === 0,
        patternReferences,
        catalogGeneratedAt: catalog.generatedAt,
        message: patternReferences.length === 0
          ? 'Catalog and pattern references are consistent.'
          : 'Some patterns reference components missing from the catalog.',
      },
      tools: [
        'list',
        'search',
        'get_component',
        'get_example',
        'get_guide',
        'get_setup',
        'validate_usage',
        'list_patterns',
        'get_pattern',
        'recommend_page',
        'get_design_rules',
        'recommend_component',
        'version',
      ],
    })
  }

  return {
    catalog,
    list,
    search,
    getComponent,
    getExample,
    getGuide,
    getSetup,
    validateUsage,
    listPatterns,
    getPattern,
    recommendPage,
    getDesignRules,
    recommendComponent,
    version,
  }
}
