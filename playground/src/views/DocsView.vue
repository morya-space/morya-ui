<script setup lang="ts">
import type { DocSection } from "../composables/useDocSections";
import type {
    GuideNavGroupId,
    ResolvedGuideDoc,
} from "../docs/guide/loadGuideDocs";
import { MIcon, MScrollbar } from "morya-ui";
import { computed, nextTick, reactive, ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import ComponentDocViewer from "../components/ComponentDocViewer.vue";
import DocSectionNav from "../components/DocSectionNav.vue";
import MobileSidebarShell from "../components/MobileSidebarShell.vue";
import {
    findGuideNavGroupId,
    findGuideNavSectionId,
    guideDocExists,
    listGuideDocs,
    listGuideNavGroups,
    resolveGuideDoc,
} from "../docs/guide/loadGuideDocs";
import { useDocsI18n } from "../i18n";

const route = useRoute();
const router = useRouter();
const { lang, t } = useDocsI18n();
const guides = computed(() => listGuideDocs(lang.value));
const guideBySlug = computed(
    () => new Map(guides.value.map((item) => [item.slug, item])),
);
const activeDoc = ref<ResolvedGuideDoc | null>(null);
const docLoading = ref(false);
const docViewerRef = ref<InstanceType<typeof ComponentDocViewer> | null>(null);
const docSections = ref<DocSection[]>([]);
const activeDocSectionId = ref("");
const contentScroll = ref<InstanceType<typeof MScrollbar> | null>(null);

const activeSlug = computed(() => {
    const slug = route.params.slug;
    return typeof slug === "string" && slug ? slug : "introduction";
});

const activeGroupId = computed(() => findGuideNavGroupId(activeSlug.value));
const activeSection = computed(() => findGuideNavSectionId(activeSlug.value));
const sidebarTitle = computed(() =>
    activeSection.value === "design" ? t.value.design : t.value.docsTitle,
);

const expandedGroups = reactive<Record<GuideNavGroupId, boolean>>({
    start: true,
    theme: false,
    design: false,
    recipes: false,
    usage: false,
    agents: false,
});

watch(
    activeGroupId,
    (groupId) => {
        expandedGroups.start = true;
        if (groupId) expandedGroups[groupId] = true;
    },
    { immediate: true },
);

const navGroups = computed(() => {
    return listGuideNavGroups(activeSection.value)
        .map((group) => {
            const items = group.items.flatMap((item) => {
                if (item.kind === "doc") {
                    const meta = guideBySlug.value.get(item.slug);
                    if (!meta) return [];
                    return [
                        {
                            key: item.slug,
                            kind: "doc" as const,
                            slug: item.slug,
                            label: t.value.guideTitles[item.slug] ?? meta.title,
                            to: {
                                name: "docs" as const,
                                params: { slug: item.slug },
                            },
                            externalHint: false,
                        },
                    ];
                }

                return [
                    {
                        key: item.id,
                        kind: "link" as const,
                        slug: item.id,
                        label:
                            t.value.guideTitles[item.titleKey] ?? item.titleKey,
                        to: item.to,
                        externalHint: Boolean(item.externalHint),
                    },
                ];
            });

            return {
                id: group.id,
                title: t.value.guideGroups[group.id],
                items,
                open: expandedGroups[group.id],
            };
        })
        .filter((group) => group.items.length > 0);
});

/** A single-group section (e.g. design) renders as a flat list. */
const showGroupHeaders = computed(() => navGroups.value.length > 1);

function toggleGroup(id: GuideNavGroupId) {
    if (id === "start") {
        expandedGroups.start = true;
        return;
    }
    expandedGroups[id] = !expandedGroups[id];
}

function isItemActive(slug: string) {
    if (activeSlug.value === slug) return true;
    if (slug === "theme-editor" && route.name === "theme-editor") return true;
    return false;
}

function onDocSectionsChange(sections: DocSection[]) {
    docSections.value = sections;
}

function onActiveDocSectionChange(id: string) {
    activeDocSectionId.value = id;
}

function scrollToDocSection(id: string) {
    activeDocSectionId.value = id;
    docViewerRef.value?.scrollToSection(id);
}

watch(
    [activeSlug, lang],
    async () => {
        await nextTick();
        contentScroll.value?.setScrollTop?.(0);
        docSections.value = [];
        activeDocSectionId.value = "";

        if (!guideDocExists(activeSlug.value, lang.value)) {
            if (guides.value[0])
                void router.replace({
                    name: "docs",
                    params: { slug: guides.value[0].slug },
                });
            activeDoc.value = null;
            return;
        }
        docLoading.value = true;
        activeDoc.value = await resolveGuideDoc(activeSlug.value, lang.value);
        docLoading.value = false;
    },
    { immediate: true },
);
</script>

<template>
    <div class="docs-shell">
        <MobileSidebarShell
            class="docs-sidebar"
            :title="sidebarTitle"
            :toggle-label="t.openNav"
            scroll-class="docs-scroll"
            body-class="docs-sidebar__body"
        >
            <h1 class="docs-sidebar__title">
                {{ sidebarTitle }}
            </h1>
            <nav class="docs-nav" :aria-label="t.docsNav">
                <section
                    v-for="group in navGroups"
                    :key="group.id"
                    class="docs-nav__group"
                >
                    <button
                        v-if="showGroupHeaders"
                        type="button"
                        class="docs-nav__group-toggle"
                        :aria-expanded="group.open"
                        @click="toggleGroup(group.id)"
                    >
                        <span>{{ group.title }}</span>
                        <MIcon
                            class="docs-nav__chevron"
                            :class="{ 'is-open': group.open }"
                            name="chevron-down"
                            size="sm"
                            aria-hidden="true"
                        />
                    </button>
                    <div
                        v-show="!showGroupHeaders || group.open"
                        class="docs-nav__items"
                    >
                        <RouterLink
                            v-for="item in group.items"
                            :key="item.key"
                            class="docs-nav__item"
                            :class="{ 'is-active': isItemActive(item.slug) }"
                            :to="item.to"
                        >
                            <span>{{ item.label }}</span>
                            <span
                                v-if="item.externalHint"
                                class="docs-nav__external"
                                :title="t.openTool"
                            >
                                <MIcon
                                    name="external-link"
                                    size="sm"
                                    aria-hidden="true"
                                />
                                <span class="sr-only">{{ t.openTool }}</span>
                            </span>
                        </RouterLink>
                    </div>
                </section>
            </nav>
        </MobileSidebarShell>

        <main class="docs-main">
            <MScrollbar ref="contentScroll" class="docs-scroll">
                <div class="docs-main__body">
                    <p
                        v-if="docLoading"
                        class="docs-loading"
                        aria-live="polite"
                    >
                        …
                    </p>
                    <ComponentDocViewer
                        v-else-if="activeDoc"
                        ref="docViewerRef"
                        :key="`${activeDoc.slug}-${lang}`"
                        :doc="{
                            name: activeDoc.slug,
                            frontmatter: activeDoc.frontmatter,
                            component: activeDoc.component,
                        }"
                        @sections-change="onDocSectionsChange"
                        @active-section-change="onActiveDocSectionChange"
                    />
                    <section v-else class="docs-missing">
                        <h2>{{ t.docsMissing }}</h2>
                        <RouterLink
                            :to="{
                                name: 'docs',
                                params: { slug: 'introduction' },
                            }"
                        >
                            {{ t.backIntro }}
                        </RouterLink>
                    </section>
                </div>
            </MScrollbar>
        </main>

        <aside class="docs-toc" :aria-label="t.componentSection">
            <MScrollbar class="docs-scroll">
                <div class="docs-toc__body">
                    <DocSectionNav
                        :sections="docSections"
                        :active-id="activeDocSectionId"
                        @select="scrollToDocSection"
                    />
                </div>
            </MScrollbar>
        </aside>
    </div>
