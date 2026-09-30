import type { Component } from "vue";
import type { DocsLang } from "../../i18n";
import type { GuideNavGroupId, GuideNavSectionId } from "./guideNav";
import guideDocsManifest from "virtual:guide-docs-manifest";
import {
  findGuideNavGroupId,
  findGuideNavSectionId,
  GUIDE_NAV_GROUPS,
  listGuideNavGroups,
} from "./guideNav";

export interface GuideDocFrontmatter {
  title?: string;
  order?: string | number;
  description?: string;
  group?: string;
}

export interface GuideDocMeta {
  slug: string;
  title: string;
  order: number;
  description?: string;
  group: GuideNavGroupId | null;
}

export interface ResolvedGuideDoc {
  slug: string;
  frontmatter: GuideDocFrontmatter;
  component: Component;
}

interface GuideModule {
  default: Component;
  frontmatter?: GuideDocFrontmatter;
}

type GuideLoader = () => Promise<GuideModule>;

const guideLoaders = import.meta.glob<GuideModule>("./*.md");

function parseGuidePath(path: string): { slug: string; lang: DocsLang } | null {
  const normalized = path.replace(/\\/g, "/");
  const match = normalized.match(/\/([^/]+?)(?:\.(en))?\.md$/);
  if (!match?.[1]) return null;
  return {
    slug: match[1],
    lang: match[2] === "en" ? "en-US" : "zh-CN",
  };
}

function manifestFrontmatter(
  slug: string,
  lang: DocsLang,
): GuideDocFrontmatter {
  const entry = guideDocsManifest[slug];
  if (!entry) return { title: slug, order: 99 };
  const raw = entry[lang] ?? entry["zh-CN"];
  return {
    title: raw.title ?? slug,
    order: raw.order,
    description: raw.description,
    group: raw.group,
  };
}

function findGuideLoader(
  slug: string,
  lang: DocsLang = "zh-CN",
): { path: string; loader: GuideLoader } | null {
  const entries = Object.entries(guideLoaders);
  const matchLang = (target: DocsLang) =>
    entries.find(([path]) => {
      const parsed = parseGuidePath(path);
      return parsed?.slug === slug && parsed.lang === target;
    });

  const primary =
    matchLang(lang) ?? (lang === "en-US" ? matchLang("zh-CN") : undefined);
  if (!primary) return null;
  return { path: primary[0], loader: primary[1] };
}

export function listGuideDocs(lang: DocsLang = "zh-CN"): GuideDocMeta[] {
  const bySlug = new Map<string, GuideDocMeta>();

  for (const slug of Object.keys(guideDocsManifest)) {
    const frontmatter = manifestFrontmatter(slug, lang);
    bySlug.set(slug, {
      slug,
      title: frontmatter.title ?? slug,
      order: Number(frontmatter.order ?? 99),
      description: frontmatter.description,
      group: findGuideNavGroupId(slug),
    });
  }

  // Prefer nav order when present; append unknown manifests at the end.
  const ordered: GuideDocMeta[] = [];
  const seen = new Set<string>();

  for (const group of GUIDE_NAV_GROUPS) {
    for (const item of group.items) {
      if (item.kind !== "doc") continue;
      const meta = bySlug.get(item.slug);
      if (!meta) continue;
      ordered.push({ ...meta, group: group.id });
      seen.add(item.slug);
    }
  }

  for (const meta of [...bySlug.values()].sort(
    (a, b) => a.order - b.order || a.slug.localeCompare(b.slug),
  )) {
    if (seen.has(meta.slug)) continue;
    ordered.push(meta);
  }

  return ordered;
}

export async function resolveGuideDoc(
  slug: string,
  lang: DocsLang = "zh-CN",
): Promise<ResolvedGuideDoc | null> {
  const resolved = findGuideLoader(slug, lang);
  if (!resolved) return null;
  const mod = await resolved.loader();
  const fromModule = mod.frontmatter;
  const fromManifest = manifestFrontmatter(slug, lang);
  return {
    slug,
    frontmatter: {
      title: fromModule?.title ?? fromManifest.title,
      order: fromModule?.order ?? fromManifest.order,
      description: fromModule?.description ?? fromManifest.description,
      group: fromModule?.group ?? fromManifest.group,
    },
    component: mod.default,
  };
}

export function guideDocExists(
  slug: string,
  lang: DocsLang = "zh-CN",
): boolean {
  return findGuideLoader(slug, lang) !== null;
}

export {
  findGuideNavGroupId,
  findGuideNavSectionId,
  GUIDE_NAV_GROUPS,
  listGuideNavGroups,
};
export type { GuideNavGroupId, GuideNavSectionId };
