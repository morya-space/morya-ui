import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { createToolHandlers } from './tools.js'

const handlers = createToolHandlers()
const server = new McpServer({
  name: handlers.catalog.mcp.name,
  version: handlers.catalog.mcp.version,
})

type ToolHandler = (args: any) => Promise<any> | any

function register(
  name: string,
  description: string,
  inputSchema: Record<string, z.ZodTypeAny>,
  handler: ToolHandler,
  annotations: {
    readOnlyHint: boolean
    destructiveHint: boolean
    idempotentHint: boolean
    openWorldHint: boolean
  } = {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
) {
  return server.registerTool(
    name,
    {
      title: description.split('.')[0],
      description,
      inputSchema,
      outputSchema: z.record(z.string(), z.unknown()),
      annotations,
    },
    handler,
  )
}

register(
  'list',
  'List @well-insight/ui components, guides, examples, categories, or page patterns.',
  {
    kind: z
      .enum(['components', 'guides', 'examples', 'categories', 'patterns', 'decisions'])
      .optional()
      .describe('What to list. Defaults to components.'),
    mode: z.string().optional().describe('Locale mode: zh / en. Defaults to zh.'),
    limit: z.number().int().min(1).max(200).optional(),
    offset: z.number().int().min(0).optional(),
  },
  async (args) => handlers.list(args),
)

register(
  'search',
  'Search components, guides, API text, and examples.',
  {
    query: z.string().min(1),
    scope: z.enum(['all', 'components', 'guides', 'api', 'examples', 'patterns', 'decisions']).optional(),
    mode: z.string().optional(),
    limit: z.number().int().min(1).max(50).optional(),
    offset: z.number().int().min(0).optional(),
  },
  async (args) => handlers.search(args),
)

register(
  'get_component',
  'Read component docs and metadata from the generated catalog.',
  {
    component: z.string().min(1).optional(),
    components: z.array(z.string()).max(10).optional(),
    mode: z.string().optional(),
    detail: z.enum(['compact', 'full']).optional(),
    includeApi: z.boolean().optional(),
    includeExamples: z.boolean().optional(),
    examplesLimit: z.number().int().min(1).max(100).optional(),
    examplesOffset: z.number().int().min(0).optional(),
    sections: z.array(z.string()).optional(),
  },
  async (args) => handlers.getComponent(args),
)

register(
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

register(
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

register(
  'get_setup',
  'Return installation and setup guidance for consuming @well-insight/ui.',
  {
    environment: z.string().optional(),
    mode: z.string().optional(),
  },
  async (args) => handlers.getSetup(args),
)

register(
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

register(
  'list_patterns',
  'List reusable page patterns for composing @well-insight/ui components.',
  {
    mode: z.string().optional(),
    limit: z.number().int().min(1).max(200).optional(),
    offset: z.number().int().min(0).optional(),
  },
  async (args) => handlers.listPatterns(args),
)

register(
  'get_pattern',
  'Read the structure, component composition, layout, and interaction rules for a page pattern.',
  {
    pattern: z.string().min(1),
    mode: z.string().optional(),
  },
  async (args) => handlers.getPattern(args),
)

register(
  'recommend_page',
  'Recommend a page pattern and component composition from a product/page intent.',
  {
    intent: z.string().min(1),
    pageType: z.string().optional(),
    features: z.array(z.string()).max(20).optional(),
    mode: z.string().optional(),
  },
  async (args) => handlers.recommendPage(args),
)

register(
  'generate_page',
  'Generate a Vue 3 + TypeScript page scaffold from intent, pattern, and design rules without writing files.',
  {
    intent: z.string().min(1),
    pageType: z.string().optional(),
    pattern: z.string().optional(),
    features: z.array(z.string()).max(20).optional(),
    mode: z.string().optional(),
    responsive: z.boolean().optional(),
  },
  async (args) => handlers.generatePage(args),
)

register(
  'create_page',
  'Preview or safely write a generated page inside the current project. Writing requires confirm: true.',
  {
    path: z.string().min(1),
    intent: z.string().min(1),
    pageType: z.string().optional(),
    pattern: z.string().optional(),
    features: z.array(z.string()).max(20).optional(),
    mode: z.string().optional(),
    responsive: z.boolean().optional(),
    confirm: z.boolean().optional(),
  },
  async (args) => handlers.createPage(args),
  {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: false,
  },
)

register(
  'get_design_rules',
  'Return design-token, semantic-action, accessibility, and composition rules for generated pages.',
  { mode: z.string().optional() },
  async (args) => handlers.getDesignRules(args),
)

register(
  'list_decisions',
  'List component selection decision guides for common UI choices.',
  {
    mode: z.string().optional(),
    limit: z.number().int().min(1).max(200).optional(),
    offset: z.number().int().min(0).optional(),
  },
  async (args) => handlers.listDecisions(args),
)

register(
  'get_decision',
  'Read bilingual guidance for choosing between related components.',
  {
    decision: z.string().min(1),
    mode: z.string().optional(),
  },
  async (args) => handlers.getDecision(args),
)

register(
  'recommend_component',
  'Recommend a component choice from a UI selection question.',
  {
    query: z.string().min(1),
    decision: z.string().optional(),
    mode: z.string().optional(),
  },
  async (args) => handlers.recommendComponent(args),
)

register(
  'validate_page',
  'Validate page-level component composition, interaction, accessibility, and design-token rules.',
  {
    pattern: z.string().optional(),
    code: z.string().optional(),
    components: z.array(z.string()).max(50).optional(),
    intent: z.string().optional(),
    strict: z.boolean().optional().describe('Enable additional static checks for dynamic bindings and incomplete snippets.'),
  },
  async (args) => handlers.validatePage(args),
)

register('version', 'Return MCP package, library version, and catalog status.', {}, async () =>
  handlers.version(),
)

const transport = new StdioServerTransport()
await server.connect(transport)
