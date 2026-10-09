<script setup lang="ts">
import { MAlert, MButton, MCard, MCheckbox, MInput, MSwitch, MTag } from '../../src'
import { ref } from 'vue'

const checked = ref(true)
const on = ref(true)
const text = ref('Morya')
</script>

<template>
  <main class="visual-root" data-visual-ready="true">
    <section class="visual-panel" data-case="button">
      <h1>Button</h1>
      <div class="row">
        <MButton type="primary">Primary</MButton>
        <MButton label="Secondary"/>
        <MButton label="Danger" danger type="primary"/>
        <MButton label="Outlined"/>
        <MButton label="Text" type="text"/>
        <MButton loading label="Loading" />
        <MButton disabled label="Disabled" />
      </div>
    </section>

    <section class="visual-panel" data-case="form">
      <h1>Form controls</h1>
      <div class="row">
        <MInput v-model="text" placeholder="Name" style="width: 220px" />
        <MCheckbox v-model="checked" label="Accept" />
        <MSwitch v-model="on" />
        <MTag severity="success">Ready</MTag>
      </div>
    </section>

    <section class="visual-panel" data-case="feedback">
      <h1>Feedback</h1>
      <MAlert severity="info" title="Heads up" description="Visual fixture for regression." />
      <MCard title="Card" style="margin-top: 12px; width: 320px">
        Compact surface used in docs and apps.
      </MCard>
    </section>
  </main>
</template>

<style>
:root {
  color-scheme: light;
}

body {
  margin: 0;
  background: #f5f7fb;
  color: #0f172a;
  font-family: "IBM Plex Sans", system-ui, sans-serif;
}

.visual-root {
  display: grid;
  gap: 24px;
  padding: 24px;
  width: 960px;
  box-sizing: border-box;
}

.visual-panel {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
}

.visual-panel h1 {
  font-size: 16px;
  margin: 0 0 16px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
</style>
