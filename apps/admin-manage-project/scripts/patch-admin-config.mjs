import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const file = join(import.meta.dirname, '..', 'src', 'layouts', 'AdminLayout.vue')
let text = readFileSync(file, 'utf8')
text = text.replace(/config: t\('系统配[^']+'/, `config: t('\u7cfb\u7edf\u914d\u7f6e'`)
writeFileSync(file, text, 'utf8')
console.log('patched AdminLayout config label')
