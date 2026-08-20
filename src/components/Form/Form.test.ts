import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import WiForm from './Form.vue'
import WiFormItem from './FormItem.vue'

describe('WiForm / WiFormItem', () => {
  it('renders label, required mark, and error alert', () => {
    const wrapper = mount(WiForm, {
      slots: {
        default: () =>
          h(
            WiFormItem,
            { label: '名称', required: true, error: '必填项' },
            { default: () => h('input') },
          ),
      },
    })

    expect(wrapper.get('.wi-form-item__label').text()).toContain('名称')
    expect(wrapper.get('.wi-form-item__required').text()).toBe('*')
    expect(wrapper.get('.wi-form-item__error').text()).toBe('必填项')
    expect(wrapper.get('.wi-form-item').classes()).toContain('wi-form-item--invalid')
  })

  it('inherits left label layout from Form', () => {
    const wrapper = mount(WiForm, {
      props: { labelPosition: 'left', labelWidth: '6rem' },
      slots: {
        default: () =>
          h(WiFormItem, { label: '邮箱' }, { default: () => h('input') }),
      },
    })

    expect(wrapper.get('.wi-form').classes()).toContain('wi-form--label-left')
    expect(wrapper.get('.wi-form-item').classes()).toContain('wi-form-item--label-left')
    expect(wrapper.get('.wi-form-item__label').attributes('style')).toContain('6rem')
  })

  it('shows help when there is no error', () => {
    const wrapper = mount(WiFormItem, {
      props: { label: '备注', help: '可选' },
      slots: { default: () => h('input') },
    })
    expect(wrapper.get('.wi-form-item__help').text()).toBe('可选')
    expect(wrapper.find('.wi-form-item__error').exists()).toBe(false)
  })

  it('validates on submit via field validate callbacks', async () => {
    const value = ref('')
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            WiForm,
            { validateOn: 'submit' },
            {
              default: () =>
                h(
                  WiFormItem,
                  {
                    label: '名称',
                    name: 'name',
                    validate: () => (value.value.trim() ? undefined : '必填'),
                  },
                  { default: () => h('input', { value: value.value }) },
                ),
            },
          )
      },
    })
    const wrapper = mount(Host)
    await wrapper.get('form').trigger('submit')
    await nextTick()
    expect(wrapper.get('.wi-form-item__error').text()).toBe('必填')
  })
})
