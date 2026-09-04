import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import WdForm from './Form.vue'
import WdFormItem from './FormItem.vue'

describe('wdForm / WdFormItem', () => {
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

  it('accepts labelPlacement as an alias of labelPosition', () => {
    const wrapper = mount(WdForm, {
      props: { labelPlacement: 'left', labelWidth: 80 },
      slots: {
        default: () => h(WdFormItem, { label: '邮箱' }, { default: () => h('input') }),
      },
    })
    expect(wrapper.get('.wd-form').classes()).toContain('wd-form--label-left')
    expect(wrapper.get('.wd-form-item__label').attributes('style')).toContain('80px')
  })

  it('applies inline layout and labelAlign', () => {
    const wrapper = mount(WdForm, {
      props: { inline: true, labelAlign: 'right' },
      slots: {
        default: () => h(WdFormItem, { label: '名称' }, { default: () => h('input') }),
      },
    })
    expect(wrapper.get('.wd-form').classes()).toContain('wd-form--inline')
    expect(wrapper.get('.wd-form').classes()).toContain('wd-form--align-right')
    expect(wrapper.get('.wd-form-item__label').attributes('style')).toContain('text-align: right')
  })

  it('validates declarative rules from model and always resolves', async () => {
    const Host = defineComponent({
      setup() {
        const model = ref({ name: '' })
        return () =>
          h(
            WdForm,
            {
              model: model.value,
              rules: { name: { required: true, message: '请输入名称' } },
            },
            {
              default: () =>
                h(WdFormItem, { label: '名称', name: 'name' }, { default: () => h('input') }),
            },
          )
      },
    })
    const wrapper = mount(Host)
    const form = wrapper.getComponent(WdForm)
    const result = await form.vm.validate()
    expect(result.valid).toBe(false)
    expect(result.errors.name).toBe('请输入名称')
    expect(wrapper.get('.wd-form-item__error').text()).toBe('请输入名称')
    expect(wrapper.get('.wd-form-item__required').text()).toBe('*')
  })

  it('merges item rules after form rules and validates a single field', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            WdForm,
            {
              model: { email: 'a' },
              rules: { email: { required: true } },
            },
            {
              default: () =>
                h(
                  WdFormItem,
                  {
                    label: '邮箱',
                    name: 'email',
                    rules: { pattern: /.[^\n\r@\u2028\u2029]*@.+\..+/, message: '邮箱格式不正确' },
                  },
                  { default: () => h('input') },
                ),
            },
          )
      },
    })
    const wrapper = mount(Host)
    const result = await wrapper.getComponent(WdForm).vm.validate('email')
    expect(result.valid).toBe(false)
    expect(result.errors.email).toBe('邮箱格式不正确')
  })

  it('runs blur-only rules on focusout, not on input', async () => {
    const Host = defineComponent({
      setup() {
        const model = ref({ title: '' })
        return () =>
          h(
            WdForm,
            {
              model: model.value,
              validateOn: 'submit',
              rules: { title: { required: true, message: '标题不能为空', trigger: 'blur' } },
            },
            {
              default: () =>
                h(WdFormItem, { label: '标题', name: 'title' }, { default: () => h('input') }),
            },
          )
      },
    })
    const wrapper = mount(Host)
    await wrapper.get('.wd-form-item').trigger('input')
    await nextTick()
    expect(wrapper.find('.wd-form-item__error').exists()).toBe(false)

    await wrapper.get('.wd-form-item').trigger('focusout')
    await nextTick()
    expect(wrapper.get('.wd-form-item__error').text()).toBe('标题不能为空')
  })

  it('clears a field error via clearValidate', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            WdForm,
            { model: { name: '' }, rules: { name: { required: true, message: '必填' } } },
            {
              default: () =>
                h(WdFormItem, { label: '名称', name: 'name' }, { default: () => h('input') }),
            },
          )
      },
    })
    const wrapper = mount(Host)
    const form = wrapper.getComponent(WdForm)
    await form.vm.validate()
    expect(wrapper.get('.wd-form-item__error').exists()).toBe(true)
    form.vm.clearValidate('name')
    await nextTick()
    expect(wrapper.find('.wd-form-item__error').exists()).toBe(false)
  })

  it('resets model values to the initial snapshot', async () => {
    const model = { name: 'Alice', email: 'a@example.com' }
    const wrapper = mount(WdForm, {
      props: { model },
      slots: {
        default: () => h(WdFormItem, { label: '名称', name: 'name' }, { default: () => h('input') }),
      },
    })
    const form = wrapper.getComponent(WdForm)
    model.name = 'Bob'
    model.email = 'b@example.com'
    form.vm.reset()
    await nextTick()
    expect(model.name).toBe('Alice')
    expect(model.email).toBe('a@example.com')
  })

  it('applies disabled fieldset suppression and size class', () => {
    const wrapper = mount(WdForm, {
      props: { disabled: true, size: 'small' },
      slots: { default: () => h('input') },
    })
    expect(wrapper.get('form').attributes('aria-disabled')).toBe('true')
    expect(wrapper.get('fieldset').attributes('disabled')).toBeDefined()
    expect(wrapper.get('.wd-form').classes()).toContain('wd-form--size-small')
  })
})
