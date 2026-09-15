import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MEmpty from './Empty.vue'

describe('MEmpty', () => {
  it('renders default locale title and icon', () => {
    const wrapper = mount(MEmpty)
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.classes()).toContain('m-empty')
    expect(wrapper.find('.m-empty__title').text()).toBe('暂无数据')
    expect(wrapper.find('.m-icon').exists()).toBe(true)
  })

  it('renders title, description, and extra slot', () => {
    const wrapper = mount(MEmpty, {
      props: {
        title: '还没有课程',
        description: '创建第一门课程后即可展示。',
        icon: 'book',
      },
      slots: {
        extra: '<button type="button">创建</button>',
      },
    })
    expect(wrapper.find('.m-empty__title').text()).toBe('还没有课程')
    expect(wrapper.find('.m-empty__description').text()).toContain('创建第一门')
    expect(wrapper.find('.m-empty__extra button').text()).toBe('创建')
  })

  it('prefers image over icon', () => {
    const wrapper = mount(MEmpty, {
      props: {
        title: 'Empty',
        image: 'https://example.com/empty.svg',
        icon: 'database',
      },
    })
    expect(wrapper.find('.m-empty__image').exists()).toBe(true)
    expect(wrapper.find('.m-icon').exists()).toBe(false)
  })

  it('supports title and icon slots', () => {
    const wrapper = mount(MEmpty, {
      slots: {
        icon: '<span class="custom-icon">*</span>',
        title: '<span class="custom-title">Custom</span>',
        description: '<span class="custom-desc">Desc</span>',
      },
    })
    expect(wrapper.find('.custom-icon').exists()).toBe(true)
    expect(wrapper.find('.custom-title').text()).toBe('Custom')
    expect(wrapper.find('.custom-desc').text()).toBe('Desc')
  })
})
