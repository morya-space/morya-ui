#!/usr/bin/env node
/**
 * 文档-实现对账脚本（修复手册 T0.6，报告模式）。
 *
 * 对每个 src/components/<Name>/ 比对三方数据：
 *   文档  docs/index.md —— Props/Events/Slots 表格 + 示例代码中的 #slot / v-slot 写法
 *   类型  types.ts      —— <Name>*Props / <Name>*Emits interface 与 export type 别名
 *   模板  <Name>.vue 及同目录子组件 —— <slot> 标签、useSlots()/$slots 引用、
 *         defineProps/defineEmits（含内联泛型块）、emit()/$emit() 调用
 *
 * 输出四类漂移：
 *   docs-only        文档有实现无
 *   impl-only        实现有文档无（public API 层面；@internal 标记忽略）
 *   type-mismatch    同名 prop 类型疑似不一致（保守启发式，需人工确认）
 *   declared-unused  types.ts 声明但源码无引用 / 无 emit 调用（启发式，需人工确认）
 *
 * 用法：
 *   node ai-design-config/scripts/check-docs-drift.mjs                     打印控制台报告
 *   node ai-design-config/scripts/check-docs-drift.mjs --component Select  只查一个组件
 *   node ai-design-config/scripts/check-docs-drift.mjs --json              输出 JSON
 *   node ai-design-config/scripts/check-docs-drift.mjs --md [path]         生成 Markdown 报告
 *       （path 缺省为 audits/docs-drift-report.md）
 *
 * 报告模式：无论是否存在漂移，exit code 恒为 0。
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const COMPONENTS_DIR = path.join(REPO_ROOT, 'src', 'components')
const DEFAULT_MD_PATH = path.join(REPO_ROOT, 'audits', 'docs-drift-report.md')

// ---------- CLI ----------
const opts = { component: null, json: false, md: null }
const argv = process.argv.slice(2)
for (let i = 0; i < argv.length; i += 1) {
  const arg = argv[i]
  if (arg === '--json') opts.json = true
  else if (arg === '--component' || arg === '-c') {
    i += 1
    opts.component = argv[i]
  } else if (arg.startsWith('--component=')) opts.component = arg.slice('--component='.length)
  else if (arg === '--md') {
    const next = argv[i + 1]
    if (next && !next.startsWith('--')) {
      i += 1
      opts.md = next
    } else {
      opts.md = DEFAULT_MD_PATH
    }
  } else if (arg.startsWith('--md=')) opts.md = arg.slice('--md='.length)
}

// ---------- 通用工具 ----------
function lineOf(text, index) {
  let line = 1
  for (let i = 0; i < index && i < text.length; i += 1) if (text[i] === '\n') line += 1
  return line
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** 从 openIndex（'{' 位置）做花括号配对，忽略字符串与注释内容。返回配对 '}' 的下标。 */
function braceMatch(text, openIndex) {
  let depth = 0
  let i = openIndex
  while (i < text.length) {
    const ch = text[i]
    if (ch === "'" || ch === '"' || ch === '`') {
      const quote = ch
      i += 1
      while (i < text.length && text[i] !== quote) {
        if (text[i] === '\\') i += 1
        i += 1
      }
    } else if (ch === '/' && text[i + 1] === '/') {
      while (i < text.length && text[i] !== '\n') i += 1
      continue
    } else if (ch === '/' && text[i + 1] === '*') {
      const end = text.indexOf('*/', i + 2)
      i = end === -1 ? text.length : end + 2
      continue
    } else if (ch === '{') {
      depth += 1
    } else if (ch === '}') {
      depth -= 1
      if (depth === 0) return i
    }
    i += 1
  }
  return text.length
}

/** () {} [] 是否平衡（用于类型文本续行判断）。 */
function shallowBalanced(text) {
  let depth = 0
  for (const ch of text) {
    if (ch === '(' || ch === '{' || ch === '[') depth += 1
    else if (ch === ')' || ch === '}' || ch === ']') depth -= 1
  }
  return depth <= 0
}

// ---------- types.ts 解析 ----------
/**
 * 返回 {
 *   interfaces: Map<name, { line, internal, fields: Map<name,{line,type,internal}>, events: [{name,line}] }>,
 *   aliases:    Map<name, { line, type }>,
 *   typeNames:  Set<string>   // 本文件定义的所有类型名（interface + type alias）
 * }
 */
