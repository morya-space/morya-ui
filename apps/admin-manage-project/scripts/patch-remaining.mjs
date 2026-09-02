import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..', 'src')

/** @type {Array<[string, Array<[string, string]>]>} */
const patches = [
  ['views/academic/StudentsView.vue', [['        ??\n', '        \u5bfc\u51fa\n']]],
  ['views/academic/CoursesView.vue', [['>??</WiButton>', '>\u7f16\u8f91</WiButton>']]],
  [
    'views/security/DataScopeView.vue',
    [[/<WiCard title="[^"]*">/, '<WiCard title="\u73ed\u4e3b\u4efb \u00b7 \u6570\u636e\u8303\u56f4\u89c4\u5219">']],
  ],
  ['layouts/AdminLayout.vue', [[/config: t\('系统配[^']+'/, "config: t('\u7cfb\u7edf\u914d\u7f6e'"]],
]

for (const [rel, reps] of patches) {
  const file = join(root, rel)
  let text = readFileSync(file, 'utf8')
  for (const [from, to] of reps) {
    if (from instanceof RegExp) {
      if (!from.test(text)) console.warn('missing pattern in', rel, from)
      text = text.replace(from, to)
      continue
    }
    if (!text.includes(from)) {
      console.warn('missing pattern in', rel, from)
      continue
    }
    text = text.split(from).join(to)
  }
  writeFileSync(file, text, 'utf8')
  console.log('patched', rel)
}
