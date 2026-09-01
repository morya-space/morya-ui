/** Rolldown code-splitting groups for the docs playground build. */
export function docsChunkSplitting() {
  return {
    codeSplitting: {
      groups: [
        {
          name: 'vendor-vue',
          test: /node_modules[\\/](vue|@vue|vue-router)\//,
          priority: 30,
        },
        {
          name: 'vendor-markdown',
          test: /node_modules[\\/](markdown-it|@shikijs|shiki|unplugin-vue-markdown)\//,
          priority: 25,
        },
        {
          name: 'docs-catalog',
          test: /[\\/]playground[\\/]src[\\/]docs[\\/](loadComponentDocs|loadGuideDocs)/,
          priority: 20,
        },
      ],
    },
  }
}
