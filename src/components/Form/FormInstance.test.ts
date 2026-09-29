import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, reactive } from 'vue'
import MForm from './Form.vue'
import MFormItem from './FormItem.vue'
import MFormList from './FormList.vue'
import { isFormInstance, useForm } from './useForm'

function textInput() {
  return h('input')
}

describe('useForm instance', () => {
  it('is recognised as a form instance', () => {
    expect(isFormInstance(useForm())).toBe(true)
    expect(isFormInstance({})).toBe(false)
  })

  it('warns when used before the form is mounted', () => {
    const form = useForm()
    expect(() => form.setFieldsValue({ a: 1 })).toThrow(/before the form was mounted/)
  })

  it('reads and writes values through the bound form', async () => {
    const form = useForm()
    mount(MForm, {
      props: { form },
      slots: {
        default: () => h(MFormItem, { name: 'name', label: 'Name' }, { default: textInput }),
      },
    })
    await nextTick()

    expect(form.getFieldsValue()).toEqual({})

    form.setFieldsValue({ name: 'Ada' })
    await nextTick()

    expect(form.getFieldValue('name')).toBe('Ada')
    expect(form.getFieldsValue()).toEqual({ name: 'Ada' })
  })

  it('supports nested name paths in both directions', async () => {
    const form = useForm()
    mount(MForm, { props: { form }, slots: { default: () => h('div') } })
    await nextTick()

    form.setFieldValue('user.name', 'Ada')
    expect(form.getFieldValue('user.name')).toBe('Ada')
    expect(form.getFieldValue(['user', 'name'])).toBe('Ada')

    form.setFieldsValue({ 'items[0].title': 'First' })
    expect(form.getFieldValue(['items', 0, 'title'])).toBe('First')
    expect(form.getFieldsValue()).toMatchObject({
      user: { name: 'Ada' },
      items: [{ title: 'First' }],
    })
  })

  it('applies initialValues once', async () => {
    const form = useForm()
    mount(MForm, {
      props: { form, initialValues: { name: 'seed', 'user.role': 'admin' } },
      slots: { default: () => h('div') },
    })
    await nextTick()

    expect(form.getFieldValue('name')).toBe('seed')
    expect(form.getFieldValue('user.role')).toBe('admin')
  })

  it('validates a nested field and clears it', async () => {
    const model = reactive<Record<string, unknown>>({ user: { name: '' } })
    const form = useForm()

    const wrapper = mount(MForm, {
      props: { form, model, rules: { 'user.name': { required: true, message: '必填' } } },
      slots: {
        default: () => h(MFormItem, { name: 'user.name', label: 'Name' }, { default: textInput }),
      },
    })
    await nextTick()

    const result = await form.validate()
    await nextTick()

    expect(result.valid).toBe(false)
    expect(result.errors['user.name']).toBe('必填')
    expect(wrapper.find('.m-form-item__error').exists()).toBe(true)

    form.clearValidate('user.name')
    await nextTick()
    expect(wrapper.find('.m-form-item__error').exists()).toBe(false)
  })

  it('resets fields back to the initial snapshot', async () => {
    const model = reactive<Record<string, unknown>>({ name: 'seed' })
    const form = useForm()

    mount(MForm, {
      props: { form, model },
      slots: {
        default: () => h(MFormItem, { name: 'name', label: 'Name' }, { default: textInput }),
      },
    })
    await nextTick()

    form.setFieldValue('name', 'changed')
    expect(form.getFieldValue('name')).toBe('changed')

    form.resetFields()
    expect(form.getFieldValue('name')).toBe('seed')
  })

  it('exposes errors and warnings through the instance', async () => {
    const form = useForm()
    mount(MForm, {
      props: {
        form,
        rules: {
          email: { type: 'email', message: '邮箱格式不正确' },
          nick: { warningOnly: true, required: true, message: '建议填写' },
        },
      },
      slots: {
        default: () => [
          h(MFormItem, { name: 'email', label: 'Email' }, { default: textInput }),
          h(MFormItem, { name: 'nick', label: 'Nick' }, { default: textInput }),
        ],
      },
    })
    await nextTick()

    form.setFieldValue('email', 'nope')
    const result = await form.validate()
    await nextTick()

    expect(result.valid).toBe(false)
    expect(form.errors.email).toBe('邮箱格式不正确')
    // Warning-only rules surface but do not block the form.
    expect(form.warnings.nick).toBe('建议填写')
    expect(result.errors.nick).toBeUndefined()
  })
})

