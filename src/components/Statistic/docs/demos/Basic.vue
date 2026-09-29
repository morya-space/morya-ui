<script setup lang="ts">
import { MSpace, MStatistic } from 'morya-ui'
</script>

<template>
  <MSpace size="large">
    <MStatistic
      title="Active users"
      :value="112893"
    />
    <MStatistic
      title="Account balance"
      :value="112893.45"
      :precision="2"
      prefix="$"
    />
    <MStatistic
      title="Feedback"
      :value="93"
      suffix="/ 100"
    />
  </MSpace>
</template>
