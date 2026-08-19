import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import WdForm from './Form.vue'
import WdFormItem from './FormItem.vue'

describe('WdForm / WdFormItem', () => {
  it('renders label, required mark, and error alert', () => {
    const wrapper = mount(WdForm, {
      slots: {
        default: () =>
          h(
            WdFormItem,
            { label: '名称', required: true, error: '必填项' },
            { default: () => h('input') },
          ),
      },
    })

    expect(wrapper.get('.wd-form-item__label').text()).toContain('名称')
    expect(wrapper.get('.wd-form-item__required').text()).toBe('*')
    expect(wrapper.get('.wd-form-item__error').text()).toBe('必填项')
    expect(wrapper.get('.wd-form-item').classes()).toContain('wd-form-item--invalid')
  })

  it('inherits left label layout from Form', () => {
    const wrapper = mount(WdForm, {
      props: { labelPosition: 'left', labelWidth: '6rem' },
      slots: {
        default: () =>
          h(WdFormItem, { label: '邮箱' }, { default: () => h('input') }),
      },
    })

    expect(wrapper.get('.wd-form').classes()).toContain('wd-form--label-left')
    expect(wrapper.get('.wd-form-item').classes()).toContain('wd-form-item--label-left')
    expect(wrapper.get('.wd-form-item__label').attributes('style')).toContain('6rem')
  })

  it('shows help when there is no error', () => {
    const wrapper = mount(WdFormItem, {
      props: { label: '备注', help: '可选' },
      slots: { default: () => h('input') },
    })
    expect(wrapper.get('.wd-form-item__help').text()).toBe('可选')
    expect(wrapper.find('.wd-form-item__error').exists()).toBe(false)
  })

  it('validates on submit via field validate callbacks', async () => {
    const value = ref('')
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            WdForm,
            { validateOn: 'submit' },
            {
              default: () =>
                h(
                  WdFormItem,
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
    expect(wrapper.get('.wd-form-item__error').text()).toBe('必填')
  })
})
