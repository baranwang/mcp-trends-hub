import type { ServerResult } from "@modelcontextprotocol/sdk/types.js";
import { ZodError, z } from "zod";

export type Results = Record<string, string | number | undefined | null>[];

export type ToolConfig = {
  name: string;
  description: string;
  zodSchema?: z.ZodSchema<unknown>;
  func: (args: unknown) => Promise<Results>;
};

type MaybePromise<T> = T | Promise<T>;

export const defineToolConfig = async (
  config: ToolConfig | (() => MaybePromise<ToolConfig | ToolConfig[]>),
): Promise<ToolConfig | ToolConfig[]> => {
  if (typeof config === "function") {
    return await config();
  }
  return config;
};

export async function loadToolConfigs(toolsContext: Rspack.Context) {
  const toolPromises = toolsContext.keys().map((key) => {
    const toolModule = toolsContext(key) as { default: MaybePromise<ToolConfig | ToolConfig[]> };
    return Promise.resolve(toolModule.default);
  });

  const results = await Promise.allSettled(toolPromises);

  return results.reduce<Map<string, ToolConfig>>((map, result) => {
    if (result.status === "fulfilled" && result.value) {
      if (Array.isArray(result.value)) {
        result.value.forEach((tool) => {
          map.set(tool.name, tool);
        });
      } else {
        map.set(result.value.name, result.value);
      }
    }
    return map;
  }, new Map());
}

export const handleErrorResult = (error: unknown): ServerResult => {
  let errorMessage = "";
  if (error instanceof ZodError) {
    errorMessage = z.prettifyError(error);
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else {
    errorMessage = JSON.stringify(error);
  }
  return {
    content: [
      {
        type: "text",
        text: errorMessage,
      },
    ],
    isError: true,
  };
};

export const handleSuccessResult = (results: Results, toolName: string): ServerResult => {
  const hiddenFields = (process.env.TRENDS_HUB_HIDDEN_FIELDS ?? "")
    .split(",")
    .filter(Boolean)
    .reduce<string[]>((fields, config) => {
      if (config.includes(":")) {
        const [tool, key] = config.split(":");
        if (tool === toolName) fields.push(key);
      } else {
        fields.push(config);
      }
      return fields;
    }, []);

  return {
    content: results.map((item) => ({
      type: "text",
      text: Object.entries(item)
        .filter(([key, value]) => !hiddenFields.includes(key) && value !== undefined && value !== null && value !== "")
        .map(([key, value]) => `<${key}>${String(value)}</${key}>`)
        .join("\n"),
    })),
  };
};
