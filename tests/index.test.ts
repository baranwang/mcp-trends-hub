import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { afterAll, describe, expect, test } from "@rstest/core";

const transport = new StdioClientTransport({
  command: "node",
  args: ["."],
});

const client = new Client({
  name: "test-client",
  version: "0.0.0",
});

describe("MCP 工具测试", async () => {
  await client.connect(transport);

  const toolsResponse = await client.listTools();

  afterAll(async () => {
    await client.close();
  });

  test("应能列出可用工具", async () => {
    expect(toolsResponse).toBeDefined();
    expect(toolsResponse).toHaveProperty("tools");
    expect(toolsResponse.tools).toBeInstanceOf(Array);
    expect(toolsResponse.tools).not.toHaveLength(0);
  });

  describe.each(toolsResponse.tools.map((tool) => [tool.name]))("%s", async (toolName) => {
    test("应能调用工具", async () => {
      const result = await client.callTool({
        name: toolName as unknown as string,
      });
      expect(result).toBeDefined();
      expect(result).toHaveProperty("content");
      expect(result.content).toBeInstanceOf(Array);
      expect(result.content).not.toHaveLength(0);
    });
  });
});
