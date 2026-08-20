import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import WiCascadeSelect from './CascadeSelect.vue'

const options = [
  {
    label: 'Electronics',
    value: 'electronics',
    children: [
      { label: 'Phone', value: 'phone' },
      { label: 'Laptop', value: 'laptop' },
    ],
  },
  { label: 'Books', value: 'books' },
]

describe('WiCascadeSelect', () => {
  it('opens nested columns and selects a leaf', async () => {
    const wrapper = mount(WiCascadeSelect, {
      props: { options, modelValue: null, teleport: false },
    })
    await wrapper.find('.wi-cascadeselect__trigger').trigger('click')
    expect(wrapper.findAll('.wi-cascadeselect__column')).toHaveLength(1)
    await wrapper.findAll('.wi-cascadeselect__option')[0]!.trigger('click')
    expect(wrapper.findAll('.wi-cascadeselect__column')).toHaveLength(2)
    const phone = wrapper.findAll('.wi-cascadeselect__option').find((node) => node.text().includes('Phone'))
    await phone!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['phone'])
  })

  it('shows selected label', () => {
    const wrapper = mount(WiCascadeSelect, { props: { options, modelValue: 'laptop' } })
    expect(wrapper.find('.wi-cascadeselect__label').text()).toBe('Laptop')
  })

  it('teleports the panel to body by default', async () => {
    const wrapper = mount(WiCascadeSelect, {
      props: { options, modelValue: null },
      attachTo: document.body,
    })
    await wrapper.find('.wi-cascadeselect__trigger').trigger('click')
    await nextTick()
    expect(document.body.querySelector('.wi-cascadeselect__panel--teleported')).toBeTruthy()
    wrapper.unmount()
  })

  it('keeps the overlay as wide as the trigger', async () => {
    const wrapper = mount(WiCascadeSelect, {
      props: { options, modelValue: null, teleport: false },
      attachTo: document.body,
    })
    const trigger = wrapper.get('.wi-cascadeselect__trigger').element as HTMLElement
    Object.defineProperty(trigger, 'getBoundingClientRect', {
      value: () => ({
        width: 240,
        height: 34,
        top: 10,
        left: 16,
        bottom: 44,
        right: 256,
        x: 16,
        y: 10,
        toJSON() {
          return {}
        },
      }),
    })
    await wrapper.find('.wi-cascadeselect__trigger').trigger('click')
    await nextTick()
    const panel = wrapper.get('.wi-cascadeselect__panel')
    expect(panel.attributes('style')).toContain('width: 240px')
    await wrapper.findAll('.wi-cascadeselect__option')[0]!.trigger('click')
    await nextTick()
    expect(wrapper.findAll('.wi-cascadeselect__column')).toHaveLength(2)
    expect(wrapper.get('.wi-cascadeselect__panel').attributes('style')).toContain('width: 240px')
    wrapper.unmount()
  })
})
