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
import { countCatalogResources } from './resources.js'

function inspectButtonIconOnlyUsage(code: string, issues: Array<{ type: string; message: string }>) {
  const pairedTagRe = /<WiButton\b([^>]*)>([\s\S]*?)<\/WiButton>/gi
  let match = pairedTagRe.exec(code)
  while (match !== null) {
    const attrs = match[1] || ''
    const inner = (match[2] || '').replace(/<!--[\s\S]*?-->/g, '').trim()
    const hasIconOnly = /\b(?:icon-only|iconOnly)\b/.test(attrs)
    const hasIconProp = /\b(?::icon|icon=)/.test(attrs)
    if (hasIconOnly && !hasIconProp) {
      issues.push({
        type: 'icon-only-missing-icon',
        message: 'WiButton with icon-only must set icon (or :icon). Default slot content is not rendered when iconOnly is true.',
      })
    }
    if (hasIconOnly && inner.length > 0) {
      issues.push({
        type: 'icon-only-default-slot',
        message: 'WiButton with icon-only ignores default slot content. Pass the icon via icon / :icon instead.',
      })
    }
    match = pairedTagRe.exec(code)
  }

  const selfClosingRe = /<WiButton\b([^>]*)\/>/gi
  match = selfClosingRe.exec(code)
  while (match !== null) {
    const attrs = match[1] || ''
    const hasIconOnly = /\b(?:icon-only|iconOnly)\b/.test(attrs)
    const hasIconProp = /\b(?::icon|icon=)/.test(attrs)
    if (hasIconOnly && !hasIconProp) {
      issues.push({
        type: 'icon-only-missing-icon',
        message: 'WiButton with icon-only must set icon (or :icon).',
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
  return `Wi${name}`
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
  const isForm = patternId === 'form-page' || isSettings || isAuth || isWizard
  const title = intent || (zh ? '业务页面' : 'Business page')
  const script = `<script setup lang="ts">
import { ref } from 'vue'
import { WiButton, WiCard, WiInput, WiTag${isList ? ', WiPagination, WiTable' : ''}${isForm ? ', WiForm, WiFormItem, WiSelect' : ''}${isDashboard ? ', WiProgressBar, WiSkeleton' : ''}${isDetail ? ', WiDivider' : ''}${isEmpty ? ', WiDataView' : ''}${isWizard ? ', WiStepper' : ''}${isSettings ? ', WiTabs' : ''} } from '@well-insight/ui'

const loading = ref(false)
const error = ref('')
${isList ? `const keyword = ref('')
const page = ref(1)
const rows = ref<Record<string, unknown>[]>([])
` : ''}${isForm ? `const model = ref({ name: '' })
` : ''}${isDashboard ? `const metrics = ref([{ label: '${zh ? '产量' : 'Production'}', value: 0 }])
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
  const template = `<template>
  <main class="wi-generated-page">
    <header class="wi-generated-header">
      <div>
        <h1>${title}</h1>
        <p class="wi-generated-muted">${zh ? '请根据业务接口替换示例数据和交互。' : 'Replace the sample data and interactions with your business API.'}</p>
      </div>
      <WiButton label="${isForm ? (zh ? '保存' : 'Save') : (zh ? '新增' : 'Create')}" :loading="loading" @click="submit" />
    </header>
${isList ? `    <WiCard>
      <div class="wi-generated-toolbar">
        <WiInput v-model="keyword" label="${zh ? '关键词' : 'Keyword'}" fluid />
        <WiButton label="${zh ? '查询' : 'Search'}" severity="secondary" outlined @click="page = 1" />
      </div>
      <WiTable :value="rows" :loading="loading" />
      <WiPagination v-model="page" :total="0" />
      <p v-if="!loading && !rows.length" class="wi-generated-muted">${zh ? '暂无数据' : 'No data yet'}</p>
    </WiCard>` : isDashboard ? `    <section class="wi-generated-grid">
      <WiCard v-for="metric in metrics" :key="metric.label">
        <span class="wi-generated-muted">{{ metric.label }}</span>
        <strong class="wi-generated-metric">{{ metric.value }}</strong>
        <WiProgressBar :value="metric.value" />
      </WiCard>
      <WiCard>
        <WiSkeleton v-if="loading" height="8rem" />
        <p v-else class="wi-generated-muted">${zh ? '趋势和告警区域，请接入真实数据。' : 'Connect trend and alert data here.'}</p>
      </WiCard>
    </section>` : isDetail ? `    <WiCard>
      <div class="wi-generated-detail-head">
        <div>
          <h2>${zh ? '资源概览' : 'Resource overview'}</h2>
          <WiTag value="${zh ? '正常' : 'Active'}" severity="success" />
        </div>
        <WiButton label="${zh ? '编辑' : 'Edit'}" outlined />
      </div>
      <WiDivider />
      <dl class="wi-generated-details">
        <div><dt>${zh ? '名称' : 'Name'}</dt><dd>${zh ? '示例资源' : 'Example resource'}</dd></div>
        <div><dt>${zh ? '更新时间' : 'Updated'}</dt><dd>—</dd></div>
      </dl>
    </WiCard>` : isEmpty ? `    <WiCard>
      <WiDataView :value="[]">
        <template #empty>
          <div class="wi-generated-empty">
            <strong>${zh ? '暂无内容' : 'Nothing here yet'}</strong>
            <p class="wi-generated-muted">${zh ? '创建第一条记录开始使用。' : 'Create your first record to get started.'}</p>
            <WiButton label="${zh ? '创建' : 'Create'}" @click="submit" />
          </div>
        </template>
      </WiDataView>
    </WiCard>` : isWizard ? `    <WiCard>
      <WiStepper v-model="activeStep" :items="[${zh ? "'基本信息', '确认'" : "'Details', 'Confirm'"}]" />
      <WiForm label-position="top" @submit.prevent="submit">
        <WiFormItem label="${zh ? '名称' : 'Name'}" name="name"><WiInput v-model="model.name" fluid /></WiFormItem>
        <WiButton native-type="submit" label="${zh ? '下一步' : 'Next'}" :loading="loading" />
      </WiForm>
    </WiCard>` : isSettings ? `    <WiCard>
      <WiTabs :value="'general'" :items="[{ label: '${zh ? '常规' : 'General'}', value: 'general' }]" />
      <WiForm label-position="top" @submit.prevent="submit">
        <WiFormItem label="${zh ? '显示名称' : 'Display name'}" name="name"><WiInput v-model="model.name" fluid /></WiFormItem>
        <WiButton native-type="submit" label="${zh ? '保存设置' : 'Save settings'}" :loading="loading" />
      </WiForm>
    </WiCard>` : isAuth ? `    <WiCard>
      <WiForm label-position="top" @submit.prevent="submit">
        <WiFormItem label="${zh ? '邮箱' : 'Email'}" name="email"><WiInput type="email" label="${zh ? '邮箱' : 'Email'}" fluid /></WiFormItem>
        <WiFormItem label="${zh ? '密码' : 'Password'}" name="password"><WiInput type="password" label="${zh ? '密码' : 'Password'}" fluid /></WiFormItem>
        <WiButton native-type="submit" label="${zh ? '登录' : 'Sign in'}" :loading="loading" />
      </WiForm>
    </WiCard>` : `    <WiCard>
      <p class="wi-generated-muted">${zh ? '将此区域替换为页面内容。' : 'Replace this area with page content.'}</p>
      <WiTag value="${zh ? '示例' : 'Example'}" severity="info" />
    </WiCard>`}
    <p v-if="error" role="alert" class="wi-generated-error">{{ error }}</p>
  </main>
</template>`
  const style = `<style scoped>
.wi-generated-page { display: grid; gap: var(--wi-space-4); max-width: 80rem; margin: 0 auto; padding: var(--wi-space-6); }
.wi-generated-header, .wi-generated-toolbar, .wi-generated-actions, .wi-generated-detail-head { display: flex; gap: var(--wi-space-3); align-items: center; justify-content: space-between; flex-wrap: wrap; }
.wi-generated-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--wi-space-4); }
.wi-generated-metric { display: block; font-size: var(--wi-font-size-lg); margin: var(--wi-space-2) 0; }
.wi-generated-details { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--wi-space-4); margin: 0; }
.wi-generated-details dt { color: var(--wi-color-text-muted); font-size: var(--wi-font-size-sm); }
.wi-generated-details dd { margin: var(--wi-space-1) 0 0; }
.wi-generated-empty { display: grid; gap: var(--wi-space-2); justify-items: center; padding: var(--wi-space-8); text-align: center; }
.wi-generated-muted { color: var(--wi-color-text-muted); }
.wi-generated-error { color: var(--wi-color-danger); }
@media (max-width: 48rem) { .wi-generated-page { padding: var(--wi-space-4); } .wi-generated-toolbar > *, .wi-generated-grid > * { width: 100%; } .wi-generated-grid, .wi-generated-details { grid-template-columns: 1fr; } }
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
    (name === 'default' && source.includes('<Wi') && source.includes('</Wi'))
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
      components: best.pattern.components,
      structure: best.pattern.structure,
      layout: best.pattern.layout,
      styleRules: best.pattern.styleRules,
      interactionRules: best.pattern.interactionRules,
      avoid: best.pattern.avoid,
      alternatives: ranked.slice(1, 3).filter((item) => item.score > 0).map((item) => ({ id: item.pattern.id, score: item.score })),
      nextStep: locale === 'en-US'
        ? 'Read matchedPattern with get_pattern, then verify component APIs with get_component or get_example. Pass includeScaffold: true for a starter Vue file.'
        : '用 get_pattern 读取 matchedPattern，再用 get_component 或 get_example 核对组件 API。需要 starter 代码时传 includeScaffold: true。',
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
        colors: ['--wi-color-primary', '--wi-color-surface', '--wi-color-text', '--wi-color-border'],
        spacing: '--wi-space-*',
        radius: '--wi-radius-sm/md/lg',
        typography: '--wi-font-size-xs/sm/md/lg',
        motion: '--wi-motion-fast/normal',
      },
      actions: {
        primary: { component: 'WiButton', props: ['omit severity or use primary'] },
        secondary: { component: 'WiButton', props: ['severity="secondary"', 'outlined or text'] },
        destructive: { component: 'WiButton', props: ['severity="danger"'], requiresConfirmation: true },
        cancel: { component: 'WiButton', props: ['severity="secondary"', 'text'] },
      },
      status: { component: 'WiTag', mapping: { active: 'success', pending: 'warn', disabled: 'secondary', error: 'danger' } },
      global: [
        'Prefer library components and --wi-* tokens; do not maintain a second color system.',
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
      install: 'pnpm add @well-insight/ui',
      peer: 'vue@^3.5.0',
      styles: "import '@well-insight/ui/styles.css'",
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
      const componentName =
        usage.component ||
        code.match(/<(Wi[A-Z][A-Za-z0-9]*)\b/)?.[1] ||
        code.match(/import\s*\{[^}]*\b(Wi[A-Z][A-Za-z0-9]*)\b/)?.[1]

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

      if (code && !code.includes('@well-insight/ui') && /import\s+/.test(code)) {
        if (!/from\s+['"]@well-insight\/ui['"]/.test(code)) {
          issues.push({
            type: 'import',
            message: `Import should come from '@well-insight/ui' (expected ${component.exportName}).`,
          })
        }
      }

      const attrRe = /<Wi[A-Z][A-Za-z0-9]*\b([^>]*)>/g
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
