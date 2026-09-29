import { describe, expect, it } from 'vitest'
import {
  evaluateFormRule,
  isEmptyValue,
  ruleMatchesTrigger,
  toCssSize,
} from './rules'

describe('form rules helpers', () => {
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

const messages = {
  required: '必填',
  invalidValue: '格式不正确',
  invalidEmail: '邮箱格式不正确',
  invalidUrl: '链接格式不正确',
  invalidDate: '日期格式不正确',
}

describe('form rules — built-in type checks', () => {
  it('validates email and url, honouring a custom message', async () => {
    expect(await evaluateFormRule({ type: 'email' }, 'nope', messages)).toBe('邮箱格式不正确')
    expect(await evaluateFormRule({ type: 'email' }, 'a@b.com', messages)).toBeUndefined()
    expect(await evaluateFormRule({ type: 'email', message: '自定义' }, 'nope', messages)).toBe('自定义')
    expect(await evaluateFormRule({ type: 'url' }, 'not-a-url', messages)).toBe('链接格式不正确')
    expect(await evaluateFormRule({ type: 'url' }, 'https://example.com', messages)).toBeUndefined()
  })

  it('validates primitive and collection types', async () => {
    expect(await evaluateFormRule({ type: 'number' }, '5', messages)).toBe('格式不正确')
    expect(await evaluateFormRule({ type: 'number' }, 5, messages)).toBeUndefined()
    expect(await evaluateFormRule({ type: 'integer' }, 1.5, messages)).toBe('格式不正确')
    expect(await evaluateFormRule({ type: 'integer' }, 2, messages)).toBeUndefined()
    expect(await evaluateFormRule({ type: 'boolean' }, 'true', messages)).toBe('格式不正确')
    expect(await evaluateFormRule({ type: 'array' }, 'x', messages)).toBe('格式不正确')
    expect(await evaluateFormRule({ type: 'array' }, ['a'], messages)).toBeUndefined()
    expect(await evaluateFormRule({ type: 'object' }, 'x', messages)).toBe('格式不正确')
    expect(await evaluateFormRule({ type: 'object' }, { a: 1 }, messages)).toBeUndefined()
    expect(await evaluateFormRule({ type: 'date' }, '2024-01-01', messages)).toBe('日期格式不正确')
    expect(await evaluateFormRule({ type: 'date' }, new Date('2024-01-01'), messages)).toBeUndefined()
  })

  it('skips type checks for empty values unless required', async () => {
    expect(await evaluateFormRule({ type: 'email' }, '', messages)).toBeUndefined()
    expect(await evaluateFormRule({ type: 'email', required: true }, '', messages)).toBe('必填')
  })
})

describe('form rules — length, whitespace, enum, transform', () => {
  it('checks exact length', async () => {
    expect(await evaluateFormRule({ len: 4, message: '长度不符' }, 'abc', messages)).toBe('长度不符')
    expect(await evaluateFormRule({ len: 4 }, 'abcd', messages)).toBeUndefined()
    expect(await evaluateFormRule({ len: 3 }, [1, 2, 3], messages)).toBeUndefined()
  })

  it('can accept whitespace-only strings when required', async () => {
    expect(await evaluateFormRule({ required: true }, '   ', messages)).toBe('必填')
    expect(await evaluateFormRule({ required: true, whitespace: false }, '   ', messages)).toBeUndefined()
  })

  it('restricts values to an enum', async () => {
    expect(await evaluateFormRule({ enum: ['a', 'b'], message: '不在范围内' }, 'c', messages)).toBe('不在范围内')
    expect(await evaluateFormRule({ enum: ['a', 'b'] }, 'a', messages)).toBeUndefined()
  })

  it('applies transform before evaluating', async () => {
    const rule = { pattern: /^[A-Z]+$/, message: '需大写', transform: (value: unknown) => String(value).toUpperCase() }
    expect(await evaluateFormRule(rule, 'abc', messages)).toBeUndefined()
  })

  it('reports warning-only rules with the same message', async () => {
    expect(await evaluateFormRule({ warningOnly: true, required: true, message: '建议填写' }, '', messages))
      .toBe('建议填写')
  })
})
