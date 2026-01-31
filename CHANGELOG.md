# mcp-trends-hub

## 1.7.0

### Minor Changes

- 86014c2: ### 新特性

  - 工具名统一使用 snake_case 格式，解决部分 MCP 客户端（如 Cursor）对 kebab-case 命名的兼容问题

  ### 改进

  - 优化 README 结构，参考 playwright-mcp 风格重新组织安装配置说明
  - 新增 MCPorter、Cline、Windsurf 等客户端的配置示例
  - 移除 Zod schema 中的 `.transform()` 调用，修复 `z.toJSONSchema()` 报错问题

### Patch Changes

- e77a54b: 修复微博 403 的问题

## 1.6.2

### Patch Changes

- e81d125: 修复知乎热榜请求失败的问题

## 1.6.1

### Patch Changes

- 3c53867: 修复知乎热榜 ID 错误的问题

## 1.6.0

### Minor Changes

- ce74e8d: 添加获取 BBC 新闻工具及其配置
- 645622e: 更新豆瓣工具描述，增强对作品类型的说明，并添加标签信息
- ae0e048: 添加自定义 RSS 工具

## 1.5.0

### Minor Changes

- 7200921: 更新各工具的更详细的内容概述，更便于 LLM 理解各工具的作用和使用场景

### Patch Changes

- de40421: 优化 nytimes 请求模式的分类描述

## 1.4.1

### Patch Changes

- 95ca6d9: 更新发布工作流，添加版本命令
- d505342: 更新 package.json 以支持模块导出

## 1.4.0

### Minor Changes

- 63c2941: 新增多个工具
- 63c2941: 新增 TRENDS_HUB_HIDDEN_FIELDS 环境变量，支持过滤字段

## 1.3.1

### Patch Changes

- b4f5dac: 优化头条链接，节省 token

## 1.3.0

### Minor Changes

- 79ba5ed: 添加多个工具以获取热门新闻和排行榜

## 1.2.1

### Patch Changes

- 802935e: 修复参数名称错误，将`args`改为`arguments`

## 1.2.0

### Minor Changes

- 3ef95c4: 新增 36kr 工具

## 1.1.0

### Minor Changes

- a4fe3c9: 替换豆瓣电影工具为实时热门榜工具，并更新相关文档
