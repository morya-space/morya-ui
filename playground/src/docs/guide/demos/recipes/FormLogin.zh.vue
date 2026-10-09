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
        { required: true, message: "请输入邮箱", trigger: "blur" },
        {
            pattern: /.[^\n\r@\u2028\u2029]*@.+\..+/,
            message: "邮箱格式不正确",
            trigger: "blur",
        },
    ],
    password: [
        { required: true, message: "请输入密码", trigger: ["blur", "input"] },
        { min: 6, message: "密码至少 6 位", trigger: ["blur", "input"] },
    ],
};

async function onSubmit() {
    status.value = "";
    const { valid } = await formRef.value!.validate();
    if (!valid) return;
    status.value = `已校验通过：${model.email}`;
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
            <MFormItem label="邮箱" name="email">
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
            <MFormItem label="密码" name="password">
                <template #default="{ id, invalid }">
                    <MInputPassword
                        :id="id"
                        v-model="model.password"
                        fluid
                        placeholder="至少 6 位"
                        :invalid="invalid"
                        autocomplete="current-password"
                    />
                </template>
            </MFormItem>
            <MButton type="primary" html-type="submit" label="登录" block />
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
