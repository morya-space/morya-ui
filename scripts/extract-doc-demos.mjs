/**
 * Extract inline ```vue preview``` blocks into docs/demos/*.vue
 * and rewrite zh/en markdown to `src="./demos/..."`.
 *
 * - Identical zh/en bodies → shared `Name.vue`
 * - Differing bodies → `Name.zh.vue` + `Name.en.vue`
 * - Common layout inline styles → UnoCSS utilities where straightforward
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()

/** @typedef {{ heading: string, body: string, start: number, end: number, full: string }} PreviewBlock */

function extractPreviewBlocks(code) {
  /** @type {PreviewBlock[]} */
  const blocks = []
  const re = /```vue([^\n]*\bpreview\b[^\n]*)\n([\s\S]*?)```/g
  let m
  while ((m = re.exec(code))) {
    if (/\bsrc=/.test(m[1])) continue
    const before = code.slice(0, m.index)
    const headingMatch = [...before.matchAll(/^#{2,3}\s+([^\n]+)/gm)].at(-1)
    blocks.push({
      heading: headingMatch?.[1]?.trim() || `Demo ${blocks.length + 1}`,
      body: m[2].replace(/^\n/, '').replace(/\n$/, ''),
      start: m.index,
      end: m.index + m[0].length,
      full: m[0],
    })
  }
  return blocks
}

function slugify(heading) {
  // Prefer Latin tokens; fall back to transliteration-free PascalCase of remaining words.
  const latin = heading
    .replace(/&/g, ' and ')
    .replace(/[^A-Za-z0-9\s/-]+/g, ' ')
    .trim()
    .split(/[\s/-]+/)
    .filter(Boolean)

  if (latin.length) {
    return latin
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join('')
      .replace(/[^A-Za-z0-9]/g, '') || 'Demo'
  }

  // Non-Latin headings (e.g. 基础用法): keep a stable compact token
  return `Demo${Math.abs(hashString(heading)).toString(36).slice(0, 6)}`
}

function hashString(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return h
}

function uniqueNames(headings) {
  const used = new Map()
  return headings.map((h) => {
    let base = slugify(h) || 'Demo'
    if (/^\d/.test(base)) base = `Demo${base}`
    const key = base.toLowerCase()
    const count = (used.get(key) || 0) + 1
    used.set(key, count)
    return count === 1 ? base : `${base}${count}`
  })
}

const STYLE_MAP = [
  [
    /style="display:\s*flex;\s*flex-wrap:\s*wrap;\s*gap:\s*0\.75rem;\s*align-items:\s*center"/g,
    'class="flex flex-wrap gap-3 items-center"',
  ],
  [
    /style="display:\s*flex;\s*flex-wrap:\s*wrap;\s*gap:\s*0\.75rem"/g,
    'class="flex flex-wrap gap-3"',
  ],
  [
    /style="display:\s*flex;\s*flex-wrap:\s*wrap;\s*gap:\s*1rem;\s*align-items:\s*center"/g,
    'class="flex flex-wrap gap-4 items-center"',
  ],
  [
    /style="display:\s*flex;\s*flex-direction:\s*column;\s*gap:\s*0\.75rem"/g,
    'class="flex flex-col gap-3"',
  ],
  [
    /style="display:\s*flex;\s*flex-direction:\s*column;\s*gap:\s*0\.75rem;\s*max-width:\s*28rem"/g,
    'class="flex flex-col gap-3 max-w-md"',
  ],
  [
    /style="display:\s*flex;\s*flex-direction:\s*column;\s*gap:\s*1rem"/g,
    'class="flex flex-col gap-4"',
  ],
  [
    /style="display:\s*grid;\s*gap:\s*1rem;\s*width:\s*100%"/g,
    'class="grid gap-4 w-full"',
  ],
  [
    /style="display:\s*grid;\s*gap:\s*0\.75rem"/g,
    'class="grid gap-3"',
  ],
  [
    /style="display:\s*grid;\s*gap:\s*1rem"/g,
    'class="grid gap-4"',
  ],
  [/style="width:\s*100%"/g, 'class="w-full"'],
  [/style="width:10rem"/g, 'class="w-40"'],
  [/style="width:12rem"/g, 'class="w-48"'],
  [/style="width:14rem"/g, 'class="w-56"'],
  [/style="width:\s*10rem"/g, 'class="w-40"'],
  [/style="width:\s*12rem"/g, 'class="w-48"'],
  [/style="width:\s*14rem"/g, 'class="w-56"'],
  [/style="width:\s*24rem"/g, 'class="w-96"'],
  [/style="width:\s*28rem"/g, 'class="w-[28rem]"'],
  [/style="max-width:12rem;border-radius:0\.5rem"/g, 'class="max-w-48 rounded-lg"'],
  [/style="max-width:\s*12rem;\s*border-radius:\s*0\.5rem"/g, 'class="max-w-48 rounded-lg"'],
  [/style="max-width:\s*20rem;\s*margin-bottom:\s*1rem"/g, 'class="max-w-xs mb-4"'],
]

function applyUno(body) {
  let next = body
  for (const [re, replacement] of STYLE_MAP) {
    // replacement is like class="flex ..."
    const classes = replacement.match(/^class="([^"]*)"$/)?.[1]
    if (!classes) {
      next = next.replace(re, replacement)
      continue
    }
    next = next.replace(re, (match, offset, full) => {
      // Look back within the same opening tag for an existing class=
      const before = full.slice(Math.max(0, offset - 200), offset)
      const tagStart = before.lastIndexOf('<')
      if (tagStart === -1 || before.includes('>', tagStart)) return replacement
      const open = before.slice(tagStart)
      const existing = open.match(/\sclass="([^"]*)"/)
      if (!existing) return replacement
      // Drop the new class= attr; merge into existing via a marker rewrite after loop
      return `data-uno-merge="${classes}"`
    })
  }
  next = next.replace(
    /\sclass="([^"]*)"([^>]*?)\sdata-uno-merge="([^"]*)"/g,
    (_m, existing, mid, extra) => ` class="${existing} ${extra}"${mid}`,
  )
  next = next.replace(
    /\sdata-uno-merge="([^"]*)"([^>]*?)\sclass="([^"]*)"/g,
    (_m, extra, mid, existing) => ` class="${existing} ${extra}"${mid}`,
  )
  next = next.replace(/\sdata-uno-merge="([^"]*)"/g, ' class="$1"')
  next = next.replace(
    /class="([^"]*)"\s+class="([^"]*)"/g,
    (_m, a, b) => `class="${a} ${b}"`,
  )
  return next
}

