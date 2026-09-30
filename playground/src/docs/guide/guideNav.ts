export type GuideNavGroupId =
  "start" | "theme" | "design" | "recipes" | "usage" | "agents";

/** Top-level site sections that own a separate sidebar menu. */
export type GuideNavSectionId = "docs" | "design";

export type GuideNavItem =
  | {
      kind: "doc";
      slug: string;
    }
  | {
      kind: "link";
      id: string;
      /** i18n key under guideTitles, falling back to id */
      titleKey: string;
      to: { name: string; params?: Record<string, string> };
      externalHint?: boolean;
    };

export interface GuideNavGroup {
  id: GuideNavGroupId;
  /** Which top-level sidebar menu this group belongs to. */
  section: GuideNavSectionId;
  items: GuideNavItem[];
}

/** Sidebar source of truth for docs grouping, order and section split. */
export const GUIDE_NAV_GROUPS: GuideNavGroup[] = [
  {
    id: "start",
    section: "docs",
    items: [
      { kind: "doc", slug: "introduction" },
      { kind: "doc", slug: "learning-path" },
      { kind: "doc", slug: "quick-start" },
      { kind: "doc", slug: "setup" },
      { kind: "doc", slug: "ssr" },
    ],
  },
  {
    id: "theme",
    section: "docs",
    items: [
      { kind: "doc", slug: "theme" },
      { kind: "doc", slug: "motion" },
      { kind: "doc", slug: "design-tokens" },
      {
        kind: "link",
        id: "theme-editor",
        titleKey: "theme-editor",
        to: { name: "theme-editor" },
        externalHint: true,
      },
    ],
  },
  {
    id: "design",
    section: "design",
    items: [
      { kind: "doc", slug: "design" },
      { kind: "doc", slug: "design-color" },
      { kind: "doc", slug: "design-typography" },
      { kind: "doc", slug: "design-spacing" },
      { kind: "doc", slug: "design-layout" },
      { kind: "doc", slug: "design-feedback" },
    ],
  },
  {
    id: "recipes",
    section: "docs",
    items: [
      { kind: "doc", slug: "recipe-form-login" },
      { kind: "doc", slug: "recipe-table-filter" },
      { kind: "doc", slug: "recipe-confirm-flow" },
      { kind: "doc", slug: "recipe-admin-layout" },
      { kind: "doc", slug: "recipe-theme-customize" },
      { kind: "doc", slug: "recipe-ssr-nuxt" },
    ],
  },
  {
    id: "usage",
    section: "docs",
    items: [
      { kind: "doc", slug: "attrs" },
      { kind: "doc", slug: "common-props" },
      { kind: "doc", slug: "types" },
      { kind: "doc", slug: "config" },
      { kind: "doc", slug: "accessibility" },
      { kind: "doc", slug: "conventions" },
    ],
  },
  {
    id: "agents",
    section: "docs",
    items: [
      { kind: "doc", slug: "for-agents" },
      { kind: "doc", slug: "ai-setup" },
      { kind: "doc", slug: "agent-skill" },
      { kind: "doc", slug: "mcp" },
    ],
  },
];

export function findGuideNavGroupId(slug: string): GuideNavGroupId | null {
  for (const group of GUIDE_NAV_GROUPS) {
    for (const item of group.items) {
      if (item.kind === "doc" && item.slug === slug) return group.id;
      if (item.kind === "link" && item.id === slug) return group.id;
    }
  }
  if (slug === "design" || slug.startsWith("design-")) return "design";
  return null;
}

export function findGuideNavSectionId(slug: string): GuideNavSectionId {
  return findGuideNavGroupId(slug) === "design" ? "design" : "docs";
}

export function listGuideNavGroups(
  section: GuideNavSectionId,
): GuideNavGroup[] {
  return GUIDE_NAV_GROUPS.filter((group) => group.section === section);
}

export function listGuideNavDocSlugs(): string[] {
  const slugs: string[] = [];
  for (const group of GUIDE_NAV_GROUPS) {
    for (const item of group.items) {
      if (item.kind === "doc") slugs.push(item.slug);
    }
  }
  return slugs;
}
