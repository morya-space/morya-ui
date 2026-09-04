import { describe, expect, it } from 'vitest'
import { createToolHandlers } from '../tools.js'
import { countCatalogResourceTemplates, countCatalogResources } from '../resources.js'

describe('@wex-design/ui-mcp resources', () => {
  const handlers = createToolHandlers()

  it('registers static resources and resource templates', () => {
    expect(countCatalogResources(handlers.catalog)).toBeGreaterThan(100)
    expect(countCatalogResourceTemplates()).toBe(3)
  })
})
