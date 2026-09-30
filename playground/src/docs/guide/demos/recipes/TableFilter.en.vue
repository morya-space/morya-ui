<script setup lang="ts">
import { MInput, MSelect, MTable } from "morya-ui";
import { computed, ref, watch } from "vue";

const columns = [
    { key: "name", label: "Name", sortable: true, minWidth: 120 },
    { key: "role", label: "Role", minWidth: 120 },
    { key: "email", label: "Email", minWidth: 180 },
];

const rows = [
    { id: 1, name: "Ada", role: "Designer", email: "ada@well.design" },
    { id: 2, name: "Lin", role: "Engineer", email: "lin@well.design" },
    { id: 3, name: "Kai", role: "Engineer", email: "kai@well.design" },
    { id: 4, name: "Mia", role: "Designer", email: "mia@well.design" },
    { id: 5, name: "Neo", role: "Engineer", email: "neo@well.design" },
    { id: 6, name: "Ora", role: "PM", email: "ora@well.design" },
];

const query = ref("");
const role = ref<string | undefined>();
const page = ref(1);

const roleOptions = [
    { label: "Designer", value: "Designer" },
    { label: "Engineer", value: "Engineer" },
    { label: "PM", value: "PM" },
];

const tableFilters = computed(() => (role.value ? { role: role.value } : null));

watch([query, role], () => {
    page.value = 1;
});
</script>

<template>
    <div style="display: grid; gap: 0.75rem">
        <div
            style="
                display: flex;
                flex-wrap: wrap;
                gap: 0.75rem;
                align-items: flex-end;
            "
        >
            <MInput
                v-model="query"
                label="Search"
                placeholder="Name / email"
                style="min-width: 12rem; flex: 1"
                allow-clear
            />
            <MSelect
                v-model="role"
                label="Role"
                :options="roleOptions"
                placeholder="All"
                allow-clear
                style="min-width: 10rem"
            />
        </div>
        <MTable
            v-model:page="page"
            :columns="columns"
            :rows="rows"
            :search-value="query"
            :search-field="['name', 'email']"
            :filters="tableFilters"
            paginator
            :rows-per-page="3"
        />
    </div>
</template>
