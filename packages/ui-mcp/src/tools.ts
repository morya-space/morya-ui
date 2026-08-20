import type { Catalog, ComponentRecord, GuideRecord, Locale } from './catalog.js'
import {
  findComponent,
  findGuide,
  loadCatalog,
  normalizeName,
  resolveLocale,
  textResult,
  toKebab,
} from './catalog.js'

function pickLocale<T extends { locales: Partial<Record<Locale, unknown>> }>(
  record: T,
  locale: Locale,
) {
  return record.locales[locale] || record.locales['zh-CN'] || record.locales['en-US'] || null
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
    kind?: 'components' | 'guides' | 'examples' | 'categories'
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
    scope?: 'all' | 'components' | 'guides' | 'api' | 'examples'
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

      const attrRe = /<(?:Wi[A-Z][A-Za-z0-9]*)\b([^>]*)>/g
      let tagMatch
      while ((tagMatch = attrRe.exec(code)) !== null) {
        const attrs = tagMatch[1] || ''
        const attrNames = [
          ...attrs.matchAll(/(?:^|\s)(?:v-bind:|:)([A-Za-z_][\w-]*)/g),
          ...attrs.matchAll(/(?:^|\s)([A-Za-z_][\w-]*)\s*=/g),
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

        const eventNames = [...attrs.matchAll(/(?:^|\s)@([A-Za-z_][\w-]*)/g)].map((match) => match[1])
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
    version,
  }
}