function ensureDemoSfc(body) {
  const trimmed = body.trim()
  if (trimmed.includes('<script') || trimmed.includes('<template')) return `${trimmed}\n`
  // Rare: template-only fence
  return `<template>\n${trimmed}\n</template>\n`
}

function rewriteMarkdown(code, blocks, srcForIndex) {
  let out = ''
  let cursor = 0
  blocks.forEach((block, i) => {
    out += code.slice(cursor, block.start)
    const src = srcForIndex[i]
    out += `\`\`\`vue preview src="${src}"\n\`\`\``
    cursor = block.end
  })
  out += code.slice(cursor)
  return out
}

function processPair(zhPath, enPath, demosDir, label, srcPrefix = './demos') {
  const hasZh = fs.existsSync(zhPath)
  const hasEn = enPath && fs.existsSync(enPath)
  if (!hasZh && !hasEn) return { wrote: 0, rewritten: 0 }

  const zhCode = hasZh ? fs.readFileSync(zhPath, 'utf8') : ''
  const enCode = hasEn ? fs.readFileSync(enPath, 'utf8') : ''
  const zhBlocks = hasZh ? extractPreviewBlocks(zhCode) : []
  const enBlocks = hasEn ? extractPreviewBlocks(enCode) : []

  if (!zhBlocks.length && !enBlocks.length) return { wrote: 0, rewritten: 0 }

  const count = Math.max(zhBlocks.length, enBlocks.length)
  const headings = Array.from({ length: count }, (_, i) => {
    const en = enBlocks[i]?.heading
    const zh = zhBlocks[i]?.heading
    if (en && /[A-Za-z]/.test(en)) return en
    if (zh && /[A-Za-z]/.test(zh)) return zh
    return `Demo${i + 1}`
  })
  const names = uniqueNames(headings)

  fs.mkdirSync(demosDir, { recursive: true })

  /** @type {string[]} */
  const zhSrcs = []
  /** @type {string[]} */
  const enSrcs = []
  let wrote = 0

  for (let i = 0; i < count; i++) {
    const name = names[i]
    const zhBody = zhBlocks[i] ? applyUno(ensureDemoSfc(zhBlocks[i].body)) : null
    const enBody = enBlocks[i] ? applyUno(ensureDemoSfc(enBlocks[i].body)) : null

    if (zhBody && enBody && zhBody === enBody) {
      const file = `${name}.vue`
      fs.writeFileSync(path.join(demosDir, file), zhBody, 'utf8')
      wrote++
      zhSrcs[i] = `${srcPrefix}/${file}`
      enSrcs[i] = `${srcPrefix}/${file}`
    }
    else {
      if (zhBody) {
        const file = enBody ? `${name}.zh.vue` : `${name}.vue`
        fs.writeFileSync(path.join(demosDir, file), zhBody, 'utf8')
        wrote++
        zhSrcs[i] = `${srcPrefix}/${file}`
      }
      if (enBody) {
        const file = zhBody ? `${name}.en.vue` : `${name}.vue`
        fs.writeFileSync(path.join(demosDir, file), enBody, 'utf8')
        wrote++
        enSrcs[i] = `${srcPrefix}/${file}`
      }
    }
  }

  if (hasZh && zhBlocks.length) {
    fs.writeFileSync(zhPath, rewriteMarkdown(zhCode, zhBlocks, zhSrcs), 'utf8')
  }
  if (hasEn && enBlocks.length) {
    fs.writeFileSync(enPath, rewriteMarkdown(enCode, enBlocks, enSrcs), 'utf8')
  }

  console.log(`[ok] ${label}: ${wrote} demo file(s), zh=${zhBlocks.length} en=${enBlocks.length}`)
  return { wrote, rewritten: zhBlocks.length + enBlocks.length }
}

