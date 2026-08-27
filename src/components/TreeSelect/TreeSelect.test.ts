import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import WiTreeSelect from './TreeSelect.vue'

const options = [
  {
    key: 'docs',
    label: 'Documents',
    children: [
      { key: 'resume', label: 'Resume' },
      { key: 'home', label: 'Home' },
    ],
  },
]

describe('wiTreeSelect', () => {
  it('selects a tree node from the dropdown', async () => {
    const wrapper = mount(WiTreeSelect, {
      props: { options, modelValue: null, teleport: false },
    })
    await wrapper.find('.wi-treeselect__trigger').trigger('click')
    await wrapper.find('.wi-treeselect__toggler').trigger('click')
    await wrapper.findAll('.wi-treeselect__option').find((n) => n.text() === 'Resume')!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['resume'])
  })

  it('shows selected label', () => {
    const wrapper = mount(WiTreeSelect, { props: { options, modelValue: 'home' } })
    expect(wrapper.find('.wi-treeselect__label').text()).toBe('Home')
  })

  it('teleports the panel to body by default', async () => {
    const wrapper = mount(WiTreeSelect, {
      props: { options, modelValue: null },
      attachTo: document.body,
    })
    await wrapper.find('.wi-treeselect__trigger').trigger('click')
    await nextTick()
    expect(document.body.querySelector('.wi-treeselect__panel--teleported')).toBeTruthy()
    wrapper.unmount()
  })

  it('selects multiple keys and filters nodes', async () => {
    const wrapper = mount(WiTreeSelect, {
      props: { options, modelValue: [], multiple: true, filterable: true, teleport: false },
    })
    await wrapper.find('.wi-treeselect__trigger').trigger('click')
    await wrapper.find('.wi-treeselect__filter').setValue('Resume')
    await wrapper.find('.wi-treeselect__toggler').trigger('click')
    await wrapper.findAll('.wi-treeselect__option').find((n) => n.text() === 'Resume')!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['resume']])
  })
})
