import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MResult from './Result.vue'

describe('MResult', () => {
  it('renders success status with locale title', () => {
    const wrapper = mount(MResult, { props: { status: 'success' } })
    expect(wrapper.classes()).toContain('m-result--success')
    expect(wrapper.find('.m-result__title').text()).toBe('操作成功')
    expect(wrapper.find('.m-icon').exists()).toBe(true)
    expect(wrapper.attributes('role')).toBe('status')
  })

  it('normalizes warn and danger aliases', () => {
    const warn = mount(MResult, { props: { status: 'warning' } })
    expect(warn.classes()).toContain('m-result--warn')
    expect(warn.find('.m-result__title').text()).toBe('警告')

    const danger = mount(MResult, { props: { status: 'danger' } })
    expect(danger.classes()).toContain('m-result--error')
    expect(danger.find('.m-result__title').text()).toBe('操作失败')
  })

  it('supports http-style statuses', () => {
    const wrapper = mount(MResult, {
      props: {
        status: '404',
        description: '页面不存在或已被移除。',
      },
    })
    expect(wrapper.classes()).toContain('m-result--404')
    expect(wrapper.find('.m-result__title').text()).toBe('页面不存在')
    expect(wrapper.find('.m-result__description').text()).toContain('已被移除')
  })

  it('allows custom title, icon, and extra actions', () => {
    const wrapper = mount(MResult, {
      props: {
        status: 'success',
        title: '提交完成',
        icon: 'check',
      },
      slots: {
        extra: '<button type="button">返回</button>',
      },
    })
    expect(wrapper.find('.m-result__title').text()).toBe('提交完成')
    expect(wrapper.find('.m-result__extra button').text()).toBe('返回')
  })
})
