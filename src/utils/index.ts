export * from "./cache";
export * from "./dayjs";
export * from "./http";
export * from "./logger";
export * from "./rss";
export * from "./tools";

export const safeJsonParse = <T>(json: string): T | undefined => {
  try {
    return JSON.parse(json) as T;
  } catch {
    return undefined;
  }
};
