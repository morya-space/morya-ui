import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

export function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

export function writeJson(path, value, { dryRun = false } = {}) {
  const text = `${JSON.stringify(value, null, 2)}\n`
  if (dryRun) return text
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, text, 'utf8')
  return text
}

export function ensureDir(path, { dryRun = false } = {}) {
  if (dryRun || existsSync(path)) return
  mkdirSync(path, { recursive: true })
}

export function fileExists(path) {
  return existsSync(path)
}
