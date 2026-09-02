# 智学云 · 教育管理后台（纯前端演示）

基于 `@well-insight/ui` 构建的教育行业管理后台，覆盖 `index.md` 中五层能力模型的前端界面与交互演示。

## 快速开始

```bash
# 在 well-insight-ui 根目录
pnpm install
pnpm dev:admin
```

浏览器访问 http://localhost:5174

## 演示账号

| 账号 | 密码 | MFA |
| --- | --- | --- |
| `admin` | `admin123` | `123456` |
| `teacher` | `teacher123` | 无需 |

## 功能模块

- **权限与安全**：登录/注册/MFA、用户/角色/权限、数据权限、操作日志
- **教务业务**：学生/教师/课程/班级、联动选课表单、批量导入导出、审批流程
- **系统运营**：消息中心、定时任务、系统配置、字典管理
- **数据与监控**：仪表盘、报表、异常监控
- **体验增强**：暗色模式、Ctrl+K 全局搜索、回收站、中英文切换

## 技术栈

- Vue 3 + TypeScript + Vue Router
- `@well-insight/ui` 组件库与设计令牌
- Mock 数据 + localStorage（无后端）
