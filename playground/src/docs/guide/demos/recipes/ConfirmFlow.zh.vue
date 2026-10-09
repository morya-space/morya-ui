<script setup lang="ts">
import { MButton, MConfirmDialog, useConfirm } from "morya-ui";
import { ref } from "vue";

const visible = ref(false);
const lastResult = ref("");
const confirm = useConfirm();

function onAccept() {
    lastResult.value = "声明式：已确认删除";
}

function onReject() {
    lastResult.value = "声明式：已取消";
}

async function onImperativeDelete() {
    const ok = await confirm.require({
        header: "删除确认",
        message: "确定要删除该项吗？此操作不可撤销。",
        acceptLabel: "删除",
        rejectLabel: "取消",
        acceptColor: "danger",
        type: "warning",
    });
    lastResult.value = ok ? "命令式：已确认删除" : "命令式：已取消";
}
</script>

<template>
    <div style="display: grid; gap: 0.75rem; max-width: 28rem">
        <div style="display: flex; flex-wrap: wrap; gap: 0.75rem">
            <MButton label="声明式确认" type="primary" danger @click="visible = true" />
            <MButton label="命令式确认" type="primary" danger @click="onImperativeDelete" />
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
            header="删除确认"
            message="确定要删除该项吗？此操作不可撤销。"
            accept-label="删除"
            reject-label="取消"
            accept-color="danger"
            type="warning"
            @accept="onAccept"
            @reject="onReject"
        />
    </div>
</template>
