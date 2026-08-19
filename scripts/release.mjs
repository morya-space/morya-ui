import {
  parseReleaseOptions,
  resolveSteps,
  runReleaseSteps,
  warnIgnoredDryRun,
} from './release-steps.mjs'

const options = parseReleaseOptions(process.argv.slice(2))
const selectedSteps = resolveSteps(options)

warnIgnoredDryRun(selectedSteps, options.dryRun)

if (!options.step && !options.from && !options.until) {
  const displaySteps = options.dryRun ? ['prepare'] : selectedSteps
  console.log(`Release pipeline: ${displaySteps.join(' → ')}`)
  if (options.dryRun) {
    console.log('(dry-run: only the prepare step runs)')
  }
}

await runReleaseSteps(selectedSteps, options)
