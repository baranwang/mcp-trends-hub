# 🔥 Trends Hub

[![smithery badge](https://smithery.ai/badge/@baranwang/mcp-trends-hub)](https://smithery.ai/server/@baranwang/mcp-trends-hub)
[![NPM Version](https://img.shields.io/npm/v/mcp-trends-hub)](https://www.npmjs.com/package/mcp-trends-hub)
![NPM License](https://img.shields.io/npm/l/mcp-trends-hub)

基于 Model Context Protocol (MCP) 协议的全网热点趋势一站式聚合服务

<a href="https://glama.ai/mcp/servers/@baranwang/mcp-trends-hub">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@baranwang/mcp-trends-hub/badge" alt="Trends Hub MCP server" />
</a>

## 示例效果

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/case-dark.png">
  <img src="./assets/case-light.png" alt="Trends Hub 示例">
</picture>

## ✨ 特性

- 📊 **一站式聚合** - 聚合全网热点资讯，20+ 优质数据源
- 🔄 **实时更新** - 保持与源站同步的最新热点数据
- 🧩 **MCP 协议支持** - 完全兼容 Model Context Protocol，轻松集成到 AI 应用
- 🔌 **易于扩展** - 简单配置即可添加自定义 RSS 源
- 🎨 **灵活定制** - 通过环境变量轻松调整返回字段

## 📋 环境要求

- Node.js 22 或更新版本
- VS Code、Cursor、Windsurf、Claude Desktop 或其他 MCP 客户端

### 🚀 快速开始

首先，在你的 MCP 客户端中安装 Trends Hub MCP 服务。

**标准配置**适用于大部分客户端：

```json
{
  "mcpServers": {
    "trends-hub": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-trends-hub"
      ]
    }
  }
}
```

<details>
<summary>Claude Desktop</summary>

参考 MCP 安装[指南](https://modelcontextprotocol.io/quickstart/user)，使用上述标准配置。

配置文件位置：
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

</details>

<details>
<summary>Cursor</summary>

前往 `Cursor Settings` -> `MCP` -> `Add new MCP Server`。自定义名称，类型选择 `command`，命令填写 `npx -y mcp-trends-hub`。

</details>

<details>
<summary>VS Code</summary>

参考 MCP 安装[指南](https://code.visualstudio.com/docs/copilot/chat/mcp-servers#_add-an-mcp-server)，使用上述标准配置。

你也可以使用 VS Code CLI 安装：

```bash
code --add-mcp '{"name":"trends-hub","command":"npx","args":["-y","mcp-trends-hub"]}'
```

</details>

<details>
<summary>Windsurf</summary>

参考 Windsurf MCP [文档](https://docs.windsurf.com/windsurf/cascade/mcp)，使用上述标准配置。

</details>

<details>
<summary>Cline</summary>

参考 [Configuring MCP Servers](https://docs.cline.bot/mcp/configuring-mcp-servers) 文档。

在 `cline_mcp_settings.json` 中添加：

```json
{
  "mcpServers": {
    "trends-hub": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "mcp-trends-hub"],
      "disabled": false
    }
  }
}
```

</details>

<details>
<summary>Smithery</summary>

通过 [Smithery](https://smithery.ai/server/@baranwang/mcp-trends-hub) 一键安装（仅支持 Claude Desktop）：

```bash
npx -y @smithery/cli install @baranwang/mcp-trends-hub --client claude
```

</details>

<details>
<summary>MCPorter</summary>

[MCPorter](https://github.com/steipete/mcporter) 是一个强大的 MCP 工具包，可通过 TypeScript 或 CLI 调用 MCP，适合 OpenClaw(Clawdbot/Moltbot) 等场景使用。

使用 CLI 添加：

```bash
npx mcporter add mcp-trends-hub -- npx -y mcp-trends-hub
```

或在配置文件中添加：

```json
{
  "mcps": {
    "trends-hub": {
      "command": "npx",
      "args": ["-y", "mcp-trends-hub"]
    }
  }
}
```

</details>

### ⚙️ 配置选项

Trends Hub 支持以下环境变量配置，可在 JSON 配置的 `"env"` 对象中设置：

| 选项 | 说明 |
|------|------|
| `TRENDS_HUB_HIDDEN_FIELDS` | 隐藏返回数据中的指定字段。<br>作用于所有工具：`{field-name}`（如 `cover`）<br>作用于特定工具：`{tool-name}:{field-name}`（如 `get_toutiao_trending:cover`）<br>多个配置用逗号分隔 |
| `TRENDS_HUB_CUSTOM_RSS_URL` | 添加自定义 RSS 订阅源，支持多个 URL（逗号分隔）<br>工具名根据 hostname 自动生成（如 `news_yahoo_com`）<br>相同域名会添加数字后缀避免冲突 |

**示例配置：**

```json
{
  "mcpServers": {
    "trends-hub": {
      "command": "npx",
      "args": ["-y", "mcp-trends-hub"],
      "env": {
        "TRENDS_HUB_HIDDEN_FIELDS": "cover,get_nytimes_news:description",
        "TRENDS_HUB_CUSTOM_RSS_URL": "https://news.yahoo.com/rss,https://sspai.com/feed"
      }
    }
  }
}
```

## 🛠️ 支持的工具

<!-- tools-start -->
| 工具名称 | 描述 |
| --- | --- |
| get_36kr_trending | 获取 36 氪热榜，提供创业、商业、科技领域的热门资讯，包含投融资动态、新兴产业分析和商业模式创新信息 |
| get_9to5mac_news | 获取 9to5Mac 苹果相关新闻，包含苹果产品发布、iOS 更新、Mac 硬件、应用推荐及苹果公司动态的英文资讯 |
| get_bbc_news | 获取 BBC 新闻，提供全球新闻、英国新闻、商业、政治、健康、教育、科技、娱乐等资讯 |
| get_bilibili_rank | 获取哔哩哔哩视频排行榜，包含全站、动画、音乐、游戏等多个分区的热门视频，反映当下年轻人的内容消费趋势 |
| get_douban_rank | 获取豆瓣实时热门榜单，提供当前热门的图书、电影、电视剧、综艺等作品信息，包含评分和热度数据 |
| get_douyin_trending | 获取抖音热搜榜单，展示当下最热门的社会话题、娱乐事件、网络热点和流行趋势 |
| get_gcores_new | 获取机核网游戏相关资讯，包含电子游戏评测、玩家文化、游戏开发和游戏周边产品的深度内容 |
| get_ifanr_news | 获取爱范儿科技快讯，包含最新的科技产品、数码设备、互联网动态等前沿科技资讯 |
| get_infoq_news | 获取 InfoQ 技术资讯，包含软件开发、架构设计、云计算、AI等企业级技术内容和前沿开发者动态 |
| get_juejin_article_rank | 获取掘金文章榜，包含前端开发、后端技术、人工智能、移动开发及技术架构等领域的高质量中文技术文章和教程 |
| get_netease_news_trending | 获取网易新闻热点榜，包含时政要闻、社会事件、财经资讯、科技动态及娱乐体育的全方位中文新闻资讯 |
| get_nytimes_news | 获取纽约时报新闻，包含国际政治、经济金融、社会文化、科学技术及艺术评论的高质量英文或中文国际新闻资讯 |
| get_smzdm_rank | 获取什么值得买热门，包含商品推荐、优惠信息、购物攻略、产品评测及消费经验分享的实用中文消费类资讯 |
| get_sspai_rank | 获取少数派热榜，包含数码产品评测、软件应用推荐、生活方式指南及效率工作技巧的优质中文科技生活类内容 |
| get_tencent_news_trending | 获取腾讯新闻热点榜，包含国内外时事、社会热点、财经资讯、娱乐动态及体育赛事的综合性中文新闻资讯 |
| get_thepaper_trending | 获取澎湃新闻热榜，包含时政要闻、财经动态、社会事件、文化教育及深度报道的高质量中文新闻资讯 |
| get_theverge_news | 获取 The Verge 新闻，包含科技创新、数码产品评测、互联网趋势及科技公司动态的英文科技资讯 |
| get_toutiao_trending | 获取今日头条热榜，包含时政要闻、社会事件、国际新闻、科技发展及娱乐八卦等多领域的热门中文资讯 |
| get_weibo_trending | 获取微博热搜榜，包含时事热点、社会现象、娱乐新闻、明星动态及网络热议话题的实时热门中文资讯 |
| get_weread_rank | 获取微信读书排行榜，包含热门小说、畅销书籍、新书推荐及各类文学作品的阅读数据和排名信息 |
| get_zhihu_trending | 获取知乎热榜，包含时事热点、社会话题、科技动态、娱乐八卦等多领域的热门问答和讨论的中文资讯 |


<!-- tools-end -->

更多数据源正在持续增加中

## 鸣谢

- [DailyHotApi](https://github.com/imsyy/DailyHotApi)
- [RSSHub](https://github.com/DIYgod/RSSHub)