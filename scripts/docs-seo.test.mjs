import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  absoluteUrl,
  buildRobotsTxt,
  buildSitemapXml,
  injectSeoIntoHtml,
  parseYamlFrontmatter,
  prepareMarkdownBody,
  SITE_ORIGIN,
} from './docs-seo.mjs'

function closeTag(name) {
  return '<' + '/' + name + '>'
}

describe('docs-seo', () => {
  it('parses frontmatter and strips preview fences', () => {
    const raw = `---
title: Button
description: trigger actions
---

# Button

hello

\`\`\`vue preview src="./demos/Basic.vue"
\`\`\`

more
`
    assert.deepEqual(parseYamlFrontmatter(raw), {
      title: 'Button',
      description: 'trigger actions',
    })
    const body = prepareMarkdownBody(raw)
    assert.match(body, /hello/)
    assert.match(body, /more/)
    assert.equal(body.includes('preview'), false)
  })

  it('injects meta and seo body into spa shell', () => {
    const html = [
      '<!doctype html>',
      '<html>',
      '  <head>',
      '    <meta',
      '      name="description"',
      '      content="old"',
      '    />',
      '    <meta property="og:title" content="old" />',
      '    <link rel="canonical" href="https://example.com/" />',
      '    <title>Old' + closeTag('title'),
      '  ' + closeTag('head'),
      '  <body>',
      '    <div id="app"></div>',
      '  ' + closeTag('body'),
      closeTag('html'),
    ].join('\n')

    const next = injectSeoIntoHtml(html, {
      title: 'Quick start · Morya UI',
      description: 'Install and use Morya UI',
      canonical: `${SITE_ORIGIN}/docs/quick-start`,
      bodyHtml: '<p>Install</p>',
    })

    assert.match(next, /Quick start · Morya UI/)
    assert.match(next, /Install and use Morya UI/)
    assert.match(next, new RegExp(`${SITE_ORIGIN}/docs/quick-start`))
    assert.match(next, /data-seo-prerender/)
    assert.match(next, /<p>Install<\/p>/)
  })

  it('builds sitemap and robots', () => {
    const sitemap = buildSitemapXml(['', 'docs/quick-start', 'components/Button'])
    assert.match(sitemap, new RegExp(`<loc>${absoluteUrl(SITE_ORIGIN, '')}`))
    assert.match(sitemap, new RegExp(`<loc>${SITE_ORIGIN}/docs/quick-start`))
    assert.match(buildRobotsTxt(), new RegExp(`Sitemap: ${SITE_ORIGIN}/sitemap.xml`))
  })
})
