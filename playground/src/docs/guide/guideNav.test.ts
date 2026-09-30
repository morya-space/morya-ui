import { describe, expect, it } from 'vitest'
import {
  findGuideNavGroupId,
  findGuideNavSectionId,
  GUIDE_NAV_GROUPS,
  listGuideNavDocSlugs,
  listGuideNavGroups,
} from './guideNav'

const DESIGN_SLUGS = [
  'design',
  'design-color',
  'design-typography',
  'design-spacing',
  'design-layout',
  'design-feedback',
]

function docSlugsOf(section: 'docs' | 'design'): string[] {
  return listGuideNavGroups(section).flatMap((group) =>
    group.items.flatMap((item) => (item.kind === 'doc' ? [item.slug] : [])),
  )
}

describe('guideNav sections', () => {
  it('splits the docs and design menus without overlap', () => {
    const docsSlugs = docSlugsOf('docs')
    const designSlugs = docSlugsOf('design')

    expect(designSlugs.sort()).toEqual([...DESIGN_SLUGS].sort())
    for (const slug of DESIGN_SLUGS) {
      expect(docsSlugs).not.toContain(slug)
    }
    expect(docsSlugs.filter((slug) => designSlugs.includes(slug))).toEqual([])
  })

  it('renders the design menu as a single flat group', () => {
    const groups = listGuideNavGroups('design')
    expect(groups).toHaveLength(1)
    expect(groups[0]?.id).toBe('design')
  })

  it('maps design-language slugs to the design section', () => {
    for (const slug of DESIGN_SLUGS) {
      expect(findGuideNavSectionId(slug)).toBe('design')
      expect(findGuideNavGroupId(slug)).toBe('design')
    }
  })

  it('keeps design-tokens and other guides in the docs section', () => {
    for (const slug of [
      'design-tokens',
      'theme',
      'motion',
      'introduction',
      'recipe-form-login',
    ]) {
      expect(findGuideNavSectionId(slug)).toBe('docs')
    }
  })

  it('lists every nav doc slug exactly once', () => {
    const all = listGuideNavDocSlugs()
    expect(new Set(all).size).toBe(all.length)

    const sectioned = GUIDE_NAV_GROUPS.flatMap((group) =>
      group.items.flatMap((item) => (item.kind === 'doc' ? [item.slug] : [])),
    )
    expect(new Set(sectioned)).toEqual(new Set(all))
  })
})
