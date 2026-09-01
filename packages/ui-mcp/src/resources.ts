import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { Catalog, Locale } from './catalog.js'
import { designRules } from './patterns.js'

const DOC_LOCALES: Locale[] = ['zh-CN', 'en-US']

export function registerCatalogResources(server: McpServer, catalog: Catalog) {
  server.registerResource(
    'catalog-index',
    'wi://catalog/index.json',
    {
      title: 'Well Insight UI catalog index',
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
      title: 'Well Insight design rules',
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

  for (const component of catalog.components) {
    for (const locale of DOC_LOCALES) {
      const doc = component.locales[locale]
      if (!doc?.markdown) continue

      const resourceUri = `wi://components/${component.id}/docs/${locale}`
      server.registerResource(
        `component-${component.id}-docs-${locale}`,
        resourceUri,
        {
          title: `${component.exportName} documentation (${locale})`,
          description: doc.description || component.description,
          mimeType: 'text/markdown',
        },
        async (uri) => ({
          contents: [{ uri: uri.href, mimeType: 'text/markdown', text: doc.markdown }],
        }),
      )
    }

    const apiUri = `wi://components/${component.id}/api.json`
    server.registerResource(
      `component-${component.id}-api`,
      apiUri,
      {
        title: `${component.exportName} API`,
        description: `Props, events, and slots for ${component.exportName}.`,
        mimeType: 'application/json',
      },
      async (uri) => ({
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(
              {
                id: component.id,
                exportName: component.exportName,
                category: component.category,
                import: component.import,
                props: component.props,
                events: component.events,
                slots: component.slots,
                methods: component.methods,
              },
              null,
              2,
            ),
          },
        ],
      }),
    )
  }

  for (const guide of catalog.guides) {
    for (const locale of DOC_LOCALES) {
      const doc = guide.locales[locale]
      if (!doc?.markdown) continue

      const resourceUri = `wi://guides/${guide.id}/docs/${locale}`
      server.registerResource(
        `guide-${guide.id}-docs-${locale}`,
        resourceUri,
        {
          title: `${doc.title} (${locale})`,
          description: doc.description,
          mimeType: 'text/markdown',
        },
        async (uri) => ({
          contents: [{ uri: uri.href, mimeType: 'text/markdown', text: doc.markdown }],
        }),
      )
    }
  }
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
