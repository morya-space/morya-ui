<script setup lang="ts">
import type { FormInstance, FormRules } from "morya-ui";
import { MButton, MForm, MFormItem, MInput, MInputPassword } from "morya-ui";
import { reactive, ref } from "vue";

const formRef = ref<FormInstance | null>(null);
const status = ref("");
const model = reactive({
    email: "",
    password: "",
});

const rules: FormRules = {
    email: [
        { required: true, message: "Enter an email", trigger: "blur" },
        {
            pattern: /.[^\n\r@\u2028\u2029]*@.+\..+/,
            message: "Enter a valid email",
            trigger: "blur",
        },
    ],
    password: [
        {
            required: true,
            message: "Enter a password",
            trigger: ["blur", "input"],
        },
        {
            min: 6,
            message: "Use at least 6 characters",
            trigger: ["blur", "input"],
        },
    ],
};

async function onSubmit() {
    status.value = "";
    const { valid } = await formRef.value!.validate();
    if (!valid) return;
    status.value = `Validated: ${model.email}`;
}
</script>

<template>
    <div style="display: grid; gap: 0.75rem; max-width: 22rem">
        <MForm
            ref="formRef"
            :model="model"
            :rules="rules"
            label-position="top"
            validate-on="submit"
            @submit="onSubmit"
        >
            <MFormItem label="Email" name="email">
                <template #default="{ id, invalid }">
                    <MInput
                        :id="id"
                        v-model="model.email"
                        type="email"
                        fluid
                        placeholder="you@example.com"
                        :invalid="invalid"
                        autocomplete="username"
                    />
                </template>
            </MFormItem>
            <MFormItem label="Password" name="password">
                <template #default="{ id, invalid }">
                    <MInputPassword
                        :id="id"
                        v-model="model.password"
                        fluid
                        placeholder="At least 6 characters"
                        :invalid="invalid"
                        autocomplete="current-password"
                    />
                </template>
            </MFormItem>
            <MButton type="primary" html-type="submit" label="Sign in" block />
        </MForm>
        <p
            v-if="status"
            style="
                margin: 0;
                color: var(--m-color-text-muted);
                font-size: 0.875rem;
            "
        >
            {{ status }}
        </p>
    </div>
</template>
