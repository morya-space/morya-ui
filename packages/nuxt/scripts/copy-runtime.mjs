import { cpSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
mkdirSync(join(root, 'dist/runtime'), { recursive: true })
cpSync(join(root, 'src/runtime/plugin.client.ts'), join(root, 'dist/runtime/plugin.client.ts'))
