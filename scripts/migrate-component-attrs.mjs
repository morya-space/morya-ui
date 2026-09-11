/**
 * Batch-migrate public components to hybrid attrs (useRootParts / useFieldParts).
 * Run: node scripts/migrate-component-attrs.mjs
 */
import { readFile, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'

const ROOT = new URL('../src/components', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')

const FIELD_COMPONENTS = new Set(['FileUpload/FileUpload.vue'])

const MUST_FIX = [
  'Accordion/Accordion.vue',
  'Avatar/AvatarGroup.vue',
  'BlockUI/BlockUI.vue',
  'Breadcrumb/Breadcrumb.vue',
  'Button/ButtonGroup.vue',
  'Card/Card.vue',
  'Carousel/Carousel.vue',
  'Checkbox/CheckboxGroup.vue',
  'CommandMenu/CommandMenu.vue',
  'ConfigProvider/ConfigProvider.vue',
  'ConfirmDialog/ConfirmDialog.vue',
  'ConfirmPopup/ConfirmPopup.vue',
  'ContextMenu/ContextMenu.vue',
  'DataView/DataView.vue',
  'Dialog/Dialog.vue',
  'Dock/Dock.vue',
  'Drawer/Drawer.vue',
  'Fieldset/Fieldset.vue',
  'FileUpload/FileUpload.vue',
  'Flex/Flex.vue',
  'Fluid/Fluid.vue',
  'Gallery/Gallery.vue',
  'Inplace/Inplace.vue',
  'Layout/Layout.vue',
  'Layout/LayoutContent.vue',
  'Layout/LayoutFooter.vue',
  'Layout/LayoutHeader.vue',
  'Layout/LayoutSider.vue',
  'MegaMenu/MegaMenu.vue',
  'Menu/Menu.vue',
  'Menubar/Menubar.vue',
  'Message/Message.vue',
  'MeterGroup/MeterGroup.vue',
  'OrderList/OrderList.vue',
  'Pagination/Pagination.vue',
  'Panel/Panel.vue',
  'PickList/PickList.vue',
  'Popover/Popover.vue',
  'ProgressSpinner/ProgressSpinner.vue',
  'Radio/RadioGroup.vue',
  'ScrollTop/ScrollTop.vue',
  'Scrollbar/Scrollbar.vue',
  'SelectButton/SelectButton.vue',
  'Sidebar/Sidebar.vue',
  'Skeleton/Skeleton.vue',
  'Space/Space.vue',
  'SpeedDial/SpeedDial.vue',
  'SplitButton/SplitButton.vue',
  'Splitter/Splitter.vue',
  'Stepper/Stepper.vue',
  'Table/Table.vue',
  'Tabs/Tabs.vue',
  'Terminal/Terminal.vue',
  'TieredMenu/TieredMenu.vue',
  'Timeline/Timeline.vue',
  'Toast/Toast.vue',
  'Toolbar/Toolbar.vue',
  'Tree/Tree.vue',
  'TreeTable/TreeTable.vue',
  'VirtualScroller/VirtualScroller.vue',
]

function propsInterfaceName(componentDir) {
  const base = componentDir.split('/').pop()
  return `${base}Props`
}

async function migrateTypes(typesPath, isField) {
  const ptType = isField ? 'FieldPassThrough' : 'RootPassThrough'
  let src
  try {
    src = await readFile(typesPath, 'utf8')
  } catch {
    return false
  }

  if (/pt\s*\?:/.test(src)) {
    if (!src.includes(ptType)) {
      // existing pt with different type — leave as-is
    }
    return false
  }

  if (!src.includes(`import type { ${ptType}`)) {
    if (src.includes("from '../../shared/passThrough'")) {
      src = src.replace(
        /import type \{([^}]+)\} from '\.\.\/\.\.\/shared\/passThrough'/,
        (m, types) => {
          const list = types.split(',').map((t) => t.trim()).filter(Boolean)
          if (!list.includes(ptType)) list.push(ptType)
          return `import type { ${list.join(', ')} } from '../../shared/passThrough'`
        },
      )
    } else {
      src = `import type { ${ptType} } from '../../shared/passThrough'\n${src}`
    }
  }

  const iface = src.match(/export interface (\w+Props)\s*\{/)
  if (!iface) return false

  src = src.replace(
    new RegExp(`(export interface ${iface[1]}\\s*\\{)`),
    `$1\n  pt?: ${ptType}`,
  )
  await writeFile(typesPath, src, 'utf8')
  return true
}

function ensureVueImport(src, name) {
  const vueImport = src.match(/import\s+\{([^}]+)\}\s+from\s+'vue'/)
  if (!vueImport) return src
  const names = vueImport[1].split(',').map((s) => s.trim()).filter(Boolean)
  if (!names.includes(name)) {
    names.push(name)
    names.sort((a, b) => a.localeCompare(b))
    src = src.replace(vueImport[0], `import { ${names.join(', ')} } from 'vue'`)
  }
  return src
}

function ensureComposableImport(src, composable) {
  const path = '../../shared/useComponentAttrs'
  if (src.includes(composable)) return src
  const existing = src.match(
    new RegExp(`import\\s+\\{([^}]+)\\}\\s+from\\s+'${path.replace(/\//g, '\\/')}'`),
  )
  if (existing) {
    const names = existing[1].split(',').map((s) => s.trim()).filter(Boolean)
    if (!names.includes(composable)) names.push(composable)
    src = src.replace(existing[0], `import { ${names.join(', ')} } from '${path}'`)
  } else {
    const insertAfter = src.match(/^import .+$/m)
    const importLine = `import { ${composable} } from '${path}'\n`
    if (insertAfter) {
      src = src.replace(insertAfter[0], `${insertAfter[0]}\n${importLine.trim()}`)
    } else {
      src = importLine + src
    }
  }
  return src
}

function ensureDefineOptions(src) {
  if (/inheritAttrs\s*:\s*false/.test(src)) return src
  const opts = src.match(/defineOptions\(\{([^}]*)\}\)/)
  if (opts) {
    const body = opts[1].trim()
    const inner = body ? `${body}, inheritAttrs: false` : 'inheritAttrs: false'
    return src.replace(opts[0], `defineOptions({ ${inner} })`)
  }
  return src.replace(
    /<script setup lang="ts">\n/,
    `<script setup lang="ts">\n\ndefineOptions({ inheritAttrs: false })\n`,
  )
}

