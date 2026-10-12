<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import {
    SITE_GITHUB_URL,
    SITE_LICENSE,
    SITE_LOGO_URL,
    SITE_NAME,
    SITE_NPM_URL,
    SITE_PACKAGE,
} from "../config/site";
import { getUiPackageMeta } from "../docs/packageMeta";
import { useDocsI18n } from "../i18n";

const uiMeta = getUiPackageMeta();
const { lang, t } = useDocsI18n();

const contributingUrl = computed(() =>
    lang.value === "zh-CN"
        ? `${SITE_GITHUB_URL}/blob/main/CONTRIBUTING.zh-CN.md`
        : `${SITE_GITHUB_URL}/blob/main/CONTRIBUTING.md`,
);
</script>

<template>
    <footer class="site-footer">
        <div class="site-footer__inner">
            <RouterLink
                class="site-footer__brand"
                :to="{ name: 'home' }"
                :aria-label="t.homeAria"
            >
                <img
                    class="site-footer__logo"
                    :src="SITE_LOGO_URL"
                    width="20"
                    height="20"
                    alt=""
                />
                <span>{{ SITE_NAME }}</span>
                <span class="site-footer__version">v{{ uiMeta.version }}</span>
            </RouterLink>

            <nav class="site-footer__nav" :aria-label="t.footerNavAria">
                <RouterLink
                    :to="{ name: 'docs', params: { slug: 'quick-start' } }"
                >
                    {{ t.docs }}
                </RouterLink>
                <RouterLink :to="{ name: 'components' }">
                    {{ t.components }}
                </RouterLink>
                <RouterLink :to="{ name: 'docs', params: { slug: 'design' } }">
                    {{ t.design }}
                </RouterLink>
                <RouterLink :to="{ name: 'theme-editor' }">
                    {{ t.themeEditor }}
                </RouterLink>
                <RouterLink
                    :to="{ name: 'docs', params: { slug: 'for-agents' } }"
                >
                    {{ t.agents }}
                </RouterLink>
                <a
                    :href="SITE_GITHUB_URL"
                    target="_blank"
                    rel="noopener noreferrer"
                    >GitHub</a
                >
                <a
                    :href="SITE_NPM_URL"
                    target="_blank"
                    rel="noopener noreferrer"
                    >npm</a
                >
                <a
                    :href="contributingUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {{ t.footerContributing }}
                </a>
            </nav>

            <p class="site-footer__meta">
                {{ SITE_PACKAGE }} · {{ SITE_LICENSE }}
            </p>
        </div>
    </footer>
</template>

<style scoped>
.site-footer {
    margin-top: 3rem;
    position: relative;
}

/* gradient hairline on top of the footer */
.site-footer::before {
    background: linear-gradient(
        90deg,
        transparent,
        var(--docs-primary-edge) 30%,
        var(--docs-primary-edge) 70%,
        transparent
    );
    content: '';
    height: 1px;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
}

.site-footer__inner {
    align-items: center;
    background: color-mix(in srgb, var(--m-color-surface) 82%, transparent);
    border-top: 1px solid var(--docs-edge);
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem 1.5rem;
    justify-content: space-between;
    padding: 1.35rem 0.25rem 0.5rem;
}

.site-footer__brand {
    align-items: center;
    color: var(--m-color-text);
    display: inline-flex;
    font-family: var(--docs-display);
    font-size: 0.9rem;
    font-weight: 700;
    gap: 0.5rem;
    letter-spacing: -0.03em;
    text-decoration: none;
    transition: opacity var(--m-motion-fast) var(--m-motion-ease);
}

.site-footer__brand:hover {
    opacity: 0.82;
}

.site-footer__logo {
    border-radius: 0.4rem;
    box-shadow: 0 0 0 1px var(--docs-edge);
    display: block;
}

.site-footer__version {
    background: var(--docs-primary-soft);
    border: 1px solid var(--docs-primary-edge);
    border-radius: 999px;
    color: var(--m-color-primary);
    font-family: var(--docs-mono);
    font-size: 0.64rem;
    font-weight: 600;
    letter-spacing: 0.03em;
    line-height: 1;
    padding: 0.22rem 0.5rem;
}

.site-footer__nav {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 0.2rem 0.25rem;
}

.site-footer__nav a {
    border-radius: 0.5rem;
    color: var(--m-color-text-muted);
    font-size: 0.78rem;
    font-weight: 500;
    padding: 0.3rem 0.55rem;
    text-decoration: none;
    transition:
        color var(--m-motion-fast) var(--m-motion-ease),
        background var(--m-motion-fast) var(--m-motion-ease);
}

.site-footer__nav a:hover {
    background: var(--docs-primary-soft);
    color: var(--m-color-primary);
}

.site-footer__meta {
    color: var(--m-color-text-muted);
    font-family: var(--docs-mono);
    font-size: 0.64rem;
    letter-spacing: 0.04em;
    margin: 0;
    opacity: 0.8;
    width: 100%;
}

@media (min-width: 900px) {
    .site-footer__meta {
        margin-left: auto;
        width: auto;
    }
}
</style>