describe('MForm warning-only rules', () => {
  it('renders a warning without marking the item invalid', async () => {
    const model = reactive<Record<string, unknown>>({ nick: '' })
    const form = useForm()

    const wrapper = mount(MForm, {
      props: { form, model, rules: { nick: { warningOnly: true, required: true, message: '建议填写' } } },
      slots: {
        default: () => h(MFormItem, { name: 'nick', label: 'Nick' }, { default: textInput }),
      },
    })
    await nextTick()

    const result = await form.validate()
    await nextTick()

    expect(result.valid).toBe(true)
    expect(wrapper.find('.m-form-item__warning').text()).toBe('建议填写')
    expect(wrapper.find('.m-form-item').classes()).not.toContain('m-form-item--invalid')
  })
})

describe('MFormItem dependencies', () => {
  it('re-validates when a dependency changes', async () => {
    const model = reactive<Record<string, unknown>>({ password: 'a', confirm: '' })

    const Host = defineComponent({
      setup() {
        return () =>
          h(MForm, { model }, {
            default: () => [
              h(MFormItem, { name: 'password', label: 'Password' }, { default: textInput }),
              h(MFormItem, {
                name: 'confirm',
                label: 'Confirm',
                dependencies: ['password'],
                validate: () => (model.confirm === model.password ? undefined : '两次输入不一致'),
              }, { default: textInput }),
            ],
          })
      },
    })

    const wrapper = mount(Host)
    await nextTick()
    expect(wrapper.find('.m-form-item__error').exists()).toBe(false)

    model.password = 'b'
    await nextTick()
    await flushPromises()

    expect(wrapper.find('.m-form-item__error').text()).toBe('两次输入不一致')
  })
})

describe('MFormList', () => {
  function mountList(initialValue: unknown = { title: '' }) {
    const form = useForm()
    const model = reactive<Record<string, unknown>>({})

    const Host = defineComponent({
      setup() {
        return () => h(MForm, { form, model }, {
          default: () => h(MFormList, { name: 'items', initialValue: () => initialValue }, {
            default: ({ fields, add, remove }: any) => [
              ...fields.map((field: any) =>
                h(MFormItem, { key: field.key, name: ['items', field.name, 'title'], label: 'Title' }, { default: textInput }),
              ),
              h('button', { class: 'add', onClick: () => add() }),
              h('button', { class: 'remove', onClick: () => remove(0) }),
            ],
          }),
        })
      },
    })

    return { wrapper: mount(Host), form }
  }

  it('adds rows with a fresh initial value', async () => {
    const { wrapper, form } = mountList()

    expect(form.getFieldValue('items')).toBeUndefined()

    await wrapper.get('.add').trigger('click')
    await wrapper.get('.add').trigger('click')
    await nextTick()

    expect(form.getFieldValue('items')).toEqual([{ title: '' }, { title: '' }])
    expect(wrapper.findAll('.m-form-item')).toHaveLength(2)
  })

  it('removes a row', async () => {
    const { wrapper, form } = mountList()

    await wrapper.get('.add').trigger('click')
    await wrapper.get('.add').trigger('click')
    await wrapper.get('.remove').trigger('click')
    await nextTick()

    expect(form.getFieldValue('items')).toEqual([{ title: '' }])
    expect(wrapper.findAll('.m-form-item')).toHaveLength(1)
  })

  it('validates the list itself', async () => {
    const form = useForm()
    const model = reactive<Record<string, unknown>>({})

    const Host = defineComponent({
      setup() {
        return () => h(MForm, { form, model }, {
          default: () => h(MFormList, {
            name: 'items',
            rules: { required: true, message: '至少一项' },
          }, { default: () => h('div') }),
        })
      },
    })

    mount(Host)
    await nextTick()

    const result = await form.validate()
    expect(result.valid).toBe(false)
    expect(result.errors.items).toBe('至少一项')
  })
})
