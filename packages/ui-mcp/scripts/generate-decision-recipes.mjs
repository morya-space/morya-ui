#!/usr/bin/env node
/**
 * Generate design-kit skill offline decision recipes from packages/ui-mcp/src/decisions.ts
 * (single source of truth for MCP recommend_component + skill references).
 *
 * Usage (from packages/ui-mcp):
 *   node --experimental-strip-types ./scripts/generate-decision-recipes.mjs
 *   node --experimental-strip-types ./scripts/generate-decision-recipes.mjs --check
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkgRoot = resolve(__dirname, '..')
const repoRoot = resolve(pkgRoot, '../..')
const decisionsPath = join(pkgRoot, 'src', 'decisions.ts')
const outPath = join(
  repoRoot,
  'design-kit',
  '.agents',
  'skills',
  'morya-ui-pages',
  'references',
  'decision-recipes.md',
)

const check = process.argv.includes('--check')

const mod = await import(pathToFileURL(decisionsPath).href)
const { assertDecisionRecipes, componentDecisions } = mod

assertDecisionRecipes(componentDecisions)

function bullets(lines = []) {
  if (!lines.length) return ''
  return lines.map((line) => `- ${line}`).join('\n')
}

function renderOption(option) {
  const parts = [
    `### ${option.component}`,
    '',
    '**When**',
    '',
    bullets(option.when),
    '',
    '**Avoid when**',
    '',
    bullets(option.avoidWhen),
    '',
    '**Recipe · props**',
    '',
    bullets(option.recipe.props),
  ]

  if (option.recipe.slots?.length) {
    parts.push('', '**Recipe · slots**', '', bullets(option.recipe.slots))
  }
  if (option.recipe.events?.length) {
    parts.push('', '**Recipe · events**', '', bullets(option.recipe.events))
  }

  if (option.relatedSnippets?.length) {
    parts.push(
      '',
      '**Related snippets**',
      '',
      bullets(option.relatedSnippets.map((id) => `\`${id}\``)),
    )
  }

  parts.push('', '**Anti-patterns**', '', bullets(option.antiPatterns), '')
  return parts.join('\n')
}

function renderDecision(decision) {
  return [
    `## \`${decision.id}\` — ${decision.title}`,
    '',
    `> ${decision.question}`,
    '',
    ...decision.options.flatMap((option) => [renderOption(option), '']),
  ].join('\n')
}

const header = `# Decision recipes (scenario → component → key API)

Generated from \`packages/ui-mcp/src/decisions.ts\`. **Do not hand-edit** this file — run:

\`\`\`bash
pnpm --filter @morya-ui/mcp generate:recipes
\`\`\`

MCP: \`recommend_component\` (list / read by \`decision\` / query; options may include \`relatedSnippets\`). Full prop manuals still come from \`get_component\` + \`validate_usage\`. Prefer page snippets for composition; golden pages are optional block-order checks.

This file is the **offline** mirror for agents without MCP.

`

const body = componentDecisions.map(renderDecision).join('\n---\n\n')
const markdown = `${header}${body}`.trimEnd() + '\n'

if (check) {
  let existing = ''
  try {
    existing = readFileSync(outPath, 'utf8')
  } catch {
    console.error(`Missing generated file: ${outPath}`)
    process.exit(1)
  }
  if (existing !== markdown) {
    console.error('decision-recipes.md is out of date. Run: pnpm --filter @morya-ui/mcp generate:recipes')
    process.exit(1)
  }
  console.log('decision-recipes.md is up to date')
  process.exit(0)
}

writeFileSync(outPath, markdown, 'utf8')
console.log(`Wrote ${outPath} (${componentDecisions.length} decisions)`)