function injectAttrsSetup(src, composable, field = false) {
  if (src.includes('useRootParts') || src.includes('useFieldParts')) return src

  src = ensureVueImport(src, 'useAttrs')
  src = ensureComposableImport(src, composable)

  const destructuring = field
    ? 'const { rootAttrs, controlAttrs } = useFieldParts(attrs, () => props.pt, { controlKey: \'input\' })'
    : 'const { rootAttrs } = useRootParts(attrs, () => props.pt)'

  if (src.includes('const attrs = useAttrs()')) {
    if (!src.includes(destructuring)) {
      src = src.replace(
        /const attrs = useAttrs\(\)\n/,
        `const attrs = useAttrs()\n${destructuring}\n`,
      )
    }
    return src
  }

  const propsMatch = src.match(/const props = (withDefaults\(defineProps[^)]+\([^)]*\)[^)]*\)|defineProps[^;]+;)/)
  if (propsMatch) {
    const insertAt = propsMatch.index + propsMatch[0].length
    const block = `\nconst attrs = useAttrs()\n${destructuring}\n`
    return src.slice(0, insertAt) + block + src.slice(insertAt)
  }

  // inline defineProps without const props (ConfigProvider)
  const inlineProps = src.match(/const props = defineProps<\{[\s\S]*?\}>\(\)/)
  if (inlineProps) {
    const insertAt = inlineProps.index + inlineProps[0].length
    const block = `\nconst attrs = useAttrs()\n${destructuring}\n`
    return src.slice(0, insertAt) + block + src.slice(insertAt)
  }

  return src
}

function addRootBind(src) {
  if (/v-bind="rootAttrs"/.test(src)) return src

  const templateIdx = src.indexOf('<template>')
  if (templateIdx === -1) return src
  const template = src.slice(templateIdx)

  // Prefer :class="rootClass"
  let m = template.match(/(<[a-z][a-z0-9-]*)(\s[^>]*?:class="rootClass")/i)
  if (m && !m[0].includes('v-bind="rootAttrs"')) {
    const replaced = template.replace(m[0], `${m[1]} v-bind="rootAttrs"${m[2]}`)
    return src.slice(0, templateIdx) + replaced
  }

  // class="m-*" on first substantive element (skip Teleport/Transition)
  const lines = template.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (/^\s*<(Teleport|Transition)\b/.test(line)) continue
    const tag = line.match(/^(\s*<[a-z][a-z0-9-]*)(\s)/i)
    if (!tag) continue
    if (line.includes('v-bind="rootAttrs"')) break
    if (/class="m-/.test(line) || /:class=/.test(line) || /:class="/.test(line)) {
      lines[i] = line.replace(tag[0], `${tag[1]} v-bind="rootAttrs"${tag[2]}`)
      break
    }
  }

  return src.slice(0, templateIdx) + lines.join('\n')
}

function addControlBind(src) {
  if (/v-bind="controlAttrs"/.test(src)) return src
  return src.replace(
    /(<input[^>]*ref="inputRef"[^>]*)(>)/,
    '$1 v-bind="controlAttrs"$2',
  )
}

function migrateConfigProviderTypes(src) {
  if (/pt\s*\?:/.test(src)) return src
  if (!src.includes('RootPassThrough')) {
    src = src.replace(
      /<script setup lang="ts">\n/,
      `<script setup lang="ts">\nimport type { RootPassThrough } from '../../shared/passThrough'\n`,
    )
  }
  return src.replace(
    /(globalDensity\?: boolean\n)(\}\>\(\))/,
    `$1  pt?: RootPassThrough\n$2`,
  )
}

async function migrateOne(rel) {
  const vuePath = join(ROOT, rel)
  const componentDir = dirname(rel)
  const typesPath = join(ROOT, componentDir, 'types.ts')
  const isField = FIELD_COMPONENTS.has(rel)
  const composable = isField ? 'useFieldParts' : 'useRootParts'

  let src = await readFile(vuePath, 'utf8')
  if (src.includes(composable) && /inheritAttrs\s*:\s*false/.test(src)) {
    return { rel, status: 'skip' }
  }

  if (rel === 'ConfigProvider/ConfigProvider.vue') {
    src = migrateConfigProviderTypes(src)
  } else {
    await migrateTypes(typesPath, isField).catch(() => {})
  }

  src = ensureDefineOptions(src)
  src = injectAttrsSetup(src, composable, isField)
  src = addRootBind(src)
  if (isField) src = addControlBind(src)

  await writeFile(vuePath, src, 'utf8')
  return { rel, status: 'ok' }
}

const results = []
for (const rel of MUST_FIX) {
  results.push(await migrateOne(rel))
}

console.log('Migration results:')
for (const r of results) console.log(`  ${r.status.padEnd(5)} ${r.rel}`)
console.log(`\nDone: ${results.filter((r) => r.status === 'ok').length} migrated`)
