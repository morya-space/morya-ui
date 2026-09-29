<script setup lang="ts">
import { MLink, MParagraph, MSpace, MText, MTitle } from 'morya-ui'
</script>

<template>
  <MSpace
    vertical
    size="medium"
    style="width: 100%"
  >
    <MTitle>h1. Morya UI</MTitle>
    <MTitle :level="2">h2. Design system</MTitle>
    <MTitle :level="3">h3. Component library</MTitle>

    <MParagraph>
      Morya UI 排版原语：
      <MText type="secondary">次要</MText>、
      <MText type="success">成功</MText>、
      <MText type="warning">警告</MText>、
      <MText type="danger">危险</MText>，
      以及 <MText code>code</MText>、<MText mark>mark</MText>、<MText strong>strong</MText>。
    </MParagraph>

    <MParagraph>
      更多细节见
      <MLink href="https://github.com">文档链接</MLink>。
    </MParagraph>
  </MSpace>
</template>
