---
name: vue3-unit-testing
description: Vue3 + TypeScript 单元与组件测试规范。用于为 Vue 组件、composable、Pinia store、表单交互或组件库补充、修复、重构测试，也用于配置 Vitest 与 Vue Test Utils。涵盖用户行为导向断言、Props/Emits/Slots、v-model、异步状态、无障碍、主题状态、mock、覆盖率和稳定测试策略。
---

# Vue3 Unit Testing

为 Vue3 + TypeScript 项目编写快速、稳定、以用户可感知行为为中心的单元与组件测试。默认使用仓库现有测试工具；新项目优先选择 Vitest + Vue Test Utils。端到端浏览器流程属于 `webapp-testing` 的职责，不要用浏览器测试替代单元测试。

## 流程

1. 阅读现有 `package.json`、测试配置、同类测试、组件 API 和可访问性约定；不检查 `node_modules`、缓存或 vendor。
2. 先定义行为：输入、用户动作、可见结果、事件、可访问语义和副作用；不为私有实现细节写断言。
3. 编写最小测试集合，覆盖成功路径、关键状态、边界和曾发生的回归。
4. 运行最小相关测试，再运行项目既有的类型检查、完整测试或覆盖率命令。
5. 测试失败时先确认产品契约；不要为了让测试通过而掩盖真实行为问题。

## 建议工具与配置

- 使用 `vitest` 执行测试，使用 `@vue/test-utils` 挂载组件。
- 使用 `happy-dom` 或 `jsdom` 提供 DOM 环境，遵循仓库已有选择。
- 使用 `@testing-library/user-event` 或真实 DOM 事件表达用户操作；若仓库未使用，则以 Vue Test Utils 的 `trigger` 为主。
- 将测试放在组件旁的 `Component.test.ts` 或项目约定的测试目录；命名与源码一一对应。
- 全局 setup 只放通用 matcher、DOM cleanup、浏览器 API polyfill 和稳定 mock；不要在全局隐藏每个测试的业务依赖。

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Button from './Button.vue'

describe('Button', () => {
  it('emits click when enabled', async () => {
    const wrapper = mount(Button, { props: { label: 'Save' } })

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
```

## 组件测试边界

### 应测试的公共行为

- Props 的默认值、变体和关键组合。
- Emits 的事件名、参数、时机与不应触发的情况。
- Slots 的渲染、空 slot 或 fallback 行为。
- 单/多 `v-model` 的初始值、用户更新和受控回写。
- `disabled`、`loading`、`readonly`、`error`、`empty` 等适用状态。
- 可访问名称、角色、关联关系、焦点和关键键盘操作。
- 使用 CSS 变量或主题容器时，验证组件没有硬编码主题关键行为；主题全链路切换可交给集成/视觉测试。

### 不应测试的内容

- 私有 ref、computed、内部函数名称、实现组件树或框架本身的渲染细节。
- 单纯存在的 class 名，除非它是组件库承诺的公开样式 API 或实际表达状态。
- 第三方库已保证的行为；验证自己的集成边界即可。
- 用 snapshot 取代有意义的语义断言。大型 snapshot 只能作为补充，并保持小且稳定。

## 常见模式

### v-model

```ts
it('requests a model update from user input', async () => {
  const wrapper = mount(TextInput, { props: { modelValue: 'before' } })

  await wrapper.get('input').setValue('after')

  expect(wrapper.emitted('update:modelValue')).toEqual([['after']])
})
```

受控组件应由测试宿主接收事件后更新 Prop，以验证真实回写：

```ts
const Harness = defineComponent({
  components: { TextInput },
  setup() {
    const value = ref('before')
    return { value }
  },
  template: '<TextInput v-model="value" />',
})
```

### 异步行为与定时器

- 只 mock 网络、时钟、随机数、存储和边界服务，不 mock 被测逻辑本身。
- 使用 `vi.useFakeTimers()` 时在每个测试后恢复真实定时器；推进时间后等待 Vue 更新。
- 对 Promise 流程等待实际 UI 结果或 `flushPromises()`，不要依赖任意 `setTimeout`。
- 测试 loading、success、error 与取消/清理（适用时），确保竞态不会写入过期结果。

### Composables 与 Store

- 纯计算逻辑直接调用并断言返回值。
- 需要生命周期、注入或 DOM 的 composable，用最小测试宿主挂载；测试公开返回值和副作用。
- Pinia store 在每个测试中创建新的 `createPinia()`；网络或持久化放在明确 mock 中，避免跨测试共享状态。

## 无障碍与交互

- 以 `getByRole` 等语义选择器或明确的 label/id 为优先选择器；避免脆弱 CSS 层级选择器。
- 测试键盘路径（Tab、Enter、Space、Escape、方向键）时，应断言焦点位置和用户可见结果。
- Dialog、Menu、Popover 等覆盖层应测试打开、关闭、Escape、点击外部（如支持）以及关闭后焦点恢复。
- 图标按钮、输入错误、必填提示等测试可访问名称和关联 ARIA 属性；可结合仓库已有 `axe` 工具做针对性检查。

## 组件库额外基线

使用 `vue3-component-library` 时，每个新公共组件至少验证：

- 默认和每个公开尺寸/变体的关键语义与交互。
- Props、Events、Slots、`v-model` 和 `defineExpose` 的公开契约（适用时）。
- disabled/loading 等状态不允许意外触发操作。
- token 驱动的状态 class 或 CSS variable 覆盖契约（如组件将其作为公开 API）。
- 对话框、菜单、选择器等复杂组件的键盘和焦点生命周期。

## Mock 与测试稳定性

- Mock 位于网络、时间、浏览器 API 和第三方 SDK 等系统边界；使用类型安全的 mock 并在测试后复位。
- 每个测试独立创建数据、Pinia 和 wrapper；不要依赖执行顺序。
- 不使用真实网络、不读取用户本机状态、不依赖系统时间或动画结束时间。
- 使用 `data-testid` 仅作为语义选择器无法表达的最后手段，并保持其稳定、面向测试的含义。

## 覆盖率与完成检查

覆盖率用于发现遗漏，而不是追求虚高数字。优先覆盖风险高的状态转换、校验、错误处理、权限呈现和回归路径。

- [ ] 测试验证可观察行为，而非 Vue 内部实现。
- [ ] 覆盖默认路径、关键边界、错误和禁用/加载状态。
- [ ] 事件参数与 `v-model` 回写符合公开 API。
- [ ] 异步、时钟和全局状态已隔离且清理。
- [ ] 适用的键盘、焦点和可访问语义已验证。
- [ ] 相关 Vitest 测试、类型检查和覆盖率命令已运行，或说明无法运行的原因。
