import { fileURLToPath, URL } from 'node:url'
import { createHighlighter } from 'shiki'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Markdown from 'unplugin-vue-markdown/vite'
import MarkdownPreview from 'vite-plugin-markdown-preview'

const highlighter = await createHighlighter({
  themes: ['github-light', 'github-dark'],
  langs: ['vue', 'typescript', 'javascript', 'ts', 'js', 'tsx', 'jsx', 'css', 'html', 'json', 'bash', 'shell', 'markdown', 'md'],
})

function highlightCode(code: string, lang: string) {
  const normalized = lang.trim().split(/\s+/)[0] || 'text'
  const language = highlighter.getLoadedLanguages().includes(normalized as never)
    ? normalized
    : 'text'

  return highlighter.codeToHtml(code, {
    lang: language,
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
    defaultColor: false,
  })
}

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    Markdown({
      wrapperClasses: 'wd-markdown-doc',
      markdownOptions: {
        highlight: highlightCode,
      },
      transforms: {
        // vite-plugin-markdown-preview 的 load() 会把 YAML 重写成 *** / ----，
        // markdown-it 会当成 hr + setext 标题，导致 frontmatter 原文出现在正文顶部。
        before: (code) =>
          code.replace(/^\*{3,}\r?\n([\s\S]*?)\r?\n-{3,}\r?\n/, '---\n$1\n---\n'),
        // 页面顶部已用 frontmatter 渲染标题；去掉正文首个 h1，避免标题重复。
        after: (html) => html.replace(/<h1[^>]*>[\s\S]*?<\/h1>\s*/i, ''),
      },
    }),
    MarkdownPreview(),
  ],
  resolve: {
    alias: [
      {
        find: '@well-insight/ui/styles.css',
        replacement: fileURLToPath(new URL('../src/styles/index.css', import.meta.url)),
      },
      {
        find: '@well-insight/ui',
        replacement: fileURLToPath(new URL('../src', import.meta.url)),
      },
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
    ],
  },
  server: {
    port: 5182,
  },
})