function main() {
  let wrote = 0
  let rewritten = 0

  const componentsDir = path.join(ROOT, 'src/components')
  for (const name of fs.readdirSync(componentsDir)) {
    const docsDir = path.join(componentsDir, name, 'docs')
    if (!fs.existsSync(docsDir)) continue
    const result = processPair(
      path.join(docsDir, 'index.md'),
      path.join(docsDir, 'index.en.md'),
      path.join(docsDir, 'demos'),
      name,
    )
    wrote += result.wrote
    rewritten += result.rewritten
  }

  // Guide pages with live previews (attrs / config / design-tokens). Skip meta-only pages.
  const guideDir = path.join(ROOT, 'playground/src/docs/guide')
  const guideSkip = new Set(['guide', 'introduction', 'loadGuideDocs'])
  const guideFiles = fs.readdirSync(guideDir).filter((f) => {
    if (!f.endsWith('.md') || f.endsWith('.en.md')) return false
    const base = f.replace(/\.md$/, '')
    return !guideSkip.has(base)
  })
  for (const file of guideFiles) {
    const base = file.replace(/\.md$/, '')
    const result = processPair(
      path.join(guideDir, file),
      path.join(guideDir, `${base}.en.md`),
      path.join(guideDir, 'demos', base),
      `guide/${base}`,
      `./demos/${base}`,
    )
    wrote += result.wrote
    rewritten += result.rewritten
  }

  console.log(`\nDone. Wrote ${wrote} demo SFCs, rewrote ${rewritten} preview fences.`)
}

main()
