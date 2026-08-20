import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { createToolHandlers } from './tools.js'

const handlers = createToolHandlers()
const server = new McpServer({
  name: handlers.catalog.mcp.name,
  version: handlers.catalog.mcp.version,
})

server.tool(
  'list',
  'List @well-insight/ui components, guides, examples, or categories.',
  {
    kind: z
      .enum(['components', 'guides', 'examples', 'categories'])
      .optional()
      .describe('What to list. Defaults to components.'),
    mode: z.string().optional().describe('Locale mode: zh / en. Defaults to zh.'),
    limit: z.number().int().min(1).max(200).optional(),
    offset: z.number().int().min(0).optional(),
  },
  async (args) => handlers.list(args),
)

server.tool(
  'search',
  'Search components, guides, API text, and examples.',
  {
    query: z.string().min(1),
    scope: z.enum(['all', 'components', 'guides', 'api', 'examples']).optional(),
    mode: z.string().optional(),
    limit: z.number().int().min(1).max(50).optional(),
    offset: z.number().int().min(0).optional(),
  },
  async (args) => handlers.search(args),
)

server.tool(
  'get_component',
  'Read component docs and metadata from the generated catalog.',
  {
    component: z.string().min(1).optional(),
    components: z.array(z.string()).max(10).optional(),
    mode: z.string().optional(),
    detail: z.enum(['compact', 'full']).optional(),
    includeApi: z.boolean().optional(),
    includeExamples: z.boolean().optional(),
    sections: z.array(z.string()).optional(),
  },
  async (args) => handlers.getComponent(args),
)

server.tool(
  'get_example',
  'Return one source-backed example for a component.',
  {
    component: z.string().min(1),
    mode: z.string().optional(),
    section: z.string().optional(),
    variant: z.string().optional(),
  },
  async (args) => handlers.getExample(args),
)

server.tool(
  'get_guide',
  'Read a guide (introduction, quick-start, theme, config, …).',
  {
    guide: z.string().min(1),
    mode: z.string().optional(),
    section: z.string().optional(),
    detail: z.enum(['compact', 'full']).optional(),
  },
  async (args) => handlers.getGuide(args),
)

server.tool(
  'get_setup',
  'Return installation and setup guidance for consuming @well-insight/ui.',
  {
    environment: z.string().optional(),
    mode: z.string().optional(),
  },
  async (args) => handlers.getSetup(args),
)

server.tool(
  'validate_usage',
  'Validate component usage snippets against documented props/events.',
  {
    component: z.string().min(1).optional(),
    code: z.string().min(1).optional(),
    mode: z.string().optional(),
    usages: z
      .array(
        z.object({
          component: z.string().optional(),
          code: z.string().optional(),
        }),
      )
      .max(10)
      .optional(),
  },
  async (args) => handlers.validateUsage(args),
)

server.tool('version', 'Return MCP package, library version, and catalog status.', {}, async () =>
  handlers.version(),
)

const transport = new StdioServerTransport()
await server.connect(transport)