function parseTypesFile(text) {
  const interfaces = new Map()
  const aliases = new Map()
  const typeNames = new Set()

  const ifaceRe = /(?:^|\n)[ \t]*(?:export[ \t]+)?interface[ \t]+([A-Za-z_$][\w$]*)[^\n{]*\{/g
  let m
  while ((m = ifaceRe.exec(text))) {
    const name = m[1]
    typeNames.add(name)
    const open = text.indexOf('{', m.index + m[0].length - 1)
    const close = braceMatch(text, open)
    const body = text.slice(open + 1, close)
    // interface 级别 @internal（声明前最后一个 JSDoc 块）
    const before = text.slice(Math.max(0, m.index - 400), m.index)
    const internal = /@internal/.test(before.slice(before.lastIndexOf('/**')))
    const bodyBase = lineOf(text, open)
    const bodyLines = body.split(/\r?\n/)
    const fields = new Map()
    const events = []
    let pendingComment = ''
    for (let k = 0; k < bodyLines.length; k += 1) {
      const raw = bodyLines[k]
      const trimmed = raw.trim()
      const lineNo = bodyBase + k
      if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) {
        pendingComment += `${trimmed}\n`
        continue
      }
      // 事件调用签名：(event: 'name', ...)
      const evRe = /\(\s*event:\s*['"]([^'"]+)['"]/g
      let ev
      let matchedEvent = false
      while ((ev = evRe.exec(raw))) {
        events.push({ name: ev[1], line: lineNo })
        matchedEvent = true
      }
      if (matchedEvent || trimmed.startsWith('(') || trimmed.startsWith('[')) {
        pendingComment = ''
        continue
      }
      const fm = raw.match(/^\s*(?:readonly\s+)?([A-Za-z_$][\w$]*)\s*\??\s*:\s*(.*)$/)
      if (fm) {
        let type = fm[2].replace(/;+\s*$/, '').trim()
        // 类型跨行续接：括号未平衡或以 | 结尾时向下合并
        let k2 = k
        while ((!shallowBalanced(type) || /\|\s*$/.test(type)) && k2 + 1 < bodyLines.length) {
          k2 += 1
          type += ` ${bodyLines[k2].trim()}`
        }
        k = k2
        fields.set(fm[1], { line: lineNo, type, internal: internal || /@internal/.test(pendingComment) })
      }
      pendingComment = ''
    }
    interfaces.set(name, { line: lineOf(text, m.index), internal, fields, events })
  }

  const aliasRe = /(?:^|\n)[ \t]*(?:export[ \t]+)?type[ \t]+([A-Za-z_$][\w$]*)[ \t]*=[ \t]*/g
  while ((m = aliasRe.exec(text))) {
    const name = m[1]
    typeNames.add(name)
    const startOffset = m.index + m[0].length
    let endOffset = text.indexOf('\n', startOffset)
    if (endOffset === -1) endOffset = text.length
    let typeText = text.slice(startOffset, endOffset)
    // 续行：有效行（忽略注释/空行）未平衡、以 | 结尾、或下一有效行以 | 开头时继续合并
    let guard = 0
    while (endOffset < text.length && guard < 60) {
      guard += 1
      const sigLines = typeText
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith('//') && !l.startsWith('/*') && !l.startsWith('*'))
      const lastSig = sigLines[sigLines.length - 1] ?? ''
      // 向下窥视下一有效行
      let nextSig = ''
      let peek = endOffset + 1
      while (peek < text.length) {
        const nl = text.indexOf('\n', peek)
        const l = (nl === -1 ? text.slice(peek) : text.slice(peek, nl)).trim()
        if (l && !l.startsWith('//') && !l.startsWith('/*') && !l.startsWith('*')) {
          nextSig = l
          break
        }
        if (nl === -1) break
        peek = nl + 1
      }
      if (lastSig && shallowBalanced(sigLines.join('\n')) && !lastSig.endsWith('|') && !nextSig.startsWith('|')) break
      const nextNL = text.indexOf('\n', endOffset + 1)
      if (nextNL === -1) {
        typeText += `\n${text.slice(endOffset + 1)}`
        endOffset = text.length
        break
      }
      typeText += `\n${text.slice(endOffset + 1, nextNL)}`
      endOffset = nextNL
    }
    aliases.set(name, { line: lineOf(text, m.index), type: typeText.replace(/;+\s*$/, '').trim() })
  }
  return { interfaces, aliases, typeNames }
}

const KNOWN_GLOBAL_TYPES = new Set([
  'Date', 'RegExp', 'HTMLElement', 'Element', 'Record', 'Array', 'Promise', 'Partial',
  'Required', 'Pick', 'Omit', 'Readonly', 'ReadonlyArray', 'Map', 'Set', 'Function',
  'Object', 'String', 'Number', 'Boolean', 'MouseEvent', 'KeyboardEvent', 'Event',
  'DragEvent', 'FocusEvent', 'InputEvent', 'Error', 'Component', 'VNode', 'CSSProperties',
])

/** 用本文件 export type 别名递归展开类型文本（深度受限，防循环）。 */
function expandType(typeText, aliases, depth = 0, seen = new Set()) {
  if (depth > 5) return typeText
  return typeText.replace(/\b[A-Za-z_$][\w$]*\b/g, (id) => {
    if (!aliases.has(id) || seen.has(id)) return id
    const next = new Set(seen)
    next.add(id)
    return `( ${expandType(aliases.get(id).type, aliases, depth + 1, next)} )`
  })
}

/** 提取类型文本中的字符串字面量（单/双引号均可）。 */
function extractLiterals(text) {
  const out = []
  for (const lm of text.matchAll(/'([^']+)'|"([^"]+)"/g)) out.push(lm[1] ?? lm[2])
  return out
}

/** 本文件 interface 展开为内联对象形态 `{ 字段: 类型; ... }`，供类型比对（排除 Emits / 无字段接口）。 */
function interfaceExpansions(parsed) {
  const map = new Map()
  for (const [name, iface] of parsed.interfaces) {
    if (/Emits$/.test(name) || !iface.fields.size) continue
    const body = [...iface.fields].map(([fname, f]) => `${fname}: ${f.type || 'unknown'}`).join('; ')
    map.set(name, { line: iface.line, type: `{ ${body} }` })
  }
  return map
}

/**
 * 保守的类型一致性检查：字面量与基础类型做单向包含校验。
 * 返回 null（一致或无法判定而跳过）或问题描述字符串。
 */
function checkTypeMismatch(docTypeRaw, implTypeRaw, parsed, expandMap) {
  const docType = docTypeRaw.replace(/`/g, '').replace(/\\\|/g, '|').trim()
  if (!docType || docType === '—' || docType === '-' || docType === '–') return null
  const expanded = expandType(implTypeRaw, expandMap)
  // 已知全局类型与本文件类型名置空后仍有大写标识符 → 含未解析引用（如跨文件 import），跳过
  const scrubbed = expanded.replace(/\b[A-Za-z_$][\w$]*\b/g, (id) =>
    KNOWN_GLOBAL_TYPES.has(id) || parsed.typeNames.has(id) ? ' ' : id,
  )
  if (/\b[A-Z][\w$]*/.test(scrubbed)) return null

  const docLits = extractLiterals(docType)
  const implLits = new Set(extractLiterals(expanded))
  if (docLits.length) {
    const missing = docLits.filter((lit) => !implLits.has(lit))
    if (missing.length) return `文档字面量 ${missing.map((x) => `'${x}'`).join('/')} 在实现类型中不存在`
  }

  // 文档侧从严（避免把 `{...}[]` 示例写法当成 object 声明）；实现侧从宽
  // （CSSProperties / Record< / 内联 { x: T } / 展开的 interface 均视为 object 形态）
  const docPrimPatterns = [
    ['string', /\bstring\b/i],
    ['number', /\bnumber\b/i],
    ['boolean', /\bboolean\b/i],
    ['array', /\[\s*\]|\barray\s*</i],
    ['function', /=>|\bfunction\b/i],
    ['Date', /\bdate\b/i],
    ['object', /\bobject\b|\brecord\s*</i],
  ]
  const implPrimPatterns = {
    string: /\bstring\b/i,
    number: /\bnumber\b/i,
    boolean: /\bboolean\b/i,
    array: /\[\s*\]|\barray\s*</i,
    function: /=>|\bfunction\b/i,
    Date: /\bdate\b/i,
    object: /\bobject\b|\brecord\s*<|\bCSSProperties\b|\bVNode\b|\{\s*[A-Za-z_'"]/i,
  }
  const missingPrim = []
  for (const [label, re] of docPrimPatterns) {
    if (re.test(docType) && !implPrimPatterns[label].test(expanded)) missingPrim.push(label)
  }
  if (missingPrim.length) return `文档类型含 ${missingPrim.join('/')}，实现类型中未出现`
  return null
}

// ---------- docs/index.md 解析 ----------
const HEADING_KINDS = [
  ['props', /props/i],
  ['events', /events|emits/i],
  ['slots', /slots/i],
]

function classifyHeading(text) {
  const kinds = []
  for (const [kind, re] of HEADING_KINDS) if (re.test(text)) kinds.push(kind)
  return kinds
}

function classifyTableHeader(headerLine) {
  if (/插槽/.test(headerLine)) return 'slots'
  if (/事件/.test(headerLine)) return 'events'
  if (/参数/.test(headerLine)) return 'props'
  return null
}

function isSeparatorRow(line) {
  const cells = line.split(/(?<!\\)\|/).map((c) => c.trim()).filter(Boolean)
  return cells.length > 0 && cells.every((c) => /^:?-{2,}:?$/.test(c))
}

function splitRow(line) {
  return line.split(/(?<!\\)\|/).slice(1, -1).map((c) => c.trim())
}

/**
 * 解析 docs/index.md，返回 {
 *   props: Map<name,{line,type}>, events: Map<name,{line}>, slots: Map<name,{line}>,
 *   sectionsFound: { props, events, slots }
 * }
 */
function parseDoc(text, compName) {
  const lines = text.split(/\r?\n/)
  const props = new Map()
  const events = new Map()
  const slots = new Map()
  const sectionsFound = { props: false, events: false, slots: false }

  // ---- 表格 ----
  let headingKinds = []
  let inCode = false
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (/^\s*```/.test(line)) {
      inCode = !inCode
      i += 1
      continue
    }
    if (inCode) {
      i += 1
      continue
    }
    const h = line.match(/^#{2,4}\s+(.+?)\s*$/)
    if (h) {
      headingKinds = classifyHeading(h[1])
      for (const kind of headingKinds) sectionsFound[kind] = true
      i += 1
      continue
    }
    if (headingKinds.length && /^\s*\|/.test(line)) {
      const block = []
      while (i < lines.length && /^\s*\|/.test(lines[i])) {
        block.push({ text: lines[i], line: i + 1 })
        i += 1
      }
      const kind = classifyTableHeader(block[0].text) ?? headingKinds[0]
      const target = kind === 'props' ? props : kind === 'events' ? events : slots
      for (const row of block.slice(1)) {
        if (isSeparatorRow(row.text)) continue
        const cells = splitRow(row.text)
        if (!cells.length || !cells[0]) continue
        const tokens = [...cells[0].matchAll(/`([^`]+)`/g)].map((x) => x[1].trim())
        for (const token of tokens) {
          if (!token) continue
          if (kind === 'events' && /\(/.test(token)) continue // expose 方法写法，如 validate(name?)
          if (target.has(token)) continue
          target.set(token, { line: row.line, type: kind === 'props' ? cells[1] ?? '' : '' })
        }
      }
      continue
    }
    i += 1
  }

  // ---- 示例中的 #slot / v-slot:slot（仅归属于本组件标签的） ----
  inCode = false
  let codeStartLine = 0
  let codeLines = []
  for (let n = 0; n < lines.length; n += 1) {
    if (/^\s*```/.test(lines[n])) {
      if (!inCode) {
        inCode = true
        codeStartLine = n + 1
        codeLines = []
      } else {
        inCode = false
        const codeText = codeLines.join('\n')
        const slotRe = /<template\s+(?:#([A-Za-z][\w-]*)|v-slot:\s*([A-Za-z][\w-]*))/g
        let sm
        while ((sm = slotRe.exec(codeText))) {
          const slotName = sm[1] ?? sm[2]
          // 向前找最近的未自闭合组件标签，仅当属于本组件时归属
          const prefix = codeText.slice(0, sm.index)
          const tagRe = /<([A-Z][\w]*)\b[^>]*?(\/?)>/g
          let tm
          let owner = null
          while ((tm = tagRe.exec(prefix))) {
            if (tm[1] === 'template') continue
            if (tm[2] === '/') continue
            owner = tm[1]
          }
          if (owner && owner.replace(/^Wi/, '') === compName && !slots.has(slotName)) {
            slots.set(slotName, { line: codeStartLine + lineOf(codeText, sm.index) - 1, type: '' })
          }
        }
      }
      continue
    }
    if (inCode) codeLines.push(lines[n])
  }

  return { props, events, slots, sectionsFound }
}

// ---------- .vue 实现解析 ----------
/**
 * 解析单个 .vue，返回 {
 *   slots: [{name,line}], emitCalls: [{name,line}],
 *   propTypeRefs: [name], emitTypeRefs: [name],
 *   inlineProps: Map<name,{line}>, inlineEmits: [{name,line}]
 * }
 */
function parseVueFile(text) {
  const slots = []
  const emitCalls = []
  const propTypeRefs = []
  const emitTypeRefs = []
  const inlineProps = new Map()
  const inlineEmits = []

  // <slot> 标签（支持跨行属性）
  const slotTagRe = /<slot\b[\s\S]*?>/g
  let m
  while ((m = slotTagRe.exec(text))) {
    const tag = m[0]
    const line = lineOf(text, m.index)
    const dyn = tag.match(/:name\s*=\s*"([^"]*)"/) ?? tag.match(/:name\s*=\s*'([^']*)'/)
    if (dyn) {
      const tpl = dyn[1].match(/^`([^`]*?)\$\{/)
      // 模板字面量前缀可枚举（cell-*），纯表达式记为 *（完全动态）
      slots.push(tpl ? { name: `${tpl[1]}*`, line } : { name: '*', line })
      continue
    }
    const named = tag.match(/\bname\s*=\s*"([^"]+)"/) ?? tag.match(/\bname\s*=\s*'([^']+)'/)
    slots.push({ name: named ? named[1] : 'default', line })
  }

  // slots.xxx / $slots.xxx / slots['xxx'] / slots[`prefix-${...}`]
  const slotRefRe = /(?:\$slots|(?<![\w$.])slots)\s*(?:\.\s*([A-Za-z_$][\w$]*)|\[\s*['"]([^'"]+)['"]\s*\]|\[\s*`([^`]*?)\$\{)/g
  while ((m = slotRefRe.exec(text))) {
    const line = lineOf(text, m.index)
    if (m[3] != null) slots.push({ name: `${m[3]}*`, line })
    else slots.push({ name: m[1] ?? m[2], line })
  }

  // defineProps<Name>() / defineProps<{ ... }>()
  const dpRe = /defineProps\s*<\s*/g
  while ((m = dpRe.exec(text))) {
    const rest = text.slice(m.index + m[0].length)
    if (rest.startsWith('{')) {
      const open = m.index + m[0].length
      const close = braceMatch(text, open)
      const body = text.slice(open + 1, close)
      const baseLine = lineOf(text, open)
      body.split(/\r?\n/).forEach((l, k) => {
        const fm = l.match(/^\s*(?:readonly\s+)?([A-Za-z_$][\w$]*)\s*\??\s*:/)
        if (fm && !l.trim().startsWith('(')) inlineProps.set(fm[1], { line: baseLine + k })
      })
    } else {
      const nm = rest.match(/^([A-Za-z_$][\w$]*)\s*>/)
      if (nm) propTypeRefs.push(nm[1])
    }
  }

  // defineEmits<Name>() / defineEmits<{ ... }>() / defineEmits(['a'])
  const deRe = /defineEmits\s*(?:<\s*)?/g
  while ((m = deRe.exec(text))) {
    const rest = text.slice(m.index + m[0].length)
    if (rest.startsWith('{')) {
      const open = m.index + m[0].length
      const close = braceMatch(text, open)
      const body = text.slice(open + 1, close)
      const baseLine = lineOf(text, open)
      const evRe = /\(\s*event:\s*['"]([^'"]+)['"]/g
      let ev
      while ((ev = evRe.exec(body))) inlineEmits.push({ name: ev[1], line: baseLine + lineOf(body, ev.index) - 1 })
    } else {
      const nm = rest.match(/^([A-Za-z_$][\w$]*)\s*>/)
      if (nm) emitTypeRefs.push(nm[1])
      const arr = rest.match(/^\(\s*\[([^\]]*)\]/)
      if (arr) {
        const litRe = /['"]([^'"]+)['"]/g
        let lit
        while ((lit = litRe.exec(arr[1]))) inlineEmits.push({ name: lit[1], line: lineOf(text, m.index) })
      }
    }
  }

  // emit('x') / $emit('x')
  const emitRe = /(?<![\w$.])\$?emit\s*\(\s*['"]([^'"]+)['"]/g
  while ((m = emitRe.exec(text))) emitCalls.push({ name: m[1], line: lineOf(text, m.index) })

  return { slots, emitCalls, propTypeRefs, emitTypeRefs, inlineProps, inlineEmits }
}

// ---------- 名称归一与插槽匹配 ----------
const normKey = (name) => name.toLowerCase().replace(/[^a-z0-9:]/g, '')

/** 文档插槽名归一为模式：[tab.value] → *；cell-{key} → cell-*；其余返回 null（精确名）。 */
function docSlotPattern(name) {
  if (/^\[.*\]$/.test(name)) return '*'
  if (name.includes('{')) return name.replace(/\{[^}]*\}/g, '*')
  return null
}

/** 文档插槽名是否被任一实现插槽覆盖（支持模式名互配）。 */
function slotCoveredByImpl(docName, implSlots) {
  const docPattern = docSlotPattern(docName)
  for (const impl of implSlots.keys()) {
    if (impl === docName) return true
    if (impl === '*') return true // 实现为完全动态插槽（如 :name="tab.value"），任意名可渲染
    const implPrefix = impl.endsWith('*') ? impl.slice(0, -1) : null
    if (docPattern) {
      const docPrefix = docPattern === '*' ? null : docPattern.slice(0, -1)
      if (docPattern === '*') {
        if (implPrefix !== null) return true // 文档通配配任意动态实现
      } else if (implPrefix !== null ? implPrefix === docPrefix : impl.startsWith(docPrefix)) return true
    } else if (implPrefix) {
      if (docName.startsWith(implPrefix)) return true
    }
  }
  return false
}

/** 实现插槽名是否被任一文档插槽覆盖。 */
function slotCoveredByDocs(implName, docSlots) {
  for (const docName of docSlots.keys()) {
    if (docName === implName) return true
    const docPattern = docSlotPattern(docName)
    const implPrefix = implName.endsWith('*') ? implName.slice(0, -1) : null
    if (docPattern) {
      const docPrefix = docPattern === '*' ? null : docPattern.slice(0, -1)
      if (docPattern === '*') {
        if (implPrefix !== null) return true
      } else if (implPrefix !== null ? implPrefix === docPrefix : implName.startsWith(docPrefix)) return true
    } else if (implPrefix) {
      if (docName.startsWith(implPrefix)) return true
    }
  }
  return false
}

// ---------- 主流程 ----------
function collectFiles(dir, filter) {
  const out = []
  const walk = (d) => {
    for (const entry of readdirSync(d)) {
      if (entry === 'docs' || entry === 'node_modules') continue
      const full = path.join(d, entry)
      const st = statSync(full)
      if (st.isDirectory()) {
        walk(full)
        continue
      }
      if (/\.test\./.test(entry)) continue
      if (filter(full)) out.push(full)
    }
  }
  walk(dir)
  return out
}

function analyzeComponent(dir) {
  const name = path.basename(dir)
  const result = {
    component: name,
    items: [],
    stats: { 'docs-only': 0, 'impl-only': 0, 'type-mismatch': 0, 'declared-unused': 0 },
  }
  const add = (kind, category, itemName, docLoc, implLoc, note) => {
    result.items.push({ kind, category, name: itemName, docLoc, implLoc, note })
    result.stats[kind] += 1
  }
  const sectionsNote = (found, label, fallback) => (found ? fallback : `文档无 ${label} 章节`)

  // ---- 文档侧 ----
  const docsPath = path.join(dir, 'docs', 'index.md')
  if (!existsSync(docsPath)) {
    add('docs-only', 'meta', '(docs/index.md 缺失)', null, null, '组件目录下无中文文档，无法对账')
    return result
  }
  const doc = parseDoc(readFileSync(docsPath, 'utf8'), name)

  // ---- 实现侧 ----
  const typesPath = path.join(dir, 'types.ts')
  const parsed = existsSync(typesPath)
    ? parseTypesFile(readFileSync(typesPath, 'utf8'))
    : { interfaces: new Map(), aliases: new Map(), typeNames: new Set() }
  // 类型展开映射：export type 别名 + 本文件 interface（字段类型并集）
  const expandMap = new Map([...interfaceExpansions(parsed), ...parsed.aliases])

  const vueFiles = collectFiles(dir, (f) => f.endsWith('.vue'))
  const mainVuePath = path.join(dir, `${name}.vue`)
  const allVueParsed = new Map()
  for (const file of vueFiles) allVueParsed.set(file, parseVueFile(readFileSync(file, 'utf8')))
  const mainParsed = allVueParsed.get(mainVuePath) ?? null

  // props：types.ts 中 ^<Name>\w*Props$（排除 *SlotProps）∪ defineProps 引用接口 ∪ 主组件内联 defineProps
  const implProps = new Map() // name -> { loc, type, internal }
  const propsIfaceRe = new RegExp(`^${escapeRegExp(name)}\\w*Props$`)
  for (const [ifaceName, iface] of parsed.interfaces) {
    if (!propsIfaceRe.test(ifaceName) || /SlotProps$/.test(ifaceName)) continue
    for (const [fieldName, field] of iface.fields) {
      if (!implProps.has(fieldName)) {
        implProps.set(fieldName, {
          loc: `types.ts:${field.line}`,
          type: field.type,
          internal: iface.internal || field.internal,
        })
      }
    }
  }
  for (const pv of allVueParsed.values()) {
    for (const ref of pv.propTypeRefs) {
      const iface = parsed.interfaces.get(ref)
      if (!iface || propsIfaceRe.test(ref) || /SlotProps$/.test(ref)) continue
      for (const [fieldName, field] of iface.fields) {
        if (!implProps.has(fieldName)) {
          implProps.set(fieldName, { loc: `types.ts:${field.line}`, type: field.type, internal: false })
        }
      }
    }
  }
  if (mainParsed) {
    for (const [fieldName, meta] of mainParsed.inlineProps) {
      if (!implProps.has(fieldName)) {
        implProps.set(fieldName, { loc: `${name}.vue:${meta.line}`, type: '', internal: false })
      }
    }
  }

  // events：types.ts 中 ^<Name>\w*Emits$ ∪ defineEmits 引用接口 ∪ 主组件内联 defineEmits ∪ 主组件 emit() 调用
  const implEvents = new Map() // name -> loc
  const emitsIfaceRe = new RegExp(`^${escapeRegExp(name)}\\w*Emits$`)
  for (const [ifaceName, iface] of parsed.interfaces) {
    if (!emitsIfaceRe.test(ifaceName)) continue
    for (const ev of iface.events) {
      if (!implEvents.has(ev.name)) implEvents.set(ev.name, `types.ts:${ev.line}`)
    }
  }
  for (const pv of allVueParsed.values()) {
    for (const ref of pv.emitTypeRefs) {
      const iface = parsed.interfaces.get(ref)
      if (!iface || emitsIfaceRe.test(ref)) continue
      for (const ev of iface.events) if (!implEvents.has(ev.name)) implEvents.set(ev.name, `types.ts:${ev.line}`)
    }
  }
  if (mainParsed) {
    for (const ev of mainParsed.inlineEmits) if (!implEvents.has(ev.name)) implEvents.set(ev.name, `${name}.vue:${ev.line}`)
    for (const ev of mainParsed.emitCalls) if (!implEvents.has(ev.name)) implEvents.set(ev.name, `${name}.vue:${ev.line}`)
  }

  // slots：全部 .vue 的 <slot> 标签与 slots 引用
  const implSlots = new Map() // name -> loc
  for (const [file, pv] of allVueParsed) {
    const rel = path.basename(file)
    for (const slot of pv.slots) {
      if (!slot.name) continue
      if (!implSlots.has(slot.name)) implSlots.set(slot.name, `${rel}:${slot.line}`)
    }
  }

  // ---- 对账 ----
  const implPropsNorm = new Map([...implProps].map(([n, v]) => [normKey(n), v]))
  const docPropsNorm = new Map([...doc.props].map(([n, v]) => [normKey(n), v]))
  const implEventsNorm = new Map([...implEvents].map(([n, v]) => [normKey(n), v]))
  const docEventsNorm = new Map([...doc.events].map(([n, v]) => [normKey(n), v]))

  for (const [n, meta] of doc.props) {
    const impl = implPropsNorm.get(normKey(n))
    if (!impl) {
      add('docs-only', 'prop', n, `docs/index.md:${meta.line}`, null,
        sectionsNote(doc.sectionsFound.props, 'Props', 'types.ts / defineProps 未声明该 prop'))
      continue
    }
    if (meta.type && impl.type) {
      const problem = checkTypeMismatch(meta.type, impl.type, parsed, expandMap)
      if (problem) add('type-mismatch', 'prop', n, `docs/index.md:${meta.line}`, impl.loc, problem)
    }
  }
  for (const [n, meta] of implProps) {
    if (meta.internal) continue
    if (!docPropsNorm.has(normKey(n))) {
      add('impl-only', 'prop', n, null, meta.loc,
        sectionsNote(doc.sectionsFound.props, 'Props', '文档 Props 表未记载'))
    }
  }

  for (const [n, meta] of doc.events) {
    if (!implEventsNorm.has(normKey(n))) {
      add('docs-only', 'event', n, `docs/index.md:${meta.line}`, null,
        sectionsNote(doc.sectionsFound.events, 'Events', 'types.ts / 模板均未声明或抛出该事件'))
    }
  }
  for (const [n, loc] of implEvents) {
    if (!docEventsNorm.has(normKey(n))) {
      add('impl-only', 'event', n, null, loc,
        sectionsNote(doc.sectionsFound.events, 'Events', '文档 Events 表未记载'))
    }
  }

  for (const [n, meta] of doc.slots) {
    if (!slotCoveredByImpl(n, implSlots)) {
      add('docs-only', 'slot', n, `docs/index.md:${meta.line}`, null,
        sectionsNote(doc.sectionsFound.slots, 'Slots', '模板中无对应 <slot> 或 slots 引用'))
    }
  }
  for (const [n, loc] of implSlots) {
    if (n === '*') continue // 完全动态插槽名无法枚举，跳过
    if (!slotCoveredByDocs(n, doc.slots)) {
      add('impl-only', 'slot', n, null, loc,
        sectionsNote(doc.sectionsFound.slots, 'Slots', '文档 Slots 表未记载'))
    }
  }

  // ---- 声明未接线（启发式，需人工确认） ----
  const searchText = collectFiles(dir, (f) => (f.endsWith('.vue') || f.endsWith('.ts')) && !f.endsWith('types.ts'))
    .map((f) => readFileSync(f, 'utf8'))
    .join('\n')
  for (const [n, meta] of implProps) {
    if (meta.internal || !meta.loc.startsWith('types.ts')) continue
    if (!new RegExp(`\\b${escapeRegExp(n)}\\b`).test(searchText)) {
      add('declared-unused', 'prop', n,
        docPropsNorm.has(normKey(n)) ? `docs/index.md:${docPropsNorm.get(normKey(n)).line}` : null,
        meta.loc, 'types.ts 已声明，但组件源码中未检索到引用（疑似死 prop，需人工确认）')
    }
  }
  for (const [n, loc] of implEvents) {
    if (!loc.startsWith('types.ts')) continue
    // emit 形参在 composable 中常命名为 emits（如 Table hooks），两种形态都认
    const re = new RegExp(`\\$?emits?\\s*\\(\\s*['"]${escapeRegExp(n)}['"]`)
    if (!re.test(searchText)) {
      add('declared-unused', 'event', n,
        docEventsNorm.has(normKey(n)) ? `docs/index.md:${docEventsNorm.get(normKey(n)).line}` : null,
        loc, 'types.ts 已声明，但未检索到 emit() 调用（疑似未接线，需人工确认）')
    }
  }

  return result
}

// ---------- 输出 ----------
const KIND_LABEL = {
  'docs-only': '文档有实现无',
  'impl-only': '实现有文档无',
  'type-mismatch': '类型疑似不一致',
  'declared-unused': '声明未接线(疑似)',
}
const KIND_ORDER = ['docs-only', 'impl-only', 'type-mismatch', 'declared-unused']

function run() {
  const dirs = readdirSync(COMPONENTS_DIR)
    .map((entry) => path.join(COMPONENTS_DIR, entry))
    .filter((full) => {
      try {
        return statSync(full).isDirectory()
      } catch {
        return false
      }
    })
    .sort()

  const results = []
  for (const dir of dirs) {
    const name = path.basename(dir)
    if (opts.component && name.toLowerCase() !== opts.component.toLowerCase()) continue
    try {
      results.push(analyzeComponent(dir))
    } catch (error) {
      results.push({
        component: name,
        items: [{ kind: 'docs-only', category: 'meta', name: '(解析失败)', docLoc: null, implLoc: null, note: String(error?.message ?? error) }],
        stats: { 'docs-only': 1, 'impl-only': 0, 'type-mismatch': 0, 'declared-unused': 0 },
      })
    }
  }
  return results
}

function printConsole(results) {
  let total = 0
  const totals = { 'docs-only': 0, 'impl-only': 0, 'type-mismatch': 0, 'declared-unused': 0 }
  for (const r of results) {
    total += r.items.length
    for (const k of KIND_ORDER) totals[k] += r.stats[k]
  }
  console.log(`docs-drift: scanned ${results.length} component(s), found ${total} drift item(s). (report mode, exit 0)\n`)
  for (const r of results) {
    if (!r.items.length) continue
    console.log(`== ${r.component} (${r.items.length}) ==`)
    const sorted = [...r.items].sort(
      (a, b) => KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind) || a.name.localeCompare(b.name),
    )
    for (const item of sorted) {
      const docLoc = item.docLoc ? ` ${item.docLoc}` : ' (文档未记载)'
      const implLoc = item.implLoc ? ` impl:${item.implLoc}` : ''
      console.log(`  [${KIND_LABEL[item.kind]}] ${item.category} \`${item.name}\`${docLoc}${implLoc}`)
      if (item.note) console.log(`      ${item.note}`)
    }
    console.log('')
  }
  const header = ['组件', ...KIND_ORDER.map((k) => KIND_LABEL[k]), '合计']
  console.log(header.join('\t'))
  for (const r of results) {
    if (!r.items.length) continue
    console.log([r.component, ...KIND_ORDER.map((k) => r.stats[k]), r.items.length].join('\t'))
  }
  console.log(['TOTAL', ...KIND_ORDER.map((k) => totals[k]), total].join('\t'))
}

