# 提交规范

本仓库使用 [Conventional Commits](https://www.conventionalcommits.org/)。本地通过 **husky** + **commitlint** 在 `commit-msg` 钩子中校验。

## 格式

```text
<type>(optional-scope)!: <description>
```

### type（必填）

| type | 含义 |
| --- | --- |
| `feat` | 新功能 |
| `fix` | 缺陷修复 |
| `docs` | 文档 |
| `style` | 不影响逻辑的格式/样式 |
| `refactor` | 重构（非 feat / fix） |
| `perf` | 性能 |
| `test` | 测试 |
| `build` | 构建 / 依赖 |
| `ci` | CI |
| `chore` | 杂项维护 |
| `revert` | 回滚 |
| `release` | 发版提交（脚本自动生成） |

破坏性变更在 type 后加 `!`，例如 `feat!: 调整 Button API`，或在正文写 `BREAKING CHANGE:`。

### scope（可选）

按改动区域标注，例如：`button`、`theme`、`docs`、`playground`、`release`。

```text
feat(button): 支持 loading 状态
fix(theme): 暗色边框对比度
docs: 补充快速开始说明
```

## 与发版的关系

- **版本号由发版时手动选择**（`patch` / `minor` / `major`），不会根据 commit type 自动升版。
- 约定上可参考：`feat` → minor，`fix` / 其他 → patch，`feat!:` / breaking → major；最终以你在 `pnpm release:prepare` 中的选择为准。
- **不是所有 commit 都会进 CHANGELOG**：发版时会列出上一个 `v*` 以来的全部提交，交互勾选要写入的条目（默认预选改过 `src/`、`playground/` 等库路径的提交）。

详见 [`scripts/README.md`](../scripts/README.md)。

## 示例

```text
feat: 新增 CommandMenu 键盘导航
fix(pagination): 英文 aria-label
docs: 更新组件文档站 i18n 说明
chore: 调整发版脚本
feat!: Dialog 关闭回调参数变更
```

不合规的提交会被 hook 拒绝，例如缺少 type、或 type 不在允许列表中。
