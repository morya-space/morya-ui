<script setup lang="ts">
import { MStatus } from "morya-ui";
</script>

<template>
    <div class="flex flex-wrap gap-4 items-center">
        <MStatus label="Primary" type="primary" />
        <MStatus label="Secondary" type="secondary" />
        <MStatus label="Success" type="success" />
        <MStatus label="Info" type="info" />
        <MStatus label="Warning" type="warning" />
        <MStatus label="Danger" type="danger" />
        <MStatus label="Contrast" type="contrast" />
        <MStatus label="Disabled" disabled />
    </div>
</template>
