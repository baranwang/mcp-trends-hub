#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { handleErrorResult, handleSuccessResult, loadToolConfigs, logger } from "./utils";

const mcpServer = new McpServer(
  {
    name: "Trends Hub",
    version: process.env.PACKAGE_VERSION ?? "0.0.0",
  },
  {
    capabilities: {
      tools: {},
      logging: {},
    },
  },
);
logger.setMcpServer(mcpServer);

(async () => {
  try {
    // Load files both with and without extensions from the tools directory
    const toolsContext = import.meta.webpackContext("./tools", {
      regExp: /\.(js|ts)$/,
    });
    const toolConfigMap = await loadToolConfigs(toolsContext);

    // 处理工具列表请求
    mcpServer.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: Array.from(toolConfigMap.values()).map((tool) => {
          const { name, description, zodSchema = z.object({}) } = tool;
          return {
            name,
            description,
            inputSchema: z.toJSONSchema(zodSchema),
          };
        }),
      };
    });

    // 处理工具调用请求
    mcpServer.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const tool = toolConfigMap.get(request.params.name);
        if (!tool) {
          throw new Error(`Tool not found: ${request.params.name}`);
        }
        const result = await tool.func(request.params.arguments ?? {});
        return handleSuccessResult(result, request.params.name);
      } catch (error) {
        return handleErrorResult(error);
      }
    });

    const transport = new StdioServerTransport();
    await mcpServer.connect(transport);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
