import type { ComponentRecord, GuideRecord, Locale } from './catalog.js'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path'
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
  const isForm = patternId === 'form-page' || patternId === 'settings-page' || patternId === 'auth-page' || patternId === 'wizard-form'
  const title = intent || (zh ? '业务页面' : 'Business page')
  const script = `<script setup lang="ts">
import { ref } from 'vue'
import { WiButton, WiCard, WiInput, WiTag${isList ? ', WiPagination, WiTable' : ''}${isForm ? ', WiForm, WiFormItem, WiSelect' : ''} } from '@well-insight/ui'

const loading = ref(false)
const error = ref('')
${isList ? `const keyword = ref('')
const page = ref(1)
const rows = ref<Record<string, unknown>[]>([])
` : ''}${isForm ? `const model = ref({ name: '' })
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
    </WiCard>` : isForm ? `    <WiCard>
      <WiForm label-position="top" @submit.prevent="submit">
        <WiFormItem label="${zh ? '名称' : 'Name'}" name="name">
          <WiInput v-model="model.name" fluid />
        </WiFormItem>
        <div class="wi-generated-actions">
          <WiButton label="${zh ? '取消' : 'Cancel'}" severity="secondary" text />
          <WiButton native-type="submit" label="${zh ? '保存' : 'Save'}" :loading="loading" />
        </div>
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
.wi-generated-header, .wi-generated-toolbar, .wi-generated-actions { display: flex; gap: var(--wi-space-3); align-items: center; justify-content: space-between; flex-wrap: wrap; }
.wi-generated-muted { color: var(--wi-color-text-muted); }
.wi-generated-error { color: var(--wi-color-danger); }
@media (max-width: 48rem) { .wi-generated-page { padding: var(--wi-space-4); } .wi-generated-toolbar > * { width: 100%; } }
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
    kind?: 'components' | 'guides' | 'examples' | 'categories' | 'patterns' | 'decisions'
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
      return textResult({ kind, total: catalog.guides.length, offset, limit, items })
    }

    if (kind === 'patterns') return listPatterns(args)
    if (kind === 'decisions') return listDecisions(args)

    if (kind === 'categories') {
      const counts = new Map<string, number>()
      for (const component of catalog.components) {
        const key = component.category || 'Uncategorized'
        counts.set(key, (counts.get(key) || 0) + 1)
      }
      const items = [...counts.entries()]
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => a.category.localeCompare(b.category))
      return textResult({ kind, total: items.length, items })
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
        total: flat.length,
        offset,
        limit,
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
    return textResult({ kind: 'components', total: catalog.components.length, offset, limit, items })
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
      total: hits.length,
      offset,
      limit,
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
            }
          : {}),
        ...(includeExamples
          ? {
              examples: component.examples.filter((example) => example.locale === locale).slice(0, 8),
            }
          : {
              exampleCount: component.examples.filter((example) => example.locale === locale).length,
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
    return textResult({ kind: 'patterns', total: pagePatterns.length, offset, limit, items })
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

  function recommendPage(args: { intent: string; pageType?: string; features?: string[]; mode?: string }) {
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
    return textResult({
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
      nextStep: '读取 matchedPattern 的 get_pattern 结果后，再读取核心组件 API 和示例。',
    })
  }

  function generatePage(args: {
    intent: string
    pageType?: string
    pattern?: string
    features?: string[]
    mode?: string
    responsive?: boolean
  }) {
    const locale = resolveLocale(args.mode)
    const recommendation = pagePatterns
      .map((pattern) => ({ pattern, score: scorePattern(pattern, [args.intent, args.pageType || '', ...(args.features || [])].join(' ')) }))
      .sort((a, b) => b.score - a.score)[0]
    const pattern = args.pattern ? findPattern(args.pattern) : recommendation?.pattern
    if (!pattern) {
      return textResult({ error: 'Unable to determine a page pattern.', availablePatterns: pagePatterns.map((item) => item.id) })
    }
    const code = generatedPageCode(pattern.id, args.intent, locale)
    const componentSource = `${code.script  }\\n\\n${  code.template  }\\n\\n${  code.style}`
    const validation = JSON.parse(validatePage({
      pattern: pattern.id,
      code: componentSource,
      intent: args.intent,
    }).content[0].text)
    return textResult({
      intent: args.intent,
      pattern: pattern.id,
      title: locale === 'en-US' ? pattern.titleEn : pattern.title,
      locale,
      responsive: args.responsive !== false,
      components: pattern.components,
      files: { component: componentSource },
      vue: code,
      validation: { page: validation },
      warnings: [
        locale === 'en-US'
          ? 'Generated code is a scaffold: replace sample API state, data, and events with the application implementation.'
          : '生成代码是脚手架：请将示例 API 状态、数据和事件替换为实际业务实现。',
      ],
      nextStep: locale === 'en-US'
        ? 'Review the validation report, then verify unfamiliar component props with get_component or get_example before shipping.'
        : '请先查看 validation 报告，再用 get_component 或 get_example 核对不熟悉的组件属性后发布。',
    })
  }

  function createPage(args: {
    path: string
    intent: string
    pageType?: string
    pattern?: string
    features?: string[]
    mode?: string
    responsive?: boolean
    confirm?: boolean
  }) {
    const projectRoot = resolve(process.cwd())
    const target = resolve(projectRoot, args.path)
    const targetRelative = relative(projectRoot, target)
    if (isAbsolute(args.path) || targetRelative === '..' || targetRelative.startsWith(`..${sep}`) || isAbsolute(targetRelative)) {
      return textResult({ error: 'Path must be relative and stay inside the current project.' })
    }
    const existed = existsSync(target)
    const generated = JSON.parse(generatePage(args).content[0].text) as { files?: { component?: string }; pattern?: string; title?: string; warnings?: string[]; validation?: unknown; error?: string }
    if (generated.error || !generated.files?.component) return textResult(generated)
    if (!args.confirm) {
      return textResult({ path: args.path, exists: existed, written: false, requiresConfirmation: true, pattern: generated.pattern, title: generated.title, content: generated.files.component, warnings: generated.warnings, validation: generated.validation })
    }
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, generated.files.component, 'utf8')
    return textResult({ path: args.path, written: true, overwritten: existed, pattern: generated.pattern, title: generated.title, warnings: generated.warnings, validation: generated.validation })
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

  function listDecisions(args: { mode?: string; limit?: number; offset?: number }) {
    const locale = resolveLocale(args.mode)
    const limit = Math.min(Math.max(args.limit ?? 50, 1), 200)
    const offset = Math.max(args.offset ?? 0, 0)
    const items = componentDecisions.slice(offset, offset + limit).map((decision) => ({
      id: decision.id,
      title: locale === 'en-US' ? decision.titleEn : decision.title,
      question: locale === 'en-US' ? decision.questionEn : decision.question,
      keywords: decision.keywords,
      options: decision.options.map((option) => option.component),
    }))
    return textResult({ kind: 'decisions', total: componentDecisions.length, offset, limit, items })
  }

  function getDecision(args: { decision: string; mode?: string }) {
    const decision = findDecision(args.decision)
    if (!decision) {
      return textResult({
        error: `Decision not found: ${args.decision}`,
        availableDecisions: componentDecisions.map((item) => item.id),
      })
    }
    const locale = resolveLocale(args.mode)
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

  function recommendComponent(args: { query: string; decision?: string; mode?: string }) {
    const ranked = componentDecisions
      .map((decision) => ({ decision, score: scoreDecision(decision, args.query) }))
      .sort((a, b) => b.score - a.score || a.decision.id.localeCompare(b.decision.id))
    const matched = args.decision ? findDecision(args.decision) : ranked[0]?.decision
    if (!matched || (!args.decision && (ranked[0]?.score || 0) === 0)) {
      return textResult({ error: `No component decision matched: ${args.query}`, suggestions: componentDecisions.map((item) => item.id) })
    }
    const locale = resolveLocale(args.mode)
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
      nextStep: 'Use the selected component API and examples before implementing the page.',
    })
  }

  function validatePage(args: {
    pattern?: string
    code?: string
    components?: string[]
    intent?: string
  }) {
    const code = args.code || ''
    const detected = [
      ...(code.match(/<Wi[A-Z][A-Za-z0-9]*/g) || []).map((name) => name.slice(1)),
      ...(code.match(/import\s*\{([^}]+)\}/g) || []).flatMap((statement) =>
        [...statement.matchAll(/\b(Wi[A-Z][A-Za-z0-9]*)\b/g)].map((match) => match[1]),
      ),
      ...(args.components || []),
    ]
    const uniqueNames = [...new Set(detected)]
    const resolved = uniqueNames.map((name) => ({
      query: name,
      component: findComponent(catalog, name),
    }))
    const issues: Array<{ type: string; severity: 'error' | 'warning'; message: string }> = []
    const warnings: Array<{ type: string; severity: 'warning'; message: string }> = []
    const addWarning = (type: string, message: string) => warnings.push({ type, severity: 'warning', message })
    const names = new Set(resolved.filter((item) => item.component).map((item) => item.component!.id.toLowerCase()))
    const hasFormItem = uniqueNames.some((name) => /form[-_ ]?item|表单项/i.test(name))
    const text = code.toLowerCase()
    const pattern = args.pattern ? findPattern(args.pattern) : undefined

    for (const item of resolved) {
      if (!item.component) {
        issues.push({ type: 'unknown-component', severity: 'error', message: `Component not found: ${item.query}. Use a canonical component name or a documented alias.` })
      }
    }

    if (pattern) {
      const required = pattern.components.filter((item) => item.required !== false)
      for (const item of required) {
        if (!names.has(item.component.toLowerCase())) {
          addWarning('missing-pattern-component', `${item.component} is recommended for the ${pattern.id} pattern (${item.role}).`)
        }
      }
    } else if (args.pattern) {
      issues.push({ type: 'unknown-pattern', severity: 'error', message: `Pattern not found: ${args.pattern}.` })
    }

    if (/status|状态|active|pending|enabled|disabled/.test(text) && names.has('button') && !names.has('tag')) {
      addWarning('status-component', 'Business status should use WiTag instead of Button severity.')
    }
    if (/(delete|remove|destroy|删除|移除|销毁)/.test(text) && /severity=["']danger["']|danger/.test(text) && !names.has('dialog') && !names.has('confirmdialog')) {
      addWarning('destructive-confirmation', 'Destructive actions should be confirmed with WiDialog or WiConfirmDialog.')
    }
    if (names.has('table') && !names.has('pagination') && /(list|table|列表|表格|分页)/.test(text)) {
      addWarning('pagination', 'A data list should usually provide WiPagination or an explicit load-more strategy.')
    }
    if (names.has('form') && !hasFormItem && !/<WiFormItem\b/i.test(code)) {
      addWarning('form-structure', 'WiForm should normally be composed with WiFormItem for labels and validation state.')
    }
    if (/<WiButton[^>]*icon-only/i.test(code) && !/<WiButton[^>]*(aria-label|ariaLabel)/i.test(code)) {
      addWarning('accessibility', 'Icon-only WiButton requires aria-label or ariaLabel.')
    }
    if (code && /#[0-9a-f]{3,8}|rgb\s*\(/i.test(code)) {
      addWarning('design-token', 'Prefer --wi-* semantic tokens over hard-coded colors in page styles.')
    }
    if (code && /<Wi(Input|Select|Textarea)\b/i.test(code) && !/(label=|aria-label|ariaLabel)/i.test(code)) {
      addWarning('form-label', 'Form controls should provide a visible label or an equivalent accessible name.')
    }

    return textResult({
      ok: issues.length === 0 && warnings.length === 0,
      pattern: pattern?.id,
      intent: args.intent,
      components: resolved.map((item) => ({ query: item.query, resolved: item.component?.id || null, exportName: item.component?.exportName || null })),
      issues,
      warnings,
      summary: issues.length === 0 && warnings.length === 0
        ? 'Page composition matches the documented component and design rules.'
        : `Found ${issues.length} error(s) and ${warnings.length} warning(s).`,
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
    return textResult({
      mcp: catalog.mcp,
      library: catalog.library,
      generatedAt: catalog.generatedAt,
      counts: {
        components: catalog.components.length,
        guides: catalog.guides.length,
        examples: catalog.components.reduce((sum, item) => sum + item.examples.length, 0),
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
        'validate_page',
        'generate_page',
        'create_page',
        'list_decisions',
        'get_decision',
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
    generatePage,
    createPage,
    listDecisions,
    getDecision,
    recommendComponent,
    validatePage,
    version,
  }
}
