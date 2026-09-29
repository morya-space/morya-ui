<script setup lang="ts">
import { MAnchor, MSpace, MTitle } from 'morya-ui'
</script>

<template>
  <MSpace
    align="start"
    size="large"
    style="width: 100%"
  >
    <MAnchor
      :offset-top="8"
      :items="[
        { href: '#anchor-demo-a', title: 'Section A' },
        { href: '#anchor-demo-b', title: 'Section B' },
        { href: '#anchor-demo-c', title: 'Section C' },
      ]"
    />
    <div style="flex: 1; min-height: 18rem">
      <MTitle
        id="anchor-demo-a"
        :level="4"
      >
        Section A
      </MTitle>
      <p style="margin-block: var(--m-space-6) 12rem">
        Scroll to highlight the active anchor link.
      </p>
      <MTitle
        id="anchor-demo-b"
        :level="4"
      >
        Section B
      </MTitle>
      <p style="margin-block: var(--m-space-6) 12rem">
        Click a link to smooth-scroll here.
      </p>
      <MTitle
        id="anchor-demo-c"
        :level="4"
      >
        Section C
      </MTitle>
      <p style="margin-block: var(--m-space-6) 0">
        End of demo content.
      </p>
    </div>
  </MSpace>
</template>
