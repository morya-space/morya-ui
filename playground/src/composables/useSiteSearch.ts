import type { CommandMenuItem } from '@well-insight/ui'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { listDocumentedComponents } from '../docs/loadComponentDocs'
import { listGuideDocs } from '../docs/guide/loadGuideDocs'
import { useDocsI18n } from '../i18n'

export function useSiteSearchItems() {
  const router = useRouter()
  const { lang, t } = useDocsI18n()

  return computed<CommandMenuItem[]>(() => {
    const items: CommandMenuItem[] = [
      {
        label: t.value.home,
        icon: 'home',
        command: () => router.push({ name: 'home' }),
      },
    ]

    for (const guide of listGuideDocs(lang.value)) {
      items.push({
        label: `${t.value.docs} · ${t.value.guideTitles[guide.slug] ?? guide.title}`,
        icon: 'menu',
        command: () => router.push({ name: 'docs', params: { slug: guide.slug } }),
      })
    }

    for (const component of listDocumentedComponents(lang.value)) {
      items.push({
        label: `${t.value.components} · ${component.name}`,
        icon: 'grip',
        command: () => router.push({ name: 'component-doc', params: { component: component.name } }),
      })
    }

    items.push({
      label: t.value.changelog,
      icon: 'clock',
      command: () => router.push({ name: 'changelog' }),
    })

    return items
  })
}

export function useSiteSearchPalette() {
  const visible = ref(false)
  const items = useSiteSearchItems()

  function open() {
    visible.value = true
  }

  function toggle() {
    visible.value = !visible.value
  }

  return { visible, items, open, toggle }
}