function escCell(text) {
  return String(text ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ')
}

function buildMarkdown(results) {
  let total = 0
  const totals = { 'docs-only': 0, 'impl-only': 0, 'type-mismatch': 0, 'declared-unused': 0 }
  for (const r of results) {
    total += r.items.length
    for (const k of KIND_ORDER) totals[k] += r.stats[k]
  }
  const withItems = results.filter((r) => r.items.length)
  const out = []
  out.push('# 文档-实现漂移清单（docs drift report）')
  out.push('')
  out.push('> 由 `ai-design-config/scripts/check-docs-drift.mjs` 生成（报告模式，exit code 恒 0）。')
  out.push('> 重新生成：`node ai-design-config/scripts/check-docs-drift.mjs --md`')
  out.push(`> 基准日期：2026-09-02；扫描组件 ${results.length} 个；漂移条目 ${total} 条。`)
  out.push('')
  out.push('## 类别说明')
  out.push('')
  out.push('- **文档有实现无**：`docs/index.md` 声明了 prop / event / slot，但 `types.ts` 与模板中不存在。')
  out.push('- **实现有文档无**：实现存在但文档未记载（仅 public API 层面，`@internal` 标记已忽略）。')
  out.push('- **类型疑似不一致**：同名 prop 的文档类型与实现类型在字面量 / 基础类型层面冲突（保守启发式，需人工确认）。')
  out.push('- **声明未接线（疑似）**：`types.ts` 已声明，但组件源码中检索不到 prop 引用或 `emit()` 调用（启发式，可能因间接使用误报，需人工确认）。')
  out.push('')
  out.push('## 汇总')
  out.push('')
  out.push('| 组件 | 文档有实现无 | 实现有文档无 | 类型疑似不一致 | 声明未接线(疑似) | 合计 |')
  out.push('| --- | --- | --- | --- | --- | --- |')
  for (const r of withItems) {
    out.push(
      `| [${r.component}](#${r.component.toLowerCase()}) | ${r.stats['docs-only']} | ${r.stats['impl-only']} | ${r.stats['type-mismatch']} | ${r.stats['declared-unused']} | ${r.items.length} |`,
    )
  }
  out.push(`| **合计** | **${totals['docs-only']}** | **${totals['impl-only']}** | **${totals['type-mismatch']}** | **${totals['declared-unused']}** | **${total}** |`)
  out.push('')
  for (const r of withItems) {
    out.push(`## ${r.component}`)
    out.push('')
    for (const kind of KIND_ORDER) {
      const items = r.items.filter((x) => x.kind === kind)
      if (!items.length) continue
      out.push(`### ${KIND_LABEL[kind]}（${items.length}）`)
      out.push('')
      out.push('| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |')
      out.push('| --- | --- | --- | --- | --- |')
      for (const item of items) {
        out.push(
          `| \`${escCell(item.name)}\` | ${item.category} | ${escCell(item.docLoc ?? '—')} | ${escCell(item.implLoc ?? '—')} | ${escCell(item.note ?? '')} |`,
        )
      }
      out.push('')
    }
  }
  return `${out.join('\n')}\n`
}

const results = run()

if (opts.json) {
  console.log(JSON.stringify(results, null, 2))
} else {
  printConsole(results)
}

if (opts.md) {
  const target = path.resolve(REPO_ROOT, opts.md)
  writeFileSync(target, buildMarkdown(results), 'utf8')
  console.log(`\nMarkdown report written to ${path.relative(REPO_ROOT, target)}`)
}

// 报告模式：恒 0
process.exitCode = 0
