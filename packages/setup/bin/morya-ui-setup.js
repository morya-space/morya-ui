#!/usr/bin/env node
import { parseArgs, printHelp, runSetup } from '../src/cli.mjs'

try {
  const options = parseArgs(process.argv.slice(2))
  if (options.help) {
    printHelp()
    process.exit(0)
  }
  await runSetup(options)
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
}
