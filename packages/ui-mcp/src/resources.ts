import { ResourceTemplate, type McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { Catalog, ComponentRecord, Locale } from './catalog.js'
import { designRules } from './patterns.js'

const DOC_LOCALES: Locale[] = ['zh-CN', 'en-US']
const RESOURCE_TEMPLATE_COUNT = 3

function filterCompletion(candidates: string[], value?: string): string[] {
  const query = (value ?? '').trim().toLowerCase()
  if (!query) return candidates
  return candidates.filter((item) => item.toLowerCase().startsWith(query))
}

function findComponentById(catalog: Catalog, componentId: string): ComponentRecord | undefined {
  return catalog.components.find((item) => item.id === componentId)
}

function findGuideById(catalog: Catalog, guideId: string) {
  return catalog.guides.find((item) => item.id === guideId)
}

function componentApiPayload(component: ComponentRecord) {
  return {
    id: component.id,
    exportName: component.exportName,
    category: component.category,
    import: component.import,
    props: component.props,
    events: component.events,
    slots: component.slots,
    methods: component.methods,
  }
}

function registerStaticResources(server: McpServer, catalog: Catalog) {
  server.registerResource(
    'catalog-index',
    'wi://catalog/index.json',
    {
      title: 'Wex Design UI catalog index',
      description: 'Index of all components and guides in the MCP catalog.',
      mimeType: 'application/json',
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify(
            {
              library: catalog.library,
              mcp: catalog.mcp,
              generatedAt: catalog.generatedAt,
              components: catalog.components.map((item) => ({
                id: item.id,
                exportName: item.exportName,
                category: item.category,
                docsZh: `wi://components/${item.id}/docs/zh-CN`,
                docsEn: `wi://components/${item.id}/docs/en-US`,
                api: `wi://components/${item.id}/api.json`,
              })),
              guides: catalog.guides.map((item) => ({
                id: item.id,
                title: item.title,
                docsZh: `wi://guides/${item.id}/docs/zh-CN`,
                docsEn: `wi://guides/${item.id}/docs/en-US`,
              })),
            },
            null,
            2,
          ),
        },
      ],
    }),
  )

  server.registerResource(
    'design-rules',
    'wi://design-rules.json',
    {
      title: 'Wex Design design rules',
      description: 'Design tokens, semantic actions, accessibility, and composition rules.',
      mimeType: 'application/json',
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify(designRules, null, 2),
        },
      ],
    }),
  )
}

function registerComponentDocTemplate(server: McpServer, catalog: Catalog) {
  const componentIds = catalog.components.map((item) => item.id)

  server.registerResource(
    'component-docs',
    new ResourceTemplate('wi://components/{component}/docs/{locale}', {
      list: async () => ({
        resources: catalog.components.flatMap((component) =>
          DOC_LOCALES.filter((locale) => component.locales[locale]?.markdown).map((locale) => {
            const doc = component.locales[locale]!
            return {
              uri: `wi://components/${component.id}/docs/${locale}`,
              name: `${component.id}-docs-${locale}`,
              title: `${component.exportName} documentation (${locale})`,
              description: doc.description || component.description,
              mimeType: 'text/markdown',
            }
          }),
        ),
      }),
      complete: {
        component: async (value) => filterCompletion(componentIds, value),
        locale: async (value) => filterCompletion([...DOC_LOCALES], value),
      },
    }),
    {
      title: 'Component documentation',
      description: 'Markdown documentation for a @wex-design/ui component.',
      mimeType: 'text/markdown',
    },
    async (uri, variables) => {
      const component = findComponentById(catalog, String(variables.component))
      const locale = String(variables.locale) as Locale
      const doc = component?.locales[locale]
      if (!component || !doc?.markdown) {
        throw new Error(`Component documentation not found: ${uri.href}`)
      }
      return {
        contents: [{ uri: uri.href, mimeType: 'text/markdown', text: doc.markdown }],
      }
    },
  )
}

function registerComponentApiTemplate(server: McpServer, catalog: Catalog) {
  const componentIds = catalog.components.map((item) => item.id)

  server.registerResource(
    'component-api',
    new ResourceTemplate('wi://components/{component}/api.json', {
      list: async () => ({
        resources: catalog.components.map((component) => ({
          uri: `wi://components/${component.id}/api.json`,
          name: `${component.id}-api`,
          title: `${component.exportName} API`,
          description: `Props, events, and slots for ${component.exportName}.`,
          mimeType: 'application/json',
        })),
      }),
      complete: {
        component: async (value) => filterCompletion(componentIds, value),
      },
    }),
    {
      title: 'Component API',
      description: 'Props, events, slots, and methods for a @wex-design/ui component.',
      mimeType: 'application/json',
    },
    async (uri, variables) => {
      const component = findComponentById(catalog, String(variables.component))
      if (!component) {
        throw new Error(`Component API not found: ${uri.href}`)
      }
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(componentApiPayload(component), null, 2),
          },
        ],
      }
    },
  )
}

function registerGuideDocTemplate(server: McpServer, catalog: Catalog) {
  const guideIds = catalog.guides.map((item) => item.id)

  server.registerResource(
    'guide-docs',
    new ResourceTemplate('wi://guides/{guide}/docs/{locale}', {
      list: async () => ({
        resources: catalog.guides.flatMap((guide) =>
          DOC_LOCALES.filter((locale) => guide.locales[locale]?.markdown).map((locale) => {
            const doc = guide.locales[locale]!
            return {
              uri: `wi://guides/${guide.id}/docs/${locale}`,
              name: `${guide.id}-docs-${locale}`,
              title: `${doc.title} (${locale})`,
              description: doc.description,
              mimeType: 'text/markdown',
            }
          }),
        ),
      }),
      complete: {
        guide: async (value) => filterCompletion(guideIds, value),
        locale: async (value) => filterCompletion([...DOC_LOCALES], value),
      },
    }),
    {
      title: 'Guide documentation',
      description: 'Markdown guide docs for @wex-design/ui.',
      mimeType: 'text/markdown',
    },
    async (uri, variables) => {
      const guide = findGuideById(catalog, String(variables.guide))
      const locale = String(variables.locale) as Locale
      const doc = guide?.locales[locale]
      if (!guide || !doc?.markdown) {
        throw new Error(`Guide documentation not found: ${uri.href}`)
      }
      return {
        contents: [{ uri: uri.href, mimeType: 'text/markdown', text: doc.markdown }],
      }
    },
  )
}

export function registerCatalogResources(server: McpServer, catalog: Catalog) {
  registerStaticResources(server, catalog)
  registerComponentDocTemplate(server, catalog)
  registerComponentApiTemplate(server, catalog)
  registerGuideDocTemplate(server, catalog)
}

export function countCatalogResources(catalog: Catalog): number {
  let count = 2
  for (const component of catalog.components) {
    for (const locale of DOC_LOCALES) {
      if (component.locales[locale]?.markdown) count += 1
    }
    count += 1
  }
  for (const guide of catalog.guides) {
    for (const locale of DOC_LOCALES) {
      if (guide.locales[locale]?.markdown) count += 1
    }
  }
  return count
}

export function countCatalogResourceTemplates(): number {
  return RESOURCE_TEMPLATE_COUNT
}
