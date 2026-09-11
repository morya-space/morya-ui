/**
 * Remove mistaken rootAttrs bindings and fix root placement.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const ROOT = new URL('../src/components', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')

const REMOVE_ROOT_BIND = [
  'Avatar/Avatar.vue',
  'Badge/Badge.vue',
  'Button/Button.vue',
  'Chip/Chip.vue',
  'Divider/Divider.vue',
  'Icon/Icon.vue',
  'ProgressBar/ProgressBar.vue',
  'Tag/Tag.vue',
  'ToggleButton/ToggleButton.vue',
  'ContextMenu/ContextMenuNodes.vue',
  'Dropdown/DropdownNodes.vue',
  'Menu/MenuNodes.vue',
  'Tree/TreeNodeItem.vue',
  'TreeSelect/TreeSelectNodeItem.vue',
  'TreeTable/TreeTableRow.vue',
  'InputGroup/InputGroupAddon.vue',
  'Message/Message.vue',
  'TieredMenu/TieredMenu.vue',
  'ConfirmPopup/ConfirmPopup.vue',
  'Drawer/Drawer.vue',
]

const MOVES = [
  {
    file: 'Pagination/Pagination.vue',
    from: '<button v-bind="rootAttrs" type="button" class="m-pagination__button" :disabled="disabled || currentPage === 1"',
    toNav: '<nav\n    v-bind="rootAttrs"\n    class="m-pagination"',
    removeFrom: ' v-bind="rootAttrs"',
    navOld: '<nav\n    class="m-pagination"',
  },
  {
    file: 'Dialog/Dialog.vue',
    from: '<div v-bind="rootAttrs" class="m-dialog-zoom"',
    to: '<div\n        v-bind="rootAttrs"\n        v-if="modelValue"\n        class="m-dialog-backdrop"',
    removeZoom: '<div v-bind="rootAttrs" class="m-dialog-zoom"',
    replaceZoom: '<div class="m-dialog-zoom"',
    backdropOld: `<div
        v-if="modelValue"
        class="m-dialog-backdrop"`,
  },
  {
    file: 'ConfirmDialog/ConfirmDialog.vue',
    sameAs: 'Dialog/Dialog.vue',
  },
  {
    file: 'Toast/Toast.vue',
    from: '<div v-bind="rootAttrs" class="m-toast__content">',
    to: '<div\n      v-bind="rootAttrs"\n      class="m-toast"',
    contentOld: '<div v-bind="rootAttrs" class="m-toast__content">',
    contentNew: '<div class="m-toast__content">',
    outerOld: `<div
      class="m-toast"`,
  },
  {
    file: 'Table/Table.vue',
    from: '<div v-bind="rootAttrs" class="m-table__surface"',
    to: '<div\n    v-bind="rootAttrs"\n    ref="dataTable"\n    class="m-table"',
    surfaceOld: '<div v-bind="rootAttrs" class="m-table__surface"',
    surfaceNew: '<div class="m-table__surface"',
    outerOld: `<div
    ref="dataTable"
    class="m-table"`,
  },
]

async function removeRootBind(rel) {
  const path = join(ROOT, rel)
  let src = await readFile(path, 'utf8')
  const next = src.replace(/\s*v-bind="rootAttrs"/g, '')
  if (next !== src) {
    await writeFile(path, next, 'utf8')
    return true
  }
  return false
}

async function addDefineOptions(rel) {
  const path = join(ROOT, rel)
  let src = await readFile(path, 'utf8')
  if (/inheritAttrs\s*:\s*false/.test(src)) return false
  if (!src.includes('useRootParts')) return false
  src = src.replace(
    /<script setup lang="ts">\n/,
    `<script setup lang="ts">\n\ndefineOptions({ inheritAttrs: false })\n`,
  )
  await writeFile(path, src, 'utf8')
  return true
}

async function fixPagination() {
  const path = join(ROOT, 'Pagination/Pagination.vue')
  let src = await readFile(path, 'utf8')
  src = src.replace(
    '<nav\n    class="m-pagination"',
    '<nav\n    v-bind="rootAttrs"\n    class="m-pagination"',
  )
  src = src.replace(
    '<button v-bind="rootAttrs" type="button" class="m-pagination__button" :disabled="disabled || currentPage === 1"',
    '<button type="button" class="m-pagination__button" :disabled="disabled || currentPage === 1"',
  )
  await writeFile(path, src, 'utf8')
}

async function fixDialogLike(rel) {
  const path = join(ROOT, rel)
  let src = await readFile(path, 'utf8')
  src = src.replace(
    `<div
        v-if="modelValue"
        class="m-dialog-backdrop"`,
    `<div
        v-if="modelValue"
        v-bind="rootAttrs"
        class="m-dialog-backdrop"`,
  )
  src = src.replace('<div v-bind="rootAttrs" class="m-dialog-zoom"', '<div class="m-dialog-zoom"')
  await writeFile(path, src, 'utf8')
}

async function fixToast() {
  const path = join(ROOT, 'Toast/Toast.vue')
  let src = await readFile(path, 'utf8')
  src = src.replace(
    `<div
      class="m-toast"`,
    `<div
      v-bind="rootAttrs"
      class="m-toast"`,
  )
  src = src.replace('<div v-bind="rootAttrs" class="m-toast__content">', '<div class="m-toast__content">')
  await writeFile(path, src, 'utf8')
}

async function fixTable() {
  const path = join(ROOT, 'Table/Table.vue')
  let src = await readFile(path, 'utf8')
  src = src.replace(
    `<div
    ref="dataTable"
    class="m-table"`,
    `<div
    v-bind="rootAttrs"
    ref="dataTable"
    class="m-table"`,
  )
  src = src.replace('<div v-bind="rootAttrs" class="m-table__surface"', '<div class="m-table__surface"')
  await writeFile(path, src, 'utf8')
}

async function fixTree() {
  const path = join(ROOT, 'Tree/Tree.vue')
  let src = await readFile(path, 'utf8')
  if (!src.includes("from '../../shared/useComponentAttrs'")) {
    src = src.replace(
      "} from './types'\n",
      "} from './types'\nimport { useRootParts } from '../../shared/useComponentAttrs'\n",
    )
  }
  if (!src.includes('const attrs = useAttrs()')) {
    src = src.replace(
      /(\}\)\s*\n\nconst emit = defineEmits)/,
      `})\nconst attrs = useAttrs()\nconst { rootAttrs } = useRootParts(attrs, () => props.pt)\n\nconst emit = defineEmits`,
    )
  }
  await writeFile(path, src, 'utf8')
}

async function fixLayoutImports() {
  for (const rel of [
    'Layout/Layout.vue',
    'Layout/LayoutContent.vue',
    'Layout/LayoutFooter.vue',
    'Layout/LayoutHeader.vue',
    'Layout/LayoutSider.vue',
    'Fieldset/Fieldset.vue',
  ]) {
    const path = join(ROOT, rel)
    let src = await readFile(path, 'utf8')
    let changed = false
    if (src.includes('useAttrs()') && !src.match(/import\s+\{[^}]*useAttrs/)) {
      src = src.replace(/from 'vue'/, (m) => {
        changed = true
        return m
      })
      src = src.replace(
        /import \{([^}]+)\} from 'vue'/,
        (m, names) => {
          const list = names.split(',').map((s) => s.trim()).filter(Boolean)
          if (!list.includes('useAttrs')) list.push('useAttrs')
          return `import { ${list.join(', ')} } from 'vue'`
        },
      )
      src = src.replace(/from "vue"/, (m) => m)
      src = src.replace(
        /import \{([^}]+)\} from "vue"/,
        (m, names) => {
          const list = names.split(',').map((s) => s.trim()).filter(Boolean)
          if (!list.includes('useAttrs')) list.push('useAttrs')
          return `import { ${list.join(', ')} } from "vue"`
        },
      )
    }
    src = src.replace('\n;\n\nconst emit', '\n\nconst emit')
    if (changed || src.includes('\n;\n')) {
      await writeFile(path, src, 'utf8')
    }
  }
}

async function addPtToTypes(rel, iface) {
  const path = join(ROOT, rel)
  let src
  try {
    src = await readFile(path, 'utf8')
  } catch {
    return false
  }
  if (/pt\s*\?:/.test(src)) return false
  if (!src.includes('RootPassThrough')) {
    src = `import type { RootPassThrough } from '../../shared/passThrough'\n${src}`
  }
  src = src.replace(
    new RegExp(`(export interface ${iface}\\s*\\{)`),
    `$1\n  pt?: RootPassThrough`,
  )
  await writeFile(path, src, 'utf8')
  return true
}

let n = 0
for (const rel of REMOVE_ROOT_BIND) {
  if (await removeRootBind(rel)) n++
}
for (const rel of ['Card/Card.vue', 'Dialog/Dialog.vue', 'Tabs/Tabs.vue', 'Table/Table.vue', 'Toast/Toast.vue']) {
  if (await addDefineOptions(rel)) n++
}
await fixPagination()
await fixDialogLike('Dialog/Dialog.vue')
await fixDialogLike('ConfirmDialog/ConfirmDialog.vue')
await fixToast()
await fixTable()
await fixTree()
await fixLayoutImports()

const ptFixes = [
  ['Avatar/types.ts', 'AvatarGroupProps'],
  ['Button/types.ts', 'ButtonGroupProps'],
  ['Checkbox/types.ts', 'CheckboxGroupProps'],
  ['ConfirmDialog/types.ts', 'ConfirmDialogProps'],
  ['ConfirmPopup/types.ts', 'ConfirmPopupProps'],
  ['FileUpload/types.ts', 'FileUploadProps'],
  ['Layout/types.ts', 'LayoutContentProps'],
  ['Layout/types.ts', 'LayoutFooterProps'],
  ['Layout/types.ts', 'LayoutHeaderProps'],
  ['Layout/types.ts', 'LayoutSiderProps'],
  ['Radio/types.ts', 'RadioGroupProps'],
  ['Terminal/types.ts', 'TerminalProps'],
]

for (const [rel, iface] of ptFixes) {
  if (await addPtToTypes(rel, iface)) n++
}

// Layout types may have multiple interfaces - handle LayoutContentProps etc separately
const layoutTypesPath = join(ROOT, 'Layout/types.ts')
let layoutTypes = await readFile(layoutTypesPath, 'utf8')
if (!layoutTypes.includes('RootPassThrough')) {
  layoutTypes = `import type { RootPassThrough } from '../../shared/passThrough'\n${layoutTypes}`
}
for (const iface of ['LayoutProps', 'LayoutContentProps', 'LayoutFooterProps', 'LayoutHeaderProps', 'LayoutSiderProps']) {
  if (!new RegExp(`${iface}[\\s\\S]*?pt\\s*\\?:`).test(layoutTypes)) {
    layoutTypes = layoutTypes.replace(
      new RegExp(`(export interface ${iface}\\s*\\{)`),
      `$1\n  pt?: RootPassThrough`,
    )
  }
}
await writeFile(layoutTypesPath, layoutTypes, 'utf8')

// FileUpload needs FieldPassThrough not RootPassThrough
const fuTypesPath = join(ROOT, 'FileUpload/types.ts')
let fuTypes = await readFile(fuTypesPath, 'utf8')
if (!fuTypes.includes('FieldPassThrough')) {
  fuTypes = fuTypes.replace(
    /import type \{ RootPassThrough \}/,
    'import type { FieldPassThrough }',
  )
  if (!fuTypes.includes('FieldPassThrough')) {
    fuTypes = `import type { FieldPassThrough } from '../../shared/passThrough'\n${fuTypes}`
  }
  fuTypes = fuTypes.replace('pt?: RootPassThrough', 'pt?: FieldPassThrough')
  if (!fuTypes.includes('pt?: FieldPassThrough')) {
    fuTypes = fuTypes.replace(
      /(export interface FileUploadProps\s*\{)/,
      `$1\n  pt?: FieldPassThrough`,
    )
  }
  await writeFile(fuTypesPath, fuTypes, 'utf8')
}

console.log(`Cleanup touched ${n}+ files`)
