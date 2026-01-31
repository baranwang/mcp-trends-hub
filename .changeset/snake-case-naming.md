---
"mcp-trends-hub": minor
---

### 新特性
- 工具名统一使用 snake_case 格式，解决部分 MCP 客户端（如 Cursor）对 kebab-case 命名的兼容问题

### 改进
- 优化 README 结构，参考 playwright-mcp 风格重新组织安装配置说明
- 新增 MCPorter、Cline、Windsurf 等客户端的配置示例
- 移除 Zod schema 中的 `.transform()` 调用，修复 `z.toJSONSchema()` 报错问题
