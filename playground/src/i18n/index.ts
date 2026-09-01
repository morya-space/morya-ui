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
    homeAria: 'Well Insight 首页',
    navAria: '站点导航',
    lightMode: '浅色模式',
    darkMode: '暗色模式',
    switchToLight: '切换到浅色模式',
    switchToDark: '切换到暗色模式',
    githubRepo: 'GitHub 仓库',
    openGithub: '打开 GitHub 仓库',
    langSwitch: '切换语言',
    langZh: '中文',
    langEn: 'English',
    headline: '为自己的产品打造的 Vue 3 界面系统。',
    lead: '基础控件、表单、浮层与数据展示同构于一套视觉语法。安装一个包即可接入组件、主题与文档约定。',
    start: '开始使用',
    browse: '浏览组件',
    techTags: '技术标签',
    capabilities: '产品能力',
    next: '下一步',
    nextBody: '文档讲清接入方式；组件实验室提供实时预览与 API。',
    themeMotion: '主题与动效',
    globalConfig: '全局配置',
    allComponents: '全部组件',
    pillarSystemTitle: '语义化设计令牌',
    pillarSystemBody: '颜色、圆角、间距与动效统一走 --wi-* 变量，主题切换不改组件结构。',
    pillarCraftTitle: '文档即预览',
    pillarCraftBody: '每个组件自带 Markdown + 可交互示例，边看 API 边验证真实交互。',
    pillarControlTitle: '全局配置入口',
    pillarControlBody: 'WiConfigProvider / createWellInsight 统一浮层挂载、尺寸、密度与文案。',
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
    labCopy: '每个组件的 API 与示例写在 docs/index.md，支持 Markdown + vue preview。上手与主题配置请见顶部「文档」。',
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
      migration: 'API 迁移',
      accessibility: '无障碍',
      mcp: 'MCP',
    } as Record<string, string>,
    categories: {
      GUIDE: '指南',
      PRIMITIVE: '基础',
      FORM: '表单',
      OVERLAY: '浮层',
      PANEL: '面板',
      DATA: '数据',
      MISC: '杂项',
      MENU: '菜单',
      FILE: '文件',
      MEDIA: '媒体',
      OTHER: '其他',
    } as Record<string, string>,
  },
  'en-US': {
    home: 'Home',
    docs: 'Docs',
    components: 'Components',
    changelog: 'Changelog',
    homeAria: 'Well Insight home',
    navAria: 'Site navigation',
    lightMode: 'Light mode',
    darkMode: 'Dark mode',
    switchToLight: 'Switch to light mode',
    switchToDark: 'Switch to dark mode',
    githubRepo: 'GitHub repository',
    openGithub: 'Open GitHub repository',
    langSwitch: 'Language',
    langZh: '中文',
    langEn: 'English',
    headline: 'A Vue 3 interface system built for your product.',
    lead: 'Primitives, forms, overlays, and data views share one visual grammar. One package covers components, theme, and docs conventions.',
    start: 'Get started',
    browse: 'Browse components',
    techTags: 'Tech tags',
    capabilities: 'Capabilities',
    next: 'Next steps',
    nextBody: 'Docs cover setup; the component lab gives live previews and APIs.',
    themeMotion: 'Theme & motion',
    globalConfig: 'Global config',
    allComponents: 'All components',
    pillarSystemTitle: 'Semantic design tokens',
    pillarSystemBody: 'Color, radius, space, and motion all use --wi-* variables. Theme switches never rewrite component structure.',
    pillarCraftTitle: 'Docs as preview',
    pillarCraftBody: 'Each component ships Markdown plus interactive examples so you can read the API and verify the interaction together.',
    pillarControlTitle: 'Global configuration',
    pillarControlBody: 'WiConfigProvider / createWellInsight unify overlay mount, size, density, and copy.',
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
    labCopy: 'Each component’s API and examples live in docs/index.md, with Markdown + vue preview. Setup and theme live under Docs.',
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
      migration: 'API migration',
      accessibility: 'Accessibility',
      mcp: 'MCP',
    } as Record<string, string>,
    categories: {
      GUIDE: 'Guide',
      PRIMITIVE: 'Primitive',
      FORM: 'Form',
      OVERLAY: 'Overlay',
      PANEL: 'Panel',
      DATA: 'Data',
      MISC: 'Misc',
      MENU: 'Menu',
      FILE: 'File',
      MEDIA: 'Media',
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
