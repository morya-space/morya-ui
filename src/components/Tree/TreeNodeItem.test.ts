import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, provide } from 'vue'
import { WI_TREE_KEY } from './context'
import type { TreeNode } from './types'
import TreeNodeItem from './TreeNodeItem.vue'

const node: TreeNode = { key: '1', label: 'Docs', children: [{ key: '1-1', label: 'Readme' }] }

function mountNode(overrides: Partial<Parameters<typeof mount>[1]> = {}) {
  const Host = {
    setup() {
      provide(WI_TREE_KEY, {
        isExpanded: (key: string) => key === '1',
        isSelected: () => false,
        isChecked: () => false,
        isIndeterminate: () => false,
        isDisabled: () => false,
        isLeaf: (n: TreeNode) => !n.children?.length,
        isMatch: () => true,
        showCheckbox: false,
        draggable: false,
        lazy: false,
        loadingKeys: {},
        toggleExpand: vi.fn(),
        select: vi.fn(),
        toggleCheck: vi.fn(),
        onDragStart: vi.fn(),
        onDragOver: vi.fn(),
        onDrop: vi.fn(),
      })
      return () => h(TreeNodeItem, { node })
    },
  }
  return mount(Host, overrides)
}

describe('TreeNodeItem', () => {
  it('renders expanded node with children', () => {
    const wrapper = mountNode()
    expect(wrapper.get('.wi-tree__label').text()).toBe('Docs')
    expect(wrapper.find('.wi-tree__node .wi-tree__node').exists()).toBe(true)
  })

  it('calls tree select on label click', async () => {
    const select = vi.fn()
    const Host = {
      setup() {
        provide(WI_TREE_KEY, {
          isExpanded: () => true,
          isSelected: () => false,
          isChecked: () => false,
          isIndeterminate: () => false,
          isDisabled: () => false,
          isLeaf: () => false,
          isMatch: () => true,
          showCheckbox: false,
          draggable: false,
          lazy: false,
          loadingKeys: {},
          toggleExpand: vi.fn(),
          select,
          toggleCheck: vi.fn(),
          onDragStart: vi.fn(),
          onDragOver: vi.fn(),
          onDrop: vi.fn(),
        })
        return () => h(TreeNodeItem, { node })
      },
    }
    const wrapper = mount(Host)
    await wrapper.get('.wi-tree__label').trigger('click')
    expect(select).toHaveBeenCalledWith(node)
  })
})
