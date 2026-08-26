import { describe, expect, it } from 'vitest'
import {
  evaluateFormRule,
  isEmptyValue,
  ruleMatchesTrigger,
  toCssSize,
} from './rules'

describe('Form rules helpers', () => {
  it('treats null, blank strings, and empty arrays as empty', () => {
    expect(isEmptyValue(null)).toBe(true)
    expect(isEmptyValue('  ')).toBe(true)
    expect(isEmptyValue([])).toBe(true)
    expect(isEmptyValue(0)).toBe(false)
    expect(isEmptyValue('ok')).toBe(false)
  })

  it('runs every rule on submit / programmatic validate', () => {
    expect(ruleMatchesTrigger({ trigger: 'blur' }, 'submit', ['submit'])).toBe(true)
    expect(ruleMatchesTrigger({ trigger: 'blur' }, 'all', ['submit'])).toBe(true)
    expect(ruleMatchesTrigger({ trigger: 'blur' }, 'blur', ['submit'])).toBe(true)
    expect(ruleMatchesTrigger({ trigger: 'blur' }, 'change', ['submit'])).toBe(false)
  })

  it('inherits Form validateOn when a rule omits trigger', () => {
    expect(ruleMatchesTrigger({}, 'blur', ['blur', 'change'])).toBe(true)
    expect(ruleMatchesTrigger({}, 'input', ['submit'])).toBe(false)
  })

  it('evaluates required, min, pattern, and custom validators', async () => {
    expect(await evaluateFormRule({ required: true, message: '必填' }, '', 'Required')).toBe('必填')
    expect(await evaluateFormRule({ min: 3, message: '太短' }, 'ab', 'Required')).toBe('太短')
    expect(await evaluateFormRule({ pattern: /^\d+$/, message: '数字' }, '12a', 'Required')).toBe('数字')
    expect(await evaluateFormRule({ pattern: /^\d+$/ }, '', 'Required')).toBeUndefined()
    expect(await evaluateFormRule({ validator: () => false, message: '否' }, 'x', 'Required')).toBe('否')
    expect(await evaluateFormRule({ validator: async () => '异步' }, 'x', 'Required')).toBe('异步')
  })

  it('formats numeric label widths as px', () => {
    expect(toCssSize(96)).toBe('96px')
    expect(toCssSize('6rem')).toBe('6rem')
    expect(toCssSize(undefined)).toBeUndefined()
  })
})
