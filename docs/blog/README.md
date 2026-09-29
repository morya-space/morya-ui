# Blog 文稿归档

本目录存放对外发布的博客 Markdown 与配图，便于版本管理与再发布（掘金 / 公众号等）。**不是**文档站运行时路由内容。

| 目录 | 标题 | 文稿 |
| --- | --- | --- |
| [`introducing-morya-ui/`](./introducing-morya-ui/) | 开源 Vue 3 组件库 Morya UI：主题、文档与 AI 一站式，再用它快速搭一套中后台 | [`article.md`](./introducing-morya-ui/article.md) |
| [`dont-handcraft-agent-wins/`](./dont-handcraft-agent-wins/) | 别手搓了，搓也搓不过 Agent | [`article.md`](./dont-handcraft-agent-wins/article.md) |

## 约定

每篇文章一个子目录：

```text
docs/blog/<slug>/
  article.md          # 正文（图片用相对路径 ./assets/...）
  assets/             # 封面与正文截图
  assets/README.md    # 配图说明
  capture_*.py        # 可选：截图脚本
```

发掘金等平台时，把 `assets/*.png` 上传图床后替换文中链接即可；仓库内保留相对路径，方便离线阅读与 diff。
