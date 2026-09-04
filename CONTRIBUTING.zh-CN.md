# 参与贡献

[English](./CONTRIBUTING.md) · [中文](./CONTRIBUTING.zh-CN.md)

感谢你对 Wex Design UI 的关注！

## 贡献方式

- **报告 Bug** — 在 [Issues](https://github.com/wex-design/wex-design-ui/issues) 中提供复现步骤。
- **功能建议** — 先在 Issue 中描述使用场景与期望 API。
- **改进文档** — 修正笔误、补充指南或示例，欢迎 PR。
- **提交代码** — Bug 修复与组件增强均可。

## 开始之前

1. 阅读 [在线文档](https://wex-design.github.io/wex-design-ui/)。
2. 本地环境见 [开发指南](./docs/DEVELOPMENT.zh-CN.md)。
3. 提交信息遵循 [Conventional Commits](./docs/COMMIT_CONVENTION.md)。

## Pull Request 检查清单

- [ ] 改动范围聚焦，只解决相关问题。
- [ ] `pnpm typecheck` 通过。
- [ ] `pnpm test` 通过（行为变更时请补充测试）。
- [ ] 若公开 API 有变，更新组件文档（`docs/index.md` + `docs/index.en.md`）。
- [ ] **不要**手动改 CHANGELOG — 发版时由 `pnpm release` 自动写入。

## 行为准则

保持尊重与建设性的沟通。我们欢迎不同经验水平的贡献者。

## 有疑问？

如果不确定改动是否合适，请先 [提 Issue](https://github.com/wex-design/wex-design-ui/issues) 讨论，避免在大改动上白费功夫。
