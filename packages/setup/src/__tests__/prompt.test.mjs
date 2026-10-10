import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { canPrompt } from '../prompt.mjs'

describe('canPrompt', () => {
  it('returns false when --yes is set', () => {
    assert.equal(canPrompt({ yes: true }), false)
  })

  it('returns false when dry-run is set', () => {
    assert.equal(canPrompt({ dryRun: true }), false)
  })

  it('returns false when both are set', () => {
    assert.equal(canPrompt({ yes: true, dryRun: true }), false)
  })

  it('reflects TTY availability otherwise', () => {
    // In the test runner stdin is typically not a TTY.
    const result = canPrompt({})
    assert.equal(typeof result, 'boolean')
    assert.equal(result, Boolean(process.stdin.isTTY))
  })
})
