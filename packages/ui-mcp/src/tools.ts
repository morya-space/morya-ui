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
import { listGoldenPages, readGoldenPageSource } from './golden-pages.js'
import { filterPageSnippets, findPageSnippet, pageSnippets, scorePageSnippet } from './page-snippets.js'
import { designRules, findPattern, pagePatterns, scorePattern } from './patterns.js'
import { countCatalogResources, countCatalogResourceTemplates } from './resources.js'

function inspectButtonIconOnlyUsage(code: string, issues: Array<{ type: string; message: string }>) {
  const pairedTagRe = /<MButton\b([^>]*)>([\s\S]*?)<\/MButton>/gi
  let match = pairedTagRe.exec(code)
  while (match !== null) {
    const attrs = match[1] || ''
    const inner = (match[2] || '').replace(/<!--[\s\S]*?-->/g, '').trim()
    const hasIconOnly = /\b(?:icon-only|iconOnly)\b/.test(attrs)
    const hasIconProp = /\b(?::icon|icon=)/.test(attrs)
    if (hasIconOnly && !hasIconProp) {
      issues.push({
        type: 'icon-only-missing-icon',
        message: 'MButton with icon-only must set icon (or :icon). Default slot content is not rendered when iconOnly is true.',
      })
    }
    if (hasIconOnly && inner.length > 0) {
      issues.push({
        type: 'icon-only-default-slot',
        message: 'MButton with icon-only ignores default slot content. Pass the icon via icon / :icon instead.',
      })
    }
    match = pairedTagRe.exec(code)
  }

  const selfClosingRe = /<MButton\b([^>]*)\/>/gi
  match = selfClosingRe.exec(code)
  while (match !== null) {
    const attrs = match[1] || ''
    const hasIconOnly = /\b(?:icon-only|iconOnly)\b/.test(attrs)
    const hasIconProp = /\b(?::icon|icon=)/.test(attrs)
    if (hasIconOnly && !hasIconProp) {
      issues.push({
        type: 'icon-only-missing-icon',
        message: 'MButton with icon-only must set icon (or :icon).',
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
  return `M${name}`
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
    ? ', MLayout, MLayoutContent, MLayoutHeader, MLayoutSider, MBreadcrumb'
    : ''
  const pageImports = useLayoutShell
    ? ', MPageContent, MPageFilters, MPageHeader, MPageSection, MPageToolbar'
    : ''
  const listImports = isList ? ', MEmpty, MSelect, MSpace, MTable' : ''
  const formImports = isForm || isAuth || isWizard ? ', MForm, MFormItem, MSelect' : ''
  const dashboardImports = isDashboard ? ', MCard, MGrid, MGridItem, MPagePlaceholder, MPageStat, MSkeleton, MTable' : ''
  const detailImports = isDetail ? ', MDivider' : ''
  const emptyImports = isEmpty ? ', MEmpty, MPageToolbar' : ''
  const wizardImports = isWizard ? ', MStepper' : ''
  const settingsImports = isSettings ? ', MTabs' : ''
  const statusImports = isList || isDetail || isDashboard ? ', MStatus' : ''

  const script = `<script setup lang="ts">
import { ref } from 'vue'
import { MButton, MCard, MConfigProvider, MInput, MTag, zhCN${layoutImports}${pageImports}${listImports}${formImports}${dashboardImports}${detailImports}${emptyImports}${wizardImports}${settingsImports}${statusImports} } from 'morya-ui'

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

  const listContent = `            <MPageFilters :aria-label="${zh ? '筛选' : 'Filters'}">
              <MSpace wrap>
                <MInput v-model="keyword" placeholder="${zh ? '搜索关键词' : 'Search keyword'}" clearable style="width: 14rem" />
                <MButton severity="primary">${zh ? '查询' : 'Search'}</MButton>
                <MButton severity="secondary">${zh ? '重置' : 'Reset'}</MButton>
              </MSpace>
            </MPageFilters>
            <MPageToolbar :title="title">
              <template #actions>
                <MButton severity="primary">${zh ? '新建' : 'Create'}</MButton>
              </template>
            </MPageToolbar>
            <MTable :columns="columns" :rows="rows" :loading="loading" paginator :rows-per-page="10" striped bordered row-key="id">
              <template #cell-status="{ value }">
                <MStatus :label="String(value ?? '')" :severity="value === 'active' ? 'success' : 'secondary'" />
              </template>
              <template #empty>
                <MEmpty
                  :title="${zh ? '暂无数据' : 'No data yet'}"
                  :description="${zh ? '创建第一条记录开始使用。' : 'Create your first record to get started.'}"
                >
                  <template #extra>
                    <MButton severity="primary">${zh ? '新建' : 'Create'}</MButton>
                  </template>
                </MEmpty>
              </template>
            </MTable>`

  const formContent = `            <MPageHeader :title="title" :description="${zh ? '填写表单并保存。' : 'Fill in the form and save.'}" />
            <MPageSection variant="form">
              <MForm @submit.prevent="submit">
                <MFormItem label="${zh ? '名称' : 'Name'}" name="name" required>
                  <MInput v-model="model.name" fluid />
                </MFormItem>
                <MPageSection variant="actions">
                  <MButton native-type="submit" severity="primary" :loading="loading">${zh ? '保存' : 'Save'}</MButton>
                  <MButton severity="secondary">${zh ? '取消' : 'Cancel'}</MButton>
                </MPageSection>
              </MForm>
            </MPageSection>`

  const dashboardContent = `            <MPageHeader :title="title" />
            <MGrid :cols="2" :x-gap="16" :y-gap="16" responsive="screen">
              <MGridItem v-for="metric in metrics" :key="metric.label" :span="1">
                <MPageStat :label="metric.label" :value="metric.value" icon="activity" />
              </MGridItem>
            </MGrid>
            <MCard :title="${zh ? '趋势概览' : 'Trend overview'}">
              <MSkeleton v-if="loading" height="8rem" />
              <MPagePlaceholder v-else :description="${zh ? '接入图表或业务组件。' : 'Connect charts or business widgets here.'}" aria-label="${zh ? '图表占位' : 'Chart placeholder'}" />
            </MCard>`

  const detailContent = `            <MPageToolbar :title="title">
              <template #actions>
                <MButton severity="primary" outlined>${zh ? '编辑' : 'Edit'}</MButton>
              </template>
            </MPageToolbar>
            <MTag value="${zh ? '正常' : 'Active'}" severity="success" />
            <MCard>
              <MDivider />
              <p style="margin:0;color:var(--m-color-text-muted)">${zh ? '示例资源详情' : 'Example resource details'}</p>
            </MCard>`

  const settingsContent = `          <h1 class="m-generated-title">${title}</h1>
          <MTabs :value="'general'" :items="[{ label: '${zh ? '常规' : 'General'}', value: 'general' }]" />
          <MForm class="m-generated-form" @submit.prevent="submit">
            <MFormItem label="${zh ? '显示名称' : 'Display name'}" name="name">
              <MInput v-model="model.name" fluid />
            </MFormItem>
            <MButton native-type="submit" severity="primary" :loading="loading">${zh ? '保存设置' : 'Save settings'}</MButton>
          </MForm>`

  let innerTemplate = ''
  if (isList) {
    innerTemplate = `<MConfigProvider :locale="zhCN">
  <MLayout has-sider fill-viewport>
    <MLayoutSider bordered />
    <MLayout>
      <MLayoutHeader :padding="'var(--m-space-4) var(--m-space-6)'">
        <MBreadcrumb :model="[{ label: '${zh ? '首页' : 'Home'}', to: '/' }, { label: '${title}' }]" />
      </MLayoutHeader>
      <MLayoutContent>
        <MPageContent>
${listContent}
        </MPageContent>
      </MLayoutContent>
    </MLayout>
  </MLayout>
</MConfigProvider>`
  } else if (useLayoutShell) {
    const content = isDashboard ? dashboardContent : isDetail ? detailContent : isSettings ? settingsContent : formContent
    const pageContentAttrs = isForm || isSettings ? ' width="narrow"' : isDashboard ? ' density="spacious"' : ''
    innerTemplate = `<MConfigProvider :locale="zhCN">
  <MLayout fill-viewport>
    <MLayoutHeader :padding="'var(--m-space-4) var(--m-space-6)'">
      <MBreadcrumb :model="[{ label: '${zh ? '首页' : 'Home'}', to: '/' }, { label: '${title}' }]" />
    </MLayoutHeader>
    <MLayoutContent>
      <MPageContent${pageContentAttrs}>
${content}
      </MPageContent>
    </MLayoutContent>
  </MLayout>
</MConfigProvider>`
  } else if (isAuth) {
    innerTemplate = `<MConfigProvider :locale="zhCN">
  <main class="m-generated-page m-generated-auth">
    <MCard>
      <MForm label-position="top" @submit.prevent="submit">
        <MFormItem label="${zh ? '邮箱' : 'Email'}" name="email">
          <MInput type="email" fluid />
        </MFormItem>
        <MFormItem label="${zh ? '密码' : 'Password'}" name="password">
          <MInput type="password" fluid />
        </MFormItem>
        <MButton native-type="submit" severity="primary" :loading="loading" fluid>${zh ? '登录' : 'Sign in'}</MButton>
      </MForm>
    </MCard>
  </main>
</MConfigProvider>`
  } else if (isEmpty) {
    innerTemplate = `<MConfigProvider :locale="zhCN">
  <main class="m-generated-page">
    <MPageToolbar :title="title">
      <template #actions>
        <MButton severity="primary" @click="submit">${zh ? '新建' : 'Create'}</MButton>
      </template>
    </MPageToolbar>
    <MEmpty
      :title="${zh ? '暂无内容' : 'Nothing here yet'}"
      :description="${zh ? '创建第一条记录开始使用。' : 'Create your first record to get started.'}"
      icon="database"
    >
      <template #extra>
        <MButton severity="primary" @click="submit">${zh ? '创建' : 'Create'}</MButton>
      </template>
    </MEmpty>
  </main>
</MConfigProvider>`
  } else if (isWizard) {
    innerTemplate = `<MConfigProvider :locale="zhCN">
  <main class="m-generated-page">
    <MCard>
      <MStepper v-model="activeStep" :items="[${zh ? "'基本信息', '确认'" : "'Details', 'Confirm'"}]" />
      <MForm label-position="top" @submit.prevent="submit">
        <MFormItem label="${zh ? '名称' : 'Name'}" name="name"><MInput v-model="model.name" fluid /></MFormItem>
        <MButton native-type="submit" severity="primary" :loading="loading">${zh ? '下一步' : 'Next'}</MButton>
      </MForm>
    </MCard>
  </main>
</MConfigProvider>`
  } else {
    innerTemplate = `<MConfigProvider :locale="zhCN">
  <main class="m-generated-page">
    <MCard>
      <p class="m-generated-muted">${zh ? '将此区域替换为页面内容。' : 'Replace this area with page content.'}</p>
      <MTag value="${zh ? '示例' : 'Example'}" severity="info" />
    </MCard>
  </main>
</MConfigProvider>`
  }

  const template = `<template>
  ${innerTemplate}
  <p v-if="error" role="alert" class="m-generated-error">${'{{ error }}'}</p>
</template>`

  const style = `<style scoped>
.m-generated-auth { display: grid; place-items: center; padding: var(--m-space-8); max-width: 24rem; margin: 0 auto; min-height: 100vh; }
.m-generated-empty { display: grid; gap: var(--m-space-2); justify-items: center; padding: var(--m-space-8); text-align: center; }
.m-generated-error { color: var(--m-color-danger); padding: 0 var(--m-space-6); }
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
    (name === 'default' && source.includes('<M') && source.includes('</M>'))
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
    scope?: 'all' | 'components' | 'guides' | 'api' | 'examples' | 'patterns' | 'decisions' | 'snippets'
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

    if (scope === 'all' || scope === 'snippets') {
      for (const snippet of pageSnippets) {
        const score = scorePageSnippet(snippet, query)
        if (score > 0) {
          hits.push({
            type: 'snippet',
            id: snippet.id,
            title: locale === 'en-US' ? snippet.titleEn : snippet.title,
            score,
            snippet: locale === 'en-US' ? snippet.descriptionEn : snippet.description,
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
      nextStep: (() => {
        const goldenId =
          best.pattern.goldenPage?.split('/').pop()?.replace(/\.vue$/i, '') ||
          listGoldenPages().find((item) => item.patternId === best.pattern.id)?.id ||
          best.pattern.id
        return locale === 'en-US'
          ? `Call get_golden_page("${goldenId}"), get_pattern, get_design_rules, then get_component/get_example. Pass includeScaffold: true for starter code. Optionally validate_page.`
          : `调用 get_golden_page("${goldenId}")、get_pattern、get_design_rules，再用 get_component/get_example 查 API。需要 starter 时传 includeScaffold: true。可选用 validate_page。`
      })(),
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

  function getGoldenPage(args: { page: string; mode?: string }) {
    const locale = resolveLocale(args.mode)
    const payload = readGoldenPageSource(args.page)
    if (!payload) {
      return textResult({
        error: `Golden page not found: ${args.page}`,
        availablePages: listGoldenPages().map((item) => item.id),
      })
    }
    return textResult({
      id: payload.record.id,
      patternId: payload.record.patternId,
      title: locale === 'en-US' ? payload.record.titleEn : payload.record.title,
      file: payload.record.file,
      source: payload.source,
      nextStep:
        locale === 'en-US'
          ? 'Copy this structure and replace business data. Prefer MPage* components; see get_design_rules for page standards.'
          : '复制此结构并替换业务数据。优先使用 MPage* 组件；页面标准见 get_design_rules。',
    })
  }

  function listGoldenPageCatalog(args: { mode?: string } = {}) {
    const locale = resolveLocale(args.mode)
    return textResult({
      items: listGoldenPages().map((item) => ({
        id: item.id,
        patternId: item.patternId,
        title: locale === 'en-US' ? item.titleEn : item.title,
        file: item.file,
      })),
    })
  }

  function listPageSnippets(args: {
    query?: string
    pageType?: string
    mode?: string
    limit?: number
    offset?: number
  }) {
    const locale = resolveLocale(args.mode)
    const result = filterPageSnippets(args)
    return textResult({
      ...result,
      items: result.items.map((item) => ({
        id: item.id,
        title: locale === 'en-US' ? item.titleEn : item.title,
        description: locale === 'en-US' ? item.descriptionEn : item.description,
        pageTypes: item.pageTypes,
        keywords: item.keywords,
        imports: item.imports,
      })),
    })
  }

  function getPageSnippet(args: { section: string; mode?: string; includeScript?: boolean }) {
    const locale = resolveLocale(args.mode)
    const ranked = pageSnippets
      .map((snippet) => ({ snippet, score: scorePageSnippet(snippet, args.section) }))
      .sort((a, b) => b.score - a.score || a.snippet.id.localeCompare(b.snippet.id))
    const match = findPageSnippet(args.section) || (ranked[0]?.score ? ranked[0].snippet : undefined)

    if (!match || (ranked[0]?.score ?? 0) === 0) {
      return textResult({
        error: `Page snippet not found: ${args.section}`,
        availableSnippets: pageSnippets.map((item) => item.id),
        suggestion: locale === 'en-US'
          ? 'Try list_page_snippets with query like "filters", "toolbar", or pageType="list".'
          : '可尝试 list_page_snippets，query 如 "filters"、"toolbar"，或 pageType="list"。',
      })
    }

    const imports = [...new Set(match.imports)].sort()
    const payload: Record<string, unknown> = {
      id: match.id,
      title: locale === 'en-US' ? match.titleEn : match.title,
      description: locale === 'en-US' ? match.descriptionEn : match.description,
      pageTypes: match.pageTypes,
      imports,
      template: match.template,
      rules: locale === 'en-US' ? match.rulesEn : match.rules,
      avoid: locale === 'en-US' ? match.avoidEn : match.avoid,
      nextStep:
        locale === 'en-US'
          ? 'Merge this block into the existing page. Call get_component/get_example for unfamiliar imports, then validate_usage and validate_page.'
          : '将此区块合并进现有页面。不熟悉的 import 用 get_component/get_example 核对，完成后 validate_usage / validate_page。',
    }
    if (match.scriptSetup) payload.scriptSetup = match.scriptSetup

    if (args.includeScript) {
      payload.vue = {
        imports: `import { ${imports.join(', ')} } from 'morya-ui'`,
        scriptSetup: match.scriptSetup || '',
        template: match.template,
      }
    }

    if (!findPageSnippet(args.section) && ranked.length > 1 && ranked[0]?.score) {
      payload.matchedBy = 'query'
      payload.alternatives = ranked
        .slice(1, 4)
        .filter((entry) => entry.score > 0)
        .map((entry) => ({ id: entry.snippet.id, score: entry.score }))
    }

    return textResult(payload)
  }

  function validatePage(args: { code?: string; mode?: string }) {
    const locale = resolveLocale(args.mode)
    const code = args.code || ''
    const suggestions: Array<{ standardId: string; type: string; message: string }> = []

    if (/#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\b/i.test(code)) {
      suggestions.push({
        standardId: 'tokens',
        type: 'raw-color',
        message:
          locale === 'en-US'
            ? 'Standard: prefer --m-* design tokens over hex colors.'
            : '标准建议：颜色优先使用 --m-* 设计令牌，而非 hex 色值。',
      })
    }

    if (/\brgb\s*\(/i.test(code) && !/--m-/.test(code)) {
      suggestions.push({
        standardId: 'tokens',
        type: 'raw-color',
        message:
          locale === 'en-US'
            ? 'Standard: prefer --m-* tokens over raw rgb()/rgba() in page styles.'
            : '标准建议：页面样式优先 --m-* 令牌，而非裸 rgb()/rgba()。',
      })
    }

    if (/<MCard\b[^>]*>[\s\S]*?<MTable\b[^>]*\bbordered\b/i.test(code)) {
      suggestions.push({
        standardId: 'page-sections',
        type: 'double-border',
        message:
          locale === 'en-US'
            ? 'Standard: place bordered MTable directly in MPageContent instead of wrapping it with MCard.'
            : '标准建议：bordered 的 MTable 直接放在 MPageContent 内，通常不必再包 MCard。',
      })
    }

    if (/<MLayoutContent\b/i.test(code) && !/<MPageContent\b/i.test(code)) {
      suggestions.push({
        standardId: 'layout-shell',
        type: 'missing-page-content',
        message:
          locale === 'en-US'
            ? 'Standard: prefer MPageContent inside MLayoutContent for consistent page spacing.'
            : '标准建议：MLayoutContent 内使用 MPageContent 统一页面间距。',
      })
    }

    if (
      (/\bpage[-_](?:list|form|dashboard)?[-_]?(?:filters|toolbar|content|header)\b/i.test(code) ||
        /class="[^"]*filters/i.test(code)) &&
      !/<MPage(?:Content|Filters|Toolbar|Header|Section|Stat)\b/i.test(code)
    ) {
      suggestions.push({
        standardId: 'page-sections',
        type: 'custom-page-css',
        message:
          locale === 'en-US'
            ? 'Standard: prefer MPageFilters, MPageToolbar, MPageHeader, or MPageSection over custom page section CSS.'
            : '标准建议：筛选/工具栏/表单区块优先 MPage* 组件，少写自定义 page section CSS。',
      })
    }

    if (/<MPageFilters\b/i.test(code) && /<MCard\b[^>]*>[\s\S]*?<MPageFilters\b/i.test(code)) {
      suggestions.push({
        standardId: 'page-sections',
        type: 'redundant-wrapper',
        message:
          locale === 'en-US'
            ? 'Standard: MPageFilters already provides a surface; wrapping it in MCard is usually redundant.'
            : '标准建议：MPageFilters 已自带表面样式，通常不必再用 MCard 包裹。',
      })
    }

    if (
      /<MPageSection\b[^>]*variant=["']form["']/i.test(code) &&
      /<MCard\b[^>]*>[\s\S]*?<MPageSection\b/i.test(code)
    ) {
      suggestions.push({
        standardId: 'page-sections',
        type: 'redundant-wrapper',
        message:
          locale === 'en-US'
            ? 'Standard: MPageSection variant="form" already provides a surface; wrapping it in MCard is usually redundant.'
            : '标准建议：MPageSection variant="form" 已自带表面样式，通常不必再用 MCard 包裹。',
      })
    }

    if (/<MPageContent\b[^>]*>[\s\S]*?<MPageContent\b/i.test(code)) {
      suggestions.push({
        standardId: 'layout-shell',
        type: 'redundant-wrapper',
        message:
          locale === 'en-US'
            ? 'Standard: prefer a single MPageContent shell for page padding and section gap.'
            : '标准建议：页面 padding 与区块间距优先只用一层 MPageContent。',
      })
    }

    if (
      /<(?:div|section|main)\b[^>]*style=["'][^"']*(?:padding|gap)\s*:[^"']*["'][^>]*>\s*<(?:MPage(?:Content|Filters|Toolbar|Header|Section)|MTable)\b/i.test(
        code,
      )
    ) {
      suggestions.push({
        standardId: 'page-sections',
        type: 'redundant-wrapper',
        message:
          locale === 'en-US'
            ? 'Standard: avoid extra padded wrappers around MPage* blocks; prefer the components’ built-in spacing.'
            : '标准建议：少在 MPage* 外包带 padding 的容器；优先使用组件自带间距。',
      })
    }

    if (
      /style="[^"]*overflow(?:-y|-x)?\s*:\s*(auto|scroll)/i.test(code) ||
      /<style\b[^>]*>[\s\S]*?overflow(?:-y|-x)?\s*:\s*(auto|scroll)/i.test(code)
    ) {
      suggestions.push({
        standardId: 'scroll',
        type: 'native-scroll',
        message:
          locale === 'en-US'
            ? 'Standard: prefer MScrollbar or MLayout scroll regions over overflow:auto/scroll in page styles.'
            : '标准建议：页面滚动优先 MLayout 主滚动或 MScrollbar，少写 overflow:auto/scroll。',
      })
    }

    if (/::-webkit-scrollbar|scrollbar-width\s*:/i.test(code)) {
      suggestions.push({
        standardId: 'scroll',
        type: 'custom-scrollbar-css',
        message:
          locale === 'en-US'
            ? 'Standard: prefer MScrollbar or layout defaults over native scrollbar CSS in product code.'
            : '标准建议：业务代码优先 MScrollbar 或 Layout 默认滚动，少定制原生滚动条样式。',
      })
    }

    if (/min-height\s*:\s*100vh/i.test(code) && !/<MLayout\b[^>]*fill-viewport/i.test(code)) {
      suggestions.push({
        standardId: 'layout-shell',
        type: 'viewport-height',
        message:
          locale === 'en-US'
            ? 'Standard: prefer MLayout fillViewport over hand-written min-height:100vh page shells.'
            : '标准建议：整页高度优先 MLayout fillViewport，少写 min-height:100vh。',
      })
    }

    if (
      (/fill-viewport|fillViewport/i.test(code) || /<MLayout\b/i.test(code))
      && !/html\s*,\s*body\s*,\s*#app[\s\S]{0,80}height\s*:\s*100%/i.test(code)
    ) {
      suggestions.push({
        standardId: 'layout-shell',
        type: 'height-chain',
        message:
          locale === 'en-US'
            ? 'Prefer layout-app-shell / golden pages: with MLayout, set html, body, #app { height: 100% } when the shell is not using fillViewport.'
            : '对齐 layout-app-shell / 黄金样例：未使用 fillViewport 时，配合 MLayout 设置 html, body, #app { height: 100% }。',
      })
    }

    if (/<MMenu\b/i.test(code)) {
      const iconCount = (code.match(/\bicon\s*:/g) || []).length
      const looksLikeMenuModel =
        /MMenu[\s\S]{0,1200}\b(label|model)\s*[:=]/i.test(code) || /:model=/i.test(code)
      if (looksLikeMenuModel && iconCount === 0) {
        suggestions.push({
          standardId: 'layout-shell',
          type: 'menu-missing-icons',
          message:
            locale === 'en-US'
              ? 'Prefer golden / layout-app-shell menu items that include icon (e.g. user, shield, home).'
              : '对齐黄金样例 / layout-app-shell：侧栏菜单项带上 icon（如 user、shield、home）。',
        })
      }
    }

    return textResult({
      ok: true,
      advisory: true,
      summary:
        locale === 'en-US'
          ? suggestions.length === 0
            ? 'No deviations from page standards detected.'
            : `${suggestions.length} advisory suggestion(s).`
          : suggestions.length === 0
            ? '未发现与页面标准的明显偏差。'
            : `${suggestions.length} 条参考建议。`,
      suggestions,
      nextStep:
        locale === 'en-US'
          ? 'See get_design_rules.standards for the full recommended page standards.'
          : '完整页面标准见 get_design_rules.standards。',
    })
  }

  function getDesignRules(args: { mode?: string } = {}) {
    const locale = resolveLocale(args.mode)
    if (locale === 'zh-CN') {
      return textResult({
        meta: designRules.meta,
        standards: designRules.standards,
        tokens: designRules.tokens,
        composition: designRules.composition,
        actions: designRules.actions,
        status: designRules.status,
        feedback: designRules.feedback,
        global: designRules.global,
      })
    }
    return textResult({
      meta: designRules.meta,
      standards: designRules.standards.map((item) => ({
        id: item.id,
        title: item.titleEn,
        recommend: item.recommendEn,
        discouraged: item.discouragedEn,
        mcp: item.mcp,
      })),
      tokens: {
        colors: ['--m-color-primary', '--m-color-surface', '--m-color-text', '--m-color-border'],
        spacing: '--m-space-*',
        radius: '--m-radius-sm/md/lg',
        typography: '--m-font-size-xs/sm/md/lg',
        motion: '--m-motion-fast/normal',
      },
      composition: designRules.composition,
      actions: {
        primary: { component: 'MButton', props: ['omit severity or use primary'] },
        secondary: { component: 'MButton', props: ['severity="secondary"', 'outlined or text'] },
        destructive: { component: 'MButton', props: ['severity="danger"'], requiresConfirmation: true },
        cancel: { component: 'MButton', props: ['severity="secondary"', 'text'] },
      },
      status: { component: 'MTag', mapping: { active: 'success', pending: 'warn', disabled: 'secondary', error: 'danger' } },
      feedback: {
        default: 'message',
        message: { when: ['single-line action result', 'save/delete/create confirmations'] },
        toast: { when: ['summary + detail', 'async or background notifications'] },
        inlineMessage: { api: 'field errorMessage | token-styled role=alert', when: ['persistent form/auth errors'] },
        doc: 'docs/feedback-message-vs-toast.md',
      },
      global: [
        'Prefer library components and --m-* tokens.',
        'Default action feedback to message; prefer message over toast for single-line-only text.',
        'Icon-only buttons should provide aria-label or ariaLabel.',
        'Form controls should have a visible label or an equivalent accessible name.',
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
      install: 'pnpm add morya-ui',
      peer: 'vue@^3.3.0',
      styles: "import 'morya-ui/styles.css'",
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
      const componentTagMatch = code.match(/<(M)([A-Z][A-Za-z0-9]*)\b/)
      const componentImportMatch = code.match(/import\s*\{[^}]*\b(M)([A-Z][A-Za-z0-9]*)\b/)
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

      if (code && !code.includes('morya-ui') && /import\s+/.test(code)) {
        if (!/from\s+['"]morya-ui['"]/.test(code)) {
          issues.push({
            type: 'import',
            message: `Import should come from 'morya-ui' (expected ${component.exportName}).`,
          })
        }
      }

      const attrRe = /<M[A-Z][A-Za-z0-9]*\b([^>]*)>/g
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
        'list_golden_pages',
        'get_golden_page',
        'list_page_snippets',
        'get_page_snippet',
        'validate_page',
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
    listGoldenPageCatalog,
    getGoldenPage,
    listPageSnippets,
    getPageSnippet,
    validatePage,
    version,
  }
}
