/**
 * Repair broken attrs migration (withDefaults split + import glitches).
 */
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { readdir } from 'node:fs/promises'

const ROOT = new URL('../src/components', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')

async function walk(dir, out = []) {
  for (const name of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, name.name)
    if (name.isDirectory()) await walk(path, out)
    else if (name.name.endsWith('.vue')) out.push(path)
  }
  return out
}

function fixBrokenWithDefaults(src) {
  return src.replace(
    /(\s+\w+:\s*\(\))\s*\nconst attrs = useAttrs\(\)\s*\nconst \{ rootAttrs \} = useRootParts\(attrs, \(\) => props\.pt\)\s*\n => /g,
    '$1 => ',
  )
}

function fixBrokenImport(src) {
  return src.replace(
    /import type \{\nimport \{ useRootParts \} from '\.\.\/\.\.\/shared\/useComponentAttrs'\n/g,
    'import type {\n',
  )
}

function ensureAttrsAfterProps(src) {
  if (!src.includes('useRootParts') && !src.includes('useFieldParts')) return src
  if (src.includes('const attrs = useAttrs()')) return src

  const block = `const attrs = useAttrs()\nconst { rootAttrs } = useRootParts(attrs, () => props.pt)\n\n`
  const fieldBlock = `const attrs = useAttrs()\nconst { rootAttrs, controlAttrs } = useFieldParts(attrs, () => props.pt, { controlKey: 'input' })\n\n`
  const isField = src.includes('useFieldParts')

  // after withDefaults closing
  const withDefaults = src.match(
    /const props = withDefaults\(defineProps<[^>]+>\(\),\s*\{[\s\S]*?\}\)\s*\n/,
  )
  if (withDefaults) {
    const insertAt = withDefaults.index + withDefaults[0].length
    return src.slice(0, insertAt) + (isField ? fieldBlock : block) + src.slice(insertAt)
  }

  const defineProps = src.match(/const props = defineProps<[\s\S]*?>\(\)\s*\n/)
  if (defineProps) {
    const insertAt = defineProps.index + defineProps[0].length
    return src.slice(0, insertAt) + (isField ? fieldBlock : block) + src.slice(insertAt)
  }

  return src
}

function ensureDefineOptions(src) {
  if (/inheritAttrs\s*:\s*false/.test(src)) return src
  if (!src.includes('useRootParts') && !src.includes('useFieldParts')) return src
  if (/defineOptions\(/.test(src)) {
    return src.replace(/defineOptions\(\{([^}]*)\}\)/, (m, body) => {
      const inner = body.trim()
      return `defineOptions({ ${inner ? `${inner}, inheritAttrs: false` : 'inheritAttrs: false'} })`
    })
  }
  return src.replace(
    /<script setup lang="ts">\n/,
    `<script setup lang="ts">\n\ndefineOptions({ inheritAttrs: false })\n`,
  )
}

function ensureRootBind(src) {
  if (/v-bind="rootAttrs"/.test(src)) return src
  const templateIdx = src.indexOf('<template>')
  if (templateIdx === -1) return src
  const template = src.slice(templateIdx)

  let m = template.match(/(<[a-z][a-z0-9-]*)(\s[^>]*?:class="rootClass")/i)
  if (m) {
    return src.slice(0, templateIdx) + template.replace(m[0], `${m[1]} v-bind="rootAttrs"${m[2]}`)
  }

  const lines = template.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (/^\s*<(Teleport|Transition)\b/.test(line)) continue
    const tag = line.match(/^(\s*<[a-z][a-z0-9-]*)(\s)/i)
    if (!tag) continue
    if (/class="m-/.test(line) || /:class=/.test(line)) {
      lines[i] = line.replace(tag[0], `${tag[1]} v-bind="rootAttrs"${tag[2]}`)
      break
    }
  }
  return src.slice(0, templateIdx) + lines.join('\n')
}

function ensureTreeImport(src, filePath) {
  if (!filePath.endsWith('Tree.vue') || src.includes("from '../../shared/useComponentAttrs'")) {
    if (!src.includes("from '../../shared/useComponentAttrs'") && src.includes('useRootParts')) {
      // add import after types if missing
      const typesEnd = src.match(/} from '\.\/types'\n/)
      if (typesEnd) {
        src = src.replace(
          typesEnd[0],
          `${typesEnd[0]}import { useRootParts } from '../../shared/useComponentAttrs'\n`,
        )
      }
    }
    return src
  }
  return src
}

const files = await walk(ROOT)
let fixed = 0
for (const file of files) {
  let src = await readFile(file, 'utf8')
  const original = src
  src = fixBrokenWithDefaults(src)
  src = fixBrokenImport(src)
  src = ensureTreeImport(src, file)
  src = ensureAttrsAfterProps(src)
  src = ensureDefineOptions(src)
  src = ensureRootBind(src)
  if (src !== original) {
    await writeFile(file, src, 'utf8')
    fixed++
  }
}
console.log(`Fixed ${fixed} files`)
