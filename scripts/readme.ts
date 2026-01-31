import { promises as fs } from "node:fs";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import type { RsbuildPlugin } from "@rslib/core";

interface Options {
  readmePath: string;
}

const getToolsContent = async () => {
  const transport = new StdioClientTransport({
    command: "node",
    args: ["."],
  });

  const client = new Client({
    name: "test-client",
    version: "0.0.0",
  });

  await client.connect(transport);

  const resp = await client.listTools();

  await client.close();

  let result = "| 工具名称 | 描述 |\n| --- | --- |\n";
  for (const tool of resp.tools) {
    result += `| ${tool.name} | ${tool.description} |\n`;
  }

  return result;
};

const createContentUpdater = (initialContent: string) => {
  let content = initialContent;

  return {
    update: async (markName: string, contentGenerator: () => string | Promise<string>): Promise<void> => {
      const markStart = `<!-- ${markName}-start -->`;
      const markEnd = `<!-- ${markName}-end -->`;
      const newContent = await contentGenerator();
      const regex = new RegExp(`(${markStart}\\n)([\\s\\S]*?)(\\n${markEnd})`, "g");
      content = content.replace(regex, `$1${newContent}\n$3`);
    },
    getContent: () => content,
  };
};

export const readmePlugin = ({ readmePath }: Options): RsbuildPlugin => {
  return {
    name: "readme-plugin",

    setup: (api) => {
      api.onAfterBuild(async ({ isWatch }) => {
        if (isWatch) {
          return;
        }

        try {
          api.logger.ready("更新 README.md 文件...");

          const readmeContent = await fs.readFile(readmePath, "utf-8");

          const contentUpdater = createContentUpdater(readmeContent);

          await contentUpdater.update("tools", getToolsContent);
          await fs.writeFile(readmePath, contentUpdater.getContent());

          api.logger.success("README.md 更新成功");
        } catch (error) {
          api.logger.error("更新 README.md 失败:", error);
        }
      });
    },
  };
};
