<script setup lang="ts">
import { MButton, MConfirmDialog, useConfirm } from "morya-ui";
import { ref } from "vue";

const visible = ref(false);
const lastResult = ref("");
const confirm = useConfirm();

function onAccept() {
    lastResult.value = "Declarative: deleted";
}

function onReject() {
    lastResult.value = "Declarative: cancelled";
}

async function onImperativeDelete() {
    const ok = await confirm.require({
        header: "Confirm delete",
        message:
            "Are you sure you want to delete this item? This action cannot be undone.",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptSeverity: "danger",
        type: "warning",
    });
    lastResult.value = ok ? "Imperative: deleted" : "Imperative: cancelled";
}
</script>

<template>
    <div style="display: grid; gap: 0.75rem; max-width: 28rem">
        <div style="display: flex; flex-wrap: wrap; gap: 0.75rem">
            <MButton
                label="Declarative confirm"
                severity="danger"
                @click="visible = true"
            />
            <MButton
                label="Imperative confirm"
                severity="danger"
                variant="outlined"
                @click="onImperativeDelete"
            />
        </div>
        <p
            v-if="lastResult"
            style="
                margin: 0;
                color: var(--m-color-text-muted);
                font-size: 0.875rem;
            "
        >
            {{ lastResult }}
        </p>
        <MConfirmDialog
            v-model="visible"
            header="Confirm delete"
            message="Are you sure you want to delete this item? This action cannot be undone."
            accept-label="Delete"
            reject-label="Cancel"
            accept-severity="danger"
            type="warning"
            @accept="onAccept"
            @reject="onReject"
        />
    </div>
</template>
