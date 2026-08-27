import type {VNode} from 'vue';
import { Comment, Fragment, Text  } from 'vue'

/** Flatten default-slot VNodes, skipping comments and empty text. */
export function flattenVNodes(nodes: VNode[] | undefined | null): VNode[] {
  if (!nodes?.length) return []
  const result: VNode[] = []
  for (const node of nodes) {
    if (node.type === Comment) continue
    if (node.type === Text && !String(node.children ?? '').trim()) continue
    if (node.type === Fragment && Array.isArray(node.children)) {
      result.push(...flattenVNodes(node.children as VNode[]))
      continue
    }
    result.push(node)
  }
  return result
}
