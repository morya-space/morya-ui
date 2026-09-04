import type {WiLocaleMessages} from '@well-insight/ui';
import { enUS,  zhCN } from '@well-insight/ui'
import { computed, ref, watch } from 'vue'

export type DocsLang = 'zh-CN' | 'en-US'

const STORAGE_KEY = 'wi-docs-lang'

function readStoredLang(): DocsLang {
  if (typeof window === 'undefined') return 'zh-CN'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'en-US' ? 'en-US' : 'zh-CN'
}

function readLangFromQuery(): DocsLang | null {
  if (typeof window === 'undefined') return null
  const value = new URLSearchParams(window.location.search).get('lang')
  if (value === 'en-US' || value === 'en') return 'en-US'
  if (value === 'zh-CN' || value === 'zh') return 'zh-CN'
  return null
}

function writeLangQuery(next: DocsLang) {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  url.searchParams.set('lang', next)
  window.history.replaceState(window.history.state, '', url)
}

const lang = ref<DocsLang>(readLangFromQuery() ?? readStoredLang())

const messages = {
  'zh-CN': {
    home: '首页',
    docs: '文档',
    components: '组件',
    changelog: '更新日志',
    homeAria: 'Well Insight UI 首页',
    navAria: '站点导航',
    lightMode: '浅色模式',
    darkMode: '暗色模式',
    switchToLight: '切换到浅色模式',
    switchToDark: '切换到暗色模式',
    githubRepo: 'GitHub 仓库',
    openGithub: '打开 GitHub 仓库',
    npmPackage: 'npm 包',
    openNpm: '打开 npm 包页面',
    langSwitch: '切换语言',
    langZh: '中文',
    langEn: 'English',
    homeKicker: 'OPEN SOURCE · VUE 3 · 88 COMPONENTS',
    headline: '开源 Vue 3 组件库，主题、文档与预览一站齐全。',
    lead: '88 个组件共享同一套设计令牌与视觉语法。安装一个包，即可接入控件、亮暗主题与完整文档。',
    start: '快速上手',
    browse: '浏览组件',
    viewGithub: 'GitHub',
    viewNpm: '在 npm 上查看',
    installTitle: '安装',
    installHint: '支持 Vue 3（推荐 3.5 及以上）。支持全量注册、按名导入与按需子路径。',
    techTags: '技术标签',
    capabilities: '特性',
    next: '探索文档',
    nextBody: '从快速上手到组件 API，文档站提供完整接入路径与实时预览。',
    themeMotion: '主题与动效',
    globalConfig: '全局配置',
    allComponents: '全部组件',
    pillarCompleteLabel: 'Complete',
    pillarCompleteTitle: '组件齐全',
    pillarCompleteBody: '88 个组件覆盖基础、表单、导航、数据展示与反馈，均支持 tree-shaking。',
    pillarThemeLabel: 'Theme',
    pillarThemeTitle: '主题开箱即用',
    pillarThemeBody: '亮/暗色、密度与动效基于 --wi-* 令牌；useTheme 与 WiConfigProvider 同包提供。',
    pillarTypeScriptLabel: 'TypeScript',
    pillarTypeScriptTitle: 'TypeScript 优先',
    pillarTypeScriptBody: 'Composition API 编写，Props、Emits 与 locale 类型完整，IDE 体验友好。',
    pillarDocsLabel: 'Docs',
    pillarDocsTitle: '文档即预览',
    pillarDocsBody: '每个组件自带 Markdown 与 vue preview 示例，边看 API 边验证交互。',
    footerTagline: '面向现代 Web 应用的开源 Vue 3 组件库。',
    footerNavAria: '页脚导航',
    footerContributing: '参与贡献',
    docsNav: '文档导航',
    docsTitle: '文档',
    docsMissing: '未找到文档',
    backIntro: '返回介绍',
    overview: '全部组件',
    filterComponents: '筛选组件',
    componentNav: '组件导航',
    componentCatalog: '组件目录',
    theme: '主题',
    themeSettings: '主题设置',
    themeMode: '主题模式',
    light: '亮色',
    dark: '暗色',
    brandColor: '品牌主色',
    radius: '圆角',
    density: '内容密度',
    motion: '动效',
    sharp: '锐利',
    comfortable: '适中',
    soft: '柔和',
    compact: '紧凑',
    spacious: '宽松',
    motionFull: '完整',
    motionReduced: '减弱',
    motionNone: '关闭',
    labTitle: '组件实验室',
    labCopy: '开源组件库：每个组件的 API 与示例写在 docs/index.md，支持 Markdown + vue preview。接入与主题配置请见「文档」。',
    viewDetails: '查看详情',
    missingDoc: '尚未找到 docs/index.md。',
    backAll: '返回全部组件',
    noComponent: '没有找到组件',
    tokens: '设计令牌',
    tokenDesc: '组件共享同一套视觉语法。主题切换时，语义保持不变。',
    tokenNote: '所有组件都使用 --wi-* 设计变量。',
    defaultDoc: '组件文档。',
    groupAria: '{title}组件',
    useAccent: '使用{label}主题色',
    copy: '复制',
    copied: '已复制',
    copyCode: '复制代码',
    viewCode: '查看代码',
    examplesCount: '示例 {count} 个',
    sectionsCount: '章节 {count} 个',
    componentSection: '组件文档章节',
    changelogNav: '版本列表',
    changelogTitle: '更新日志',
    changelogHistory: '历史版本',
    current: '当前',
    currentHint: '当前已发布版本。之后正常提交，发版时会把相对上一版本的改动写入这里。',
    emptySection: '该版本暂无分类条目。',
    noReleases: '暂无版本记录',
    noReleasesHint: '请先运行 pnpm release 生成 CHANGELOG。',
    notFoundTitle: '页面未找到',
    notFoundBody: '你访问的地址不存在，或已被移动。',
    notFoundHome: '返回首页',
    searchOpen: '搜索站点',
    searchPlaceholder: '搜索文档与组件…',
    openNav: '打开导航',
    guideTitles: {
      introduction: '介绍',
      'quick-start': '快速开始',
      theme: '主题',
      config: '全局配置',
      guide: '指南',
      accessibility: '无障碍',
      mcp: 'MCP',
    } as Record<string, string>,
    categories: {
      GUIDE: '指南',
      BASIC: '基础组件',
      FORM: '表单组件',
      DATA: '数据展示',
      NAVIGATION: '导航',
      FEEDBACK: '反馈',
      LAYOUT: '布局',
      OTHER: '其他',
    } as Record<string, string>,
  },
  'en-US': {
    home: 'Home',
    docs: 'Docs',
    components: 'Components',
    changelog: 'Changelog',
    homeAria: 'Well Insight UI home',
    navAria: 'Site navigation',
    lightMode: 'Light mode',
    darkMode: 'Dark mode',
    switchToLight: 'Switch to light mode',
    switchToDark: 'Switch to dark mode',
    githubRepo: 'GitHub repository',
    openGithub: 'Open GitHub repository',
    npmPackage: 'npm package',
    openNpm: 'Open npm package page',
    langSwitch: 'Language',
    langZh: '中文',
    langEn: 'English',
    homeKicker: 'OPEN SOURCE · VUE 3 · 88 COMPONENTS',
    headline: 'An open-source Vue 3 library with themes, docs, and live previews.',
    lead: '88 components share one token-driven visual system. One package for UI primitives, light/dark themes, and full documentation.',
    start: 'Get started',
    browse: 'Browse components',
    viewGithub: 'GitHub',
    viewNpm: 'View on npm',
    installTitle: 'Install',
    installHint: 'Supports Vue 3 (3.5+ recommended). Full registration, named imports, and on-demand subpaths are supported.',
    techTags: 'Tech tags',
    capabilities: 'Features',
    next: 'Explore the docs',
    nextBody: 'From quick start to component APIs — full setup guides and live previews in one site.',
    themeMotion: 'Theme & motion',
    globalConfig: 'Global config',
    allComponents: 'All components',
    pillarCompleteLabel: 'Complete',
    pillarCompleteTitle: '88 components',
    pillarCompleteBody: 'Basics, forms, navigation, data display, layout, and feedback — all tree-shakeable.',
    pillarThemeLabel: 'Theme',
    pillarThemeTitle: 'Theme-ready',
    pillarThemeBody: 'Light/dark, density, and motion via --wi-* tokens; useTheme and WiConfigProvider ship in-package.',
    pillarTypeScriptLabel: 'TypeScript',
    pillarTypeScriptTitle: 'TypeScript-first',
    pillarTypeScriptBody: 'Built with Composition API; fully typed props, emits, and locale for a smooth IDE experience.',
    pillarDocsLabel: 'Docs',
    pillarDocsTitle: 'Docs as preview',
    pillarDocsBody: 'Every component ships Markdown plus vue preview examples — read the API and verify interactions together.',
    footerTagline: 'An open-source Vue 3 component library for modern web apps.',
    footerNavAria: 'Footer navigation',
    footerContributing: 'Contributing',
    docsNav: 'Documentation',
    docsTitle: 'Docs',
    docsMissing: 'Page not found',
    backIntro: 'Back to introduction',
    overview: 'All components',
    filterComponents: 'Filter components',
    componentNav: 'Component navigation',
    componentCatalog: 'Component catalog',
    theme: 'Theme',
    themeSettings: 'Theme settings',
    themeMode: 'Color mode',
    light: 'Light',
    dark: 'Dark',
    brandColor: 'Brand color',
    radius: 'Radius',
    density: 'Density',
    motion: 'Motion',
    sharp: 'Sharp',
    comfortable: 'Comfort',
    soft: 'Soft',
    compact: 'Compact',
    spacious: 'Spacious',
    motionFull: 'Full',
    motionReduced: 'Reduced',
    motionNone: 'Off',
    labTitle: 'Component lab',
    labCopy: 'Open-source library: each component documents its API in docs/index.md with Markdown + vue preview. See Docs for setup and theme.',
    viewDetails: 'View details',
    missingDoc: 'docs/index.md was not found.',
    backAll: 'Back to all components',
    noComponent: 'No components found',
    tokens: 'Design tokens',
    tokenDesc: 'Components share one visual grammar. Semantics stay stable when the theme changes.',
    tokenNote: 'Every component uses --wi-* design tokens.',
    defaultDoc: 'Component docs.',
    groupAria: '{title} components',
    useAccent: 'Use {label} accent',
    copy: 'Copy',
    copied: 'Copied',
    copyCode: 'Copy code',
    viewCode: 'View code',
    examplesCount: '{count} examples',
    sectionsCount: '{count} sections',
    componentSection: 'Component documentation sections',
    changelogNav: 'Releases',
    changelogTitle: 'Changelog',
    changelogHistory: 'Version history',
    current: 'Current',
    currentHint: 'This is the current published version. Later commits are collected into the changelog on release.',
    emptySection: 'No entries in this section.',
    noReleases: 'No releases yet',
    noReleasesHint: 'Run pnpm release to generate the changelog.',
    notFoundTitle: 'Page not found',
    notFoundBody: 'The page you requested does not exist or has moved.',
    notFoundHome: 'Back to home',
    searchOpen: 'Search site',
    searchPlaceholder: 'Search docs and components…',
    openNav: 'Open navigation',
    guideTitles: {
      introduction: 'Introduction',
      'quick-start': 'Quick start',
      theme: 'Theme',
      config: 'Configuration',
      guide: 'Guide',
      accessibility: 'Accessibility',
      mcp: 'MCP',
    } as Record<string, string>,
    categories: {
      GUIDE: 'Guide',
      BASIC: 'Basic',
      FORM: 'Form',
      DATA: 'Data Display',
      NAVIGATION: 'Navigation',
      FEEDBACK: 'Feedback',
      LAYOUT: 'Layout',
      OTHER: 'Other',
    } as Record<string, string>,
  },
} as const

export type DocsMessages = (typeof messages)['zh-CN']

watch(
  lang,
  (value) => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, value)
    document.documentElement.lang = value === 'en-US' ? 'en' : 'zh-CN'
    writeLangQuery(value)
  },
  { immediate: true },
)

export function useDocsI18n() {
  const t = computed(() => messages[lang.value])
  const componentLocale = computed<WiLocaleMessages>(() => (lang.value === 'en-US' ? enUS : zhCN))

  function setLang(next: DocsLang) {
    lang.value = next
  }

  function interpolate(template: string, vars: Record<string, string>) {
    return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? '')
  }

  return { lang, t, componentLocale, setLang, interpolate }
}
