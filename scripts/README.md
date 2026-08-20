# UI 发版

`@well-insight/ui` 的版本与 CHANGELOG 在发版时由你交互确认；日常按 [提交规范](../docs/COMMIT_CONVENTION.md) 提交即可。更完整的维护说明见 [UI 开发](../docs/ui-development.zh-CN.md)（[English](../docs/ui-development.md)）与 [开发指南](../docs/DEVELOPMENT.zh-CN.md)（[English](../docs/DEVELOPMENT.md)）。

默认情况下，一次 `pnpm release` 会同时发布 `@well-insight/ui` 与 `@well-insight/ui-mcp`（版本对齐）。

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
3. **发版先登录**如果要发版请先获取npm的token，且执行命令 `npm config set //registry.npmjs.org/:_authToken=您的新Token`

## 发版步骤

完整发版拆成 7 个原子步骤，可逐步执行，也可一条命令跑完。`build` 在 `commit` 之前，以便把 MCP catalog 一并写入发版提交。

| 步骤 | 命令 | 说明 |
| --- | --- | --- |
| 1 | `pnpm release:prepare` | 交互选 CHANGELOG 条目与 bump；写 UI `package.json` / CHANGELOG，并同步 MCP 版本 |
| 2 | `pnpm release:build` | 构建 UI `dist/` + MCP catalog / 编译 |
| 3 | `pnpm release:commit` | 提交 UI 与 MCP 的 release 文件 |
| 4 | `pnpm release:branch` | 从当前提交创建 `release/{version}` 分支（不切换） |
| 5 | `pnpm release:publish` | 发布 `@well-insight/ui` 与 `@well-insight/ui-mcp` |
| 6 | `pnpm release:tag` | 打 `v{version}` 标签 |
| 7 | `pnpm release:push` | 推送当前分支、发版分支与 tag |

### 分步发版

```bash
pnpm release:prepare -- --dry-run   # 预览
pnpm release:prepare                # 写版本与 CHANGELOG（含 MCP 版本同步）
pnpm release:build                  # UI + MCP
pnpm release:commit                 # 检查 diff 后再提交
pnpm release:branch
pnpm release:publish
pnpm release:tag
pnpm release:push
```

每步结束会提示下一步命令。

### 一键发版（编排）

```bash
pnpm release
```

等价于依次执行上述 7 步（含 MCP）。只预览、不写文件：

```bash
pnpm release -- --dry-run
```

本地发版、不 push：

```bash
pnpm release -- --no-push
```

只发 UI、跳过 MCP：

```bash
pnpm release -- --no-mcp
```

从某步开始或只跑到某步：

```bash
pnpm release -- --from=build              # build → commit → publish → tag → push
pnpm release -- --until=commit            # prepare → build → commit
pnpm release -- --from=publish --until=tag
```

### prepare 参数

适用于 `pnpm release:prepare` 与 `pnpm release`（prepare 步骤）：

| 参数 | 说明 |
| --- | --- |
| `--patch` / `--minor` / `--major` | 指定 bump，跳过版本提问 |
| `--all` | 上一个标签以来全部提交写入 CHANGELOG |
| `--ui-only` | 仅改过库路径（`src/`、`playground/` 等）的提交 |
| `--none` | 不写条目（需配合 `--force`） |
| `--force` | 无提交 / 未勾选时仍允许发版 |
| `--dry-run` | 只预览，不写文件 |
| `--no-mcp` | 跳过 MCP 版本同步 / 构建 / 发布 |
| `--no-push` | 一键发版时不执行 push |

非交互示例：

```bash
pnpm release:prepare -- --patch --ui-only
pnpm release -- --minor --all --no-push
pnpm release -- --major --ui-only --force
pnpm release -- --patch --no-mcp
```

没有 `v*` 标签时，视为首次发布当前 `package.json` 版本，不会重复写入已有说明。

### 快捷命令

| 命令 | 说明 |
| --- | --- |
| `pnpm release:npm` | `build` + `publish`（UI + MCP；需先改好根 `package.json` 的 `version`） |
| `pnpm release:git` | 仅补 `release/{version}` 分支与 `v{version}` 标签 |
| `pnpm release:mcp` | 单独发布 `@well-insight/ui-mcp`（同步 UI 版本 → 构建 → commit → publish） |

发版提交会包含：

- `package.json` / `CHANGELOG.md` / `CHANGELOG.en.md`
- `packages/ui-mcp/package.json`
- `packages/ui-mcp/data/catalog.json`

提交信息格式：`release: @well-insight/ui / @well-insight/ui-mcp v{version}`（`--no-mcp` 时仅 UI）。

## 单独发 MCP

一般不必单独跑；需要重发 catalog 或只发 MCP 时：

```bash
pnpm release:mcp -- --dry-run      # 预览
pnpm release:mcp                   # 同步版本、构建、commit、发布
pnpm release:mcp -- --no-publish   # 同步版本、构建、commit，不 publish
pnpm release:mcp -- --no-commit    # 同步版本、构建、发布，不 commit
```
