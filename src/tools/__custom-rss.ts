import { snakeCase } from "es-toolkit";
import { defineToolConfig, getRss, getRssItems } from "../utils";

const getHostname = (url: string): string => {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    return snakeCase(hostname);
  } catch {
    return "unknown";
  }
};

const resolveNameConflicts = (names: string[]): string[] => {
  const count = new Map<string, number>();
  return names.map((name) => {
    const currentCount = count.get(name) ?? 0;
    count.set(name, currentCount + 1);
    return currentCount === 0 ? name : `${name}_${currentCount + 1}`;
  });
};

export default defineToolConfig(async () => {
  const rssUrls = process.env.TRENDS_HUB_CUSTOM_RSS_URL;
  if (!rssUrls) {
    throw new Error("TRENDS_HUB_CUSTOM_RSS_URL not found");
  }

  const urls = rssUrls
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);
  const baseNames = urls.map(getHostname);
  const resolvedNames = resolveNameConflicts(baseNames);

  const toolConfigs = await Promise.all(
    urls.map(async (rssUrl, index) => {
      const resp = await getRss(rssUrl);
      if (!resp?.rss?.channel) {
        throw new Error(`Invalid RSS feed: ${rssUrl}`);
      }
      let description = resp.rss.channel.title;
      if (resp.rss.channel.description) {
        description += ` - ${resp.rss.channel.description}`;
      }
      return {
        name: resolvedNames[index],
        description,
        func: () => getRssItems(rssUrl),
      };
    }),
  );

  return toolConfigs;
});
