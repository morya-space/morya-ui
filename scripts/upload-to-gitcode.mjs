/**
 * Upload images to GitCode as a static asset host, then optionally rewrite a
 * Markdown file so its local asset references point at the hosted URLs.
 *
 * Zero-dependency Node script — no PicGo required. Uses the same GitCode API
 * endpoint that picgo-plugin-gitcode calls.
 *
 * Usage:
 *   node scripts/upload-to-gitcode.mjs <images...> [options]
 *   node scripts/upload-to-gitcode.mjs docs/blog/introducing-morya-ui/assets/*.png \
 *     --rewrite docs/blog/introducing-morya-ui/article.md \
 *     --out docs/blog/introducing-morya-ui/article-online.md
 *
 * Options:
 *   --rewrite <file.md>   Markdown file whose local refs should be rewritten
 *   --out <file.md>       Where to write the rewritten markdown (default: overwrite input)
 *   --pattern <prefix>    Local path prefix to replace (default: ./assets/)
 *   --dry-run             Print what would be uploaded / rewritten, don't call API
 *   --help                Show this help
 *
 * Configuration is hardcoded in the CONFIG object below — adjust to point at
 * your own GitCode repo / token.
 */
import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')

const API_DOMAIN = 'https://gitcode.com'
const RAW_DOMAIN = 'https://raw.gitcode.com'
const API_VERSION = 'v5'

// GitCode's default rate limit is 50 req/min. We stay well under that.
const UPLOAD_DELAY_MS = 1300

// ---------- config ----------

const CONFIG = {
  token: 'mzD8NsEVeVNG6yxDFiA7xgkD',
  owner: 'Wayne1308',
  repo: 'images-list',
  branch: 'main',
  path: '',
  message: 'chore: upload images',
}

// ---------- args ----------

function parseArgs(argv) {
  const args = {
    files: [],
    rewrite: null,
    out: null,
    pattern: './assets/',
    dryRun: false,
    help: false,
  }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--help' || a === '-h') args.help = true
    else if (a === '--dry-run') args.dryRun = true
    else if (a === '--rewrite') args.rewrite = argv[++i]
    else if (a === '--out') args.out = argv[++i]
    else if (a === '--pattern') args.pattern = argv[++i]
    else args.files.push(a)
  }
  return args
}

function printHelp() {
  console.log(`Usage: node scripts/upload-to-gitcode.mjs <images...> [options]

Options:
  --rewrite <file.md>   Markdown file whose local refs should be rewritten
  --out <file.md>       Where to write the rewritten markdown (default: overwrite input)
  --pattern <prefix>    Local path prefix to replace (default: ./assets/)
  --dry-run             Print what would be uploaded / rewritten, don't call API
  --help                Show this help

Config is hardcoded in the CONFIG object at the top of this script. Edit there
to point at your own GitCode repo / token.
`)
}

// ---------- upload ----------

function buildUploadUrl(fileName) {
  const baseUrl = `${API_DOMAIN}/api/${API_VERSION}/repos/${CONFIG.owner}/${CONFIG.repo}/contents`
  const prefix = CONFIG.path ? `/${CONFIG.path}` : ''
  const encoded = fileName.split('/').map(encodeURIComponent).join('/')
  return `${baseUrl}${prefix}/${encoded}`
}

function buildPublicUrl(fileName) {
  const prefix = CONFIG.path ? `/${CONFIG.path}` : ''
  const encoded = fileName.split('/').map(encodeURIComponent).join('/')
  return `${RAW_DOMAIN}/${CONFIG.owner}/${CONFIG.repo}/raw/${CONFIG.branch}${prefix}/${encoded}`
}

async function uploadOne(filePath, dryRun) {
  const fileName = path.basename(filePath)
  const publicUrl = buildPublicUrl(fileName)

  if (dryRun) {
    console.log(`[dry-run] would upload ${filePath} -> ${publicUrl}`)
    return { fileName, publicUrl, skipped: false }
  }

  const buffer = await readFile(filePath)
  const body = {
    content: buffer.toString('base64'),
    message: CONFIG.message,
  }

  const url = buildUploadUrl(fileName)
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': `Bearer ${CONFIG.token}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    // 4xx with "already exists" is treated as success (idempotent re-upload)
    if (/already exists?|文件已存在|duplicate/i.test(text)) {
      console.log(`skip (exists): ${fileName}`)
      return { fileName, publicUrl, skipped: true }
    }
    throw new Error(`upload failed for ${fileName}: HTTP ${res.status} ${text}`)
  }

  console.log(`uploaded: ${fileName} -> ${publicUrl}`)
  return { fileName, publicUrl, skipped: false }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ---------- markdown rewrite ----------

async function rewriteMarkdown({ rewritePath, outPath, pattern, urlByFile, dryRun }) {
  const abs = path.resolve(repoRoot, rewritePath)
  if (!existsSync(abs)) {
    throw new Error(`rewrite target not found: ${abs}`)
  }
  const src = await readFile(abs, 'utf8')

  let count = 0
  const next = src.replaceAll(pattern, (match) => {
    count++
    return match
  })

  // Replace per-file so we can skip files that weren't uploaded
  let rewritten = next
  for (const [fileName, publicUrl] of Object.entries(urlByFile)) {
    const localRef = `${pattern}${fileName}`
    if (rewritten.includes(localRef)) {
      rewritten = rewritten.split(localRef).join(publicUrl)
    }
  }

  const target = path.resolve(repoRoot, outPath || rewritePath)
  if (dryRun) {
    console.log(`[dry-run] would write rewritten markdown to ${target}`)
  } else {
    await writeFile(target, rewritten, 'utf8')
    console.log(`wrote ${target}`)
  }
}

// ---------- main ----------

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) {
    printHelp()
    return
  }
  if (!args.files.length) {
    console.error('No input files. Pass at least one image path.')
    printHelp()
    process.exit(1)
  }

  const urlByFile = {}
  for (let i = 0; i < args.files.length; i++) {
    const file = args.files[i]
    const abs = path.resolve(repoRoot, file)
    if (!existsSync(abs)) {
      console.warn(`warn: file not found, skipped: ${abs}`)
      continue
    }
    const { fileName, publicUrl } = await uploadOne(abs, args.dryRun)
    urlByFile[fileName] = publicUrl
    if (i < args.files.length - 1 && !args.dryRun) {
      await delay(UPLOAD_DELAY_MS)
    }
  }

  if (args.rewrite) {
    await rewriteMarkdown({
      rewritePath: args.rewrite,
      outPath: args.out,
      pattern: args.pattern,
      urlByFile,
      dryRun: args.dryRun,
    })
  }
}

main().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