</template>

<style>
.docs-sidebar {
    background: color-mix(in srgb, var(--m-color-surface) 94%, transparent);
    border-right: 1px solid var(--docs-edge);
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
}

.docs-scroll {
    flex: 1;
    height: 100%;
    min-height: 0;
}

.docs-sidebar__body {
    padding: 1.5rem 1rem 2rem;
}

@media (max-width: 700px) {
    .docs-sidebar:not([data-open]) {
        border: 0;
    }
}
</style>

<style scoped>
.docs-shell {
    display: grid;
    flex: 1;
    grid-template-columns: 15.5rem minmax(0, 1fr) 14rem;
    min-height: 0;
    overflow: hidden;
}

.docs-sidebar__title {
    font-family: var(--docs-display);
    font-size: 1.4rem;
    font-weight: 700;
    letter-spacing: -0.04em;
    margin: 0 0 0.85rem;
}

.docs-nav {
    display: grid;
    gap: 0.65rem;
}

.docs-nav__group-toggle {
    align-items: center;
    background: transparent;
    border: 0;
    color: var(--m-color-text);
    cursor: pointer;
    display: flex;
    font-size: 0.72rem;
    font-weight: 700;
    justify-content: space-between;
    letter-spacing: 0.04em;
    padding: 0.35rem 0.55rem;
    text-transform: uppercase;
    width: 100%;
}

