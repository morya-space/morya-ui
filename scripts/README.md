# UI 发版

`@well-insight/ui` 的版本与 CHANGELOG 在发版时由你交互确认；日常按 [提交规范](../docs/COMMIT_CONVENTION.md) 提交即可。更完整的维护说明见 [UI 开发](../docs/ui-development.zh-CN.md)（[English](../docs/ui-development.md)）与 [开发指南](../docs/DEVELOPMENT.zh-CN.md)（[English](../docs/DEVELOPMENT.md)）。

## 日常改动

```text
feat: CascadeSelect 下拉宽度与选择框对齐
fix(docs): 修复文档站 i18n 文案
docs: 补充快速开始说明
```

发版时：

1. **交互勾选**要写入 CHANGELOG 的提交（列出上一个 `v*` 以来的**全部**提交；默认预选改过 `src/`、`playground/` 等库路径的）
2. **你自己选择** bump：`patch` / `minor` / `major`  
   （提示：`feat` → minor，`fix`/其他 → patch，`!`/BREAKING → major，仅作参考）

## 发版

### 仅发布到 npm

不写 CHANGELOG、不打 tag。先改好根目录 `package.json` 的 `version`，再执行：

```bash
pnpm release:npm
```

等价于：`build` + `pnpm publish --access public --no-git-checks`。

### 完整发版

```bash
pnpm release
```

流程：

1. 交互选 CHANGELOG 条目与版本 bump
2. 更新 `package.json` 与 `CHANGELOG.md` / `CHANGELOG.en.md`
3. 在**当前分支**提交 `release: @well-insight/ui v{version}`
4. 从该提交新建（不切换）`release/{version}` 分支
5. 构建、npm publish
6. 打 `v{version}` 标签，并推送当前分支、发版分支和 tag

只预览、不写文件不发版：

```bash
pnpm release -- --dry-run
```

非交互 / CI 可用参数：

```bash
pnpm release -- --patch --ui-only --no-push
pnpm release -- --minor --all
pnpm release -- --major --ui-only --force
```

| 参数 | 说明 |
| --- | --- |
| `--patch` / `--minor` / `--major` | 指定 bump，跳过版本提问 |
| `--all` | 上一个标签以来全部提交写入 CHANGELOG |
| `--ui-only` | 仅改过库路径（`src/`、`playground/` 等）的提交 |
| `--none` | 不写条目（需配合 `--force`） |
| `--no-push` | 本地发版，不 push |
| `--force` | 无提交 / 未勾选时仍允许发版 |
| `--dry-run` | 只预览 |

没有 `v*` 标签时，视为首次发布当前 `package.json` 版本，不会重复写入已有说明。

只补 git 标签 / 分支：

```bash
pnpm release:git
```
