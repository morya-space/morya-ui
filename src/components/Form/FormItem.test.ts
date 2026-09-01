import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import WiFormItem from './FormItem.vue'

describe('FormItem', () => {
  it('renders label, help, and invalid state standalone', () => {
    const wrapper = mount(WiFormItem, {
      props: { label: '名称', help: '可选', invalid: true, error: '格式错误' },
      slots: { default: () => h('input', { id: 'name' }) },
    })
    expect(wrapper.get('.wi-form-item__label').text()).toContain('名称')
    expect(wrapper.find('.wi-form-item__help').exists()).toBe(false)
    expect(wrapper.get('.wi-form-item__error').text()).toBe('格式错误')
    expect(wrapper.classes()).toContain('wi-form-item--invalid')
  })

  it('passes slot props for control wiring', () => {
    const wrapper = mount(WiFormItem, {
      props: { label: '邮箱', for: 'email-input' },
      slots: {
        default: (props: { id: string; invalid: boolean }) =>
          h('input', { id: props.id, 'aria-invalid': props.invalid || undefined }),
      },
    })
    expect(wrapper.get('input').attributes('id')).toBe('email-input')
  })
})
