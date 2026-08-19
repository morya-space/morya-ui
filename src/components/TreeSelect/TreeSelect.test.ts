import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import WdTreeSelect from './TreeSelect.vue'

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

describe('WdTreeSelect', () => {
  it('selects a tree node from the dropdown', async () => {
    const wrapper = mount(WdTreeSelect, {
      props: { options, modelValue: null, teleport: false },
    })
    await wrapper.find('.wd-treeselect__trigger').trigger('click')
    await wrapper.find('.wd-treeselect__toggler').trigger('click')
    await wrapper.findAll('.wd-treeselect__option').find((n) => n.text() === 'Resume')!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['resume'])
  })

  it('shows selected label', () => {
    const wrapper = mount(WdTreeSelect, { props: { options, modelValue: 'home' } })
    expect(wrapper.find('.wd-treeselect__label').text()).toBe('Home')
  })

  it('teleports the panel to body by default', async () => {
    const wrapper = mount(WdTreeSelect, {
      props: { options, modelValue: null },
      attachTo: document.body,
    })
    await wrapper.find('.wd-treeselect__trigger').trigger('click')
    await nextTick()
    expect(document.body.querySelector('.wd-treeselect__panel--teleported')).toBeTruthy()
    wrapper.unmount()
  })
})
