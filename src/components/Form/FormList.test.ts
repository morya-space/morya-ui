import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick, reactive } from 'vue'
import MForm from './Form.vue'
import MFormList from './FormList.vue'
import { useForm } from './useForm'

interface Probe {
  keys: string[]
  path: unknown
  count: number
}

function mountList(initialValue: unknown = { title: '' }) {
  const form = useForm()
  const model = reactive<Record<string, unknown>>({})

  const wrapper = mount(MForm, {
    props: { form, model },
    slots: {
      default: () => h(MFormList, { name: 'items', initialValue: () => initialValue }, {
        default: (slotProps: any) =>
          h('div', { class: 'probe' }, JSON.stringify({
            keys: Object.keys(slotProps).sort(),
            path: slotProps.path,
            count: slotProps.fields.length,
          })),
      }),
    },
  })

  return { wrapper, form }
}

function probe(wrapper: ReturnType<typeof mount>): Probe {
  return JSON.parse(wrapper.get('.probe').text()) as Probe
}

describe('MFormList slot contract', () => {
  it('exposes fields, actions and the resolved path', () => {
    const { wrapper } = mountList()
    const result = probe(wrapper)

    expect(result.keys).toEqual(['add', 'fields', 'move', 'path', 'remove'])
    expect(result.path).toEqual(['items'])
    expect(result.count).toBe(0)
  })

  it('re-renders the rows when the model array changes', async () => {
    const { wrapper, form } = mountList()

    form.setFieldValue('items', [{ title: 'a' }, { title: 'b' }])
    await nextTick()

    expect(probe(wrapper).count).toBe(2)
  })
})

