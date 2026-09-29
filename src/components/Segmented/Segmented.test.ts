import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MSegmented from './Segmented.vue'

const options = [
  'Daily',
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly', disabled: true },
]

describe('MSegmented', () => {
  it('emits selection and exposes radiogroup', async () => {
    const wrapper = mount(MSegmented, { props: { options, modelValue: 'Daily' } })
    expect(wrapper.attributes('role')).toBe('radiogroup')
    const items = wrapper.findAll('.m-segmented__item')
    expect(items[0]!.classes()).toContain('m-segmented__item--checked')
    await items[1]!.find('input').setValue(true)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['weekly'])
  })

  it('normalizes string options and maps block / round / size', () => {
    const wrapper = mount(MSegmented, {
      props: { options: ['a', 'b'], block: true, shape: 'round', size: 'large' },
    })
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['m-segmented--block', 'm-segmented--round', 'm-segmented--large']),
    )
  })

  it('ignores disabled options', async () => {
    const wrapper = mount(MSegmented, { props: { options, modelValue: 'weekly' } })
    await wrapper.findAll('.m-segmented__item')[2]!.find('input').setValue(true)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('supports horizontal arrow keys on the group', async () => {
    const wrapper = mount(MSegmented, {
      props: { options: ['a', 'b', 'c'], modelValue: 'a' },
      attachTo: document.body,
    })
    const group = wrapper.get('.m-segmented')
    await group.trigger('keydown', { key: 'ArrowRight' })
    await group.trigger('keydown', { key: 'ArrowRight' })
    await group.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['b'])
    wrapper.unmount()
  })
})