.docs-nav__chevron {
    color: var(--m-color-text-muted);
    transition: transform var(--m-motion-fast) var(--m-motion-ease);
}

.docs-nav__chevron.is-open {
    transform: rotate(180deg);
}

.docs-nav__items {
    display: grid;
    gap: 0.15rem;
    margin-top: 0.15rem;
}

.docs-nav__item {
    align-items: center;
    border: 1px solid transparent;
    border-radius: 0.7rem;
    color: var(--m-color-text-muted);
    display: flex;
    font-size: 0.86rem;
    font-weight: 500;
    gap: 0.35rem;
    justify-content: space-between;
    padding: 0.55rem 0.7rem;
    text-decoration: none;
    transition:
        color var(--m-motion-fast) var(--m-motion-ease),
        background var(--m-motion-fast) var(--m-motion-ease),
        border-color var(--m-motion-fast) var(--m-motion-ease);
}

.docs-nav__item:hover,
.docs-nav__item.is-active {
    background: color-mix(in srgb, var(--m-color-primary) 10%, transparent);
    color: var(--m-color-primary);
}

.docs-nav__item.is-active {
    border-color: color-mix(in srgb, var(--m-color-primary) 28%, transparent);
    font-weight: 700;
}

.docs-nav__external {
    color: var(--m-color-text-muted);
    display: inline-flex;
}

.sr-only {
    border: 0;
    clip: rect(0, 0, 0, 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    width: 1px;
}

.docs-main,
.docs-toc {
    display: flex;
    flex-direction: column;
    min-height: 0;
    min-width: 0;
    overflow: hidden;
}

.docs-toc {
    background: color-mix(in srgb, var(--m-color-surface) 94%, transparent);
    border-left: 1px solid var(--docs-edge);
}

.docs-toc__body {
    padding: 2.5rem 1.25rem;
}

.docs-toc__body :deep(.doc-section-nav) {
    position: sticky;
    top: 0;
}

.docs-main__body {
    margin: 0 auto;
    max-width: 48rem;
    padding: clamp(1.75rem, 4vw, 3rem) clamp(1.25rem, 4vw, 3rem) 4rem;
    width: 100%;
}

.docs-loading,
.docs-missing {
    color: var(--m-color-text-muted);
}

@media (max-width: 1100px) {
    .docs-shell {
        grid-template-columns: 15.5rem minmax(0, 1fr);
    }

    .docs-toc {
        display: none;
    }
}

@media (max-width: 700px) {
    .docs-shell {
        display: block;
        overflow: visible;
    }

    .docs-main {
        overflow: visible;
    }

    .docs-scroll {
        height: auto;
    }

    .docs-toc {
        display: none;
    }
}
</style>
